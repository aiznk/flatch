const LANG = 'ja'

function get(jp, en) {
	if (LANG === 'en') {
		return en
	} else {
		return jp
	}
}

export function newThread () {
	return get('新規スレッド', 'New Thread')
}

export function reachedLimitMessage () {
	return get('このスレッドにはもう書き込めません。。', 'This thread reached limit.')
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

export function viewThread () {
	return get('スレッドを見る', 'View thread')
}

export function more () {
	return get('もっと見る', 'Show more')
}

export function threadDisplay () {
	return get('表示形式', 'Display')
}

export function threadDisplayList () {
	return get('リスト', 'List')
}

export function threadDisplayTable () {
	return get('テーブル', 'Table')
}
