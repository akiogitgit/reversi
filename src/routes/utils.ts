// 引数の配列でnullでない要素数が、マス数と同じ
export const checkAllElementsFill = (
	fieldSize: number,
	array: readonly any[]
) => {
	// 配列を1次元配列にして、nullの要素を弾く
	const fillElements = array.flat().filter(Boolean)
	return fillElements.length === fieldSize * fieldSize
}
