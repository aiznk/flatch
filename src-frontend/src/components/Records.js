import * as nue from '../nue/nue.js'

export default class Records extends nue.Ul {
	constructor (mainModel) {
		super({
			class: 'records',
		}, {
			events: ['mouseleave'],
		})
		this.mainModel = mainModel
		this.next = null
	}

	onMouseLeave (ev) {
		ev.self = this
		this.emit('mouseLeaveRecords', ev)
	}

	push (component) {
		for (let cur = this.next; cur; cur = this.next) {
			if (cur.next == null) {
				cur.next = component
				break
			}
		}
	}
}

