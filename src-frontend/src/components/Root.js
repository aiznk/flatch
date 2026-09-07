import * as nue from '../nue/nue.js'
import AppHeader from './AppHeader.js'

export default class Root extends nue.Root {
	constructor(mainModel) {
		super('div', { class: 'root' })
		this.mainModel = mainModel

		this.appHeader = new AppHeader(this.mainModel)
		this.add(this.appHeader)
	}
}