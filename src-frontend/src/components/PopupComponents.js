import * as nue from '../nue/nue.js'
import * as i18n from '../i18n.js'
import Records from './Records.js'
import RecordsItem from './RecordsItem.js'
import { RecordModel } from '../models.js'

export default class PopupComponents extends nue.Div {
	constructor (mainModel) {
		super({
			class: 'popup-components',
		}, {
			events: ['mouseleave'],
		})
		this.mainModel = mainModel

		this.anchorRecords = new Records(mainModel)
		this.anchorRecords.hide()
		this.anchorRecords.addClass('popup-anchor-records')
		this.add(this.anchorRecords)

		this.anchorRecordsStatus = 'hide'

		this.childAnchorRecords = new nue.Div({ class: 'child-anchor-records' })
		this.add(this.childAnchorRecords)

		this.mainModel.refAnchorRecordsData.onSet((_, data) => {
			if (data == null) {
				this.anchorRecords.clear()
				this.anchorRecords.hide()
				this.anchorRecordsStatus = 'hide'
				this.childAnchorRecords.clear()
				return
			}

			let nums = data.anchor_nums
			let records = data.anchor_records
			let anchorRecords

			if (this.anchorRecordsStatus === 'show') {
				anchorRecords = new Records(this.mainModel)
				anchorRecords.addClass('popup-anchor-records')
				this.childAnchorRecords.add(anchorRecords)
			} else {
				anchorRecords = this.anchorRecords
				this.anchorRecordsStatus = 'show'
			}

			anchorRecords.clear()
			anchorRecords.setCSS({
				left: data.client_x + 'px',
				top: data.client_y + 'px',
			})

			let num = nums[0]

			for (let i = 0; i < records.length; i++) {
				let record = new RecordModel(records[i], num+i)
				let item = new RecordsItem(
					mainModel, 
					data.board_slug,
					data.thread_id,
					record, {
						noName: data.board_no_name,
					}
				)
				anchorRecords.add(item)
			}
		})
	}

	receive (key, val) {
		switch (key) {
		default: this.emit(key, val); break
		case 'mouseLeaveRecords': {
			if (this.childAnchorRecords.has(val.self)) {
				this.childAnchorRecords.remove(val.self)
			}
		} break
		}
	}

	onMouseLeave (ev) {
		this.emit('mouseLeavePopupAnchorThreads')
	}
}
