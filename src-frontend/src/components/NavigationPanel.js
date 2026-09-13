import * as nue from '../nue/nue.js'
import * as i18n from '../i18n.js'

export default class NavigationPanel extends nue.Div {
	constructor (mainModel) {
		super({ class: 'navigation-panel' })
		this.mainModel = mainModel
		this.boardSlug = null
		this.threadId = null
		this.subjects = []
		this.loadVersion = 0

		this.mainModel.refRoute.onSet(async (_, path) => {
			await this.update(path)
		})
	}

	async update (path) {
		let version = ++this.loadVersion
		let match = path && path.match(new RegExp(`^/${FLATCH.BOARDS_DIR_NAME}/([a-z0-9\\-]+)/${FLATCH.THREADS_DIR_NAME}/([0-9]+)$`))
		if (!match) {
			this.boardSlug = null
			this.threadId = null
			this.subjects = []
			return
		}

		let boardSlug = match[1]
		let threadId = match[2]
		let response
		try {
			response = await fetch(`/?m=api_load_boards_detail&board_slug=${encodeURIComponent(boardSlug)}`)
		} catch (e) {
			console.error(e)
			return
		}
		if (version !== this.loadVersion || response.status !== 200) {
			return
		}

		let data = await response.json()
		this.boardSlug = boardSlug
		this.threadId = threadId
		this.subjects = data.thread_subjects || []
		this.render()
	}

	render () {
		this.clear()
		let current = this.subjects.findIndex(subject => String(subject[0]) === String(this.threadId))
		let previous = new nue.Button(i18n.previousThread(), () => this.goToOffset(-1), { class: 'thread-navigation-button' })
		let next = new nue.Button(i18n.nextThread(), () => this.goToOffset(1), { class: 'thread-navigation-button' })
		if (current <= 0) {
			previous.setAttr('disabled', 'disabled')
		}
		if (current < 0 || current >= this.subjects.length - 1) {
			next.setAttr('disabled', 'disabled')
		}
		this.add(previous)
		this.add(next)
	}

	goToOffset (offset) {
		let current = this.subjects.findIndex(subject => String(subject[0]) === String(this.threadId))
		let target = current + offset
		if (current < 0 || target < 0 || target >= this.subjects.length) {
			return
		}
		let path = `/${FLATCH.BOARDS_DIR_NAME}/${this.boardSlug}/${FLATCH.THREADS_DIR_NAME}/${this.subjects[target][0]}`
		history.pushState({ path }, '', `/?path=${path}`)
		this.mainModel.refRoute.value = path
	}
}
