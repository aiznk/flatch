const LANG = 'ja'

function get(jp, en) {
	if (LANG === 'en') {
		return en
	} else {
		return jp
	}
}

export function reachedLimitMessage () {
	return get('このスレッドはもう書き込めません。。', 'This thread is not writable.')
}

export function createNewThread () {
	return get('新規スレッド作成', 'Create new thread')
}

export function threadName () {
	return get('スレッド名', 'Thread name')
}

export function boards() {
	return get('板一覧', 'Boards')
}

export function home() {
	return get('ホーム', 'Home')
}

export function write () {
	return get('書き込む', 'Write')
}

export function name () {
	return get('名前(省略可)', 'Name')
}

export function email () {
	return get('メールアドレス(省略可)', 'Email')
}

export function content () {
	return get('コメント内容', 'Content')
}

export function invalidPostData () {
	return get('投稿データが不正です。', 'Invalid post data.')
}
