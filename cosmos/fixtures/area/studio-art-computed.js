export default {
  'name': 'Studio Art',
  'type': 'Major',
  'revision': '2014-15',
  'result': {
    '$type': 'boolean',
    '$and': [
      {
        '$type': 'modifier',
        '$count': 10,
        '$what': 'credit',
        '$from': 'children',
        '$children': '$all',
        '_result': true,
        '_matches': [
          {
            'department': [
              'ART'
            ],
            'number': 102,
            'credits': 1
          },
          {
            'department': [
              'ART'
            ],
            'number': 103,
            'credits': 1
          },
          {
            'department': [
              'ART'
            ],
            'number': 104,
            'credits': 1
          },
          {
            'department': [
              'ART'
            ],
            'number': 225,
            'credits': 1
          },
          {
            'department': [
              'ART'
            ],
            'number': 207,
            'credits': 1
          },
          {
            'department': [
              'ART'
            ],
            'number': 205,
            'credits': 1
          },
          {
            'department': [
              'ART'
            ],
            'number': 228,
            'credits': 1
          },
          {
            'department': [
              'ART'
            ],
            'number': 229,
            'credits': 1
          },
          {
            'department': [
              'ART'
            ],
            'number': 236,
            'credits': 1
          },
          {
            'department': [
              'ART'
            ],
            'number': 343,
            'credits': 1
          },
          {
            'department': [
              'ART'
            ],
            'number': 106,
            'credits': 1
          },
          {
            'department': [
              'ART'
            ],
            'number': 398,
            'credits': 1
          },
          {
            'department': [
              'ART',
              'ASIAN'
            ],
            'number': 259,
            'credits': 1
          },
          {
            'department': [
              'ART',
              'ASIAN'
            ],
            'number': 260,
            'credits': 1
          }
        ],
        '_counted': 14
      },
      {
        '$type': 'reference',
        '$requirement': 'Studio Art',
        '_result': true,
        '_matches': [
          {
            'department': [
              'ART'
            ],
            'number': 102,
            'credits': 1
          },
          {
            'department': [
              'ART'
            ],
            'number': 103,
            'credits': 1
          },
          {
            'department': [
              'ART'
            ],
            'number': 104,
            'credits': 1
          },
          {
            'department': [
              'ART'
            ],
            'number': 225,
            'credits': 1
          },
          {
            'department': [
              'ART'
            ],
            'number': 207,
            'credits': 1
          },
          {
            'department': [
              'ART'
            ],
            'number': 205,
            'credits': 1
          },
          {
            'department': [
              'ART'
            ],
            'number': 228,
            'credits': 1
          },
          {
            'department': [
              'ART'
            ],
            'number': 229,
            'credits': 1
          },
          {
            'department': [
              'ART'
            ],
            'number': 236,
            'credits': 1
          },
          {
            'department': [
              'ART'
            ],
            'number': 343,
            'credits': 1
          },
          {
            'department': [
              'ART'
            ],
            'number': 106,
            'credits': 1
          },
          {
            'department': [
              'ART'
            ],
            'number': 398,
            'credits': 1
          }
        ]
      },
      {
        '$type': 'reference',
        '$requirement': 'Art History',
        '_result': true,
        '_matches': [
          {
            'department': [
              'ART',
              'ASIAN'
            ],
            'number': 259,
            'credits': 1
          },
          {
            'department': [
              'ART',
              'ASIAN'
            ],
            'number': 260,
            'credits': 1
          }
        ]
      }
    ],
    '_result': true,
    '_matches': [
      {
        'department': [
          'ART'
        ],
        'number': 102,
        'credits': 1
      },
      {
        'department': [
          'ART'
        ],
        'number': 103,
        'credits': 1
      },
      {
        'department': [
          'ART'
        ],
        'number': 104,
        'credits': 1
      },
      {
        'department': [
          'ART'
        ],
        'number': 225,
        'credits': 1
      },
      {
        'department': [
          'ART'
        ],
        'number': 207,
        'credits': 1
      },
      {
        'department': [
          'ART'
        ],
        'number': 205,
        'credits': 1
      },
      {
        'department': [
          'ART'
        ],
        'number': 228,
        'credits': 1
      },
      {
        'department': [
          'ART'
        ],
        'number': 229,
        'credits': 1
      },
      {
        'department': [
          'ART'
        ],
        'number': 236,
        'credits': 1
      },
      {
        'department': [
          'ART'
        ],
        'number': 343,
        'credits': 1
      },
      {
        'department': [
          'ART'
        ],
        'number': 106,
        'credits': 1
      },
      {
        'department': [
          'ART'
        ],
        'number': 398,
        'credits': 1
      },
      {
        'department': [
          'ART',
          'ASIAN'
        ],
        'number': 259,
        'credits': 1
      },
      {
        'department': [
          'ART',
          'ASIAN'
        ],
        'number': 260,
        'credits': 1
      }
    ]
  },
  'Studio Art': {
    'Foundations': {
      'result': {
        '$type': 'boolean',
        '$and': [
          {
            '$type': 'course',
            '$course': {
              'department': [
                'ART'
              ],
              'number': 102,
              'credits': 1
            },
            '_used': true,
            '_result': true
          },
          {
            '$type': 'course',
            '$course': {
              'department': [
                'ART'
              ],
              'number': 103,
              'credits': 1
            },
            '_used': true,
            '_result': true
          },
          {
            '$type': 'course',
            '$course': {
              'department': [
                'ART'
              ],
              'number': 104,
              'credits': 1
            },
            '_used': true,
            '_result': true
          }
        ],
        '_result': true,
        '_matches': [
          {
            'department': [
              'ART'
            ],
            'number': 102,
            'credits': 1
          },
          {
            'department': [
              'ART'
            ],
            'number': 103,
            'credits': 1
          },
          {
            'department': [
              'ART'
            ],
            'number': 104,
            'credits': 1
          }
        ]
      },
      '$type': 'requirement',
      'computed': true
    },
    '2D Media': {
      'Drawing': {
        'result': {
          '$type': 'boolean',
          '$or': [
            {
              '$type': 'course',
              '$course': {
                'department': [
                  'ART'
                ],
                'number': 225,
                'credits': 1
              },
              '_used': true,
              '_result': true
            },
            {
              '$type': 'course',
              '$course': {
                'department': [
                  'ART'
                ],
                'number': 232
              }
            },
            {
              '$type': 'course',
              '$course': {
                'department': [
                  'ART'
                ],
                'number': 233
              }
            }
          ],
          '_result': true,
          '_matches': [
            {
              'department': [
                'ART'
              ],
              'number': 225,
              'credits': 1
            }
          ]
        },
        '$type': 'requirement',
        'computed': true
      },
      'Painting': {
        'result': {
          '$type': 'boolean',
          '$or': [
            {
              '$type': 'course',
              '$course': {
                'department': [
                  'ART'
                ],
                'number': 221,
                'credits': 1
              },
              '_used': true,
              '_result': true
            },
            {
              '$type': 'course',
              '$course': {
                'department': [
                  'ART'
                ],
                'number': 222
              }
            }
          ],
          '_result': true,
          '_matches': [
            {
              'department': [
                'ART'
              ],
              'number': 221,
              'credits': 1
            }
          ]
        },
        '$type': 'requirement',
        'computed': true
      },
      'Printmaking': {
        'result': {
          '$type': 'boolean',
          '$or': [
            {
              '$type': 'course',
              '$course': {
                'department': [
                  'ART'
                ],
                'number': 226,
                'credits': 1
              },
              '_used': true,
              '_result': true
            },
            {
              '$type': 'course',
              '$course': {
                'department': [
                  'ART'
                ],
                'number': 227
              }
            }
          ],
          '_result': true,
          '_matches': [
            {
              'department': [
                'ART'
              ],
              'number': 226,
              'credits': 1
            }
          ]
        },
        '$type': 'requirement',
        'computed': true
      },
      'result': {
        '$type': 'boolean',
        '$or': [
          {
            '$type': 'reference',
            '$requirement': 'Drawing',
            '_result': true,
            '_matches': [
              {
                'department': [
                  'ART'
                ],
                'number': 225,
                'credits': 1
              }
            ]
          },
          {
            '$type': 'reference',
            '$requirement': 'Painting'
          },
          {
            '$type': 'reference',
            '$requirement': 'Printmaking'
          }
        ],
        '_result': true,
        '_matches': [
          {
            'department': [
              'ART'
            ],
            'number': 225,
            'credits': 1
          }
        ]
      },
      '$type': 'requirement',
      'computed': true
    },
    '3D Media': {
      'Ceramics': {
        'result': {
          '$type': 'boolean',
          '$or': [
            {
              '$type': 'course',
              '$course': {
                'department': [
                  'ART'
                ],
                'number': 207,
                'credits': 1
              },
              '_used': true,
              '_result': true
            },
            {
              '$type': 'course',
              '$course': {
                'department': [
                  'ART'
                ],
                'number': 234
              }
            }
          ],
          '_result': true,
          '_matches': [
            {
              'department': [
                'ART'
              ],
              'number': 207,
              'credits': 1
            }
          ]
        },
        '$type': 'requirement',
        'computed': true
      },
      'Sculpture': {
        'result': {
          '$type': 'boolean',
          '$or': [
            {
              '$type': 'course',
              '$course': {
                'department': [
                  'ART'
                ],
                'number': 223,
                'credits': 1
              },
              '_used': true,
              '_result': true
            },
            {
              '$type': 'course',
              '$course': {
                'department': [
                  'ART'
                ],
                'number': 224
              }
            }
          ],
          '_result': true,
          '_matches': [
            {
              'department': [
                'ART'
              ],
              'number': 223,
              'credits': 1
            }
          ]
        },
        '$type': 'requirement',
        'computed': true
      },
      'result': {
        '$type': 'boolean',
        '$or': [
          {
            '$type': 'reference',
            '$requirement': 'Ceramics',
            '_result': true,
            '_matches': [
              {
                'department': [
                  'ART'
                ],
                'number': 207,
                'credits': 1
              }
            ]
          },
          {
            '$type': 'reference',
            '$requirement': 'Sculpture'
          }
        ],
        '_result': true,
        '_matches': [
          {
            'department': [
              'ART'
            ],
            'number': 207,
            'credits': 1
          }
        ]
      },
      '$type': 'requirement',
      'computed': true
    },
    'New Media': {
      'Photography': {
        'result': {
          '$type': 'boolean',
          '$or': [
            {
              '$type': 'course',
              '$course': {
                'department': [
                  'ART'
                ],
                'number': 205,
                'credits': 1
              },
              '_used': true,
              '_result': true
            },
            {
              '$type': 'course',
              '$course': {
                'department': [
                  'ART'
                ],
                'number': 238
              }
            }
          ],
          '_result': true,
          '_matches': [
            {
              'department': [
                'ART'
              ],
              'number': 205,
              'credits': 1
            }
          ]
        },
        '$type': 'requirement',
        'computed': true
      },
      'Interactive Image': {
        'result': {
          '$type': 'course',
          '$course': {
            'department': [
              'ART'
            ],
            'number': 228,
            'credits': 1
          },
          '_used': true,
          '_result': true
        },
        '$type': 'requirement',
        'computed': true
      },
      'Digital Video': {
        'result': {
          '$type': 'course',
          '$course': {
            'department': [
              'ART'
            ],
            'number': 229,
            'credits': 1
          },
          '_used': true,
          '_result': true
        },
        '$type': 'requirement',
        'computed': true
      },
      'Performance': {
        'result': {
          '$type': 'course',
          '$course': {
            'department': [
              'ART'
            ],
            'number': 240
          },
          '_result': false
        },
        '$type': 'requirement',
        'computed': false
      },
      'Graphic Design': {
        'result': {
          '$type': 'course',
          '$course': {
            'department': [
              'ART'
            ],
            'number': 236,
            'credits': 1
          },
          '_used': true,
          '_result': true
        },
        '$type': 'requirement',
        'computed': true
      },
      'result': {
        '$type': 'of',
        '$count': 1,
        '$of': [
          {
            '$type': 'reference',
            '$requirement': 'Photography',
            '_result': true,
            '_matches': [
              {
                'department': [
                  'ART'
                ],
                'number': 205,
                'credits': 1
              }
            ]
          },
          {
            '$type': 'reference',
            '$requirement': 'Interactive Image',
            '_result': true,
            '_matches': [
              {
                'department': [
                  'ART'
                ],
                'number': 228,
                'credits': 1
              }
            ]
          },
          {
            '$type': 'reference',
            '$requirement': 'Digital Video',
            '_result': true,
            '_matches': [
              {
                'department': [
                  'ART'
                ],
                'number': 229,
                'credits': 1
              }
            ]
          },
          {
            '$type': 'reference',
            '$requirement': 'Performance',
            '_result': false,
            '_matches': []
          },
          {
            '$type': 'reference',
            '$requirement': 'Graphic Design',
            '_result': true,
            '_matches': [
              {
                'department': [
                  'ART'
                ],
                'number': 236,
                'credits': 1
              }
            ]
          }
        ],
        '_result': true,
        '_matches': [
          {
            'department': [
              'ART'
            ],
            'number': 205,
            'credits': 1
          },
          {
            'department': [
              'ART'
            ],
            'number': 228,
            'credits': 1
          },
          {
            'department': [
              'ART'
            ],
            'number': 229,
            'credits': 1
          },
          {
            'department': [
              'ART'
            ],
            'number': 236,
            'credits': 1
          }
        ],
        '_counted': 4
      },
      '$type': 'requirement',
      'computed': true
    },
    'Juried Show': {
      'message': 'To fulfill the requirements of the Studio Art major, you must enter at least two juried art exhibitions on or off campus by the beginning of your senior year.',
      '$type': 'requirement',
      'computed': true,
      'overridden': true
    },
    'Senior Studies in Studio Art': {
      'result': {
        '$type': 'course',
        '$course': {
          'department': [
            'ART'
          ],
          'number': 343,
          'credits': 1
        },
        '_used': true,
        '_result': true
      },
      '$type': 'requirement',
      'computed': true
    },
    'Electives': {
      'result': {
        '$type': 'of',
        '$count': 1,
        '$of': [
          {
            '$type': 'course',
            '$course': {
              'department': [
                'ART'
              ],
              'number': 106,
              'credits': 1
            },
            '_used': true,
            '_result': true
          },
          {
            '$type': 'course',
            '$course': {
              'department': [
                'ART'
              ],
              'number': 246
            },
            '_result': false
          },
          {
            '$type': 'course',
            '$course': {
              'department': [
                'ART'
              ],
              'number': 294
            },
            '_result': false
          },
          {
            '$type': 'course',
            '$course': {
              'department': [
                'ART'
              ],
              'number': 298
            },
            '_result': false
          },
          {
            '$type': 'course',
            '$course': {
              'department': [
                'ART'
              ],
              'number': 340
            },
            '_result': false
          },
          {
            '$type': 'course',
            '$course': {
              'department': [
                'ART'
              ],
              'number': 394
            },
            '_result': false
          },
          {
            '$type': 'course',
            '$course': {
              'department': [
                'ART'
              ],
              'number': 398,
              'credits': 1
            },
            '_used': true,
            '_result': true
          }
        ],
        '_result': true,
        '_matches': [
          {
            'department': [
              'ART'
            ],
            'number': 106,
            'credits': 1
          },
          {
            'department': [
              'ART'
            ],
            'number': 398,
            'credits': 1
          }
        ],
        '_counted': 2
      },
      '$type': 'requirement',
      'computed': true
    },
    'result': {
      '$type': 'boolean',
      '$and': [
        {
          '$type': 'modifier',
          '$count': 8,
          '$what': 'course',
          '$from': 'children',
          '$children': '$all',
          '_result': true,
          '_matches': [
            {
              'department': [
                'ART'
              ],
              'number': 102,
              'credits': 1
            },
            {
              'department': [
                'ART'
              ],
              'number': 103,
              'credits': 1
            },
            {
              'department': [
                'ART'
              ],
              'number': 104,
              'credits': 1
            },
            {
              'department': [
                'ART'
              ],
              'number': 225,
              'credits': 1
            },
            {
              'department': [
                'ART'
              ],
              'number': 207,
              'credits': 1
            },
            {
              'department': [
                'ART'
              ],
              'number': 205,
              'credits': 1
            },
            {
              'department': [
                'ART'
              ],
              'number': 228,
              'credits': 1
            },
            {
              'department': [
                'ART'
              ],
              'number': 229,
              'credits': 1
            },
            {
              'department': [
                'ART'
              ],
              'number': 236,
              'credits': 1
            },
            {
              'department': [
                'ART'
              ],
              'number': 343,
              'credits': 1
            },
            {
              'department': [
                'ART'
              ],
              'number': 106,
              'credits': 1
            },
            {
              'department': [
                'ART'
              ],
              'number': 398,
              'credits': 1
            }
          ],
          '_counted': 12
        },
        {
          '$type': 'of',
          '$count': 7,
          '$of': [
            {
              '$type': 'reference',
              '$requirement': 'Foundations',
              '_result': true,
              '_matches': [
                {
                  'department': [
                    'ART'
                  ],
                  'number': 102,
                  'credits': 1
                },
                {
                  'department': [
                    'ART'
                  ],
                  'number': 103,
                  'credits': 1
                },
                {
                  'department': [
                    'ART'
                  ],
                  'number': 104,
                  'credits': 1
                }
              ]
            },
            {
              '$type': 'reference',
              '$requirement': '2D Media',
              '_result': true,
              '_matches': [
                {
                  'department': [
                    'ART'
                  ],
                  'number': 225,
                  'credits': 1
                }
              ]
            },
            {
              '$type': 'reference',
              '$requirement': '3D Media',
              '_result': true,
              '_matches': [
                {
                  'department': [
                    'ART'
                  ],
                  'number': 207,
                  'credits': 1
                }
              ]
            },
            {
              '$type': 'reference',
              '$requirement': 'New Media',
              '_result': true,
              '_matches': [
                {
                  'department': [
                    'ART'
                  ],
                  'number': 205,
                  'credits': 1
                },
                {
                  'department': [
                    'ART'
                  ],
                  'number': 228,
                  'credits': 1
                },
                {
                  'department': [
                    'ART'
                  ],
                  'number': 229,
                  'credits': 1
                },
                {
                  'department': [
                    'ART'
                  ],
                  'number': 236,
                  'credits': 1
                }
              ]
            },
            {
              '$type': 'reference',
              '$requirement': 'Juried Show',
              '_result': true
            },
            {
              '$type': 'reference',
              '$requirement': 'Senior Studies in Studio Art',
              '_result': true,
              '_matches': [
                {
                  'department': [
                    'ART'
                  ],
                  'number': 343,
                  'credits': 1
                }
              ]
            },
            {
              '$type': 'reference',
              '$requirement': 'Electives',
              '_result': true,
              '_matches': [
                {
                  'department': [
                    'ART'
                  ],
                  'number': 106,
                  'credits': 1
                },
                {
                  'department': [
                    'ART'
                  ],
                  'number': 398,
                  'credits': 1
                }
              ]
            }
          ],
          '_result': true,
          '_matches': [
            {
              'department': [
                'ART'
              ],
              'number': 102,
              'credits': 1
            },
            {
              'department': [
                'ART'
              ],
              'number': 103,
              'credits': 1
            },
            {
              'department': [
                'ART'
              ],
              'number': 104,
              'credits': 1
            },
            {
              'department': [
                'ART'
              ],
              'number': 225,
              'credits': 1
            },
            {
              'department': [
                'ART'
              ],
              'number': 207,
              'credits': 1
            },
            {
              'department': [
                'ART'
              ],
              'number': 205,
              'credits': 1
            },
            {
              'department': [
                'ART'
              ],
              'number': 228,
              'credits': 1
            },
            {
              'department': [
                'ART'
              ],
              'number': 229,
              'credits': 1
            },
            {
              'department': [
                'ART'
              ],
              'number': 236,
              'credits': 1
            },
            {
              'department': [
                'ART'
              ],
              'number': 343,
              'credits': 1
            },
            {
              'department': [
                'ART'
              ],
              'number': 106,
              'credits': 1
            },
            {
              'department': [
                'ART'
              ],
              'number': 398,
              'credits': 1
            }
          ],
          '_counted': 7
        }
      ],
      '_result': true,
      '_matches': [
        {
          'department': [
            'ART'
          ],
          'number': 102,
          'credits': 1
        },
        {
          'department': [
            'ART'
          ],
          'number': 103,
          'credits': 1
        },
        {
          'department': [
            'ART'
          ],
          'number': 104,
          'credits': 1
        },
        {
          'department': [
            'ART'
          ],
          'number': 225,
          'credits': 1
        },
        {
          'department': [
            'ART'
          ],
          'number': 207,
          'credits': 1
        },
        {
          'department': [
            'ART'
          ],
          'number': 205,
          'credits': 1
        },
        {
          'department': [
            'ART'
          ],
          'number': 228,
          'credits': 1
        },
        {
          'department': [
            'ART'
          ],
          'number': 229,
          'credits': 1
        },
        {
          'department': [
            'ART'
          ],
          'number': 236,
          'credits': 1
        },
        {
          'department': [
            'ART'
          ],
          'number': 343,
          'credits': 1
        },
        {
          'department': [
            'ART'
          ],
          'number': 106,
          'credits': 1
        },
        {
          'department': [
            'ART'
          ],
          'number': 398,
          'credits': 1
        }
      ]
    },
    '$type': 'requirement',
    'computed': true
  },
  'Art History': {
    'message': 'The department strongly recommends that you take ART 252 or 253 as one of your art history courses.',
    'result': {
      '$type': 'of',
      '$count': 2,
      '$of': [
        {
          '$type': 'course',
          '$course': {
            'department': [
              'ART'
            ],
            'number': 153
          },
          '_result': false
        },
        {
          '$type': 'course',
          '$course': {
            'department': [
              'ART'
            ],
            'number': 161
          },
          '_result': false
        },
        {
          '$type': 'course',
          '$course': {
            'department': [
              'ART'
            ],
            'number': 251
          },
          '_result': false
        },
        {
          '$type': 'course',
          '$course': {
            'department': [
              'ART'
            ],
            'number': 252
          },
          '_result': false
        },
        {
          '$type': 'course',
          '$course': {
            'department': [
              'ART'
            ],
            'number': 253
          },
          '_result': false
        },
        {
          '$type': 'course',
          '$course': {
            'department': [
              'ART'
            ],
            'number': 254
          },
          '_result': false
        },
        {
          '$type': 'course',
          '$course': {
            'department': [
              'ART'
            ],
            'number': 255
          },
          '_result': false
        },
        {
          '$type': 'course',
          '$course': {
            'department': [
              'ART'
            ],
            'number': 256
          },
          '_result': false
        },
        {
          '$type': 'course',
          '$course': {
            'department': [
              'ART'
            ],
            'number': 263
          },
          '_result': false
        },
        {
          '$type': 'course',
          '$course': {
            'department': [
              'ART'
            ],
            'number': 269
          },
          '_result': false
        },
        {
          '$type': 'course',
          '$course': {
            'department': [
              'ART'
            ],
            'number': 271
          },
          '_result': false
        },
        {
          '$type': 'course',
          '$course': {
            'department': [
              'ART'
            ],
            'number': 275
          },
          '_result': false
        },
        {
          '$type': 'course',
          '$course': {
            'department': [
              'ART'
            ],
            'number': 277
          },
          '_result': false
        },
        {
          '$type': 'course',
          '$course': {
            'department': [
              'ART'
            ],
            'number': 280
          },
          '_result': false
        },
        {
          '$type': 'course',
          '$course': {
            'department': [
              'ART'
            ],
            'number': 294
          },
          '_result': false
        },
        {
          '$type': 'course',
          '$course': {
            'department': [
              'ART'
            ],
            'number': 298
          },
          '_result': false
        },
        {
          '$type': 'course',
          '$course': {
            'department': [
              'ART'
            ],
            'number': 350
          },
          '_result': false
        },
        {
          '$type': 'course',
          '$course': {
            'department': [
              'ART'
            ],
            'number': 379
          },
          '_result': false
        },
        {
          '$type': 'course',
          '$course': {
            'department': [
              'ART'
            ],
            'number': 394
          },
          '_result': false
        },
        {
          '$type': 'course',
          '$course': {
            'department': [
              'ART'
            ],
            'number': 396
          },
          '_result': false
        },
        {
          '$type': 'course',
          '$course': {
            'department': [
              'ART'
            ],
            'number': 398,
            'credits': 1
          },
          '_result': false
        },
        {
          '$type': 'course',
          '$course': {
            'department': [
              'ART',
              'ASIAN'
            ],
            'number': 259,
            'credits': 1
          },
          '_used': true,
          '_result': true
        },
        {
          '$type': 'course',
          '$course': {
            'department': [
              'ART',
              'ASIAN'
            ],
            'number': 260,
            'credits': 1
          },
          '_used': true,
          '_result': true
        },
        {
          '$type': 'course',
          '$course': {
            'department': [
              'ART',
              'ASIAN'
            ],
            'number': 262
          },
          '_result': false
        },
        {
          '$type': 'course',
          '$course': {
            'department': [
              'ART',
              'ASIAN'
            ],
            'number': 270
          },
          '_result': false
        },
        {
          '$type': 'course',
          '$course': {
            'department': [
              'ART',
              'ASIAN'
            ],
            'number': 310
          },
          '_result': false
        },
        {
          '$type': 'course',
          '$course': {
            'department': [
              'ENVST'
            ],
            'number': 270
          },
          '_result': false
        },
        {
          '$type': 'course',
          '$course': {
            'department': [
              'PHIL'
            ],
            'number': 243
          },
          '_result': false
        },
        {
          '$type': 'course',
          '$course': {
            'department': [
              'RACE'
            ],
            'number': 253
          },
          '_result': false
        }
      ],
      '_result': true,
      '_matches': [
        {
          'department': [
            'ART',
            'ASIAN'
          ],
          'number': 259,
          'credits': 1
        },
        {
          'department': [
            'ART',
            'ASIAN'
          ],
          'number': 260,
          'credits': 1
        }
      ],
      '_counted': 2
    },
    '$type': 'requirement',
    'computed': true
  },
  'computed': true
}
