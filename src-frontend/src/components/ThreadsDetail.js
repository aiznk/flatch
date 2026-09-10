import * as nue from '../nue/nue.js'
import * as i18n from '../i18n.js'
import { ThreadModel, RecordModel } from '../models.js'

class RecordsItem extends nue.Li {
	constructor (record /* RecordModel */) {
		super({ class: 'records-item' })
		this.record = record

		this.top = new nue.Div({ class: 'top' })
		this.add(this.top)

		this.bottom = new nue.Div({ class: 'bottom' })
		this.add(this.bottom)

		this.num = new nue.Span({ class: 'field num' })
		this.num.setText(this.record.num + ':')
		this.top.add(this.num)

		this.name = new nue.Span({ class: 'field name' })
		this.name.setText(this.record.name)
		this.top.add(this.name)

		this.email = new nue.Span({ class: 'field email' })
		this.email.setText(this.record.email)
		this.top.add(this.email)

		this.datetime = new nue.Span({ class: 'field datetime' })
		this.datetime.setText(this.record.datetime)
		this.top.add(this.datetime)

		this.content = new nue.Div({ class: 'field content' })
		this.content.setHTML(this.record.parseContentAsHTML())
		this.bottom.add(this.content)
	}
}

class Records extends nue.Ul {
	constructor () {
		super({ class: 'records' })
	}
}

class PostForm extends nue.Div {
	constructor () {
		super({ class: 'post-form' })

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
			await this.emit('clickPostBtn', ev)
		}, {
			class: 'post-btn',
		})
		this.add(this.postBtn)
	}
}

class ThreadTitleWrapper extends nue.Div {
	constructor () {
		super({ class: 'thread-title-wrapper' })
		this.h2 = new nue.H2('', { class: 'thread-title' })
		this.add(this.h2)
	}

	setText (title) {
		this.h2.setText(title)
	}
}

class ReachedLimitItem extends nue.Div {
	constructor () {
		super({ class: 'reached-limit-item' })
		this.setText(i18n.reachedLimitMessage())
	}
}

export default class ThreadsDetail extends nue.Div {
	constructor (mainModel) {
		super({ class: 'threads-detail' })
		this.mainModel = mainModel
		this.boardSlug = null
		this.threadId = null
		this.refTitle = nue.ref(null)

		this.title = new ThreadTitleWrapper()
		this.add(this.title)

		this.records = new Records()
		this.add(this.records)

		this.postForm = new PostForm()
		this.add(this.postForm)

		this.refTitle.onSet((_, title) => {
			this.title.setText(title)
		})
		this.mainModel.refThreadsDetailData.onSet((_, data) => {
			this.boardSlug = data.board_slug
			this.threadId = parseInt(data.thread_id)
			if (isNaN(this.threadId) || this.threadId <= 0) {
				console.error('invalid thread id')
			}
			this.setRecordsData(data.thread_records)
		})
	}

	receive (key, val) {
		switch (key) {
		default: this.emit(key, val); break
		case 'clickPostBtn':
			val.boardSlug = this.boardSlug
			val.threadId = this.threadId
			this.emit(key, val)
			break
		}
	}

	clear () {
		this.records.clear()
	}

	setRecordsData (records) {
		this.refTitle.value = records[0][4]
		this.records.clear()

		for (let i = 0; i < records.length; i++) {
			let rec = records[i]
			let record = new RecordModel(rec, i+1)
			let item = new RecordsItem(record)
			this.records.add(item)
		}
		if (this.records.children.length >= FLATCH.LIMIT_DAT_FILE_LINES) {
			let item = new ReachedLimitItem()
			this.records.add(item)
			if (this.has(this.postForm)) {
				this.remove(this.postForm)
			}
		}
	}
}
