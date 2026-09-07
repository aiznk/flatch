<?php
namespace fc;

function safe($val) {
	return htmlspecialchars($val);
}
