export default {
	$type: 'where',
	$count: 5,
	$where: {
		$type: 'qualification',
		$key: 'year',
		$value: {
			$lte: '2015',
			$type: 'operator',
		},
	},
}
