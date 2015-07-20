export default {
	$type: 'where',
	$count: 3,
	$where: {
		$type: 'qualification',
		$key: 'gereqs',
		$value: {
			$eq: 'WRI',
			$type: 'operator',
		},
	},
}
