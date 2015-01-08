"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var _ = _interopRequire(require("lodash"));

var countCredits = _interopRequire(require("app/helpers/countCredits"));

var hasDepartment = _interopRequire(require("app/helpers/hasDepartment"));

function onlyFullCreditCourses(course) {
  return course.credits >= 1;
}

function onlyInterimCourses(course) {
  return course.sem === 2;
}

function onlyFullCreditInterimCourses(course) {
  return onlyInterimCourses(course) && onlyFullCreditCourses(course);
}

function onlySummerSessionCourses(course) {
  return course.sem === 4 || course.sem === 5;
}

function onlyFullCreditSummerSessionCourses(course) {
  return onlySummerSessionCourses(course) && onlyFullCreditCourses(course);
}

var creditsBeyondTheArea = _.curry(function (courses, creditCount, area) {
  // Takes the courses *outside* of the major department, and counts them.
  var deptAbbr = area.dept;

  // Leave only those outside of the department code
  var matchingCourses = _.reject(courses, hasDepartment(deptAbbr));

  // Grab the number of credits taken
  var matchingCourseCredits = countCredits(matchingCourses);

  // See if there are more than the required number.
  return matchingCourseCredits >= creditCount;
});

function checkStudentStudiesFor(desiredType, desiredAbbr, studies) {
  // Filter down to just the type of study (degree, major, concentration)
  var typeMatches = _.filter(studies, { type: desiredType });
  // then check for any matches of the abbreviation.
  return _.any(typeMatches, { abbr: desiredAbbr });
}

function checkStudentDegreesFor(desiredDegreeAbbreviation, studies) {
  return checkStudentStudiesFor("degree", desiredDegreeAbbreviation, studies);
}

function isMajoringIn(desiredMajorAbbr, studies) {
  return checkStudentStudiesFor("major", desiredMajorAbbr, studies);
}

function isConcentrationgOn(desiredConcentrationAbbr, studies) {
  return checkStudentStudiesFor("concentration", desiredConcentrationAbbr, studies);
}

function isBachelorOfMusic(studies) {
  return checkStudentDegreesFor("B.M.", studies);
}

function isBachelorOfArts(studies) {
  return checkStudentDegreesFor("B.A.", studies);
}

function isBachelorOfBoth(studies) {
  return _.all([isBachelorOfMusic(studies), isBachelorOfArts(studies)]);
}

// Helpers
exports.onlyFullCreditCourses = onlyFullCreditCourses;
exports.onlyInterimCourses = onlyInterimCourses;
exports.onlyFullCreditInterimCourses = onlyFullCreditInterimCourses;
exports.onlySummerSessionCourses = onlySummerSessionCourses;
exports.onlyFullCreditSummerSessionCourses = onlyFullCreditSummerSessionCourses;
exports.creditsBeyondTheArea = creditsBeyondTheArea;
exports.isBachelorOfMusic = isBachelorOfMusic;
exports.isBachelorOfArts = isBachelorOfArts;
exports.isBachelorOfBoth = isBachelorOfBoth;
exports.checkStudentStudiesFor = checkStudentStudiesFor;
exports.checkStudentDegreesFor = checkStudentDegreesFor;
exports.isMajoringIn = isMajoringIn;
exports.isConcentrationgOn = isConcentrationgOn;
exports.isBachelorOfMusic = isBachelorOfMusic;
exports.isBachelorOfArts = isBachelorOfArts;
exports.isBachelorOfBoth = isBachelorOfBoth;