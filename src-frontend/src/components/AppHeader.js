import * as nue from '../nue/nue.js'

export default class AppHeader extends nue.Div {
	constructor (mainModel) {
		super({ class: 'app-header' })
		this.mainModel = mainModel

		this.appTitle = new nue.H1()
		this.add(this.appTitle)

		this.mainModel.refAppTitle.onSet((_, appTitle) => {
			this.appTitle.setText(appTitle ?? 'Unknown')
		})

		this.appTitle.setText(this.mainModel.refAppTitle.value)
	}
}