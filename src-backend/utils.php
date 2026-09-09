<?php
namespace fc;

require_once __dir__ .'/consts.php';

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