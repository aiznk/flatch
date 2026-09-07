import * as nue from '../nue/nue.js'
import * as i18n from '../i18n.js'

export default class AppHeader extends nue.Div {
	constructor (mainModel) {
		super({ class: 'app-header' })
		this.mainModel = mainModel

		this.appTitle = new nue.H1('', { class: 'app-title' })
		this.add(this.appTitle)

		this.home = new nue.Link(i18n.home(), { path: '/home' }, '/?path=/home')
		this.add(this.home)

		this.boards = new nue.Link(i18n.boards(), { path: '/boards' }, '/?path=/boards')
		this.add(this.boards)

		this.mainModel.refAppTitle.onSet((_, appTitle) => {
			this.appTitle.setText(appTitle ?? 'Unknown')
		})

		this.appTitle.setText(this.mainModel.refAppTitle.value)
	}
}