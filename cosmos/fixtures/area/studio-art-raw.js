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
      },
      {
        '$type': 'reference',
        '$requirement': 'Studio Art',
      },
      {
        '$type': 'reference',
        '$requirement': 'Art History',
      },
    ],
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
                'ART',
              ],
              'number': 102,
            },
          },
          {
            '$type': 'course',
            '$course': {
              'department': [
                'ART',
              ],
              'number': 103,
            },
          },
          {
            '$type': 'course',
            '$course': {
              'department': [
                'ART',
              ],
              'number': 104,
            },
          },
        ],
      },
      '$type': 'requirement',
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
                  'ART',
                ],
                'number': 225,
              },
            },
            {
              '$type': 'course',
              '$course': {
                'department': [
                  'ART',
                ],
                'number': 232,
              },
            },
            {
              '$type': 'course',
              '$course': {
                'department': [
                  'ART',
                ],
                'number': 233,
              },
            },
          ],
        },
        '$type': 'requirement',
      },
      'Painting': {
        'result': {
          '$type': 'boolean',
          '$or': [
            {
              '$type': 'course',
              '$course': {
                'department': [
                  'ART',
                ],
                'number': 221,
              },
            },
            {
              '$type': 'course',
              '$course': {
                'department': [
                  'ART',
                ],
                'number': 222,
              },
            },
          ],
        },
        '$type': 'requirement',
      },
      'Printmaking': {
        'result': {
          '$type': 'boolean',
          '$or': [
            {
              '$type': 'course',
              '$course': {
                'department': [
                  'ART',
                ],
                'number': 226,
              },
            },
            {
              '$type': 'course',
              '$course': {
                'department': [
                  'ART',
                ],
                'number': 227,
              },
            },
          ],
        },
        '$type': 'requirement',
      },
      'result': {
        '$type': 'boolean',
        '$or': [
          {
            '$type': 'reference',
            '$requirement': 'Drawing',
          },
          {
            '$type': 'reference',
            '$requirement': 'Painting',
          },
          {
            '$type': 'reference',
            '$requirement': 'Printmaking',
          },
        ],
      },
      '$type': 'requirement',
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
                  'ART',
                ],
                'number': 207,
              },
            },
            {
              '$type': 'course',
              '$course': {
                'department': [
                  'ART',
                ],
                'number': 234,
              },
            },
          ],
        },
        '$type': 'requirement',
      },
      'Sculpture': {
        'result': {
          '$type': 'boolean',
          '$or': [
            {
              '$type': 'course',
              '$course': {
                'department': [
                  'ART',
                ],
                'number': 223,
              },
            },
            {
              '$type': 'course',
              '$course': {
                'department': [
                  'ART',
                ],
                'number': 224,
              },
            },
          ],
        },
        '$type': 'requirement',
      },
      'result': {
        '$type': 'boolean',
        '$or': [
          {
            '$type': 'reference',
            '$requirement': 'Ceramics',
          },
          {
            '$type': 'reference',
            '$requirement': 'Sculpture',
          },
        ],
      },
      '$type': 'requirement',
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
                  'ART',
                ],
                'number': 205,
              },
            },
            {
              '$type': 'course',
              '$course': {
                'department': [
                  'ART',
                ],
                'number': 238,
              },
            },
          ],
        },
        '$type': 'requirement',
      },
      'Interactive Image': {
        'result': {
          '$type': 'course',
          '$course': {
            'department': [
              'ART',
            ],
            'number': 228,
          },
        },
        '$type': 'requirement',
      },
      'Digital Video': {
        'result': {
          '$type': 'course',
          '$course': {
            'department': [
              'ART'
            ],
            'number': 229
          }
        },
        '$type': 'requirement'
      },
      'Performance': {
        'result': {
          '$type': 'course',
          '$course': {
            'department': [
              'ART'
            ],
            'number': 240
          }
        },
        '$type': 'requirement'
      },
      'Graphic Design': {
        'result': {
          '$type': 'course',
          '$course': {
            'department': [
              'ART'
            ],
            'number': 236
          }
        },
        '$type': 'requirement'
      },
      'result': {
        '$type': 'of',
        '$count': 1,
        '$of': [
          {
            '$type': 'reference',
            '$requirement': 'Photography'
          },
          {
            '$type': 'reference',
            '$requirement': 'Interactive Image'
          },
          {
            '$type': 'reference',
            '$requirement': 'Digital Video'
          },
          {
            '$type': 'reference',
            '$requirement': 'Performance'
          },
          {
            '$type': 'reference',
            '$requirement': 'Graphic Design'
          }
        ]
      },
      '$type': 'requirement'
    },
    'Juried Show': {
      'message': 'To fulfill the requirements of the Studio Art major, you must enter at least two juried art exhibitions on or off campus by the beginning of your senior year.',
      '$type': 'requirement'
    },
    'Senior Studies in Studio Art': {
      'result': {
        '$type': 'course',
        '$course': {
          'department': [
            'ART'
          ],
          'number': 343
        }
      },
      '$type': 'requirement'
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
              'number': 106
            }
          },
          {
            '$type': 'course',
            '$course': {
              'department': [
                'ART'
              ],
              'number': 246
            }
          },
          {
            '$type': 'course',
            '$course': {
              'department': [
                'ART'
              ],
              'number': 294
            }
          },
          {
            '$type': 'course',
            '$course': {
              'department': [
                'ART'
              ],
              'number': 298
            }
          },
          {
            '$type': 'course',
            '$course': {
              'department': [
                'ART'
              ],
              'number': 340
            }
          },
          {
            '$type': 'course',
            '$course': {
              'department': [
                'ART'
              ],
              'number': 394
            }
          },
          {
            '$type': 'course',
            '$course': {
              'department': [
                'ART'
              ],
              'number': 398
            }
          }
        ]
      },
      '$type': 'requirement'
    },
    'result': {
      '$type': 'boolean',
      '$and': [
        {
          '$type': 'modifier',
          '$count': 8,
          '$what': 'course',
          '$from': 'children',
          '$children': '$all'
        },
        {
          '$type': 'of',
          '$count': 7,
          '$of': [
            {
              '$type': 'reference',
              '$requirement': 'Foundations'
            },
            {
              '$type': 'reference',
              '$requirement': '2D Media'
            },
            {
              '$type': 'reference',
              '$requirement': '3D Media'
            },
            {
              '$type': 'reference',
              '$requirement': 'New Media'
            },
            {
              '$type': 'reference',
              '$requirement': 'Juried Show'
            },
            {
              '$type': 'reference',
              '$requirement': 'Senior Studies in Studio Art'
            },
            {
              '$type': 'reference',
              '$requirement': 'Electives'
            }
          ]
        }
      ]
    },
    '$type': 'requirement'
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
          }
        },
        {
          '$type': 'course',
          '$course': {
            'department': [
              'ART'
            ],
            'number': 161
          }
        },
        {
          '$type': 'course',
          '$course': {
            'department': [
              'ART'
            ],
            'number': 251
          }
        },
        {
          '$type': 'course',
          '$course': {
            'department': [
              'ART'
            ],
            'number': 252
          }
        },
        {
          '$type': 'course',
          '$course': {
            'department': [
              'ART'
            ],
            'number': 253
          }
        },
        {
          '$type': 'course',
          '$course': {
            'department': [
              'ART'
            ],
            'number': 254
          }
        },
        {
          '$type': 'course',
          '$course': {
            'department': [
              'ART'
            ],
            'number': 255
          }
        },
        {
          '$type': 'course',
          '$course': {
            'department': [
              'ART'
            ],
            'number': 256
          }
        },
        {
          '$type': 'course',
          '$course': {
            'department': [
              'ART'
            ],
            'number': 263
          }
        },
        {
          '$type': 'course',
          '$course': {
            'department': [
              'ART'
            ],
            'number': 269
          }
        },
        {
          '$type': 'course',
          '$course': {
            'department': [
              'ART'
            ],
            'number': 271
          }
        },
        {
          '$type': 'course',
          '$course': {
            'department': [
              'ART'
            ],
            'number': 275
          }
        },
        {
          '$type': 'course',
          '$course': {
            'department': [
              'ART'
            ],
            'number': 277
          }
        },
        {
          '$type': 'course',
          '$course': {
            'department': [
              'ART'
            ],
            'number': 280
          }
        },
        {
          '$type': 'course',
          '$course': {
            'department': [
              'ART'
            ],
            'number': 294
          }
        },
        {
          '$type': 'course',
          '$course': {
            'department': [
              'ART'
            ],
            'number': 298
          }
        },
        {
          '$type': 'course',
          '$course': {
            'department': [
              'ART'
            ],
            'number': 350
          }
        },
        {
          '$type': 'course',
          '$course': {
            'department': [
              'ART'
            ],
            'number': 379
          }
        },
        {
          '$type': 'course',
          '$course': {
            'department': [
              'ART'
            ],
            'number': 394
          }
        },
        {
          '$type': 'course',
          '$course': {
            'department': [
              'ART'
            ],
            'number': 396
          }
        },
        {
          '$type': 'course',
          '$course': {
            'department': [
              'ART'
            ],
            'number': 398
          }
        },
        {
          '$type': 'course',
          '$course': {
            'department': [
              'ART',
              'ASIAN'
            ],
            'number': 259
          }
        },
        {
          '$type': 'course',
          '$course': {
            'department': [
              'ART',
              'ASIAN'
            ],
            'number': 260
          }
        },
        {
          '$type': 'course',
          '$course': {
            'department': [
              'ART',
              'ASIAN'
            ],
            'number': 262
          }
        },
        {
          '$type': 'course',
          '$course': {
            'department': [
              'ART',
              'ASIAN'
            ],
            'number': 270
          }
        },
        {
          '$type': 'course',
          '$course': {
            'department': [
              'ART',
              'ASIAN'
            ],
            'number': 310
          }
        },
        {
          '$type': 'course',
          '$course': {
            'department': [
              'ENVST'
            ],
            'number': 270
          }
        },
        {
          '$type': 'course',
          '$course': {
            'department': [
              'PHIL'
            ],
            'number': 243
          }
        },
        {
          '$type': 'course',
          '$course': {
            'department': [
              'RACE'
            ],
            'number': 253
          }
        }
      ]
    },
    '$type': 'requirement'
  }
}
