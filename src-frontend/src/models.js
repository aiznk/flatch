import * as nue from './nue/nue.js'

export class MainModel {
	constructor () {
		this.refAppTitle = nue.ref(null)
	}

	async initialLoad () {
		const data = FLATCH.initialData
		this.refAppTitle.value = data.appTitle
	}
}
