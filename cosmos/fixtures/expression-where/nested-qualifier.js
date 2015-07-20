export default {
    $type: 'where',
    $count: 5,
    $where: {
        $type: 'boolean',
        $and: [
            {
                $type: 'qualification',
                $key: 'gereqs',
                $value: {
                    $eq: 'EIN',
                    $type: 'operator',
                },
            },
            {
                $type: 'qualification',
                $key: 'year',
                $value: {
                    $lte: {
                        $name: 'max',
                        $prop: 'year',
                        $type: 'function',
                        $where: {
                            $type: 'qualification',
                            $key: 'gereqs',
                            $value: {
                                $eq: 'BTS-T',
                                $type: 'operator',
                            },
                        },
                    },
                    $type: 'operator',
                },
            },
        ],
    },
}
