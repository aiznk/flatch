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

	function load_dat_file (string $ident, string $path, bool $lock=true) : array {
		if (!file_exists($path)) {
			throw new FileDoesNotExistsError("$ident dat file does not exists");
		}

		if ($lock) {
			$fp = fopen($path, 'r');
			if ($fp === false) {
				throw new FileIOError("failed to open file: $path");
			}

			if (flock($fp, LOCK_SH)) {
				try {
					$content = read_stream_all($fp);
				} catch (FileIOError $e) {
					throw $e;
				}
			}

			fclose($fp);
		} else {
			$content = file_get_contents($path);
			if ($content === false) {
				throw new FileIOError("failed to get $ident content");
			}			
		}

		$content = str_replace("\r\n", "\n", $content);
		$lines = explode("\n", trim($content));
		$table = [];

		foreach ($lines as $line) {
			$toks = explode(DAT_LINE_SEP, trim($line));
			$table[] = $toks;
		}

		return $table;
	}

	function load_dat_file_with_cache (string $ident, string $path, bool $lock=true, bool $cache=true) : array {
		if ($cache && $this->cache->has($ident)) {
			return $this->cache->get($ident);
		}

		try {
			$table = $this->load_dat_file($ident, $path, $lock);
		} catch (FileDoesNotExistsError $e) {
			throw $e;
		} catch (FileIOError $e) {
			throw $e;
		}
		
		if ($cache) {
			$this->cache->set($ident, $table);
		}

		return $table;
	}	

	function load_json_file (string $ident, string $path, bool $lock=true) : array {
		if (!file_exists($path)) {
			throw new FileDoesNotExistsError("$ident json file does not exists");
		}

		if ($lock) {
			$fp = fopen($path, 'r');
			if ($fp === false) {
				throw new FileIOError("failed to open file: $path");
			}

			if (flock($fp, LOCK_SH)) {
				try {
					$content = read_stream_all($fp);
				} catch (FileIOError $e) {
					throw $e;
				}
			}

			fclose($fp);
		} else {
			$content = file_get_contents($path);
			if ($content === false) {
				throw new FileIOError("failed to get $ident content");
			}			
		}

		$json = json_decode($content, true);

		return $json;
	}

	function load_json_file_with_cache (string $ident, string $path, bool $lock=true, bool $cache=true) : array {
		if ($cache && $this->cache->has($ident)) {
			return $this->cache->get($ident);
		}

		try {
			$json = $this->load_json_file($ident, $path, $lock);
		} catch (FileDoesNotExistsError $e) {
			throw $e;
		} catch (FileIOError $e) {
			throw $e;
		}
		
		if ($cache) {
			$this->cache->set($ident, $json);
		}

		return $json;
	}	

	function load_boards_json_file (bool $lock=true, bool $cache=true) : array {
		try {
			return $this->load_json_file_with_cache("boards", BOARDS_PATH, $lock, $cache);
		} catch (FileDoesNotExistsError $e) {
			throw $e;
		} catch (FileIOError $e) {
			throw $e;
		}
	}	

	function load_categories_json_file (bool $lock=true, bool $cache=true) {
		try {
			return $this->load_json_file_with_cache("categories", CATEGORIES_PATH, $lock, $cache);
		} catch (FileDoesNotExistsError $e) {
			throw $e;
		} catch (FileIOError $e) {
			throw $e;
		}
	}	

	function load_board_setting_json_file (string $board_slug, bool $lock=true, bool $cache=true) : array {
		try {
			$setting_path = gen_board_setting_path($board_slug);
		} catch (ValidationError $e) {
			throw $e;
		}

		try {
			return $this->load_json_file_with_cache("setting", $setting_path, $lock, $cache);
		} catch (FileDoesNotExistsError $e) {
			throw $e;
		} catch (FileIOError $e) {
			throw $e;
		}
	}

	function load_subjects_dat_file (string $board_slug, bool $lock=true, bool $cache=true) : array {
		try {
			$path = gen_board_subjects_path($board_slug);
		} catch (ValidationError $e) {
			throw $e;
		}

		try {
			return $this->load_dat_file_with_cache("subjects", $path, $lock, $cache);
		} catch (FileDoesNotExistsError $e) {
			throw $e;
		} catch (FileIOError $e) {
			throw $e;
		}
	}

	function load_thread_dat_file (string $board_slug, int $thread_id, bool $lock=true, bool $cache=true) : array {
		try {
			$path = gen_dat_path($board_slug, $thread_id);
		} catch (ValidationError $e) {
			throw $e;
		}

		try {
			return $this->load_dat_file_with_cache("thread", $path, $lock, $cache);
		} catch (FileDoesNotExistsError $e) {
			throw $e;
		} catch (FileIOError $e) {
			throw $e;
		}
	}
}
