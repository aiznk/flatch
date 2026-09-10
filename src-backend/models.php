<?php
namespace fc;
require_once __dir__ .'/consts.php';
require_once __dir__ .'/utils.php';
require_once __dir__ .'/excepts.php';
require_once __dir__ .'/validators.php';

function gen_datetime () {
	$weekdays = ['日', '月', '火', '水', '木', '金', '土'];
	$datetime = date('Y/m/d') . '(' . $weekdays[date('w')] . ') ' . date('H:i:s.v');
	return $datetime;
}

class Model {
	public $config;

	function __construct ($config) {
		$this->config = $config;
	}

	function is_valid_board_slug ($board_slug) {
		foreach ($this->config['boards'] as $board) {
			if ($board[1] === $board_slug) {
				return true;
			}
		}
		return false;
	}
}

class BoardModel extends Model {
	public $config;
	public $slug;

	function __construct ($config) {
		parent::__construct($config);
	}

	function init ($board_slug) {
		if (is_null($board_slug)) {
			die("board slug is null");
		}
		if (!$this->is_valid_board_slug($board_slug)) {
			die("invalid board slug $board_slug");
		}

		$this->slug = $board_slug;
	}

	function collect_thread_subjects () {
		$board_dir = check_path(BOARDS_DIR .'/'. $this->slug);
		touch_dirs($board_dir);
		
		$subject_path = check_path($board_dir .'/'. SUBJECT_FILE_NAME); 
		touch($subject_path);

		$fp = fopen($subject_path, "r");
		if ($fp === false) {
			die("failed to open subject file");
		}

		$subjects = [];

		while (($toks = parse_dat_stream_line($fp)) !== false) {
			$subjects[] = $toks;
		}

		fclose($fp);

		return $subjects;
	}
}

class ThreadModel extends Model {
	public $config;
	public $board_slug;
	public $id;

	function __construct ($config) {
		parent::__construct($config);
	}

	function init ($board_slug, $thread_id) {
		if (!$this->is_valid_board_slug($board_slug)) {
			throw new ValidationError("invalid board slug $board_slug");
		}
		if (intval($thread_id) === 0) {
			throw new ValidationError("invalid thread id 0");
		}

		$this->board_slug = $board_slug;
		$this->id = intval($thread_id);
	}

	function gen_threads_dir () {
		return check_path(BOARDS_DIR .'/'. $this->board_slug .'/threads/');		
	}

	function gen_dat_path () {
		$threads_dir = $this->gen_threads_dir();
		touch_dirs($threads_dir);
		$dat_path = check_path($threads_dir .'/'. $this->id .'.dat'); 
		return $dat_path;
	}

	function parse_records () {
		$dat_path = $this->gen_dat_path();

		if (!file_exists($dat_path)) {
			throw new FileDoesNotExistsError('dat file does not exists');
		}

		$fp = fopen($dat_path, "r");
		if ($fp === false) {
			throw new FileIOError("failed to open dat file $dat_file");
		}

		$records = [];

		while (($record = parse_dat_stream_line($fp)) !== false) {
			$records[] = $record;
		}

		fclose($fp);

		return $records;
	}

	function add_record ($name, $email, $content) {
		$record = new RecordModel($this->config);

		$record->init($name, $email, gen_datetime(), $content, '');

		$dat_path = $this->gen_dat_path();
		if (!file_exists($dat_path)) {
			throw new FileDoesNotExistsError('dat file does not exists');
		}

		file_put_contents($dat_path, $record->to_string(), FILE_APPEND);
	}
}

class RecordModel extends Model {
	public $config;
	public $name;
	public $email;
	public $datetime;
	public $content;
	public $subject;

	function __construct ($config) {
		parent::__construct($config);
	}

	function init ($name, $email, $datetime, $content, $subject) {
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

	function replace_chars ($s) {
		$s = str_replace("&", "&amp;", $s);
		$s = str_replace("<", "&lt;", $s);
		$s = str_replace(">", "&gt;", $s);
		$s = str_replace('"', "&quot;", $s);
		$s = str_replace("'", "&apos;", $s);
		$s = str_replace("\r", "", $s);
		$s = str_replace("\n", "<br>", $s);
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

	function to_string () {
		$record = [
			$this->name,
			$this->email,
			$this->datetime,
			$this->content,
			$this->subject,
		];
		return implode(DAT_LINE_SEP, $record) ."\n";	
	}

	function validate ($subject_empty=false) {
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