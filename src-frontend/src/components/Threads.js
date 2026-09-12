import * as nue from '../nue/nue.js'
import * as i18n from '../i18n.js'

class ThreadsListItem extends nue.Li {
	constructor (thread /* Thread */) {
		super({ class: 'threads-list-item' })
		this.thread = thread

		let path = this.thread.toPath()
		this.link = new nue.Link(
			thread.subject,
			{ path },
			`/?path=${path}`,
			{ class: 'link' },
		)
		this.add(this.link)
	}
}

class ThreadsList extends nue.Ul {
	constructor (display) {
		super({ class: `threads-list ${display}` })
	}

	setDisplay (display) {
		this.setClass(`threads-list ${display}`)
	}
}

export default class Threads extends nue.Div {
	constructor (mainModel, {
		display='list',
	}={}) {
		super({ class: 'threads' })
		this.mainModel = mainModel
		this.display = display

		this.list = new ThreadsList(this.display)
		this.add(this.list)
	}

	setDisplay (display) {
		if (!['list', 'table'].includes(display)) {
			return
		}
		this.display = display
		this.list.setDisplay(display)
	}

	clear () {
		this.list.clear()
	}

	setThreads (threads /* Array<Thread> */) {
		for (let thread of threads) {
			let item = new ThreadsListItem(thread)
			this.list.add(item)
		}
	}
}
