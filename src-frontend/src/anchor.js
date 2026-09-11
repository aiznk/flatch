import * as nue from './nue/nue.js'

class AnchorTagElem extends nue.Span {
	constructor (boardSlug, threadId, nums) {
		super({
			class: 'elem link',
		}, {
			events: ['click', 'mouseenter', 'mouseleave'],
		})
		this.boardSlug = boardSlug
		this.threadId = threadId
		this.nums = nums
		this.setText(this.toText())
	}

	onClick (ev) {
		alert(this.nums.length)
	}

	onMouseEnter (ev) {
		ev.boardSlug = this.boardSlug
		ev.threadId = this.threadId
		ev.anchorNums = this.nums
		this.emit('mouseEnterAnchorTagElem', ev)
	}

	onMouseLeave (ev) {
		ev.boardSlug = this.boardSlug
		ev.threadId = this.threadId
		ev.anchorNums = this.nums
		this.emit('mouseLeaveAnchorTagElem', ev)
	}

	toText () {
		let s = ''

		if (this.nums.length === 1) {
			return '' + this.nums[0]
		} else {
			return this.nums.join('-')
		}

		return s
	}
}

export class AnchorTag extends nue.Span {
	constructor (boardSlug, threadId) {
		super({ 
			class: 'anchor'
		})

		this.boardSlug = boardSlug
		this.threadId = threadId

		this.anchor = new nue.Span()
		this.anchor.setText('>>')
		this.add(this.anchor)
	}

	parseLine (line) {
		for (let m of line.split(',')) {
			if (/[0-9]+\-[0-9]+/.test(m)) {
				let nums = m.split('-')
				nums = nums.map(n => parseInt(n))
				let el = new AnchorTagElem(this.boardSlug, this.threadId, nums)
				this.add(el)
			} else {
				let el = new AnchorTagElem(this.boardSlug, this.threadId, [parseInt(m)])
				this.add(el)
			}
		}
	}
}

