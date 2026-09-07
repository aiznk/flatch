import * as nue from '../nue/nue.js'
import * as i18n from '../i18n.js'
import AppHeader from './AppHeader.js'
import AppContent from './AppContent.js'

export default class Root extends nue.Root {
	constructor(mainModel) {
		super('div', { class: 'root' })
		this.mainModel = mainModel

		this.appHeader = new AppHeader(this.mainModel)
		this.add(this.appHeader)

		this.appContent = new AppContent(this.mainModel)
		this.add(this.appContent)

		window.addEventListener('popstate', ev => {
			this.mainModel.refRoute.value = ev.state.path
		})

		this.linkClick()
	}

	receive (key, val) {
		switch (key) {
		case 'linkClick': this.linkClick(); break
		}
	}

	linkClick () {
		const params = new URLSearchParams(location.search)
		this.mainModel.refRoute.value = params.get('path')
	}
}
