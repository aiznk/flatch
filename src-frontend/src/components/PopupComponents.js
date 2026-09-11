import * as nue from '../nue/nue.js'
import * as i18n from '../i18n.js'
import Records from './Records.js'
import RecordsItem from './RecordsItem.js'
import { RecordModel } from '../models.js'

export default class PopupComponents extends nue.Div {
	constructor (mainModel) {
		super({ class: 'popup-components' })
		this.mainModel = mainModel

		this.anchorRecords = new Records(mainModel)
		this.anchorRecords.hide()
		this.anchorRecords.addClass('popup-anchor-records')
		this.add(this.anchorRecords)

		this.mainModel.refAnchorRecordsData.onSet((_, data) => {
			if (data == null) {
				this.anchorRecords.clear()
				this.anchorRecords.hide()
				return
			}

			let nums = data.anchor_nums
			let records = data.anchor_records
			
			this.anchorRecords.clear()
			this.anchorRecords.setCSS({
				left: data.client_x + 'px',
				top: data.client_y + 'px',
			})

			let num = nums[0]

			for (let i = 0; i < records.length; i++) {
				let record = new RecordModel(records[i], num+i)
				let item = new RecordsItem(
					mainModel, 
					data.boardSlug,
					data.threadId,
					record, {
						noName: data.no_name,
					}
				)
				this.anchorRecords.add(item)
			}
		})
	}
}
