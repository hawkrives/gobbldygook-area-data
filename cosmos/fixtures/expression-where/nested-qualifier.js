export default {
    $type: 'where',
    $count: 5,
    $where: {
        $type: 'boolean',
        $and: [
            {
                $type: 'qualification',
                $key: 'gereqs',
                $operator: '$eq',
                $value: 'EIN',
            },
            {
                $type: 'qualification',
                $key: 'year',
                $operator: '$lte',
                $value: {
                    $name: 'max',
                    $prop: 'year',
                    $type: 'function',
                    $where: {
                        $type: 'qualification',
                        $key: 'gereqs',
                        $operator: '$eq',
                        $value: 'BTS-T',
                    },
                },
            },
        ],
    },
}
