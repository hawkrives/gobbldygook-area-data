"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var _ = _interopRequire(require("lodash"));

var hasDepartment = _interopRequire(require("app/helpers/hasDepartment"));

var partialNameOrTitle = require("app/helpers/partialTitle").partialNameOrTitle;
var coursesAtLevel = require("app/helpers/courseLevels").coursesAtLevel;
var coursesAtOrAboveLevel = require("app/helpers/courseLevels").coursesAtOrAboveLevel;
var checkCoursesFor = _interopRequire(require("app/helpers/checkCoursesFor"));

var isRequiredCourse = _interopRequire(require("sto-areas/lib/isRequiredCourse"));

var hasDeptNumBetween = _interopRequire(require("app/helpers/hasDeptNumBetween"));

var ENGLISH_REQUIRED_COURSES = [{ deptnum: "ENGL 185" }];

var isRequiredEnglishMajorCourse = isRequiredCourse(ENGLISH_REQUIRED_COURSES);

function crossCulturalStudies(courses) {
  // Any course from cross-cultural studies (ENGL 200 - 219)
  var subsetOfCourses = _(courses).filter(hasDeptNumBetween({ dept: "ENGL", start: 200, end: 219 })).value();

  var fulfilledCrossCulturalStudies = _.filter(subsetOfCourses, function (courses) {
    return _.size(courses) >= 1;
  });

  var numberFulfilled = _.size(fulfilledCrossCulturalStudies);
  var numberNeeded = 1;

  return {
    title: "Cross-Cultural",
    type: "object/number",
    description: "One from Cross-Cultural studies",
    result: numberFulfilled >= numberNeeded,
    details: {
      has: numberFulfilled,
      needs: numberNeeded,
      matches: fulfilledCrossCulturalStudies } };
}

function literaryHistory(courses) {
  // Courses from literary history (ENGL 220 - 239)
  // One or two courses: one focusing on national literary tradition,
  // or examine literature from two or more nations.

  var subsetOfCourses = _(courses).filter(hasDeptNumBetween({ dept: "ENGL", start: 220, end: 239 })).value();

  var fulfilledLiteraryHistory = _.filter(subsetOfCourses, function (courses) {
    return _.size(courses) >= 1;
  });

  var numberFulfilled = _.size(fulfilledLiteraryHistory);
  var numberNeeded = 1;

  return {
    title: "Literary History",
    type: "object/number",
    description: "One national literary tradition or literature from two or more nations.",
    result: numberFulfilled >= numberNeeded,
    details: {
      has: numberFulfilled,
      needs: numberNeeded,
      matches: fulfilledLiteraryHistory } };
}

function crossDisciplinaryOrGenre(courses) {
  // Courses from cross disc. (ENGL 260 - 279) or genre (ENGL 280 - 299)
  // One from either Cross-Disciplinary Studies or Genre
  // check cross-disciplinary
  var numberOfCrossNeeded = 1;
  var crossDisciplinaryCourses = _.filter(courses, hasDeptNumBetween({ dept: "ENGL", start: 260, end: 279 }));
  var numberCrossFulfilled = _.size(crossDisciplinaryCourses) >= numberOfCrossNeeded;

  // check genre
  var numberOfGenreNeeded = 1;
  var genreCourses = _.filter(courses, hasDeptNumBetween({ dept: "ENGL", start: 280, end: 299 }));
  var numberGenreFulfilled = _.size(genreCourses) >= numberOfGenreNeeded;


  // evaluating how many courses we have fulfilled between Cross Disc. and Genre
  var numberFulfilled = _([numberCrossFulfilled > 0, numberGenreFulfilled > 0]).compact().size();

  // concat the two results together
  var crossAndGenreCourses = crossDisciplinaryCourses.concat(genreCourses);

  var numberNeeded = 1;

  return {
    title: "Cross-Disciplinary or Genre",
    type: "object/number",
    description: "One from either Cross-Disciplinary or Genre",
    result: _.any([numberCrossFulfilled >= numberNeeded, numberGenreFulfilled >= numberNeeded]),
    details: {
      has: numberFulfilled,
      needs: numberNeeded,
      matches: crossAndGenreCourses } };
}

function requirement1800(courses) {}

function electives(courses) {
  // Courses from (ENGL 240 - 259)
  // Six electives, with stipulations:
  // 1. At least three Level II
  // 2. At least two Level III
  // 3. An IS cannot count toward a Level II
  // 4. An IS, IR, nor English 396 can count for one of a student’s two Level III requirements
  var englishMajorElectives = _(courses).filter(hasDeptNumBetween({ dept: "ENGL", start: 240, end: 259 })).reject(isRequiredEnglishMajorCourse).value();

  var levelsTwo = _(englishMajorElectives).reject(coursesAtLevel(298)).filter(coursesAtOrAboveLevel(200)).size() >= 3;

  var levelsThree = _(englishMajorElectives).reject(coursesAtLevel(298)).reject(coursesAtLevel(396)).reject(coursesAtLevel(398)).filter(coursesAtOrAboveLevel(300)).size() >= 2;

  var onlyTwoAtLevelOne = _(englishMajorElectives).filter(coursesAtLevel(100)).size() <= 2;

  var electivesAreGood = _.all([levelsTwo, levelsThree, onlyTwoAtLevelOne]);
  var matching = _.size(englishMajorElectives);
  var needs = 6;

  var details = [levelsTwo, levelsThree, onlyTwoAtLevelOne];

  return {
    title: "Electives",
    type: "object/number",
    description: "Six electives, with stipulations:\n- At least two at Level III\n- Of the two Level III courses, at least one in literature\n- An IS cannot count toward one of three required courses at Level II\n- An IS, IR, nor English 396 can count for one of a student’s two Level III requirements",
    result: matching >= needs && electivesAreGood,
    details: {
      has: matching,
      needs: needs,
      matches: englishMajorElectives } };
}

function checkEnglishMajor(student) {
  return student.data().then(function (studentPieces) {
    var courses = studentPieces.courses;


    var englishMajorRequirements = [crossCulturalStudies(courses), literaryHistory(courses), crossDisciplinaryOrGenre(courses),
    // requirement1800(courses), fix me
    electives(courses)];

    return {
      result: _.all(englishMajorRequirements, "result"),
      details: englishMajorRequirements };
  });
}

var englishMajor = {
  title: "English",
  type: "major",
  id: "m-engl",
  departmentAbbr: "ENGL",

  check: checkEnglishMajor,
  _requirements: {
    crossCulturalStudies: crossCulturalStudies,
    literaryHistory: literaryHistory,
    crossDisciplinaryOrGenre: crossDisciplinaryOrGenre,
    requirement1800: requirement1800,
    electives: electives } };

module.exports = englishMajor;
// Fix me
// Among all level II courses (category-specific and elective)
// 1. One must be in literature before 1800
// 2. One must be in literature after 1800