export function mergeCatesAndBoards (cates, boards) {
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
