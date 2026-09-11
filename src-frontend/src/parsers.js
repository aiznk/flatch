import * as nue from './nue/nue.js'
import { isDigit } from './utils.js'

class AnchorTagElem extends nue.Span {
	constructor (nums) {
		super({
			class: 'elem link',
		}, {
			events: ['click'],
		})
		this.nums = nums
		this.setText(this.toText())
	}

	onClick (ev) {
		alert(this.nums.length)
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

class AnchorTag extends nue.Span {
	constructor () {
		super({ 
			class: 'anchor'
		})
		let anchor = new nue.Span()
		anchor.setText('>>')
		this.add(anchor)
	}

	parseLine (line) {
		for (let m of line.split(',')) {
			if (/[0-9]+\-[0-9]+/.test(m)) {
				let nums = m.split('-')
				nums = nums.map(n => parseInt(n))
				let el = new AnchorTagElem(nums)
				this.add(el)
			} else {
				let el = new AnchorTagElem([parseInt(m)])
				this.add(el)
			}
		}
	}
}

export class RecordContentParser {
	constructor () {
		this.root = null
		this.content = null
		this.i = 0
	}

	read (content, beg, n) {
		let s = ''
		for (let i = 0; i < n; i++) {
			if (beg+i >= content.length) {
				break
			}
			s += content[beg+i]
		}
		return s
	}

	parse (content) {
		let buf = ''
		let p = new nue.P()

		this.root = new nue.Div({ class: 'content-root' })
		this.content = content
		this.i = 0

		const storeSpan = () => {
			if (!buf.length) {
				return
			}

			let span = new nue.Span()
			span.setText(buf)
			buf = ''
			p.add(span)
		}

		const storeP = () => {
			if (p.children.length) {
				this.root.add(p)
				p = new nue.P()				
			}
		}

		for (this.i = 0; this.i < content.length; this.i++) {
			let s1 = content[this.i]
			let s2 = this.read(content, this.i, 2)
			let s3 = this.read(content, this.i, 3)
			let s4 = this.read(content, this.i, 4)
			let s5 = this.read(content, this.i, 5)
			let s8 = this.read(content, this.i, 8)

			if (/\>\>[0-9]/.test(s3)) {
				storeSpan()
				let tag = this.parseAnchor()
				p.add(tag)
			} else if (s5 === '[br/]') {
				storeSpan()
				storeP()
				this.i += 4
			} else {
				buf += s1
			}
		}

		storeSpan()
		storeP()

		return this.root
	}

	readDigit (content, i) {
		let buf = ''

		for (; i < content.length; i++) {
			if (isDigit(content[i])) {
				buf += content[i]
			} else {
				break
			}
		}

		return [buf, i]
	}

	parseAnchor () {
		let m = 0
		let buf = ''
		let line = ''		
		let anchor = new AnchorTag()
		let i = 0

		for (i = this.i; i < this.content.length; i++) {
			let c = this.content[i]

			if (m === 0) {
				if (c === '>') {
					m = 1
				} else {
					break
				}
			} else if (m == 1) {
				if (c === '>') {
					m = 10
				} else {
					break
				}
			} else if (m === 10) {
				if (isDigit(c) || c === ',' || c === '-') {
					line += c
				} else {
					break
				}
			}
		}

		if (line.length) {
			anchor.parseLine(line)
		}

		if (i-1 > this.i) {
			i -= 1
		}
		this.i = i

		return anchor
	}
}
