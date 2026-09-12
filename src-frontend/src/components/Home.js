import * as nue from '../nue/nue.js'
import * as i18n from '../i18n.js'
import { ThreadModel, RecordModel } from '../models.js'
import RecordsItem from './RecordsItem.js'

const THREADS_PER_PAGE = 10

class HomeThreadItem extends nue.Section {
	constructor (mainModel, thread, record, noName) {
		super({ class: 'home-thread-item' })
		this.thread = thread

		this.subject = new nue.H2(thread.subject, { class: 'home-thread-subject' })
		this.add(this.subject)

		this.records = new nue.Ul({ class: 'records home-thread-records' })
		this.records.add(new RecordsItem(
			mainModel,
			thread.boardSlug,
			parseInt(thread.id),
			record,
			{ noName },
		))
		this.add(this.records)

		this.viewButton = new nue.Button(i18n.viewThread(), () => {
			let path = this.thread.toPath()
			history.pushState({ path }, '', `/?path=${path}`)
			this.emit('linkClick', { state: { path } })
		}, { class: 'home-view-thread-button' })
		this.add(this.viewButton)
	}
}

export default class Home extends nue.Div {
	constructor (mainModel) {
		super({ class: 'home' })
		this.mainModel = mainModel
		this.boardSlug = FLATCH.HOME_DISPLAY_BOARD || null
		this.threads = []
		this.boardNoName = null
		this.offset = 0
		this.loading = false

		this.welcome = new nue.Div({ class: 'welcome-message' })
		this.welcome.setText(FLATCH.WELCOME_MESSAGE)
		this.add(this.welcome)

		this.list = new nue.Div({ class: 'home-threads' })
		this.add(this.list)

		this.moreButton = new nue.Button(i18n.more(), async () => {
			await this.showMoreThreads()
		}, { class: 'home-more-button' })
		this.moreButton.hide()
		this.add(this.moreButton)
	}

	async onMount () {
		await this.loadThreads()
	}

	async loadThreads () {
		if (!this.boardSlug) {
			return
		}

		let response
		try {
			response = await fetch(`/?m=api_load_boards_detail&board_slug=${encodeURIComponent(this.boardSlug)}`)
		} catch (e) {
			console.error(e)
			return
		}

		if (response.status !== 200) {
			console.error('failed to load home board')
			return
		}

		let data = await response.json()
		this.boardNoName = data.board.no_name
		this.threads = data.thread_subjects.map(subject => {
			let thread = new ThreadModel()
			thread.parseSubject(subject)
			thread.boardSlug = this.boardSlug
			return thread
		})

		await this.showMoreThreads()
	}

	async loadFirstRecord (thread) {
		let response
		try {
			response = await fetch(`/?m=api_load_threads_detail&board_slug=${encodeURIComponent(thread.boardSlug)}&thread_id=${encodeURIComponent(thread.id)}`)
		} catch (e) {
			console.error(e)
			return null
		}

		if (response.status !== 200) {
			console.error(`failed to load thread ${thread.id}`)
			return null
		}

		let data = await response.json()
		if (!data.thread_records.length) {
			return null
		}

		return new RecordModel(data.thread_records[0], 1)
	}

	async showMoreThreads () {
		if (this.loading || this.offset >= this.threads.length) {
			return
		}

		this.loading = true
		this.moreButton.hide()
		let nextThreads = this.threads.slice(this.offset, this.offset + THREADS_PER_PAGE)
		let records = await Promise.all(nextThreads.map(thread => this.loadFirstRecord(thread)))

		for (let i = 0; i < nextThreads.length; i++) {
			if (records[i]) {
				this.list.add(new HomeThreadItem(
					this.mainModel,
					nextThreads[i],
					records[i],
					this.boardNoName,
				))
			}
		}

		this.offset += nextThreads.length
		this.loading = false
		if (this.offset < this.threads.length) {
			this.moreButton.show()
		}
	}
}
