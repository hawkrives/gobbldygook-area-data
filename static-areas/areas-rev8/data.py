# data.py
# coding: utf-8
data = {
  "Studio Art": {
    "$type": "requirement",
    "Studio Art Courses": {
      "$type": "requirement",
      "result": {
        "$type": "of",
        "$count": 8,
        "$of": [
          {"$type": "course", "department": ["ART"], "number": 102},
          {"$type": "course", "department": ["ART"], "number": 103},
          {"$type": "course", "department": ["ART"], "number": 104},
          {"$type": "course", "department": ["ART"], "number": 106},
          {"$type": "course", "department": ["ART"], "number": 205},
          {"$type": "course", "department": ["ART"], "number": 207},
          {"$type": "course", "department": ["ART"], "number": 221},
          {"$type": "course", "department": ["ART"], "number": 222},
          {"$type": "course", "department": ["ART"], "number": 223},
          {"$type": "course", "department": ["ART"], "number": 224},
          {"$type": "course", "department": ["ART"], "number": 225},
          {"$type": "course", "department": ["ART"], "number": 226},
          {"$type": "course", "department": ["ART"], "number": 227},
          {"$type": "course", "department": ["ART"], "number": 228},
          {"$type": "course", "department": ["ART"], "number": 229},
          {"$type": "course", "department": ["ART"], "number": 232},
          {"$type": "course", "department": ["ART"], "number": 233},
          {"$type": "course", "department": ["ART"], "number": 234},
          {"$type": "course", "department": ["ART"], "number": 236},
          {"$type": "course", "department": ["ART"], "number": 238},
          {"$type": "course", "department": ["ART"], "number": 240},
          {"$type": "course", "department": ["ART"], "number": 246},
          {"$type": "course", "department": ["ART"], "number": 294},
          {"$type": "course", "department": ["ART"], "number": 298},
          {"$type": "course", "department": ["ART"], "number": 340},
          {"$type": "course", "department": ["ART"], "number": 343},
          {"$type": "course", "department": ["ART"], "number": 394},
          {"$type": "course", "department": ["ART"], "number": 398}
        ]
      }
    },
    "Foundations": {
      "$type": "requirement",
      "result": {
        "$type": "of",
        "$count": 3,
        "$of": [
          {"$type": "course", "department": ["ART"], "number": 102},
          {"$type": "course", "department": ["ART"], "number": 103},
          {"$type": "course", "department": ["ART"], "number": 104}
        ]
      }
    },
    "2D Media": {
      "$type": "requirement",
      "Drawing": {
        "$type": "requirement",
        "result": {
          "$type": "boolean",
          "$or": [
            {"$type": "course", "department": ["ART"], "number": 225},
            {"$type": "course", "department": ["ART"], "number": 232},
            {"$type": "course", "department": ["ART"], "number": 233}
          ]
        }
      },
      "Painting": {
        "$type": "requirement",
        "result": {
          "$type": "boolean",
          "$or": [
            {"$type": "course", "department": ["ART"], "number": 232},
            {"$type": "course", "department": ["ART"], "number": 233}
          ]
        }
      },
      "Printmaking": {
        "$type": "requirement",
        "result": {
          "$type": "boolean",
          "$or": [
            {"$type": "course", "department": ["ART"], "number": 226},
            {"$type": "course", "department": ["ART"], "number": 227}
          ]
        }
      },
      "result": {
        "$type": "of",
        "$count": 1,
        "$of": [
          {"$type": "reference", "$requirement": "Drawing"},
          {"$type": "reference", "$requirement": "Painting"},
          {"$type": "reference", "$requirement": "Printmaking"}
        ]
      }
    },
    "3D Media": {
      "$type": "requirement",
      "Ceramics": {
        "$type": "requirement",
        "result": {
          "$type": "boolean",
          "$or": [
            {"$type": "course", "department": ["ART"], "number": 207},
            {"$type": "course", "department": ["ART"], "number": 234}
          ]
        }
      },
      "Sculpture": {
        "$type": "requirement",
        "result": {
          "$type": "boolean",
          "$or": [
            {"$type": "course", "department": ["ART"], "number": 223},
            {"$type": "course", "department": ["ART"], "number": 224}
          ]
        }
      },
      "result": {
        "$count": 1,
        "$type": "of",
        "$of": [
          {"$type": "reference", "$requirement": "Ceramics"},
          {"$type": "reference", "$requirement": "Scuplture"}
        ]
      }
    },
    "New Media": {
      "$type": "requirement",
      "Photography": {
        "$type": "requirement",
        "result": {
          "$type": "boolean", 
          "$or": [
            {"$type": "course", "department": ["ART"], "number": 205}, 
            {"$type": "course", "department": ["ART"], "number": 238}
      ]} },
      "Interactive Image": {"$type": "requirement", "result": {"$type": "course", "department": ["ART"], "number": 228} },
      "Digital Video":     {"$type": "requirement", "result": {"$type": "course", "department": ["ART"], "number": 229} },
      "Performance":       {"$type": "requirement", "result": {"$type": "course", "department": ["ART"], "number": 240} },
      "Graphic Design":    {"$type": "requirement", "result": {"$type": "course", "department": ["ART"], "number": 236} },
      "result": {
        "$count": 1,
        "$type": "of",
        "$of": [
          {"$type": "reference", "$requirement": "Photography"},
          {"$type": "reference", "$requirement": "Interactive Image"},
          {"$type": "reference", "$requirement": "Digital Video"},
          {"$type": "reference", "$requirement": "Performance"},
          {"$type": "reference", "$requirement": "Graphic Design"},
        ]
      }
    },
    "Juried Show": {"$type": "requirement", "message": "To fulfill the requirements of the Studio Art major, you must enter at least two juried art exhibitions on or off campus by the beginning of your senior year."},
    "Senior Thing": {"$type": "requirement", "result": {"$type": "course", "department": ["ART"], "number": 343}},
    "result": {
      "$count": 7,
      "$type": "of",
      "$of": [
        {"$type": "reference", "$requirement": "Foundations"},
        {"$type": "reference", "$requirement": "2D Media"},
        {"$type": "reference", "$requirement": "3D Media"},
        {"$type": "reference", "$requirement": "New Media"},
        {"$type": "reference", "$requirement": "Juried Show"},
        {"$type": "reference", "$requirement": "Senior Thing"},
        {"$type": "reference", "$requirement": "Studio Art Courses"}
      ]
    }
  },
  "Art History": {
    "$type": "requirement",
    "message": "The department strongly recommends that you take ART 252 or 253 as one of your art history courses.",

    "result": {
      "$count": 2,
      "$type": "of",
      "$of": [
        {"$type": "course", "department": ["ART"], "number": 153},
        {"$type": "course", "department": ["ART"], "number": 161},
        {"$type": "course", "department": ["ART"], "number": 251},
        {"$type": "course", "department": ["ART"], "number": 252},
        {"$type": "course", "department": ["ART"], "number": 253},
        {"$type": "course", "department": ["ART"], "number": 254},
        {"$type": "course", "department": ["ART"], "number": 255},
        {"$type": "course", "department": ["ART"], "number": 256},
        {"$type": "course", "department": ["ART"], "number": 263},
        {"$type": "course", "department": ["ART"], "number": 269},
        {"$type": "course", "department": ["ART"], "number": 271},
        {"$type": "course", "department": ["ART"], "number": 275},
        {"$type": "course", "department": ["ART"], "number": 277},
        {"$type": "course", "department": ["ART"], "number": 280},
        {"$type": "course", "department": ["ART"], "number": 294},
        {"$type": "course", "department": ["ART"], "number": 298},
        {"$type": "course", "department": ["ART"], "number": 350},
        {"$type": "course", "department": ["ART"], "number": 379},
        {"$type": "course", "department": ["ART"], "number": 394},
        {"$type": "course", "department": ["ART"], "number": 396},
        {"$type": "course", "department": ["ART"], "number": 398},
        {"$type": "course", "department": ["ART", "ASIAN"], "number": 259},
        {"$type": "course", "department": ["ART", "ASIAN"], "number": 260},
        {"$type": "course", "department": ["ART", "ASIAN"], "number": 262},
        {"$type": "course", "department": ["ART", "ASIAN"], "number": 270},
        {"$type": "course", "department": ["ART", "ASIAN"], "number": 310},
        {"$type": "course", "department": ["ENVST"], "number": 270},
        {"$type": "course", "department": ["PHIL"], "number": 243},
        {"$type": "course", "department": ["RACE"], "number": 253}
      ]
    }
  },
  "Art Credits": {
    "$type": "requirement",
    "result": {
      "$type": "where",
      "$count": 10,
      "$what": "credit",
      "$from": "where",
      "$where": {
        "$type": "qualifier", 
        "$key": "department",
        "$value": {
          "$type": "operator", 
          "$eq": "ART"
        } 
      }
    }
  },
  "name": "Studio Art",
  "type": "Major",
  "revision": "2014-15",
  "result": {
    "$type": "boolean",
    "$and": [
      { "$type": "reference", "$requirement": "Studio Art" },
      { "$type": "reference", "$requirement": "Art History" },
      { "$type": "reference", "$requirement": "Art Credits" }
    ]
  }
}

overrides = {
  "major.studio art.studio art.juried show": True
}