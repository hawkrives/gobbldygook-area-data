{
	"Asian Studies": {
		"name": "Asian Studies",
		"type": "major",

		"sets": [
			{
				// Asian Studies 275: Interdisciplinary Approaches to Asia (.25 credit)
				"description": "Independent Approaches to Asia",
				"needs": true,
				"reqs": [
					{"courses": ["ASIAN 275"], "needs": true}
				]
			},
			{
				// Six electives, with stipulations:
				"description": "Electives",
				"count": 6,
				"reqs": [
					// 1. At least two at level II or level III, taken on campus;
					{"query": "'ASIAN' in depts AND level >= 200", "needs": 2},
					
					// 2. No more than two at level I;
					{"query": "'ASIAN' in depts AND level == 100", "max": 2},
					
					// 3. No more than four elective courses about any one country;
					{"reqgroup": [
						{"query": "'ASIAN' in depts AND 'China' =~ title", "max": 4},
						{"query": "'ASIAN' in depts AND 'Japan' =~ title", "max": 4}
					], "needs": true},
					
					// 4. No level I or level II language courses may count.
					{"query": "'ASIAN' in depts AND ('Beginner' =~ title OR 'Intermediate' =~ title) AND level < 300 AND NOT (crsid in {{ validCrsids }})", "max": 0}
				]
			},
			{
				// Senior Seminar: Asian Studies 399: Asian Studies Seminar or 397: Human Rights/Asian Context 
				"description": "Senior Seminar",
				"needs": true,
				"reqs": [
					{"courses": ["ASIAN 397", "ASIAN 399"], "needs": 1}
				]
			},
			{
				// Two courses in Chinese or Japanese above 112 or its equivalent
				"description": "Language",
				"needs": 1,
				"reqs": [
					{"query": "'JAPAN' in depts AND level >= 200 AND ('Intermediate' =~ title OR 'Advanced' =~ title OR 'Japanese' =~ title)", "needs": 2},
					{"query": "'CHIN' in depts AND level >= 200 AND ('Intermediate' =~ title OR 'Advanced' =~ title OR 'Chinese' =~ title)", "needs": 2}
				]
			}
		]
	}
}
