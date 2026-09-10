<?php
namespace fc;

require_once __dir__ .'/excepts.php';
require_once __dir__ .'/utils.php';
require_once __dir__ .'/models.php';

class Api {
	function echo_exception ($e) {
		http_response_code(500);
		echo json_encode([
			'message' => $e->getMessage(),
		]);
	}

	function echo_error ($msg) {
		http_response_code(500);
		echo json_encode([
			'message' => $msg,
		]);		
	}

	function load_boards_data () {
		if (!file_exists(BOARDS_PATH)) {
			return $this->echo_error("boards file not found");
		}
		if (!file_exists(CATEGORIES_PATH)) {
			return $this->echo_error("categories file not found");
		}

		$boards = json_decode(file_get_contents(BOARDS_PATH), true);
		$categories = json_decode(file_get_contents(CATEGORIES_PATH), true);

		$response = [
			"boards" => $boards,
			"categories" => $categories,
		];

		echo json_encode($response);
	}

	function post_thread () {
		$board_slug = $_POST['board_slug'] ?? null;
		$thread_name = $_POST['thread_name'] ?? null;
		$name = $_POST['name'] ?? null;
		$email = $_POST['email'] ?? null;
		$content = $_POST['content'] ?? null;

		$thread = new ThreadModel();

		try {
			$thread_id = $thread->create(
				$board_slug, 
				$thread_name, 
				$name, 
				$email, 
				$content,
			);
		} catch (ValidationError $e) {
			return $this->echo_exception($e);
		} catch (FileIOError $e) {
			return $this->echo_exception($e);
		}

		echo json_encode([
			'thread_id' => $thread_id,
			'board_slug' => $board_slug,
		]);
	}

	function post_record () {
		$board_slug = $_POST['board_slug'] ?? null;
		$thread_id = $_POST['thread_id'] ?? null;
		$name = $_POST['name'] ?? null;
		$email = $_POST['email'] ?? null;
		$content = $_POST['content'] ?? null;

		$thread = new ThreadModel();

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
		} catch (FileIOError $e) {
			return $this->echo_exception($e);
		} catch (ReachedLimitError $e) {
			return $this->echo_exception($e);
		}

		echo json_encode([]);
	}

	function load_boards_detail () {
		$response = [];

		$board_slug = $_GET['board_slug'] ?? null;

		$board = new BoardModel();
		$board->init($board_slug);

		try {
			$board->load_setting();
		} catch (FileDoesNotExistsError $e) {
			return $this->echo_exception($e);
		}

		$thread_subjects = $board->collect_thread_subjects();

		$response['board'] = $board->to_array();
		$response['thread_subjects'] = $thread_subjects;

		echo json_encode($response);
	}

	function load_threads_detail () {
		$response = [];

		$board_slug = $_GET['board_slug'] ?? null;
		$thread_id = $_GET['thread_id'] ?? null;

		$board = new BoardModel();

		try {
			$board->init($board_slug);
		} catch (ValidationError $e) {
			return $this->echo_exception($e);
		}
		try {
			$board->load_setting();
		} catch (FileIOError $e) {
			return $this->echo_exception($e);
		}

		$thread = new ThreadModel();

		try {
			$thread->init($board_slug, $thread_id);
		} catch (ValidationError $e) {
			return $this->echo_exception($e);
		}

		try {
			$records = $thread->parse_records();
		} catch (FileDoesNotExistsError $e) {
			return $this->echo_exception($e);
		} catch (FileIOError $e) {
			return $this->echo_exception($e);
		}

		$response['board_slug'] = $board->slug;
		$response['board_no_name'] = $board->no_name;
		$response['thread_id'] = $thread_id;
		$response['thread_records'] = $records;

		echo json_encode($response);
	}
}