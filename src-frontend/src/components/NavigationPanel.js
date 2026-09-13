import * as nue from '../nue/nue.js'

export default class NavigationPanel extends nue.Div {
	constructor (mainModel) {
		super({ class: 'navigation-panel' })
		this.mainModel = mainModel
		this.setText('Panel')
	}
}
