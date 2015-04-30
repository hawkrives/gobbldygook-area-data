import {checkListForCourse, nOf} from './helpers'

export default function checkComputerScienceMajor(courses) {
	const c = checkListForCourse(courses)


	const cs1 = (c("CSCI 121") || c("CSCI 125"))
	const design = (c("CSCI 241") && c("CSCI 251") && c("CSCI 252"))
	const proofWriting = (c("MATH 282", {year: 2014, sem: 1}) || c("MATH 244") || c("MATH 252"))

	const foundation = {
		name: "Foundation",
		result: cs1 && design && proofWriting,
		details: [
			{
				name: "CS1",
				description: "Either CSCI 121 (Principles of Computer Science) or CSCI 125 (Computer Science for Scientists and Mathematicians)",
				result: cs1,
			},
			{
				name: "Design",
				description: "All of CSCI 241 (Hardware Design), CSCI 251 (Software Design), and CSCI 252 (Software Design Lab)",
				result: design,
			},
			{
				name: "Proof-Writing",
				description: "One of MATH 244 (Real Analysis I), MATH 252 (Abstract Algebra I), or MATH 282 (Intro Abstract Math, taken 2014-15 Fall)",
				result: proofWriting,
			}
		]
	}


	const algorithms = (c("CSCI 253"))
	const ethics = (c("CSCI 263"))
	const thory = (c("CSCI 276") || c("CSCI 333"))
	const systems = (
		c("CSCI 273") ||
		c("CSCI 284") ||
		c("CSCI 300", {year: 2014, sem: 2}) ||
		c("CSCI 300", {year: 2012, sem: 3})
	)

	const core = {
		name: "Core",
		result: algorithms && ethics && theory && systems,
		details: [
			{
				name: "Algorithms",
				description: "CSCI 253 (Algorithms and Data Structures)",
				result: algorithms,
			},
			{
				name: "Ethics",
				description: "CSCI 263 (Ethical Issues in Software Design)",
				result: ethics,
			},
			{
				name: "Theory",
				description: "Either CSCI 276 (Programming Languages) or CSCI 333 (Theory of Computation)",
				result: theory,
			},
			{
				name: "Systems",
				description: "One of CSCI 273 (Operating Systems), CSCI 284 (Mobile Computing Applications), CSCI 300 (Parallel Distribut, taken 2014-15 Interim), or CSCI 300 (Parallel Distribut, taken 2012-13 Spring)",
				result: systems,
			}
		]
	}


	const electives = {
		name: "Electives",
		description: "One of CSCI 300 (Mobile Web Graphics, taken 2014-15 Fall), CSCI 315 (Bioinformatics), CSCI 336 (Logic Programming), or CSCI 350 (Advanced Team Project)",
		result: nOf([
			c("CSCI 300", {year: 2014, sem: 1}),
			c("CSCI 315"),
			c("CSCI 336"),
			c("CSCI 350"),
		], 2)
	}


	const capstone = {
		name: "Capstone",
		description: "CSCI 390 (Senior Capstone Seminar)",
		result: c("CSCI 390")
	}


	const results = [foundation, core, electives, capstone]
	return results
}
