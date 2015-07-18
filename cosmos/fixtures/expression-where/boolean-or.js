export default {
    $type: 'where',
    $count: 3,
    $where: {
        $type: 'boolean',
        $or: [
            {
                $type: 'qualification',
                $key: 'gereqs',
                $value: {
                    $eq: 'WRI',
                    $type: 'operator',
                },
            },
            {
                $type: 'qualification',
                $key: 'year',
                $value: {
                    $eq: '2014',
                    $type: 'operator',
                },
            },
        ],
    },
}
