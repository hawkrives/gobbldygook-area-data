"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var _ = _interopRequire(require("lodash"));

var hasDepartment = _interopRequire(require("app/helpers/hasDepartment"));

var partialNameOrTitle = require("app/helpers/partialTitle").partialNameOrTitle;
var coursesAboveNumber = require("app/helpers/courseLevels").coursesAboveNumber;
var checkCoursesFor = _interopRequire(require("app/helpers/checkCoursesFor"));

var isAsianCon = _interopRequire(require("sto-areas/lib/isAsianCon"));

var isRequiredCourse = _interopRequire(require("sto-areas/lib/isRequiredCourse"));

var japanStudiesRequiredCourses = [{ deptnum: "ASIAN 275" }, { deptnum: "ASIAN 397" }, { deptnum: "ASIAN 399" }];

var isRequiredJapanStudiesCourse = isRequiredCourse(japanStudiesRequiredCourses);

function lowerLevelLanguageCourses(course) {
  return _.all([hasDepartment(["CHINA", "JAPAN"], course), course.level < 300]);
}

function language(courses) {
  // Four Japanese language courses above Japanese 112;
  var japaneseLanguage = _(courses).filter(hasDepartment("JAPAN")).filter(coursesAboveNumber(112)).value();

  var numberNeeded = 4;
  var numberFulfilled = _.size(japaneseLanguage);
  var hasEnoughJapanese = numberFulfilled >= numberNeeded;

  return {
    title: "Language",
    type: "object/number",
    description: "Two courses in Japanese or Japanese above 112 or its equivalent",
    result: numberFulfilled >= numberNeeded,
    details: {
      has: numberFulfilled,
      needs: numberNeeded,
      matches: japaneseLanguage } };
}

function electives(courses) {
  // Two other courses on Japan;
  // no level I or II language courses may count in this category

  var asianCon = _.filter(courses, isAsianCon);

  var japanElectives = _(courses)
  // Only things in the Asian Studies or Japanese departments...
  .filter(hasDepartment(["ASIAN", "JAPAN"]))
  // that have the stems Japanese or China in their names...
  .filter(partialNameOrTitle(["Japanese", "Japan"]))
  // ignoring the language courses under 300 level...
  .reject(lowerLevelLanguageCourses)
  // and rejecting the required japanese studies courses,
  .reject(isRequiredJapanStudiesCourse)
  // then adding in AsianCon.
  .concat(asianCon).value();

  var matching = _.size(japanElectives);
  var needs = 2;

  return {
    title: "Electives",
    type: "object/number",
    description: "Two other courses on China; no level I or II language courses may count in this category",
    result: matching >= needs,
    details: {
      has: matching,
      needs: needs,
      matches: japanElectives } };
}

function checkJapanStudiesConcentration(student) {
  return student.data().then(function (studentPieces) {
    var courses = studentPieces.courses;


    var japanStudiesConcentrationRequirements = [language(courses), electives(courses)];

    return {
      result: _.all(japanStudiesConcentrationRequirements, "result"),
      details: japanStudiesConcentrationRequirements };
  });
}

var japanStudiesConcentration = {
  title: "Japan Studies",
  type: "concentration",
  id: "c-japan",
  departmentAbbr: "JAPAN",

  check: checkJapanStudiesConcentration,
  _requirements: {
    language: language,
    electives: electives } };

module.exports = japanStudiesConcentration;