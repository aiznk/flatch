import * as nue from '../nue/nue.js'
import * as i18n from '../i18n.js'

export default class RecordsItem extends nue.Li {
	constructor (
		mainModel,
		boardSlug /* String */,
		threadId /* Number */,
		record /* RecordModel */, {
		noName=null, /* String */
	}={}) {
		super({ class: 'records-item' })
		this.mainModel = mainModel
		this.record = record

		this.top = new nue.Div({ class: 'top' })
		this.add(this.top)

		this.bottom = new nue.Div({ class: 'bottom' })
		this.add(this.bottom)

		this.num = new nue.Span({ class: 'field num' })
		this.num.setText(this.record.num + ':')
		this.top.add(this.num)

		this.name = new nue.Span({ class: 'field name' })
		this.name.setText(this.record.name || noName)
		this.top.add(this.name)

		this.email = new nue.Span({ class: 'field email' })
		this.email.setText(this.record.email)
		this.top.add(this.email)

		this.datetime = new nue.Span({ class: 'field datetime' })
		this.datetime.setText(this.record.datetime)
		this.top.add(this.datetime)

		this.content = new nue.Div({ class: 'field content' })

		let components = this.record.parseContentAsComponents(boardSlug, threadId)
		this.content.add(components)

		this.bottom.add(this.content)
	}
}
