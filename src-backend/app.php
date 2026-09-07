<?php
namespace fc;

require_once __dir__ .'/consts.php';

class App {
	function __construct() {
		$this->config = null;
	}

	function draw_header() {
	?>
		<!DOCTYPE html>
		<html>
		<head>
			<meta charset="utf-8">
			<meta name="viewport" content="width=device-width, initial-scale=1">
			<script type="module" src="<?= INDEX_JS_PATH ?>"></script>
			<title><?= $this->config['app_title'] ?? 'Flatch' ?></title>
		</head>
		
	<?php
	}

	function draw_body() {
	?>
		<body>
			<div id="app">app</div>
		</body>
	<?php
	}

	function draw_footer() {
	?>
		</html>		
	<?php
	}

	function draw() {
		$this->draw_header();
		$this->draw_body();
		$this->draw_footer();
	}

	function load_config() {
		$json = file_get_contents(CONFIG_PATH);
		$this->config = json_decode($json, true);
	}

	function run() {
		$this->load_config();
		$this->draw();
	}
}