import * as nue from '../nue/nue.js'

export default class Root extends nue.Root {
	constructor() {
		super('div', { class: 'root' })
		this.setText('Root')
	}
}