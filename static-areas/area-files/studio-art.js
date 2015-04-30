let studioArt = (student) => {
	const c = checkListForCourse(student.courses)

	let studioArtCourses = () => {
		let validCourses = [
			c('ART 102'), c('ART 103'), c('ART 104'), c('ART 106'),
			c('ART 205'), c('ART 207'), c('ART 221'), c('ART 222'),
			c('ART 223'), c('ART 224'), c('ART 225'), c('ART 226'),
			c('ART 227'), c('ART 228'), c('ART 229'), c('ART 232'),
			c('ART 233'), c('ART 234'), c('ART 236'), c('ART 238'),
			c('ART 240'), c('ART 246'), c('ART 294'), c('ART 298'),
			c('ART 340'), c('ART 343'), c('ART 394'), c('ART 398'),
		]

		return {
			name: 'Studio Art Courses',
			description: 'Eight of the Studio Art courses',
			result: mustBeTrue(8, validCourses),
			details: validCourses,
		}
	}()

	let foundations = () => {
		return {
			name: 'Foundations',
			description: 'ART 102, ART 103, and ART 104',
			result: c('ART 102') && c('ART 103') && c('ART 104'),
		}
	}()

	let twoDMedia = () => {
		let drawing = () => {
			return {
				name: 'Drawing',
				description: 'Any of ART 225, ART 232, or ART 233',
				result: c('ART 225') || c('ART 232') || c('ART 233'),
			}
		}()

		let painting = () => {
			return {
				name: 'Painting',
				description: 'Either ART 221 or ART 222',
				result: c('ART 221') || c('ART 222'),
			}
		}()

		let printmaking = () => {
			return {
				name: 'Printmaking',
				description: 'Either ART 226 or ART 227',
				result: c('ART 226') || c('ART 227'),
			}
		}()

		return {
			name: '2D Media',
			description: 'Any of Drawing, Painting, or Printmaking',
			result: some([drawing, painting, printmaking], 'result'),
			details: [
				drawing,
				painting,
				printmaking,
			],
		}
	}

	let threeDMedia = () => {
		let ceramics = () => {
			return {
				name: 'Ceramics',
				description: 'Either ART 207 or ART 234',
				result: c('ART 207') || c('ART 234'),
			}
		}()

		let sculpture = () => {
			return {
				name: 'Sculpture',
				description: 'Either ART 223 or ART 224',
				result: c('ART 223') || c('ART 224'),
			}
		}()

		return {
			name: '3D Media',
			description: 'Either Ceramics or Sculpture',
			result: some([ceramics, sculpture], 'result'),
			details: [
				ceramics,
				sculpture,
			],
		}
	}

	let newMedia = () => {
		let photography = () => {
			return {
				name: 'Photography',
				description: 'Either ART 205 or ART 238',
				result: c('ART 205') || c('ART 238'),
			}
		}()

		let interactiveImage = () => {
			return {
				name: 'Interactive Image',
				description: 'ART 228',
				result: c('ART 228'),
			}
		}()

		let digitalVideo = () => {
			return {
				name: 'Digital Video',
				description: 'ART 229',
				result: c('ART 229'),
			}
		}()

		let performance = () => {
			return {
				name: 'Performance',
				description: 'ART 240',
				result: c('ART 240'),
			}
		}()

		let graphicDesign = () => {
			return {
				name: 'Graphic Design',
				description: 'ART 236',
				result: c('ART 236'),
			}
		}()

		return {
			name: 'New Media',
			description: 'One of Photography, Interactive Image, Digital Video, Performance, or Graphic Design',
			result: some([photography, interactiveImage, digitalVideo, performance, graphicDesign], 'result'),
			details: [
				photography,
				interactiveImage,
				digitalVideo,
				performance,
				graphicDesign,
			],
		}
	}

	let juriedShow = () => {
		return {
			name: 'Juried Show',
			description: 'To fulfill the requirements of the Studio Art major, you must enter at least two juried art exhibitions on or off campus by the beginning of your senior year.',
			result: 'message',
		}
	}()

	let seniorStudiesInStudioArt = () => {
		return {
			name: 'Senior Studies in Studio Art',
			description: 'ART 343',
			result: c('ART 343'),
		}
	}()

	return {
		name: 'Studio Art',
		result: every([studioArtCourses, foundations, twoDMedia, threeDMedia, newMedia, juriedShow, seniorStudiesInStudioArt], 'result'),
		details: [
			studioArtCourses,
			foundations,
			twoDMedia,
			threeDMedia,
			newMedia,
			juriedShow,
			seniorStudiesInStudioArt,
		]
	}
}

let artHistory = (student) => {
	const c = checkListForCourse(student.courses)

	let note = "The department strongly recommends that you take ART 252 or 253 as one of your art history courses."

	let artHistoryCourses = () => {
		return {
			name: 'Art History Course',
			description: 'Two of ART 153, 161, 251, 252, 253, 254, 255, 256, ART 263, 269, 271, 275, 277, 280, 294, 298, ART 350, 379, 394, 396, 398, AR/AS 259, 260, 262, 270, 310, ENVST 270, PHIL 243, or RACE 253',
			result: mustBeTrue(2, [c('ART 153'), c('ART 161'), c('ART 251'), c('ART 252'), c('ART 253'), c('ART 254'), c('ART 255'), c('ART 256'), c('ART 263'), c('ART 269'), c('ART 271'), c('ART 275'), c('ART 277'), c('ART 280'), c('ART 294'), c('ART 298'), c('ART 350'), c('ART 379'), c('ART 394'), c('ART 396'), c('ART 398'), c('AR/AS 259'), c('AR/AS 260'), c('AR/AS 262'), c('AR/AS 270'), c('AR/AS 310'), c('ENVST 270'), c('PHIL 243'), c('RACE 253')]),
		}
	}()

	return {
		name: 'Art History',
		note,
		result: every(artHistoryCourses, 'result'),
		details: [
			artHistoryCourses,
		],
	}
}

let artCredits = (student) => {
	const c = checkListForCourse(student.courses)
	let filtered = filter(student.courses, (course) => course.department === 'ART')
	return {
		name: 'Art Credits',
		description: 'You must have ten credits in the ART department',
		result: countCredits(filtered) >= 10,
	}
}

function check(studentData) {
	return studentData.then((student) => {
		let results = [
			studioArt(student),
			artHistory(student),
			artCredits(student),
		]
		return {
			result: every(results),
			details: results,
		}
	})
}

export default {
	title: 'Studio Art',
	type: 'Major',
	revision: 2014,
	check: check,
}
