<?php
namespace fc;

require_once __dir__ .'/consts.php';
require_once __dir__ .'/utils.php';

class App {
	public $config;

	function draw_initial_data() {
		$app_title = $this->config['app_title'] ?? DEF_APP_TITLE;
		$welcome_message = $this->config['welcome_message'] ?? 'Welcome';
		$categories = $this->config['categories'] ?? [];
		$boards = $this->config['boards'] ?? [];
	?>
		<script>
			var FLATCH = {
				APP_TITLE: "<?= safe($app_title) ?>",
				WELCOME_MESSAGE: "<?= safe($welcome_message) ?>",
				PUBLISHED_DATE: "<?= safe($this->config['published_date']) ?>",
				CATEGORIES: <?= json_encode($categories) ?>,
				BOARDS: <?= json_encode($boards) ?>,
			}
		</script>
	<?php
	}

	function draw_home() {
	?>
		<!DOCTYPE html>
		<html>
		<head>
			<meta charset="utf-8">
			<meta name="viewport" content="width=device-width, initial-scale=1">
			<script type="module" src="<?= INDEX_JS_PATH ?>"></script>
			<link rel="stylesheet" href="<?= STYLE_CSS_PATH ?>" />
			<title><?= safe($this->config['app_title'] ?? DEF_APP_TITLE) ?></title>
			<?= $this->draw_initial_data() ?>
		</head>
		<body>
			<div id="app"></div>
		</body>
		</html>		
	<?php
	}

	function load_config() {
		$json = file_get_contents(CONFIG_PATH);
		$this->config = json_decode($json, true);
	}

	function run() {
		$this->load_config();
		$this->routing();
	}

	function routing() {
		$m = $_GET['m'] ?? 'home';

		switch ($m) {
		case 'home': $this->draw_home(); break;
		}
	}
}