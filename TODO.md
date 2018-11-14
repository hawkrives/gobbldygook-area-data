- better cli interface for evaluate, probably implemented as external module

Flags: `--json`, `--prose`, `--summary` [default], `--status`

- `--json` will return the json object, pretty-printed by JSON.parse
- `--prose` details each segment of the area, both successes and failures
- `--summary` will only chatter about the failures
- `--status` reports solely by way of status code: 0 = success, 1 = failure

-----

```
Name: Hawken MacKay Rives
Area: Studio Art
Revision: 2014-15
Failed: Studio Art > Senior Lasting Legacy Project (no override)
Failed: Art History Courses (0 of 10)
Failed: Studio Art > Studio Art Courses (4 of 10)
```

-----

```
Hawken MacKay Rives, against the Studio Art major (2014-15 revision): fight!

Winner: Studio Art; better luck next time, Hawken!

┌ Studio Art major:
├─ Studio Art (✓) & Art History (✓) & Art Credits (✗)
├─┐ Studio Art: (✗)
│ ├─ all of (Foundations (✓), 2D Media (✓), 3D Media (✓), New Media (✓), Juried Show (✗), Senior Thing (✓), Studio Art Courses (✓))
│ ├─┐ Studio Art Courses: (✓)
│ │ ├─ 12 of 10
│ │ └─ (ART 110 (✓), ART 111 (✓))
│ ├─┐ Foundations: (✓)
│ │ └─ ART 102 (✓) | ART 103 | ART 104
│ ├─┐ 2D Media: (✓)
│ │ ├─ one of (Drawing (✓), Painting, Printmaking)
│ │ ├─┐ Drawing: (✓)
│ │ │ └─ ART 225 | ART 232 (✓) | ART 233
│ │ ├─┐ Painting: (✗)
│ │ │ └─ ART 221 | ART 222
│ │ └─┐ Printmaking: (✗)
│ │   └─ ART 226 | ART 227
│ ├─┐ 3D Media: (✓)
│ │ ├─ any of (Ceramics, Sculpture (✓))
│ │ ├─┐ Ceramics: (✗)
│ │ │ └─ ART 207 | ART 234
│ │ └─┐ Sculpture: (✓)
│ │   └─ ART 223 | ART 224 (✓)
│ ├─┐ New Media: (✓)
│ │ ├─ any of ( Photography (✓), Interactive Image, Digital Video, Performance, Graphic Design )
│ │ ├─┐ Photography: (✓)
│ │ │ └─ ART 205 | ART 238
│ │ ├─┐ Interactive Image: (✗)
│ │ │ └─ ART 228
│ │ ├─┐ Digital Video: (✗)
│ │ │ └─ ART 229
│ │ ├─┐ Performance: (✗)
│ │ │ └─ ART 240
│ │ └─┐ Graphic Design: (✗)
│ │   └─ ART 236
│ ├─┐ Juried Show (x - must be overridden)
│ │ └─ To fulfill the requirements of the Studio Art major, you must enter at least two juried art exhibitions on or off campus by the beginning of your senior year.
│ └─┐ Senior Thing: (✓)
│   └─ ART 343 (✓)
├─┐ Art History: (✓)
│ ├─ The department strongly recommends that you take ART 252 or 253 as one of your art history courses.
│ └─ two of (ART 153, ART 161, ART 251, ART 252, ART 253, ART 254, ART 255, ART 256, ART 263, ART 269, ART 271, ART 275 (✓), ART 277, ART 280, ART 294, ART 298, ART 350 (✓), ART 379, ART 394, ART 396, ART 398, ART/ASIAN 259, ART/ASIAN 260, ART/ASIAN 262, ART/ASIAN 270, ART/ASIAN 310, ENVST 270, PHIL 243, RACE 253 )
└─┐ Art Credits: (✗)
  ├─ ten credits from courses where {department=ART}
  ├─ <<list matches here>>
  └─ (in case of credits, show credit value of each)
```
