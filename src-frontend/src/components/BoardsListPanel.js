import * as nue from '../nue/nue.js'
import * as i18n from '../i18n.js'

export default class BoardsListPanel extends nue.Div {
	constructor (mainModel) {
		super({ class: 'boards-list-panel' })
		this.mainModel = mainModel
		this.setText('gege')
	}
}