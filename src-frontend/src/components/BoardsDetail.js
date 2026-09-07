import * as nue from '../nue/nue.js'
import * as i18n from '../i18n.js'

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
				return board
			}
		}
	}

	init (slug) {
		this.slug = slug
		this.board = this.findBoard(slug)
		if (!this.board) {
			throw new Error('not found board')
		}

		if (this.board.length >= 4) {
			this.setText(this.board[3].desc)
		}
	}
}