export default {
  $type: 'modifier',
  $count: 1,
  $what: 'course',
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
