export default {
  $type: 'modifier',
  $count: 1,
  $what: 'department',
  $from: 'children',
  $children: [
    {
      $type: 'reference',
      $requirement: 'A',
    },
    {
      $type: 'reference',
      $requirement: 'B',
    },
  ],
}
