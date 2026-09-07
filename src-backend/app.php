<?php
namespace fc;

require_once __dir__ .'/consts.php';
require_once __dir__ .'/utils.php';

class App {
	function __construct() {
		$this->config = null;
	}

	function draw_initial_data() {
		$app_title = $this->config['app_title'] ?? DEF_APP_TITLE;
	?>
		<script>
			var FLATCH = {
				APP_TITLE: "<?= safe($app_title) ?>",
			}
		</script>
	<?php
	}

	function draw_header() {
	?>
		<!DOCTYPE html>
		<html>
		<head>
			<meta charset="utf-8">
			<meta name="viewport" content="width=device-width, initial-scale=1">
			<script type="module" src="<?= INDEX_JS_PATH ?>"></script>
			<title><?= safe($this->config['app_title'] ?? DEF_APP_TITLE) ?></title>
			<?= $this->draw_initial_data() ?>
		</head>
		
	<?php
	}

	function draw_body() {
	?>
		<body>
			<div id="app"></div>
		</body>
	<?php
	}

	function draw_footer() {
	?>
		</html>		
	<?php
	}

	function draw_home() {
		$this->draw_header();
		$this->draw_body();
		$this->draw_footer();
	}

	function load_config() {
		$json = file_get_contents(CONFIG_PATH);
		$this->config = json_decode($json, true);
	}

	function api_initial_load() {
		$response = [];

		$response['app_title'] = $this->config['app_title'] ?? DEF_APP_TITLE;

		echo json_encode($response);
	}

	function run() {
		$this->load_config();

		$m = $_GET['m'] ?? 'home';

		switch ($m) {
		case 'home': $this->draw_home(); break;
		case 'api_initial_load': $this->api_initial_load(); break;
		}
	}
}