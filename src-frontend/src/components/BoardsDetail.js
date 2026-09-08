import * as nue from '../nue/nue.js'
import * as i18n from '../i18n.js'
import { BoardModel, ThreadModel } from '../models.js'
import Threads from './Threads.js'

class Desc extends nue.P {
	constructor () {
		super({ class: 'desc' })
	}
}

export default class BoardsDetail extends nue.Div {
	constructor (mainModel) {
		super({ class: 'boards-detail' })
		this.mainModel = mainModel
		this.boardSlug = null /* String */
		this.board = null /* BoardModel */

		this.desc = new Desc()
		this.add(this.desc)

		this.threads = new Threads(this.mainModel)
		this.add(this.threads)

		this.mainModel.refBoardsDetailData.onSet((_, data) => {
			this.setThreadSubjects(data.thread_subjects)
		})
	}

	findBoard (slug) {
		for (let board of FLATCH.BOARDS) {
			if (slug === board[1]) {
				return new BoardModel(board)
			}
		}
	}

	init (boardSlug) {
		this.boardSlug = boardSlug
		this.board = this.findBoard(boardSlug) /* BoardModel */
		if (!this.board) {
			throw new Error('not found board')
		}

		if (this.board.attrs.desc) {
			this.desc.setText(this.board.attrs.desc)
		}
	}

	setThreadSubjects (subjects) {
		let threads = []

		for (let sub of subjects) {
			let thread = new ThreadModel()			
			thread.parseSubject(sub)
			thread.boardSlug = this.boardSlug
			threads.push(thread)
		}

		this.threads.clear()
		this.threads.setThreads(threads)
	}
}