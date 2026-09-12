import * as nue from '../nue/nue.js'
import * as i18n from '../i18n.js'
import { BoardModel, ThreadModel } from '../models.js'
import Threads from './Threads.js'
import { LabelInput } from './widgets.js'
import PostThreadForm from './PostThreadForm.js'

class Desc extends nue.P {
	constructor () {
		super({ class: 'desc' })
	}
}

class ThreadsDisplaySelect extends nue.Select {
	constructor () {
		super({ class: 'threads-display-select' })
		this.add(new nue.Option('list', i18n.threadDisplayList()))
		this.add(new nue.Option('table', i18n.threadDisplayTable()))
		this.setValue('list')
	}

	onChange () {
		this.emit('changeThreadsDisplay', this.getValue())
	}
}

export default class BoardsDetail extends nue.Div {
	constructor (mainModel) {
		super({ class: 'boards-detail' })
		this.mainModel = mainModel
		this.board = new BoardModel()

		this.desc = new Desc()
		this.add(this.desc)

		this.threadsDisplay = new nue.Div({ class: 'threads-display' })
		this.threadsDisplayLabel = new nue.Label(i18n.threadDisplay())
		this.threadsDisplay.add(this.threadsDisplayLabel)
		this.threadsDisplaySelect = new ThreadsDisplaySelect()
		this.threadsDisplay.add(this.threadsDisplaySelect)
		this.add(this.threadsDisplay)

		this.threads = new Threads(this.mainModel)
		this.add(this.threads)

		this.postThreadForm = new PostThreadForm(this.mainModel)
		this.add(this.postThreadForm)

		this.mainModel.refBoardsDetailData.onSet((_, data) => {
			this.board.parseData(data.board)
			if (this.board.desc) {
				this.desc.setText(this.board.desc)
			}
			this.setThreadSubjects(data.thread_subjects)
			this.mainModel.refAppName.value = this.board.name
		})
	}

	receive (key, val) {
		switch (key) {
		default: this.emit(key, val); break
		case 'postThread':
			val.boardSlug = this.board.slug
			this.emit(key, val)
			break
		case 'changeThreadsDisplay':
			this.threads.setDisplay(val)
			break
		}
	}

	clear () {
		this.desc.setText('')
		this.threads.clear()
	}

	setThreadSubjects (subjects) {
		let threads = []

		for (let sub of subjects) {
			let thread = new ThreadModel()			
			thread.parseSubject(sub)
			thread.boardSlug = this.board.slug
			threads.push(thread)
		}

		this.threads.clear()
		this.threads.setThreads(threads)
	}
}
