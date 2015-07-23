export default {
  "name": "Computer Science",
  "type": "major",
  "revision": "2014-15",
  "result": {
    "$type": "of",
    "$count": 4,
    "$of": [
      {
        "$type": "reference",
        "$requirement": "Foundation",
        "_result": false,
        "_matches": [
          {
            "department": [
              "CSCI"
            ],
            "number": 125,
            "crsid": 1
          },
          {
            "department": [
              "CSCI"
            ],
            "number": 241,
            "crsid": 2
          },
          {
            "department": [
              "CSCI"
            ],
            "number": 251,
            "crsid": 3
          },
          {
            "department": [
              "CSCI"
            ],
            "number": 252,
            "crsid": 4
          }
        ]
      },
      {
        "$type": "reference",
        "$requirement": "Core",
        "_result": true,
        "_matches": [
          {
            "department": [
              "CSCI"
            ],
            "number": 253,
            "crsid": 5
          },
          {
            "department": [
              "CSCI"
            ],
            "number": 263,
            "crsid": 6
          },
          {
            "department": [
              "CSCI"
            ],
            "number": 276,
            "crsid": 8
          },
          {
            "department": [
              "CSCI"
            ],
            "number": 273,
            "crsid": 7
          }
        ]
      },
      {
        "$type": "reference",
        "$requirement": "Electives",
        "_result": false,
        "_matches": []
      },
      {
        "$type": "reference",
        "$requirement": "Capstone",
        "_result": true,
        "_matches": [
          {
            "department": [
              "CSCI"
            ],
            "number": 390,
            "crsid": 11
          }
        ]
      }
    ],
    "_result": false,
    "_matches": [
      {
        "department": [
          "CSCI"
        ],
        "number": 125,
        "crsid": 1
      },
      {
        "department": [
          "CSCI"
        ],
        "number": 241,
        "crsid": 2
      },
      {
        "department": [
          "CSCI"
        ],
        "number": 251,
        "crsid": 3
      },
      {
        "department": [
          "CSCI"
        ],
        "number": 252,
        "crsid": 4
      },
      {
        "department": [
          "CSCI"
        ],
        "number": 253,
        "crsid": 5
      },
      {
        "department": [
          "CSCI"
        ],
        "number": 263,
        "crsid": 6
      },
      {
        "department": [
          "CSCI"
        ],
        "number": 276,
        "crsid": 8
      },
      {
        "department": [
          "CSCI"
        ],
        "number": 273,
        "crsid": 7
      },
      {
        "department": [
          "CSCI"
        ],
        "number": 390,
        "crsid": 11
      }
    ],
    "_counted": 2
  },
  "Foundation": {
    "CS1": {
      "result": {
        "$type": "boolean",
        "$or": [
          {
            "$type": "course",
            "$course": {
              "department": [
                "CSCI"
              ],
              "number": 121
            },
            "_result": false
          },
          {
            "$type": "course",
            "$course": {
              "department": [
                "CSCI"
              ],
              "number": 125,
              "crsid": 1
            },
            "_used": true,
            "_result": true
          }
        ],
        "_result": true,
        "_matches": [
          {
            "department": [
              "CSCI"
            ],
            "number": 125,
            "crsid": 1
          }
        ]
      },
      "$type": "requirement",
      "computed": true
    },
    "Design": {
      "result": {
        "$type": "boolean",
        "$and": [
          {
            "$type": "course",
            "$course": {
              "department": [
                "CSCI"
              ],
              "number": 241,
              "crsid": 2
            },
            "_used": true,
            "_result": true
          },
          {
            "$type": "course",
            "$course": {
              "department": [
                "CSCI"
              ],
              "number": 251,
              "crsid": 3
            },
            "_used": true,
            "_result": true
          },
          {
            "$type": "course",
            "$course": {
              "department": [
                "CSCI"
              ],
              "number": 252,
              "crsid": 4
            },
            "_used": true,
            "_result": true
          }
        ],
        "_result": true,
        "_matches": [
          {
            "department": [
              "CSCI"
            ],
            "number": 241,
            "crsid": 2
          },
          {
            "department": [
              "CSCI"
            ],
            "number": 251,
            "crsid": 3
          },
          {
            "department": [
              "CSCI"
            ],
            "number": 252,
            "crsid": 4
          }
        ]
      },
      "$type": "requirement",
      "computed": true
    },
    "Proof-Writing": {
      "result": {
        "$type": "boolean",
        "$or": [
          {
            "$type": "course",
            "$course": {
              "section": "*",
              "year": 2014,
              "semester": 1,
              "department": [
                "MATH"
              ],
              "number": 282
            },
            "_result": false
          },
          {
            "$type": "course",
            "$course": {
              "department": [
                "MATH"
              ],
              "number": 244
            },
            "_result": false
          },
          {
            "$type": "course",
            "$course": {
              "department": [
                "MATH"
              ],
              "number": 252
            },
            "_result": false
          }
        ],
        "_result": false,
        "_matches": []
      },
      "$type": "requirement",
      "computed": false
    },
    "result": {
      "$type": "of",
      "$count": 3,
      "$of": [
        {
          "$type": "reference",
          "$requirement": "CS1",
          "_result": true,
          "_matches": [
            {
              "department": [
                "CSCI"
              ],
              "number": 125,
              "crsid": 1
            }
          ]
        },
        {
          "$type": "reference",
          "$requirement": "Design",
          "_result": true,
          "_matches": [
            {
              "department": [
                "CSCI"
              ],
              "number": 241,
              "crsid": 2
            },
            {
              "department": [
                "CSCI"
              ],
              "number": 251,
              "crsid": 3
            },
            {
              "department": [
                "CSCI"
              ],
              "number": 252,
              "crsid": 4
            }
          ]
        },
        {
          "$type": "reference",
          "$requirement": "Proof-Writing",
          "_result": false,
          "_matches": []
        }
      ],
      "_result": false,
      "_matches": [
        {
          "department": [
            "CSCI"
          ],
          "number": 125,
          "crsid": 1
        },
        {
          "department": [
            "CSCI"
          ],
          "number": 241,
          "crsid": 2
        },
        {
          "department": [
            "CSCI"
          ],
          "number": 251,
          "crsid": 3
        },
        {
          "department": [
            "CSCI"
          ],
          "number": 252,
          "crsid": 4
        }
      ],
      "_counted": 2
    },
    "$type": "requirement",
    "computed": false
  },
  "Core": {
    "Algorithms": {
      "result": {
        "$type": "course",
        "$course": {
          "department": [
            "CSCI"
          ],
          "number": 253,
          "crsid": 5
        },
        "_used": true,
        "_result": true
      },
      "$type": "requirement",
      "computed": true
    },
    "Ethics": {
      "result": {
        "$type": "course",
        "$course": {
          "department": [
            "CSCI"
          ],
          "number": 263,
          "crsid": 6
        },
        "_used": true,
        "_result": true
      },
      "$type": "requirement",
      "computed": true
    },
    "Theory": {
      "result": {
        "$type": "boolean",
        "$or": [
          {
            "$type": "course",
            "$course": {
              "department": [
                "CSCI"
              ],
              "number": 276,
              "crsid": 8
            },
            "_used": true,
            "_result": true
          },
          {
            "$type": "course",
            "$course": {
              "department": [
                "CSCI"
              ],
              "number": 333
            }
          }
        ],
        "_result": true,
        "_matches": [
          {
            "department": [
              "CSCI"
            ],
            "number": 276,
            "crsid": 8
          }
        ]
      },
      "$type": "requirement",
      "computed": true
    },
    "Systems": {
      "result": {
        "$type": "boolean",
        "$or": [
          {
            "$type": "course",
            "$course": {
              "department": [
                "CSCI"
              ],
              "number": 273,
              "crsid": 7
            },
            "_used": true,
            "_result": true
          },
          {
            "$type": "course",
            "$course": {
              "department": [
                "CSCI"
              ],
              "number": 284
            }
          },
          {
            "$type": "course",
            "$course": {
              "section": "*",
              "year": 2014,
              "semester": 2,
              "department": [
                "CSCI"
              ],
              "number": 300
            }
          },
          {
            "$type": "course",
            "$course": {
              "section": "*",
              "year": 2012,
              "semester": 3,
              "department": [
                "CSCI"
              ],
              "number": 300
            }
          }
        ],
        "_result": true,
        "_matches": [
          {
            "department": [
              "CSCI"
            ],
            "number": 273,
            "crsid": 7
          }
        ]
      },
      "$type": "requirement",
      "computed": true
    },
    "result": {
      "$type": "of",
      "$count": 4,
      "$of": [
        {
          "$type": "reference",
          "$requirement": "Algorithms",
          "_result": true,
          "_matches": [
            {
              "department": [
                "CSCI"
              ],
              "number": 253,
              "crsid": 5
            }
          ]
        },
        {
          "$type": "reference",
          "$requirement": "Ethics",
          "_result": true,
          "_matches": [
            {
              "department": [
                "CSCI"
              ],
              "number": 263,
              "crsid": 6
            }
          ]
        },
        {
          "$type": "reference",
          "$requirement": "Theory",
          "_result": true,
          "_matches": [
            {
              "department": [
                "CSCI"
              ],
              "number": 276,
              "crsid": 8
            }
          ]
        },
        {
          "$type": "reference",
          "$requirement": "Systems",
          "_result": true,
          "_matches": [
            {
              "department": [
                "CSCI"
              ],
              "number": 273,
              "crsid": 7
            }
          ]
        }
      ],
      "_result": true,
      "_matches": [
        {
          "department": [
            "CSCI"
          ],
          "number": 253,
          "crsid": 5
        },
        {
          "department": [
            "CSCI"
          ],
          "number": 263,
          "crsid": 6
        },
        {
          "department": [
            "CSCI"
          ],
          "number": 276,
          "crsid": 8
        },
        {
          "department": [
            "CSCI"
          ],
          "number": 273,
          "crsid": 7
        }
      ],
      "_counted": 4
    },
    "$type": "requirement",
    "computed": true
  },
  "Electives": {
    "result": {
      "$type": "of",
      "$count": 2,
      "$of": [
        {
          "$type": "course",
          "$course": {
            "department": [
              "CSCI"
            ],
            "number": 350
          },
          "_result": false
        },
        {
          "$type": "course",
          "$course": {
            "department": [
              "CSCI"
            ],
            "number": 315
          },
          "_result": false
        },
        {
          "$type": "course",
          "$course": {
            "department": [
              "CSCI"
            ],
            "number": 336
          },
          "_result": false
        },
        {
          "$type": "course",
          "$course": {
            "section": "*",
            "year": 2014,
            "semester": 1,
            "department": [
              "CSCI"
            ],
            "number": 300
          },
          "_result": false
        }
      ],
      "_result": false,
      "_matches": [],
      "_counted": 0
    },
    "$type": "requirement",
    "computed": false
  },
  "Capstone": {
    "result": {
      "$type": "course",
      "$course": {
        "department": [
          "CSCI"
        ],
        "number": 390,
        "crsid": 11
      },
      "_used": true,
      "_result": true
    },
    "$type": "requirement",
    "computed": true
  },
  "computed": false
}
