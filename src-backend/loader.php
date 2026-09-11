<?php
namespace fc;
require_once __dir__ .'/excepts.php';
require_once __dir__ .'/utils.php';
require_once __dir__ .'/consts.php';

class Cache {
	public $data;

	function __construct () {
		$this->data = [];
	}

	function has ($key) {
		return isset($this->data[$key]);
	}

	function set ($key, $value) {
		$this->data[$key] = $value;
	}

	function get ($key, $def_val=null) {
		if (isset($this->data[$key])) {
			return $this->data[$key];
		}

		return $def_val;
	}
}

class Loader {
	public Cache $cache;

	function __construct () {
		$this->cache = new Cache();
	}

	function load_dat_file ($ident, $path) {
		if (!file_exists($path)) {
			throw new FileDoesNotExistsError("$ident dat file does not exists");
		}

		$content = file_get_contents($path);
		if ($content === false) {
			throw new FileIOError("failed to get $ident content");
		}

		$lines = explode("\n", trim($content));
		$table = [];

		foreach ($lines as $line) {
			$toks = explode(DAT_LINE_SEP, trim($line));
			$table[] = $toks;
		}

		return $table;
	}

	function load_dat_file_with_cache ($ident, $path, $cache) {
		if ($cache && $this->cache->has($ident)) {
			return $this->cache->get($ident);
		}

		$table = $this->load_dat_file($ident, $path);
		
		if ($cache) {
			$this->cache->set($ident, $table);
		}

		return $table;
	}	

	function load_json_file ($ident, $path) {
		if (!file_exists($path)) {
			throw new FileDoesNotExistsError("$ident json file does not exists");
		}

		$content = file_get_contents($path);
		if ($content === false) {
			throw new FileIOError("failed to get $ident content");
		}

		$json = json_decode($content, true);

		return $json;
	}

	function load_json_file_with_cache ($ident, $path, $cache) {
		if ($cache && $this->cache->has($ident)) {
			return $this->cache->get($ident);
		}

		$json = $this->load_json_file($ident, $path);
		
		if ($cache) {
			$this->cache->set($ident, $json);
		}

		return $json;
	}	

	function load_boards_json_file ($cache=true) {
		return $this->load_json_file_with_cache("boards", BOARDS_PATH, $cache);
	}	

	function load_categories_json_file ($cache=true) {
		return $this->load_json_file_with_cache("categories", CATEGORIES_PATH, $cache);
	}	

	function load_board_setting_json_file ($board_slug, $cache=true) {
		$board_dir = check_path(BOARDS_DIR .'/'. $board_slug);
		$setting_path = check_path($board_dir .'/'. BOARD_SETTING_FILE_NAME);

		return $this->load_json_file_with_cache("setting", $setting_path, $cache);
	}

	function load_subjects_dat_file ($board_slug, $cache=true) {
		$path = gen_board_subjects_path($board_slug);
		return $this->load_dat_file_with_cache("subjects", $path, $cache);
	}

	function load_thread_dat_file ($board_slug, $thread_id, $cache=true) {
		$path = gen_dat_path($board_slug, $thread_id);
		return $this->load_dat_file_with_cache("thread", $path, $cache);
	}
}
