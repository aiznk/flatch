import * as nue from '../nue/nue.js'
import * as i18n from '../i18n.js'
import Home from './Home.js'
import Boards from './Boards.js'
import BoardsDetail from './BoardsDetail.js'

export default class AppContent extends nue.Div {
	constructor (mainModel) {
		super({ class: 'app-content' })
		this.mainModel = mainModel

		this.home = new Home(this.mainModel)
		this.add(this.home)

		this.boards = new Boards(this.mainModel)
		this.boards.hide()
		this.add(this.boards)

		this.boardsDetail = new BoardsDetail(this.mainModel)
		this.boardsDetail.hide()
		this.add(this.boardsDetail)

		this.mainModel.refRoute.onSet((_, path) => {
			this.showPath(path)
		})

		this.showPath(this.mainModel.refRoute.value)
	}

	showOnly (name) {
		let d = {
			'home': this.home,
			'boards': this.boards,
			'boardsDetail': this.boardsDetail,
		}
		for (let key in d) {
			if (key === name) {
				d[key].show()
			} else {
				d[key].hide()
			}
		}
	}

	showPath (path) {
		if (!path) {
			return
		}

		let m

		m = path.match(/\/boards\/([a-z0-9\-]+)/)
		if (m) {
			let slug = m[1]
			this.boardsDetail.init(slug)
			this.showOnly('boardsDetail')
			return
		}

		switch (path) {
		default:
			this.showOnly('home')
			break
		case '/boards':
			this.showOnly('boards')
			break
		}
	}
}