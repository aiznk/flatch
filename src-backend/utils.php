<?php
namespace fc;

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
