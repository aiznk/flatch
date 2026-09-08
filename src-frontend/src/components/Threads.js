import * as nue from '../nue/nue.js'
import * as i18n from '../i18n.js'

class ThreadsListItem extends nue.Li {
	constructor (thread /* Thread */) {
		super({ class: 'threads-list-item' })
		this.thread = thread

		let path = `/threads/${thread.slug}`
		this.link = new nue.Link(
			thread.name,
			{ path },
			`/?path=${path}`,
			{ class: 'link' },
		)
		this.add(this.link)
	}
}

class ThreadsList extends nue.Ul {
	constructor () {
		super({ class: 'threads-list' })
	}
}

export default class Threads extends nue.Div {
	constructor (mainModel) {
		super({ class: 'threads' })
		this.mainModel = mainModel

		this.list = new ThreadsList()
		this.add(this.list)
	}

	setThreads (threads /* Array<Thread> */) {
		for (let thread of threads) {
			let item = new ThreadsListItem(thread)
			this.list.add(item)
		}
	}
}
