import * as nue from '../nue/nue.js'
import * as i18n from '../i18n.js'
import AppHeader from './AppHeader.js'
import AppContent from './AppContent.js'
import AppFooter from './AppFooter.js'

export default class Root extends nue.Root {
	constructor(mainModel) {
		super('div', { class: 'root' })
		this.mainModel = mainModel

		this.appHeader = new AppHeader(this.mainModel)
		this.add(this.appHeader)

		this.appContent = new AppContent(this.mainModel)
		this.add(this.appContent)

		this.appFooter = new AppFooter(this.mainModel)
		this.add(this.appFooter)

		window.addEventListener('popstate', ev => {
			this.linkClick(ev)
		})

		this.parseLocation()
	}

	parseLocation () {
		let params = new URLSearchParams(location.search)
		this.mainModel.refRoute.value = params.get('path') || '/home'
	}

	async receive (key, val) {
		switch (key) {
		case 'linkClick': this.linkClick(val); break
		case 'clickBoardItem': this.clickBoardItem(val); break
		case 'clickPostBtn': await this.clickPostBtn(val); break
		}
	}

	async clickPostBtn (ev) {
		await this.mainModel.postResponse(
			ev.boardSlug, 
			ev.threadId, 
			ev.name, 
			ev.email, 
			ev.content,
		)
	}

	clickBoardItem (ev) {
		this.mainModel.refRoute.value = `/?path=/${FLATCH.BOARDS_DIR_NAME}/${ev.slug}`	
	}

	linkClick (ev) {
		this.mainModel.refRoute.value = ev.state.path
	}
}
