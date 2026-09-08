import * as nue from './nue/nue.js'
import Root from './components/Root.js'
import { MainModel } from './models.js'

async function main() {
	let mainModel = new MainModel()
	let root = new Root(mainModel)
	root.mount('#app')
}

main()
