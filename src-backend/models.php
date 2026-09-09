<?php
namespace fc;
require_once __dir__ .'/consts.php';
require_once __dir__ .'/utils.php';
require_once __dir__ .'/excepts.php';

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

	function parse_records () {
		$threads_dir = check_path(BOARDS_DIR .'/'. $this->board_slug .'/threads/');
		touch_dirs($threads_dir);
		
		$dat_path = check_path($threads_dir .'/'. $this->id .'.dat'); 

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
}
