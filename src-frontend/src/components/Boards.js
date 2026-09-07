import * as nue from '../nue/nue.js'
import * as i18n from '../i18n.js'

class Separateitem extends nue.Li {
	constructor () {
		super({ class: 'item separate-item' })
	}
}

class CategoryItem extends nue.Li {
	constructor (text, slug) {
		super({
			class: 'item category-item',
		})
		this.text = text
		this.slug = slug
		this.setText(text)
	}
}

class BoardItem extends nue.Li {
	constructor (text, slug, category) {
		super({ 
			class: 'item board-item',
			title: slug,
		}, {
			events: ['click'],
		})

		this.link = new nue.Link(text, { path: `/boards/${slug}` }, `?path=/boards/${slug}`, { class: 'link' })
		this.add(this.link)
	}
}

export default class Boards extends nue.Div {
	constructor (mainModel) {
		super({ class: 'boards' })
		this.mainModel = mainModel

		this.list = new nue.Ul({ class: 'list' })
		this.add(this.list)

		let tree = this.mergeCatesAndBoards()
		this.setListItems(tree)
	}

	mergeCatesAndBoards () {
		let cates = FLATCH.CATEGORIES
		let boards = FLATCH.BOARDS
		let tree = {}

		for (let cate of cates) {
			tree[cate[1]] = [cate]
		}

		for (let board of boards) {
			if (!(board[2] in tree)) {
				throw new Error(`not found slug in tree: "${board[2]}"`)
			}
			tree[board[2]].push(board)
		}

		return tree
	}

	setListItems (tree) {
		this.list.clear()

		for (let key in tree) {
			let cate = tree[key][0]
			let item = new CategoryItem(cate[0], cate[1])
			this.list.add(item)

			for (let i = 1; i < tree[key].length; i++) {
				let board = tree[key][i]
				let item = new BoardItem(board[0], board[1], board[2])
				this.list.add(item)
			}

			this.list.add(new Separateitem())
		}
	}
}