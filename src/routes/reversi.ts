import {
	FIELD_SIZE,
	type Color,
	type Field,
	type Position
} from './+page.svelte'

// 座標が押せるかをチェック
const checkPutAbility = (
	y: number,
	x: number,
	fields: Field[][],
	currentColor: Color
): boolean => {
	// 上 をひっくり返せるかチェック
	if (y > 1) {
		// forでcurrentColorと同じ色が出るまで、座標を配列に格納する
		for (let i = y - 1; i >= 0; i--) {
			const field = fields[i][x]
			if (!field) break // 置かれていない

			// 同じ色が出たら、trueにしてループを抜ける
			if (field === currentColor) {
				if (i === y - 1) break // 隣(1つ上)が同じ色ならひっくり返せない
				return true
			}
		}
	}

	// 下 をひっくり返せるかチェック
	if (y < FIELD_SIZE - 2) {
		for (let i = y + 1; i < FIELD_SIZE; i++) {
			const field = fields[i][x]
			if (!field) break

			if (field === currentColor) {
				if (i === y + 1) break
				return true
			}
		}
	}

	// 左 をひっくり返せるかチェック
	if (x > 1) {
		for (let i = x - 1; i >= 0; i--) {
			const field = fields[y][i]
			if (!field) break

			if (field === currentColor) {
				if (i === x - 1) break
				return true
			}
		}
	}

	// 右 をひっくり返せるかチェック
	if (x < FIELD_SIZE - 2) {
		for (let i = x + 1; i < FIELD_SIZE; i++) {
			const field = fields[y][i]
			if (!field) break

			if (field === currentColor) {
				if (i === x + 1) break
				return true
			}
		}
	}

	// 左上 をひっくり返せるかチェック
	if (x > 1 && y > 1) {
		for (let ix = x - 1, iy = y - 1; ix >= 0 && iy >= 0; ix--, iy--) {
			const field = fields[iy][ix]
			if (!field) break

			if (field === currentColor) {
				if (ix === x - 1) break
				return true
			}
		}
	}

	// 右下 をひっくり返せるかチェック
	if (x < FIELD_SIZE - 2 && y < FIELD_SIZE - 2) {
		for (
			let ix = x + 1, iy = y + 1;
			ix < FIELD_SIZE && iy < FIELD_SIZE;
			ix++, iy++
		) {
			const field = fields[iy][ix]
			if (!field) break

			if (field === currentColor) {
				if (ix === x + 1) break
				return true
			}
		}
	}

	// 右上 をひっくり返せるかチェック
	if (x < FIELD_SIZE - 2 && y > 1) {
		for (let ix = x + 1, iy = y - 1; ix < FIELD_SIZE && iy >= 0; ix++, iy--) {
			const field = fields[iy][ix]
			if (!field) break

			if (field === currentColor) {
				if (ix === x + 1) break
				return true
			}
		}
	}

	// 左下 をひっくり返せるかチェック
	if (x > 1 && y < FIELD_SIZE - 2) {
		for (let ix = x - 1, iy = y + 1; ix >= 0 && iy < FIELD_SIZE; ix--, iy++) {
			const field = fields[iy][ix]
			if (!field) break

			if (field === currentColor) {
				if (ix === x - 1) break
				return true
			}
		}
	}

	return false
}

// 全フィールドで置ける座標を配列で返す
export const getPutAbleAllField = (fields: Field[][], currentColor: Color) => {
	const putAbleFields: Position[] = []

	for (let y = 0; y < FIELD_SIZE; y++) {
		for (let x = 0; x < FIELD_SIZE; x++) {
			if (fields[y][x]) continue // 石が置かれている位置は除く

			// この時の座標を置くことが出来るか確認
			const ableToPut = checkPutAbility(y, x, fields, currentColor)
			if (ableToPut) putAbleFields.push({ x, y })
		}
	}

	return putAbleFields
}

// 置くときにひっくり返す座標を配列で返す
export const getReverseFields = (
	y: number,
	x: number,
	fields: Field[][],
	currentColor: Color
): Position[] => {
	const targetFields: Position[] = [] // ひっくり返すフィールド

	// 上 をひっくり返せる位置に置いた
	if (y > 1) {
		let ableToPut = false // ひっくり返せる石があるか
		const otherColorFields: Position[] = [] // 連続する違う色の座標

		// forでcurrentColorと同じ色が出るまで、座標を配列に格納する
		for (let i = y - 1; i >= 0; i--) {
			const field = fields[i][x]
			if (!field) break // 置かれていない

			// 同じ色が出たら、trueにしてループを抜ける
			if (field === currentColor) {
				ableToPut = true
				break
			}
			otherColorFields.push({ x, y: i }) // 座標を追加
		}

		// 上向きにひっくり返せるなら、targetFieldsに追加
		if (ableToPut) targetFields.push(...otherColorFields)
	}

	// 下 をひっくり返せる位置に置いた
	if (y < FIELD_SIZE - 2) {
		let ableToPut = false
		const otherColorFields: Position[] = []

		for (let i = y + 1; i < FIELD_SIZE; i++) {
			const field = fields[i][x]
			if (!field) break

			if (field === currentColor) {
				ableToPut = true
				break
			}
			otherColorFields.push({ x, y: i })
		}

		if (ableToPut) targetFields.push(...otherColorFields)
	}

	// 左 をひっくり返せる位置に置いた
	if (x > 1) {
		let ableToPut = false
		const otherColorFields: Position[] = []

		for (let i = x - 1; i >= 0; i--) {
			const field = fields[y][i]
			if (!field) break

			if (field === currentColor) {
				ableToPut = true
				break
			}
			otherColorFields.push({ x: i, y })
		}

		if (ableToPut) targetFields.push(...otherColorFields)
	}

	// 右 をひっくり返せる位置に置いた
	if (x < FIELD_SIZE - 2) {
		let ableToPut = false
		const otherColorFields: Position[] = []

		for (let i = x + 1; i < FIELD_SIZE; i++) {
			const field = fields[y][i]
			if (!field) break

			if (field === currentColor) {
				ableToPut = true
				break
			}
			otherColorFields.push({ x: i, y })
		}

		if (ableToPut) targetFields.push(...otherColorFields)
	}

	// 左上 をひっくり返せる位置に置いた
	if (x > 1 && y > 1) {
		let ableToPut = false
		const otherColorFields: Position[] = []

		for (let ix = x - 1, iy = y - 1; ix >= 0 && iy >= 0; ix--, iy--) {
			const field = fields[iy][ix]
			if (!field) break

			if (field === currentColor) {
				ableToPut = true
				break
			}
			otherColorFields.push({ x: ix, y: iy })
		}

		if (ableToPut) targetFields.push(...otherColorFields)
	}

	// 右下 をひっくり返せる位置に置いた
	if (x < FIELD_SIZE - 2 && y < FIELD_SIZE - 2) {
		let ableToPut = false
		const otherColorFields: Position[] = []

		for (
			let ix = x + 1, iy = y + 1;
			ix < FIELD_SIZE && iy < FIELD_SIZE;
			ix++, iy++
		) {
			const field = fields[iy][ix]
			if (!field) break

			if (field === currentColor) {
				ableToPut = true
				break
			}
			otherColorFields.push({ x: ix, y: iy })
		}

		if (ableToPut) targetFields.push(...otherColorFields)
	}

	// 右上 をひっくり返せる位置に置いた
	if (x < FIELD_SIZE - 2 && y > 1) {
		let ableToPut = false
		const otherColorFields: Position[] = []

		for (let ix = x + 1, iy = y - 1; ix < FIELD_SIZE && iy >= 0; ix++, iy--) {
			const field = fields[iy][ix]
			if (!field) break

			if (field === currentColor) {
				ableToPut = true
				break
			}
			otherColorFields.push({ x: ix, y: iy })
		}

		if (ableToPut) targetFields.push(...otherColorFields)
	}

	// 左下 をひっくり返せる位置に置いた
	if (x > 1 && y < FIELD_SIZE - 2) {
		let ableToPut = false
		const otherColorFields: Position[] = []

		for (let ix = x - 1, iy = y + 1; ix >= 0 && iy < FIELD_SIZE; ix--, iy++) {
			const field = fields[iy][ix]
			if (!field) break

			if (field === currentColor) {
				ableToPut = true
				break
			}
			otherColorFields.push({ x: ix, y: iy })
		}

		if (ableToPut) targetFields.push(...otherColorFields)
	}

	return targetFields
}
