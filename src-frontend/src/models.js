import * as nue from './nue/nue.js'

export class MainModel {
	constructor () {
		this.refRoute = nue.ref(null)
		this.refAppTitle = nue.ref(null)
		this.refBoardsDetailData = nue.ref(null)
		this.refThreadsDetailData = nue.ref(null)
	}

	async postResponse (boardSlug, threadId, name, email, content) {
		const data = new FormData()

		data.append('board_slug', boardSlug)
		data.append('thread_id', threadId)
		data.append('name', name)
		data.append('email', email)
		data.append('content', content)

		let response
		try {
			response = await fetch('/?m=api_post_response', {
				method: 'POST',
				body: data,
			})
		} catch (e) {
			console.error(e)
			return
		}

		if (response.status !== 200) {
			let json = await response.json()
			console.error(json.message)
		}
	}

	async loadBoardsDetail (boardSlug) {
		let response
		try {
			response = await fetch(`/?m=api_load_boards_detail&board_slug=${boardSlug}`)
		} catch (e) {
			console.error(e)
			return
		}
		if (response.status !== 200) {
			console.error('failed to load boards detail')
			return
		}

		this.refBoardsDetailData.value = await response.json()
	}

	async loadThreadsDetail (boardSlug, threadId) {
		let response
		try {
			response = await fetch(`/?m=api_load_threads_detail&board_slug=${boardSlug}&thread_id=${threadId}`)
		} catch (e) {
			console.error(e)
			return
		}
		if (response.status !== 200) {
			console.error('failed to load threads detail')
			return
		}

		this.refThreadsDetailData.value = await response.json()		
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
		this.id = null
		this.boardSlug = null
	}

	parseSubject (subject /* Array<String, String> */) {
		this.datFileName = subject[0]
		this.subject = subject[1]
		this.id = this.datFileName.split('.')[0]
	}

	toPath () {
		return `/${FLATCH.BOARDS_DIR_NAME}/${this.boardSlug}/${FLATCH.THREADS_DIR_NAME}/${this.id}`	
	}
}

export class RecordModel {
	constructor (data) {
		if (data.length < 4) {
			throw new Error(`invalid record length ${data.length}`)
		}

		this.name = data[0]
		this.email = data[1]
		this.datetime = data[2]
		this.content = data[3]
	}
}