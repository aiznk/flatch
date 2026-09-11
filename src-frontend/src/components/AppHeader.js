import * as nue from '../nue/nue.js'
import * as i18n from '../i18n.js'

class AppTitle extends nue.H1 {
	constructor () {
		super('', { class: 'app-title' })

		this.link = new nue.Link(i18n.home(), { path: '/' }, '/', { class: 'link' })
		this.link.setText(FLATCH.APP_TITLE)
		this.add(this.link)
	}
}

export default class AppHeader extends nue.Div {
	constructor (mainModel) {
		super({ class: 'app-header' })
		this.mainModel = mainModel

		this.appTitle = new AppTitle()
		this.add(this.appTitle)

		this.mainMenu = new nue.Div({ class: 'main-menu' })
		this.add(this.mainMenu)

		this.home = new nue.Link(i18n.home(), { path: '/home' }, '/?path=/home', { class: 'menu-item link' })
		this.mainMenu.add(this.home)

		this.boards = new nue.Link(i18n.boards(), { path: `/${FLATCH.BOARDS_DIR_NAME}` }, `/?path=/${FLATCH.BOARDS_DIR_NAME}`, { class: 'menu-item link' })
		this.mainMenu.add(this.boards)
	}
}