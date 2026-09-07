import * as nue from '../nue/nue.js'
import * as i18n from '../i18n.js'

export default class AppFooter extends nue.Div {
	constructor (mainModel) {
		super({ class: 'app-footer' })
		this.mainModel = mainModel
		this.setText('Since: ' + FLATCH.PUBLISHED_DATE)
	}
}