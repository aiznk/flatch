import * as nue from './nue/nue.js'

export class MainModel {
	constructor () {
		this.refRoute = nue.ref(null)
		this.refAppTitle = nue.ref(null)
	}

	async initialLoad () {
		this.refAppTitle.value = FLATCH.APP_TITLE
	}
}
