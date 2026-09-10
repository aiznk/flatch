import * as nue from '../nue/nue.js'
import * as i18n from '../i18n.js'

export default class AppHeader extends nue.Div {
	constructor (mainModel) {
		super({ class: 'app-header' })
		this.mainModel = mainModel

		this.appTitle = new nue.H1('', { class: 'app-title' })
		this.appTitle.setText(FLATCH.APP_TITLE)
		this.add(this.appTitle)

		this.home = new nue.Link(i18n.home(), { path: '/home' }, '/?path=/home', { class: 'link' })
		this.add(this.home)

		this.boards = new nue.Link(i18n.boards(), { path: `/${FLATCH.BOARDS_DIR_NAME}` }, `/?path=/${FLATCH.BOARDS_DIR_NAME}`, { class: 'link' })
		this.add(this.boards)
	}
}