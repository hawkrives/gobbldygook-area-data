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

var ASIAN_REQUIRED_COURSES = [{ deptnum: "ASIAN 275" }, { deptnum: "ASIAN 397" }, { deptnum: "ASIAN 399" }];

var isRequiredAsianStudiesCourse = isRequiredCourse(ASIAN_REQUIRED_COURSES);

function interdisciplinaryApproachesToAsia(courses) {
  // Asian Studies 275: Interdisciplinary Approaches to Asia (.25 credit)
  return {
    title: "Interdisciplinary Approaches to Asia",
    type: "boolean",
    description: "Asian Studies 275: Interdisciplinary Approaches to Asia",
    result: checkCoursesFor(courses, { deptnum: "ASIAN 275" }) };
}

function lowerLevelLanguageCourses(course) {
  // If all of these match, it is a lower-level language course, and will be
  // rejected by the `reject` method.
  return _.all([hasDepartment(["CHINA", "JAPAN"], course), course.level < 300]);
}

function electives(courses) {
  // Six electives, with stipulations:
  // 1. At least two at level II or level III, taken on campus;
  // 2. No more than two at level I;
  // 3. No more than four elective courses about any one country;
  // 4. No level I or level II language courses may count.

  var asianStudiesElectives = _(courses).filter(hasDepartment("ASIAN")).reject(lowerLevelLanguageCourses).reject(isRequiredAsianStudiesCourse).value();

  var levelsTwoOrThree = _(asianStudiesElectives).filter(coursesAtOrAboveLevel(200)).size() >= 2;

  var onlyTwoAtLevelOne = _(asianStudiesElectives).filter(coursesAtLevel(100)).size() <= 2;

  var notTooSpecialized = _.any([_(asianStudiesElectives).filter(partialNameOrTitle("China")).size() <= 4, _(asianStudiesElectives).filter(partialNameOrTitle("Japan")).size() <= 4]);

  // Req. #4 was embedded at the beginning, when we reject any lower-level
  // languages. That way, we can't count them.
  var electivesAreGood = _.all([levelsTwoOrThree, onlyTwoAtLevelOne, notTooSpecialized]);

  // console.log('asianStudiesElectives', asianStudiesElectives)

  var matching = _.size(asianStudiesElectives);
  var needs = 6;

  return {
    title: "Electives",
    type: "object/number",
    description: "Six electives, with stipulations: 1. At least two at level II or level III, taken on campus; 2. No more than two at level I; 3. No more than four elective courses about any one country; 4. No level I or level II language courses may count.",
    result: matching >= needs && electivesAreGood,
    details: {
      has: matching,
      needs: needs,
      matches: asianStudiesElectives } };
}

function seniorSeminar(courses) {
  // Senior Seminar: One of:
  // - Asian Studies 397: Human Rights/Asian Context, or
  // - Asian Studies 399: Asian Studies Seminar
  var humanRights = checkCoursesFor(courses, { deptnum: "ASIAN 397" });
  var asiaSeminar = checkCoursesFor(courses, { deptnum: "ASIAN 399" });

  var seminars = [humanRights, asiaSeminar];

  var seminarCount = _(seminars).compact().size();
  var seminarsNeeded = 1;

  return {
    title: "Senior Seminar",
    type: "boolean",
    description: "Senior Seminar: One of Asian Studies 397: Human Rights/Asian Context, or Asian Studies 399: Asian Studies Seminar",
    result: seminarCount >= seminarsNeeded };
}

function language(courses) {
  // Two courses in Chinese or Japanese above 112 or its equivalent
  // "'JAPAN' IN depts AND level >= 200 AND (('Intermediate' OR 'Advanced') AND 'Japanese') IN title"
  // "'CHIN' IN depts AND level >= 200 AND (('Intermediate' OR 'Advanced') AND 'Chinese') IN title"
  var subsetOfCourses = _(courses).filter(coursesAtOrAboveLevel(200)).filter(function (course) {
    return partialNameOrTitle(["Intermediate", "Advanced"], course);
  }).value();

  var japaneseLanguage = _(subsetOfCourses).filter(hasDepartment("JAPAN")).filter(partialNameOrTitle("Japanese")).value();

  var chineseLanguage = _(subsetOfCourses).filter(hasDepartment("CHIN")).filter(partialNameOrTitle("Chinese")).value();

  var fulfilledLanguages = _.filter([japaneseLanguage, chineseLanguage], function (courses) {
    return _.size(courses) >= 2;
  });
  var fulfilledLanguageCourses = _.flatten(fulfilledLanguages);

  var numberFulfilled = _.size(fulfilledLanguages);
  var numberNeeded = 1;

  return {
    title: "Language",
    type: "object/number",
    description: "Two courses in Chinese or Japanese above 112 or its equivalent",
    result: numberFulfilled >= numberNeeded,
    details: {
      has: numberFulfilled,
      needs: numberNeeded,
      matches: fulfilledLanguageCourses } };
}

function checkAsianStudiesMajor(student) {
  return student.data().then(function (studentPieces) {
    var courses = studentPieces.courses;


    var asianStudiesMajorRequirements = [interdisciplinaryApproachesToAsia(courses), electives(courses), language(courses), seniorSeminar(courses)];

    return {
      result: _.all(asianStudiesMajorRequirements, "result"),
      details: asianStudiesMajorRequirements };
  });
}

var asianStudiesMajor = {
  title: "Asian Studies",
  type: "major",
  id: "m-asian",
  departmentAbbr: "ASIAN",

  check: checkAsianStudiesMajor,
  _requirements: {
    interdisciplinaryApproachesToAsia: interdisciplinaryApproachesToAsia,
    electives: electives,
    language: language,
    seniorSeminar: seniorSeminar } };

module.exports = asianStudiesMajor;