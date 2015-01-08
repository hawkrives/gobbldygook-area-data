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

var chinaStudiesRequiredCourses = [{ deptnum: "ASIAN 275" }, { deptnum: "ASIAN 397" }, { deptnum: "ASIAN 399" }];

var isRequiredChinaStudiesCourse = isRequiredCourse(chinaStudiesRequiredCourses);

function lowerLevelLanguageCourses(course) {
  return _.all([hasDepartment(["CHINA", "JAPAN"], course), course.level < 300]);
}

function language(courses) {
  // Four Chinese language courses above Chinese 112;
  var chineseLanguage = _(courses).filter(hasDepartment("CHIN")).filter(coursesAboveNumber(112)).value();

  var numberNeeded = 4;
  var numberFulfilled = _.size(chineseLanguage);
  var hasEnoughChinese = numberFulfilled >= numberNeeded;

  return {
    title: "Language",
    type: "object/number",
    description: "Two courses in Chinese or Japanese above 112 or its equivalent",
    result: numberFulfilled >= numberNeeded,
    details: {
      has: numberFulfilled,
      needs: numberNeeded,
      matches: chineseLanguage } };
}

function electives(courses) {
  // Two other courses on China;
  // no level I or II language courses may count in this category

  var asianCon = _.filter(courses, isAsianCon);

  var chinaElectives = _(courses)
  // Only things in the Asian Studies or Chinese departments...
  .filter(hasDepartment(["ASIAN", "CHIN"]))
  // that have the stems Chinese or China in their names...
  .filter(partialNameOrTitle(["Chinese", "China"]))
  // ignoring the language courses under 300 level...
  .reject(lowerLevelLanguageCourses)
  // and rejecting the required chinese studies courses,
  .reject(isRequiredChinaStudiesCourse)
  // then adding in AsianCon.
  .concat(asianCon).value();

  var matching = _.size(chinaElectives);
  var needs = 2;

  return {
    title: "Electives",
    type: "object/number",
    description: "Two other courses on China; no level I or II language courses may count in this category",
    result: matching >= needs,
    details: {
      has: matching,
      needs: needs,
      matches: chinaElectives } };
}

function checkChinaStudiesConcentration(student) {
  return student.data().then(function (studentPieces) {
    var courses = studentPieces.courses;


    var chinaStudiesConcentrationRequirements = [language(courses), electives(courses)];

    return {
      result: _.all(chinaStudiesConcentrationRequirements, "result"),
      details: chinaStudiesConcentrationRequirements };
  });
}

var chinaStudiesConcentration = {
  title: "China Studies",
  type: "concentration",
  id: "c-chin",
  departmentAbbr: "CHIN",

  check: checkChinaStudiesConcentration,
  _requirements: {
    language: language,
    electives: electives } };

module.exports = chinaStudiesConcentration;