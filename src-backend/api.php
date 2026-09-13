<?php
namespace fc;
require_once __dir__ .'/excepts.php';
require_once __dir__ .'/utils.php';
require_once __dir__ .'/models.php';
require_once __dir__ .'/loader.php';

class Api {
	public Loader $loader;

	function __construct () {
		$this->loader = new Loader();
	}

	function echo_json ($data) {
		header_app_json_utf8();
		echo json_encode($data);
	}

	function echo_exception ($e) {
		http_response_code(500);
		$this->echo_json([
			'message' => $e->getMessage(),
		]);
	}

	function echo_error ($msg) {
		http_response_code(500);
		$this->echo_json([
			'message' => $msg,
		]);		
	}

	function require_csrf_token () {
		if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
			header('Allow: POST');
			http_response_code(405);
			$this->echo_json(['message' => 'method not allowed']);
			return false;
		}

		$token = $_POST['csrf_token'] ?? null;
		$session_token = $_SESSION['csrf_token'] ?? null;
		if (!is_string($token) || !is_string($session_token) ||
			!hash_equals($session_token, $token)) {
			http_response_code(403);
			$this->echo_json(['message' => 'invalid csrf token']);
			return false;
		}

		return true;
	}

	function set_last_post_time () {
		$_SESSION['last_post_time'] = time();
	}

	function can_not_post () {
		$t1 = intval($_SESSION['last_post_time'] ?? 0);
		$t2 = time();

		if ($t2 - $t1 <= MAX_LAST_POST_DIF) {
			return true;
		}

		return false;
	}
	
	function load_boards_data () {
		try {
			$boards = $this->loader->load_boards_json_file();
			$categories = $this->loader->load_categories_json_file();
		} catch (FileIOError $e) {
			return $this->echo_exception($e);
		} catch (FileDoesNotExistsError $e) {
			return $this->echo_exception($e);
		}

		$response = [
			"boards" => $boards,
			"categories" => $categories,
		];

		$this->echo_json($response);
	}

	function post_thread () {
		if (!$this->require_csrf_token()) {
			return;
		}
		if ($this->can_not_post()) {
			return $this->echo_error("can't post");
		}

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
		} catch (ValueError $e) {
			return $this->echo_exception($e);
		} catch (ValidationError $e) {
			return $this->echo_exception($e);
		} catch (FileIOError $e) {
			return $this->echo_exception($e);
		}

		$this->set_last_post_time();

		$this->echo_json([
			'thread_id' => $thread_id,
			'board_slug' => $board_slug,
		]);
	}

	function post_record () {
		if (!$this->require_csrf_token()) {
			return;
		}
		if ($this->can_not_post()) {
			return $this->echo_error("can't post");
		}

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

		if ($email !== "sage") {
			$subjects = new SubjectsModel();

			try {
				$subjects->init($board_slug);
			} catch (ValidationError $e) {
				return $this->echo_exception($e);
			}

			try {
				$fp = $subjects->open_stream();
			} catch (ValidationError $e) {
				return $this->echo_exception($e);
			} catch (FileIOError $e) {
				return $this->echo_exception($e);
			}

			if (!$subjects->lock_stream($fp)) {
				return $this->echo_error("failed to lock subjects file");
			}

			try {
				$subjects->load($fp);	
			} catch (ValueError $e) {
				return $this->echo_exception($e);
			} catch (ValidationError $e) {
				return $this->echo_exception($e);
			} catch (FileIOError $e) {
				return $this->echo_exception($e);
			}

			$subject = $subjects->find_by_thread_id($thread_id);
			if (!is_null($subject)) {
				$subjects->remove($subject);
				$subjects->insert_at_first($subject);
				
				try {
					$subjects->save($fp);
				} catch (ValidationError $e) {
					return $this->echo_exception($e);
				} catch (FileIOError $e) {
					return $this->echo_exception($e);
				}
			}

			$subjects->close_stream($fp);
		}

		$this->set_last_post_time();

		$this->echo_json([]);
	}

	function load_boards_detail () {
		$response = [];

		$board_slug = $_GET['board_slug'] ?? null;

		$board = new BoardModel();
		$board->init($board_slug);

		try {
			$board->load_setting();
		} catch (FileIOError $e) {
			return $this->echo_exception($e);			
		} catch (FileDoesNotExistsError $e) {
			return $this->echo_exception($e);
		}

		$thread_subjects = $board->collect_thread_subjects();

		$response['board'] = $board->to_array();
		$response['thread_subjects'] = $thread_subjects;

		$this->echo_json($response);
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

		$thread_subjects = $board->collect_thread_subjects();
		$active_subjects = array_filter($thread_subjects, function ($subject) use ($thread_id) {
			return strval($subject[0]) === strval($thread_id);
		});

		$response['board_slug'] = $board->slug;
		$response['board_name'] = $board->name;
		$response['board_no_name'] = $board->no_name;
		$response['thread_id'] = $thread_id;
		$response['thread_records'] = $records;
		$response['thread_is_dat_dropped'] = count($active_subjects) === 0;

		$this->echo_json($response);
	}
}
