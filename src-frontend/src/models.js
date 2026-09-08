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

		this.refBoardsDetailData.value = await response.json()
	}
}

export class BoardModel {
	constructor (data) {
		this.text = data[0]
		this.slug = data[1]
		this.categorySlug = data[2]
		this.attrs = data.length >= 4 ? data[3] : {}
	}
}

export class ThreadModel {
	constructor () {
		this.datFileName = null
		this.subject = null
		this.slug = null
		this.boardSlug = null
	}

	parseSubject (subject /* Array<String, String> */) {
		this.datFileName = subject[0]
		this.subject = subject[1]
		this.slug = this.datFileName.split('.')[0]
	}

	toPath () {
		return `/${FLATCH.BOARDS_DIR_NAME}/${this.boardSlug}/${FLATCH.THREADS_DIR_NAME}/${this.slug}`	
	}
}
