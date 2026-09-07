import * as nue from '../nue/nue.js'
import * as i18n from '../i18n.js'
import Home from './Home.js'
import Boards from './Boards.js'

export default class AppContent extends nue.Div {
	constructor (mainModel) {
		super({ class: 'app-content' })
		this.mainModel = mainModel

		this.home = new Home(this.mainModel)
		this.add(this.home)

		this.boards = new Boards(this.mainModel)
		this.boards.hide()
		this.add(this.boards)

		this.mainModel.refRoute.onSet((_, path) => {
			this.showPath(path)
		})

		this.showPath(this.mainModel.refRoute.value)
	}

	showPath (path) {
		switch (path) {
		default:
			this.boards.hide()
			this.home.show()
			break
		case '/boards':
			this.home.hide()
			this.boards.show()
			break
		}
	}
}