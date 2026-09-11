import * as nue from '../nue/nue.js'
import * as i18n from '../i18n.js'
import { mergeCatesAndBoards } from '../utils.js'
import Boards from './Boards.js'

export default class BoardsListPanel extends nue.Div {
	constructor (mainModel) {
		super({ class: 'boards-list-panel' })
		this.mainModel = mainModel

		this.boards = new Boards(this.mainModel, {
			kind: 'list',
		})
		this.add(this.boards)
	}

	async onMount (parent) {
		await this.mainModel.loadBoardsData()	
	}
}