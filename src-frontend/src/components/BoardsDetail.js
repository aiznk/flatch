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

export default class BoardsDetail extends nue.Div {
	constructor (mainModel) {
		super({ class: 'boards-detail' })
		this.mainModel = mainModel
		this.board = new BoardModel()

		this.desc = new Desc()
		this.add(this.desc)

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