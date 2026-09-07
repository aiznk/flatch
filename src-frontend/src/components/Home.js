import * as nue from '../nue/nue.js'
import * as i18n from '../i18n.js'

export default class Home extends nue.Div {
	constructor (mainModel) {
		super({ class: 'home' })
		this.mainModel = mainModel
		this.setText(FLATCH.WELCOME_MESSAGE)
	}
}