import * as nue from './nue/nue.js'
import { Cache } from './cache.js'
import { RecordContentParser } from './parsers.js'

export class MainModel {
	constructor () {
		this.cache = new Cache()
		this.refRoute = nue.ref(null)
		this.refAppName = nue.ref(null)
		this.refCategoriesList = nue.ref([])
		this.refBoardsData = nue.ref([])
		this.refBoardsDetailData = nue.ref(null)
		this.refThreadsDetailData = nue.ref(null)
		this.refAnchorRecordsData = nue.ref(null)
	}

	async loadRecordsByAnchorNums (
		boardSlug, 
		threadId, 
		anchorNums,
		clientX,
		clientY,
		cache=true,
	) {
		let data
		let ckey = `anchorRecordsData.${boardSlug}.${threadId}`

		if (cache && this.cache.has(ckey)) {
			data = this.cache.get(ckey)
		} else {
			let response
			const url = `/?m=api_load_threads_detail&board_slug=${encodeURIComponent(boardSlug)}&thread_id=${encodeURIComponent(threadId)}`

			try {
				response = await fetch(url)
			} catch (e) {
				console.error(e)
				return
			}

			if (response.status !== 200) {
				let json = await response.json()
				console.error(json.message)
				return
			}

			data = await response.json()
			this.cache.set(ckey, data)
		}

		data.client_x = clientX
		data.client_y = clientY
		data.anchor_nums = anchorNums

		data.anchor_records = this.findAnchorRecords(data.thread_records, anchorNums)

		this.refAnchorRecordsData.value = data
	}

	findAnchorRecords (records, nums) {
		let ret = []

		if (nums.length === 1) {
			for (let i = 0; i < records.length; i++) {
				let id = i+1
				if (nums.includes(id)) {
					ret.push(records[i])
					break
				}
			}
		} else if (nums.length === 2) {
			let m = 0
			for (let i = 0; i < records.length; i++) {
				let id = i+1
				if (m === 0) {
					if (id == nums[0]) {
						ret.push(records[i])
						m = 1
					}
				} else if (m === 1) {
					if (id == nums[1]) {
						ret.push(records[i])
						break
					} else {
						ret.push(records[i])
					}
				}
			}			
		}

		return ret
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

		await this.loadThreadsDetail(boardSlug, threadId, false)
	}

	async loadBoardsData (cache=true) {
		if (cache && this.cache.has('boardsData')) {
			return this.cache.get('boardsData')
		}

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

		let json = await response.json()
		this.cache.set('boardsData', json)
		this.refBoardsData.value = json
	}

	async loadBoardsDetail (boardSlug, cache=true) {
		const ckey = `boardsDetail.${boardSlug}`
		let data

		if (cache && this.cache.has(ckey)) {
			data = this.cache.get(ckey)
		} else {
			let response
			try {
				response = await fetch(`/?m=api_load_boards_detail&board_slug=${encodeURIComponent(boardSlug)}`)
			} catch (e) {
				console.error(e)
				return
			}
			if (response.status !== 200) {
				let json = await response.json();
				console.error(json.message)
				return
			}

			data = await response.json()
			this.cache.set(ckey, data)
		}

		this.refBoardsDetailData.value = data
	}

	async loadThreadsDetail (boardSlug, threadId, cache=true) {
		const ckey = `threadsDetail.${boardSlug}.${threadId}`
		let data

		if (cache && this.cache.has(ckey)) {
			data = this.cache.get(ckey)
		} else {
			let response
			try {
				response = await fetch(`/?m=api_load_threads_detail&board_slug=${encodeURIComponent(boardSlug)}&thread_id=${encodeURIComponent(threadId)}`)
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

			data = await response.json()
			this.cache.set(ckey, data)
		}

		this.refThreadsDetailData.value = data
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

	parseContentAsComponents (boardSlug, threadId) {
		let parser = new RecordContentParser(boardSlug, threadId)
		let components = parser.parse(this.content)
		return components
	}
}
