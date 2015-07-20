export default {
  $type: 'modifier',
  $count: 1,
  $what: 'course',
  $from: 'where',
  $where: {
    $type: 'qualification',
    $key: 'gereqs',
    $value: {
      $eq: 'WRI',
      $type: 'operator',
    },
  },
}
