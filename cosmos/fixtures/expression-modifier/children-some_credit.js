export default {
  $type: 'modifier',
  $count: 1,
  $what: 'credit',
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
