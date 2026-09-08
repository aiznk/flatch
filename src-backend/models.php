<?php
namespace fc;
require_once __dir__ .'/consts.php';
require_once __dir__ .'/utils.php';

class BoardModel {
	public $config;
	public $slug;

	function __construct ($config) {
		$this->config = $config;
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

	function is_valid_board_slug ($slug) {
		foreach ($this->config['boards'] as $board) {
			if ($board[1] === $slug) {
				return true;
			}
		}
		return false;
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

class ThreadModel {
	function __construct ($config) {
		$this->config = $config;
	}
}