import * as nue from '../nue/nue.js'
import * as i18n from '../i18n.js'
import Home from './Home.js'
import Boards from './Boards.js'
import BoardsDetail from './BoardsDetail.js'
import ThreadsDetail from './ThreadsDetail.js'

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

		this.threadsDetail = new ThreadsDetail(this.mainModel)
		this.threadsDetail.hide()
		this.add(this.threadsDetail)

		this.mainModel.refRoute.onSet(async (_, path) => {
			await this.showPath(path)
		})

		this.showPath(this.mainModel.refRoute.value)
	}

	showOnly (name) {
		let d = {
			'home': this.home,
			'boards': this.boards,
			'boardsDetail': this.boardsDetail,
			'threadsDetail': this.threadsDetail,
		}
		for (let key in d) {
			if (key === name) {
				d[key].show()
			} else {
				d[key].hide()
			}
		}
	}

	async showPath (path) {
		if (!path) {
			return
		}

		let m, reg

		reg = new RegExp(`\/${FLATCH.BOARDS_DIR_NAME}\/([a-z0-9\-]+)$`)
		m = path.match(reg)
		if (m) {
			let slug = m[1]
			this.boardsDetail.init(slug)
			await this.mainModel.loadBoardsDetail(slug)
			this.showOnly('boardsDetail')
			return
		}

		reg = new RegExp(`\/${FLATCH.BOARDS_DIR_NAME}\/([a-z0-9\-]+)\/${FLATCH.THREADS_DIR_NAME}\/([0-9]+)$`)
		m = path.match(reg)
		if (m) {
			let boardSlug = m[1]
			let threadId = parseInt(m[2])
			if (isNaN(threadId)) {
				console.error('invalid thread id')
				return
			}
			this.threadsDetail.init(boardSlug, threadId)
			await this.mainModel.loadThreadsDetail(boardSlug, threadId)
			this.showOnly('threadsDetail')
			return
		}

		switch (path) {
		default:
			this.showOnly('home')
			break
		case `/${FLATCH.BOARDS_DIR_NAME}`:
			this.showOnly('boards')
			break
		}
	}
}