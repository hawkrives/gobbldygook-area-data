{
	"info": {
		"title": "Computer Science",
		"abbr": "CSCI",
		"dept": "CSCI",
		"type": "major",

		"sets": [
			{
				/* 	Foundation courses: one of Computer Science 121 or 125;
					Computer Science 241, 251, and 252; one of Computer Science
					231 or Math 232 or Math 252.
				*/
				"description": "Foundation",
				"needs": true,
				"reqs": [
					{"title": "CS1", "courses": ["CSCI 121", "CSCI 125"], "needs": 1},
					{"title": "Design", "courses": ["CSCI 241", "CSCI 251", "CSCI 252"], "needs": true},
					{"title": "MFC", "courses": ["CSCI 231", "MATH 232", "MATH 252"], "needs": 1}
				]
			},
			{
				/*	Core courses: Computer Science 253; Computer Science 263;
					either Computer Science 276 or 333; and either Computer
					Science 273, 284, or 300 with parallel and distributed
					computing. 
				*/
				"description": "Core",
				"needs": true,
				"reqs": [
					{"title": "Algorithms", "courses": ["CSCI 253"], "needs": true},
					{"title": "Ethics", "courses": ["CSCI 263"], "needs": true},
					{"title": "Theory", "courses": ["CSCI 276", "CSCI 333"], "needs": 1},
					{"title": "Options", "query": "'CSCI' in depts AND (num in [273, 284] OR (num == 300 AND 'Parallel' =~ (name OR title)))", "needs": 1}
				]
			},
			{
				// Electives: Two approved electives.
				"description": "Electives",
				"needs": true,
				"reqs": [
					{"query": "'CSCI' in depts AND NOT (crsid in {{ validCrsids }})", "needs": 2}
				]
			},
			{
				// Capstone: Computer Science 390
				"description": "Capstone",
				"needs": true,
				"reqs": [
					{"courses": ["CSCI 390"], "needs": true}
				]
			}
		]
	}
}
