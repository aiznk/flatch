import * as nue from './nue/nue.js'

export class MainModel {
	constructor () {
		this.refRoute = nue.ref(null)
		this.refAppName = nue.ref(null)
		this.refCategoriesList = nue.ref([])
		this.refBoardsData = nue.ref([])
		this.refBoardsDetailData = nue.ref(null)
		this.refThreadsDetailData = nue.ref(null)
	}

	async postThread (boardSlug, threadName, name, email, content) {
		const data = new FormData()

		data.append('board_slug', boardSlug)
		data.append('thread_name', threadName)
		data.append('name', name)
		data.append('email', email)
		data.append('content', content)

		let response
		try {
			response = await fetch('/?m=api_post_thread', {
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
			return
		}

		let json = await response.json()
		console.log(json)
	}

	async postRecord (boardSlug, threadId, name, email, content) {
		const data = new FormData()

		data.append('board_slug', boardSlug)
		data.append('thread_id', threadId)
		data.append('name', name)
		data.append('email', email)
		data.append('content', content)

		let response
		try {
			response = await fetch('/?m=api_post_record', {
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

	async loadBoardsList () {
		let response
		try {
			response = await fetch(`/?m=api_load_boards_data`)
		} catch (e) {
			console.error(e)
			return
		}
		if (response.status !== 200) {
			let json = await response.json()
			console.error(json.message)
			return
		}

		this.refBoardsData.value = await response.json()
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
			let json = await response.json();
			console.error(json.message)
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
			let json = await response.json()
			console.error(json.message)
			return
		}

		this.refThreadsDetailData.value = await response.json()		
	}
}

export class BoardModel {
	constructor () {
		this.name = null
		this.slug = null
		this.categorySlug = null
		this.desc = null
	}

	parseData (data /* Object */) {
		this.name = data.name
		this.slug = data.slug
		this.categorySlug = data.category_slug
		this.desc = data.desc
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
	constructor (data, num) {
		if (data.length < 4) {
			throw new Error(`invalid record length ${data.length}`)
		}

		this.num = num
		this.name = data[0]
		this.email = data[1]
		this.datetime = data[2]
		this.content = data[3]
	}

	parseContentAsHTML () {
		let content = this.content

		content = content.replaceAll('[br/]', '<br/>')

		return content
	}
}
