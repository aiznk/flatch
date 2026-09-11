import * as nue from '../nue/nue.js'

export default class Records extends nue.Ul {
	constructor (mainModel) {
		super({ class: 'records' })
		this.mainModel = mainModel
	}
}

