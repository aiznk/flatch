import * as nue from '../nue/nue.js'
import * as i18n from '../i18n.js'
import { BoardModel } from '../models.js'
import Threads from './Threads.js'

class Desc extends nue.P {
	constructor (desc) {
		super({ class: 'desc' })
		this.desc = desc
		this.setText(desc)
	}
}

export default class BoardsDetail extends nue.Div {
	constructor (mainModel) {
		super({ class: 'boards-detail' })
		this.mainModel = mainModel
		this.slug = null
		this.board = null
	}

	findBoard (slug) {
		for (let board of FLATCH.BOARDS) {
			if (slug === board[1]) {
				return new BoardModel(board)
			}
		}
	}

	init (slug) {
		this.clear()
		
		this.slug = slug
		this.board = this.findBoard(slug)
		if (!this.board) {
			throw new Error('not found board')
		}

		if (this.board.attrs.desc) {
			this.desc = new Desc(this.board.attrs.desc)
			this.add(this.desc)
		}

		this.threads = new Threads(this.mainModel)
		this.add(this.threads)
	}

	async load () {

	}
}