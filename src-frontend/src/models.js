import * as nue from './nue/nue.js'

export class MainModel {
	constructor () {
		this.refRoute = nue.ref(null)
		this.refAppTitle = nue.ref(null)
		this.refBoardsDetailData = nue.ref(null)
	}

	async loadBoardsDetail (boardSlug) {
		let response
		try {
			response = await fetch(`/?m=api_load_boards_detail&board_slug=${boardSlug}`)
		} catch (e) {
			console.error(e)
			return
		}

		this.refBoardsDetailData.value = response.json()
	}
}

export class BoardModel {
	constructor (data) {
		this.text = data[0]
		this.slug = data[1]
		this.category_slug = data[2]
		this.attrs = data.length >= 4 ? data[3] : {}
	}
}
