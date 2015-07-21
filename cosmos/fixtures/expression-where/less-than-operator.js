export default {
	$type: 'where',
	$count: 5,
	$where: {
		$type: 'qualification',
		$key: 'year',
		$operator: '$lte',
		$value: 2015,
	},
}
