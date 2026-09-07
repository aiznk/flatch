import * as nue from '../nue/nue.js'
import * as i18n from '../i18n.js'

export default class Boards extends nue.Div {
	constructor (mainModel) {
		super({ class: 'boards' })
		this.mainModel = mainModel
		this.setText('Boards')
	}
}