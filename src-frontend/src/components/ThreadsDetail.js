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

class Breadcrumbs extends nue.Div {
	constructor () {
		super({ class: 'breadcrumbs' })
	}

	addSeparator () {
		let separator = new nue.Span({ class: 'breadcrumbs-separator' })
		separator.setText('>')
		this.add(separator)
	}

	setItems (boardSlug, boardName, threadName) {
		this.clear()

		this.add(new nue.Link(
			i18n.home(),
			{ path: '/home' },
			'/?path=/home',
			{ class: 'link breadcrumbs-link' },
		))
		this.addSeparator()
		this.add(new nue.Link(
			boardName,
			{ path: `/${FLATCH.BOARDS_DIR_NAME}/${boardSlug}` },
			`/?path=/${FLATCH.BOARDS_DIR_NAME}/${boardSlug}`,
			{ class: 'link breadcrumbs-link' },
		))
		this.addSeparator()

		let current = new nue.Span({ class: 'breadcrumbs-current' })
		current.setText(threadName)
		this.add(current)
	}
}

class DatDroppedWarning extends nue.Div {
	constructor () {
		super({ class: 'dat-dropped-warning' })
		this.setText(i18n.datDroppedWarning())
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
		this.boardName = null
		this.threadId = null
		this.refThreadName = nue.ref(null)
		this.refBoardNoName = nue.ref(null)

		this.breadcrumbs = new Breadcrumbs()
		this.add(this.breadcrumbs)

		this.datDroppedWarning = new DatDroppedWarning()
		this.datDroppedWarning.hide()
		this.add(this.datDroppedWarning)

		this.title = new ThreadTitleWrapper()
		this.add(this.title)

		this.records = new Records(mainModel)
		this.add(this.records)

		this.postRecordForm = new PostRecordForm()
		this.add(this.postRecordForm)

		this.refThreadName.onSet((_, title) => {
			this.title.setText(title)
			this.breadcrumbs.setItems(this.boardSlug, this.boardName, title)
		})
		this.mainModel.refThreadsDetailData.onSet((_, data) => {
			this.boardSlug = data.board_slug
			this.boardName = data.board_name
			this.threadId = parseInt(data.thread_id)
			this.refBoardNoName.value = data.board_no_name
			if (data.thread_is_dat_dropped) {
				this.datDroppedWarning.show()
			} else {
				this.datDroppedWarning.hide()
			}
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
			val.resetForm = () => this.postRecordForm.reset()
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
