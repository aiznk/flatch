<?php
namespace fc;
require_once __dir__ .'/consts.php';
require_once __dir__ .'/utils.php';
require_once __dir__ .'/excepts.php';
require_once __dir__ .'/validators.php';
require_once __dir__ .'/loader.php';

function gen_datetime () {
    $weekdays = ['日', '月', '火', '水', '木', '金', '土'];

    $now = new \DateTime();

    return $now->format('Y/m/d')
        . '(' . $weekdays[$now->format('w')] . ') '
        . $now->format('H:i:s.v');
}

class Model {
	function is_valid_board_slug ($board_slug) {
		$board_dir = check_path(BOARDS_DIR .'/'. $board_slug);
		return file_exists($board_dir);
	}
}

class BoardModel extends Model {
	public $name;
	public $slug;
	public $category_slug;
	public $desc;
	public $no_name;

	function init ($board_slug) {
		if (is_null($board_slug)) {
			throw new ValidationError('board slug is null');
		}
		if (!$this->is_valid_board_slug($board_slug)) {
			throw new ValidationError("invalid board slug $board_slug");
		}

		$this->slug = $board_slug;
	}

	function to_array () {
		return [
			"name" => $this->name,
			"slug" => $this->slug,
			"category_slug" => $this->category_slug,
			"desc" => $this->desc,
			"no_name" => $this->no_name,
		];
	}

	function load_setting () {
		$loader = new Loader();
		$setting = $loader->load_board_setting_json_file($this->slug);

		$this->name = $setting['board_name'] ?? null;
		$this->category_slug = $setting['board_category'] ?? null;
		$this->desc = $setting['board_desc'] ?? null;
		$this->no_name = $setting['board_no_name'] ?? null;
	}

	function collect_thread_subjects () {
		$board_dir = check_path(BOARDS_DIR .'/'. $this->slug);
		$subject_path = check_path($board_dir .'/'. SUBJECTS_FILE_NAME); 

		if (!file_exists($subject_path)) {
			return [];
		}

		$fp = fopen($subject_path, "r");
		if ($fp === false) {
			throw new FileIOError('failed to open subject file');
		}

		$subjects = [];

		while (($toks = parse_dat_stream_line($fp)) !== false) {
			$subjects[] = $toks;
		}

		fclose($fp);

		return $subjects;
	}
}

class SubjectsModel extends Model {
	public string $board_slug;
	public array $subjects; /* Array<SubjectModel> */

	function open_stream ($board_slug) {
		if (!$this->is_valid_board_slug($board_slug)) {
			throw new ValidationError("invalid board slug: $board_slug");
		}

		$this->board_slug = $board_slug;
		$this->subjects = [];

		try {
			$subjects_path = gen_board_subjects_path($board_slug);
		} catch (ValidationError $e) {
			throw $e;
		}

		$fp = fopen($subjects_path, "r+");
		if ($fp === false) {
			throw new FileIOError("failed to open subjects file: $subjects_path");
		}

		return $fp;
	}

	function close_stream ($fp) {
		return fclose($fp);
	}

	function load ($fp) {
		try {
			$content = read_stream_all($fp);
		} catch (FileIOError $e) {
			throw $e;
		}

		$content = str_replace("\r\n", "\n", $content);
		$lines = explode("\n", trim($content));
		$subjects = [];

		foreach ($lines as $line) {
			$toks = explode(DAT_LINE_SEP, trim($line));
			$subject = new SubjectModel();

			try {
				$subject->set_array($toks);
			} catch (ValueError $e) {
				throw $e;
			}

			$subjects[] = $subject;
		}

		$this->subjects = $subjects;

		return $this->subjects;
	}

	function save ($fp) {
		if (!rewind($fp)) {
			throw new FileIOError("failed to rewind stream");
		}

		if (flock($fp, LOCK_EX)) {
			if (!ftruncate($fp, 0)) {
				throw new FileIOError("failed to truncate file");
			}

			foreach ($this->subjects as $subject) {
				$line = $subject->to_record_line();
				fputs($fp, $line);
			}
		} else {
			throw new FileIOError("failed to lock subjects file: $subjects_path");
		}
	}

	function lock_stream ($fp) {
		return flock($fp, LOCK_EX);
	}

	function unlock_stream ($fp) {
		return flock($fp, LOCK_UN);
	}

	function shrink_tail (int $limit) {
		while (count($this->subjects) > $limit) {
			array_pop($this->subjects);
		}
	}

	function insert_at_first (SubjectModel $subject) {
		array_unshift($this->subjects, $subject);	
	}

	function find_by_thread_id (int $thread_id) {
		foreach ($this->subjects as $subject) {
			if ($subject->thread_id == $thread_id) {
				return $subject;
			}
		}
		return null;
	}

	function remove (SubjectModel $subject) {
		$this->subjects = array_filter($this->subjects, function ($s) use ($subject) {
			return !($s->thread_id == $subject->thread_id &&
				     $s->thread_name == $subject->thread_name);
		});
	}
}

class SubjectModel extends Model {
	public int $thread_id;
	public string $thread_name;

	function init (int $thread_id, string $thread_name) {
		$this->thread_id = $thread_id;
		$this->thread_name = $thread_name;
	}

	function set_array (array $row) {
		if (count($row) !== 2) {
			throw new ValueError("invalid row length: ".count($row));
		}

		$this->thread_id = $row[0];
		$this->thread_name = $row[1];
	}

	function to_record_line () {
		return implode(DAT_LINE_SEP, [$this->thread_id, $this->thread_name]) ."\n";
	}
}

class ThreadModel extends Model {
	public string $board_slug;
	public int $id;

	function init (string $board_slug, int $thread_id) {
		if (!$this->is_valid_board_slug($board_slug)) {
			throw new ValidationError("invalid board slug $board_slug");
		}
		if (intval($thread_id) === 0) {
			throw new ValidationError("invalid thread id 0");
		}

		$this->board_slug = $board_slug;
		$this->id = intval($thread_id);
	}

	function create (string $board_slug, string $thread_name, string $name, string $email, string $content) {
		// thread
		$this->board_slug = $board_slug;
		$this->id = inc_id(THREAD_ID_PATH);	

		$dat_path = gen_dat_path($this->board_slug, $this->id);
		$record = new RecordModel();

		try {
			$record->init($name, $email, gen_datetime(), $content, $thread_name);
		} catch (ValidationError $e) {
			throw $e;
		}

		file_put_contents($dat_path, $record->to_record_line(), FILE_APPEND);

		// subject
		$subjects = new SubjectsModel();

		try {
			$fp = $subjects->open_stream($this->board_slug);
		} catch (ValidationError $e) {
			throw $e;
		} catch (FileIOError $e) {
			throw $e;
		}

		if (!$subjects->lock_stream($fp)) {
			throw new FileIOError("failed to lock subjects file");
		}

		try {
			$subjects->load($fp);
		} catch (ValueError $e) {
			throw $e;
		} catch (FileDoesNotExistsError $e) {
			throw $e;
		} catch (FileIOError $e) {
			throw $e;
		}

		$subject = new SubjectModel();
		$subject->init($this->id, $thread_name);

		$subjects->shrink_tail(MAX_SUBJECTS_LEN);
		$subjects->insert_at_first($subject);

		try {
			$subjects->save($fp);
		} catch (FileIOError $e) {
			throw $e;
		}

		$subjects->close_stream($fp);

		return $this->id;
	}

	function parse_records () : array {
		$loader = new Loader();
		$records = $loader->load_thread_dat_file($this->board_slug, $this->id);

		return $records;
	}

	function add_record (string $name, string $email, string $content) {
		$record = new RecordModel();

		try {
			$record->init($name, $email, gen_datetime(), $content, '');
		} catch (ValidationError $e) {
			throw $e;
		}

		$dat_path = gen_dat_path($this->board_slug, $this->id);
		if (!file_exists($dat_path)) {
			throw new FileDoesNotExistsError('dat file does not exists');
		}

		$nlines = count_file_lines($dat_path);
		if ($nlines === false) {
			throw new FileIOError('failed to count dat file lines');
		}
		if ($nlines >= LIMIT_DAT_FILE_LINES) {
			throw new ReachedLimitError('reached limit of dat file');
		}

		file_put_contents($dat_path, $record->to_record_line(), FILE_APPEND);
	}
}

class RecordModel extends Model {
	public string $name;
	public string $email;
	public string $datetime;
	public string $content;
	public string $subject;

	function init (string $name, string $email, string $datetime, string $content, string $subject) {
		$this->name = $name;
		$this->email = $email;
		$this->datetime = $datetime;
		$this->content = $content;
		$this->subject = $subject;		

		$this->replace();

		$subject_empty = strlen($subject) === 0;

		try {
			$this->validate($subject_empty);
		} catch (ValidationError $e) {
			throw $e;
		}
	}

	function replace_chars (string $s) : string {
		// dat file keywords
		$s = str_replace("<>", "", $s);
		$s = str_replace("\n", "[br/]", $s);

		// etc
		$s = str_replace("\r", "", $s);
		$s = str_replace("\t", "", $s);
		$s = str_replace("\v", "", $s);
		$s = str_replace("\f", "", $s);
		$s = str_replace("\b", "", $s);
		$s = str_replace("\a", "", $s);
		$s = str_replace("\\", "", $s);
		$s = str_replace("\$", "", $s);
		$s = str_replace("\0", "", $s);
		return $s;
	}

	function replace () {
		$this->name = $this->replace_chars($this->name);
		$this->email = $this->replace_chars($this->email);
		$this->datetime = $this->replace_chars($this->datetime);
		$this->content = $this->replace_chars($this->content);
		$this->subject = $this->replace_chars($this->subject);
	}

	function to_record_line () {
		$record = [
			$this->name,
			$this->email,
			$this->datetime,
			$this->content,
			$this->subject,
		];
		return implode(DAT_LINE_SEP, $record) ."\n";	
	}

	function validate (bool $subject_empty=false) {
		$v = new RecordValidator();
		$v->subject_empty = $subject_empty;

		try {
			$v->validate(
				$this->name, 
				$this->email, 
				$this->datetime, 
				$this->content, 
				$this->subject,
			);
		} catch (ValidationError $e) {
			throw $e;			
		}
	}
}
