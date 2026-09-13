<?php
namespace fc;
require_once __dir__ .'/consts.php';
require_once __dir__ .'/excepts.php';

function gen_csrf_token () {
	return bin2hex(random_bytes(32));
}

function header_text_html_utf8 () {
	header('Content-Type: text/html; charset=UTF-8');
}

function header_app_json_utf8 () {
	header('Content-Type: application/json; charset=UTF-8');
}

function count_file_lines(string $filename): int {
    $fp = fopen($filename, 'rb');
    if ($fp === false) {
        return false;
    }

    $count = 0;

    while (!feof($fp)) {
        $buf = fread($fp, 1024 * 1024);
        $count += substr_count($buf, "\n");
    }

    fclose($fp);

    return $count;
}

function gen_boards_dir (string $board_slug) : string {
	$path = check_path(BOARDS_DIR .'/'. $board_slug);
	if (!is_dir($path)) {
		throw new ValidationError("invalid board slug $board_slug");
	}
	return $path;
}

function gen_board_subjects_path (string $board_slug) : string {
	$board_dir = gen_boards_dir($board_slug);
	return check_path($board_dir .'/'. SUBJECTS_FILE_NAME);
}

function gen_threads_dir (string $board_slug) : string {
	$board_dir = gen_boards_dir($board_slug);
	return check_path($board_dir .'/'. THREADS_DIR_NAME);		
}

function gen_dat_path (string $board_slug, int $thread_id) : string {
	$threads_dir = gen_threads_dir($board_slug);
	$dat_path = check_path($threads_dir .'/'. $thread_id . DAT_FILE_EXT);
	return $dat_path;
}

function inc_id ($path) {
	touch($path);

	$fp = fopen($path, "r+");
	if ($fp === false) {
		throw new FileIOError("failed to open id file: $path");
	}

	$id = null;

	if (flock($fp, LOCK_EX)) {
		$id = intval(fgets($fp));
		if ($id === 0) {
			$id += 1;
		}
		fseek($fp, 0, SEEK_SET);
		fputs($fp, $id + 1);
	} else {
		throw new FileIOError("failed to lock id file: $path");
	}
	
	fclose($fp);

	return $id;
}

function fail_die ($msg) {
	http_response_code(500);
	die($msg);
}

function safe ($val) {
	return htmlspecialchars($val);
}

function touch_dirs ($dir) {
	if (!file_exists($dir)) {
		return mkdir($dir, 0766, true);
	}
	return true;
}

function check_path ($path) {
	if (strpos($path, '..') !== false) {
		die("found '..' in path");
	}
	return $path;
}

function parse_dat_stream_line ($fp) {
	$line = fgets($fp);
	if ($line === false) {
		return false;
	}

	$line = trim($line);
	$toks = explode(DAT_LINE_SEP, $line);

	return $toks;
}