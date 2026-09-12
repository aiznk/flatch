import * as nue from '../nue/nue.js'
import * as i18n from '../i18n.js'

export default class PostRecordForm extends nue.Div {
	constructor () {
		super({ class: 'post-record-form' })

		this.name = new nue.Input({
			class: 'name',
			placeholder: i18n.name(),
		})
		this.add(this.name)

		this.email = new nue.Input({
			class: 'name',
			placeholder: i18n.email(),
		})
		this.add(this.email)

		this.content = new nue.Textarea({
			class: 'content',
			placeholder: i18n.content(),
		})
		this.add(this.content)

		this.postBtn = new nue.Button(i18n.write(), async ev => {
			ev.name = this.name.getValue()
			ev.email = this.email.getValue()
			ev.content = this.content.getValue()
			await this.emit('clickPostRecordBtn', ev)
		}, {
			class: 'post-btn',
		})
		this.add(this.postBtn)
	}
}
