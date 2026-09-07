const LANG = 'ja'

function get(jp, en) {
	if (LANG === 'en') {
		return en
	} else {
		return jp
	}
}

export function boards() {
	return get('板一覧', 'Boards')
}

export function home() {
	return get('ホーム', 'Home')
}
