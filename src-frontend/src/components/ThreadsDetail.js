import * as nue from '../nue/nue.js'
import * as i18n from '../i18n.js'
import { ThreadModel, RecordModel } from '../models.js'
import RecordsItem from './RecordsItem.js'
import Records from './Records.js'
import PostRecordForm from './PostRecordForm.js'

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
		this.refThreadName = nue.ref(null)
		this.refBoardNoName = nue.ref(null)

		this.title = new ThreadTitleWrapper()
		this.add(this.title)

		this.records = new Records(mainModel)
		this.add(this.records)

		this.postRecordForm = new PostRecordForm()
		this.add(this.postRecordForm)

		this.refThreadName.onSet((_, title) => {
			this.title.setText(title)
		})
		this.mainModel.refThreadsDetailData.onSet((_, data) => {
			this.boardSlug = data.board_slug
			this.threadId = parseInt(data.thread_id)
			this.refBoardNoName.value = data.board_no_name
			if (isNaN(this.threadId) || this.threadId <= 0) {
				console.error('invalid thread id')
			}
			this.setRecordsData(data.thread_records)
		})
	}

	receive (key, val) {
		switch (key) {
		default: this.emit(key, val); break
		case 'clickPostRecordBtn':
			val.boardSlug = this.boardSlug
			val.threadId = this.threadId
			this.emit(key, val)
			break
		}
	}

	resetPostForm () {
		if (this.has(this.postRecordForm)) {
			this.remove(this.postRecordForm)
		}
		this.postRecordForm = new PostRecordForm()
		this.add(this.postRecordForm)
	}

	clear () {
		this.resetPostForm()
		this.records.clear()
	}

	setRecordsData (records) {
		this.refThreadName.value = records[0][4]
		this.records.clear()

		for (let i = 0; i < records.length; i++) {
			let rec = records[i]
			let record = new RecordModel(rec, i+1)
			let item = new RecordsItem(
				this.mainModel,
				this.boardSlug, 
				this.threadId, 
				record, {
				noName: this.refBoardNoName.value,
			})
			this.records.add(item)
		}
		if (this.records.children.length >= FLATCH.LIMIT_DAT_FILE_LINES) {
			let item = new ReachedLimitItem()
			this.records.add(item)
			if (this.has(this.postRecordForm)) {
				this.remove(this.postRecordForm)
			}
		}
	}
}
