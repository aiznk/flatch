<?php
namespace fc;

require_once __dir__ .'/excepts.php';
require_once __dir__ .'/utils.php';
require_once __dir__ .'/models.php';

class Api {
	public $config;

	function set_config ($config) {
		$this->config = $config;
	}

	function echo_exception ($e) {
		http_response_code(500);
		echo json_encode([
			'message' => $e->getMessage(),
		]);
	}

	function post_response () {
		$board_slug = $_POST['board_slug'] ?? null;
		$thread_id = $_POST['thread_id'] ?? null;
		$name = $_POST['name'] ?? null;
		$email = $_POST['email'] ?? null;
		$content = $_POST['content'] ?? null;

		$thread = new ThreadModel($this->config);

		try {
			$thread->init($board_slug, $thread_id);
		} catch (ValidationError $e) {
			return $this->echo_exception($e);
		}

		try {
			$thread->add_record($name, $email, $content);
		} catch (ValidationError $e) {
			return $this->echo_exception($e);
		} catch (FileDoesNotExistsError $e) {
			return $this->echo_exception($e);
		}

		echo json_encode([]);
	}

	function load_boards_detail () {
		$response = [];

		$board_slug = $_GET['board_slug'] ?? null;

		$board = new BoardModel($this->config);
		$board->init($board_slug);
		$thread_subjects = $board->collect_thread_subjects();

		$response['thread_subjects'] = $thread_subjects;

		echo json_encode($response);
	}

	function load_threads_detail () {
		$response = [];

		$board_slug = $_GET['board_slug'] ?? null;
		$thread_id = $_GET['thread_id'] ?? null;

		$thread = new ThreadModel($this->config);

		try {
			$thread->init($board_slug, $thread_id);
		} catch (ValidationError $e) {
			fail_die($e->getMessage());
		}

		try {
			$records = $thread->parse_records();
		} catch (FileDoesNotExistsError $e) {
			fail_die($e->getMessage());
		} catch (FileIOError $e) {
			fail_die($e->getMessage());
		}

		$response['thread_records'] = $records;

		echo json_encode($response);
	}
}