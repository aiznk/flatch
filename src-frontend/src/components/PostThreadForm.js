import * as nue from '../nue/nue.js'
import * as i18n from '../i18n.js'
import { LabelInput } from './widgets.js'

export default class PostThreadForm extends nue.Div {
	constructor (mainModel) {
		super({ class: 'post-thread-form' })
		this.mainModel = mainModel

		this.formTitle = new nue.H2(i18n.newThread(), {
			class: 'form-title',
		})
		this.add(this.formTitle)

		this.threadName = new LabelInput({
			labelText: i18n.threadName(),
		}, {
			class: 'thread-title',
		})
		this.add(this.threadName)

		this.name = new LabelInput({
			labelText: i18n.name(),
		}, {
			class: 'name',
		})
		this.add(this.name)

		this.email = new LabelInput({
			labelText: i18n.email(), 
		}, {
			class: 'email',
		})
		this.add(this.email)

		this.content = new nue.Textarea({
			class: 'content'
		})
		this.add(this.content)

		this.postBtn = new nue.Button(i18n.createNewThread(), async ev => {
			ev.threadName = this.threadName.getValue()
			ev.name = this.name.getValue()
			ev.email = this.email.getValue()
			ev.content = this.content.getValue()
			this.emit('postThread', ev)
		})
		this.add(this.postBtn)
	}
}
