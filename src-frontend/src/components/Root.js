import * as nue from '../nue/nue.js'
import * as i18n from '../i18n.js'
import AppHeader from './AppHeader.js'
import AppContent from './AppContent.js'
import AppFooter from './AppFooter.js'
import PopupComponents from './PopupComponents.js'

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

		this.popupComponents = new PopupComponents(this.mainModel)
		this.add(this.popupComponents)

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
		case 'mouseEnterAnchorTagElem': await this.mouseEnterAnchorTagElem(val); break
		case 'mouseLeavePopupAnchorThreads': this.mouseLeavePopupAnchorThreads(val); break
		case 'postThread': await this.postThread(val); break
		case 'linkClick': this.linkClick(val); break
		case 'clickBoardItem': this.clickBoardItem(val); break
		case 'clickPostRecordBtn': await this.clickPostRecordBtn(val); break
		}
	}

	mouseLeavePopupAnchorThreads (ev) {
		this.mainModel.refAnchorRecordsData.value = null
	}

	async mouseEnterAnchorTagElem (ev) {
		let x = ev.clientX - 8
		let y = ev.clientY - 8
		await this.mainModel.loadRecordsByAnchorNums(ev.boardSlug, ev.threadId, ev.anchorNums, x, y)
	}

	async postThread (ev) {
		await this.mainModel.postThread(
			ev.boardSlug,
			ev.threadName,
			ev.name,
			ev.email,
			ev.content,
		)
	}

	async clickPostRecordBtn (ev) {
		await this.mainModel.postRecord(
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
