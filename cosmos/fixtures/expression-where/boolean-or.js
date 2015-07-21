export default {
    $type: 'where',
    $count: 3,
    $where: {
        $type: 'boolean',
        $or: [
            {
                $type: 'qualification',
                $key: 'gereqs',
                $operator: '$eq',
                $value: 'WRI',
            },
            {
                $type: 'qualification',
                $key: 'year',
                $operator: '$eq',
                $value: '2014',
            },
        ],
    },
}
