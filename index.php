<?php
namespace fc;

require_once 'src-backend/app.php';

function main() {
	$app = new App();
	$app->run();
}

main();
