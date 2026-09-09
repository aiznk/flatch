import * as nue from '../nue/nue.js'
import * as i18n from '../i18n.js'
import { ThreadModel, RecordModel } from '../models.js'

class RecordsItem extends nue.Li {
	constructor (record /* RecordModel */) {
		super({ class: 'records-item' })
		this.record = record

		this.name = new nue.Span({ class: 'name' })
		this.name.setText(this.record.name)
		this.add(this.name)
		this.email = new nue.Span({ class: 'email' })
		this.email.setText(this.record.email)
		this.add(this.email)
		this.datetime = new nue.Span({ class: 'datetime' })
		this.datetime.setText(this.record.datetime)
		this.add(this.datetime)
		this.content = new nue.Div({ class: 'content' })
		this.content.setText(this.record.content)
		this.add(this.content)
	}
}

class Records extends nue.Ul {
	constructor () {
		super({ class: 'records' })
	}
}

export default class ThreadsDetail extends nue.Div {
	constructor (mainModel) {
		super({ class: 'threads-detail' })
		this.mainModel = mainModel
		this.refBoardSlug = nue.ref(null)
		this.refThreadId = nue.ref(null)
		this.refSubject = nue.ref(null)

		this.records = new Records()
		this.add(this.records)

		this.mainModel.refThreadsDetailData.onSet((_, data) => {
			console.log(data)
			this.setRecordsData(data.thread_records)
		})
	}

	init (boardSlug, threadId) {
		this.refBoardSlug.value = boardSlug
		this.refThreadId.value = threadId
		this.records.clear()
	}

	setRecordsData (records) {
		this.refSubject.value = records[0][5]
		
		this.records.clear()
		for (let rec of records) {
			let record = new RecordModel(rec)
			let item = new RecordsItem(record)
			this.records.add(item)
		}
	}
}
