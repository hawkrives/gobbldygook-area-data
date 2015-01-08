"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var _ = _interopRequire(require("lodash"));

var hasDepartment = _interopRequire(require("sto-helpers/lib/hasDepartment"));

var isRequiredCourse = _interopRequire(require("sto-helpers/lib/isRequiredCourse"));

var asianDeptRequiredCourses = [{ deptnum: "ASIAN 275" }, { deptnum: "ASIAN 397" }, { deptnum: "ASIAN 399" }];

var isRequiredAsianStudiesCourse = isRequiredCourse(asianDeptRequiredCourses);

function asianLanguageCourses(course) {
  // If all of these match, it is a language course, and will be
  // rejected by the `reject` method.
  return hasDepartment(["CHINA", "JAPAN"], course);
}

function electives(courses) {
  // An Asian studies concentration consists of six courses:
  // - At least two of the six courses must be taken on campus
  // - No language courses may count toward this concentration

  var asianStudiesElectives = _(courses).filter(hasDepartment("ASIAN")).reject(asianLanguageCourses).reject(isRequiredAsianStudiesCourse).value();

  var asianStudiesElectivesOnCampus = _(asianStudiesElectives).reject({ kind: "fabrication" }).value();

  var totalTaken = _.size(asianStudiesElectives);
  var needs = 6;

  var takenOnCampus = _.size(asianStudiesElectivesOnCampus);
  var needsOnCampus = 2;

  var result = _.all([totalTaken >= needs, takenOnCampus >= needsOnCampus]);

  return {
    title: "Electives",
    type: "object/number",
    description: "// An Asian studies concentration consists of six courses: At least two of the six courses must be taken on campus, and No language courses may count toward this concentration",
    result: result,
    details: {
      has: totalTaken,
      needs: needs,
      matches: asianStudiesElectives } };
}

function checkAsianStudiesConcentration(student) {
  return student.data().then(function (studentPieces) {
    var courses = studentPieces.courses;


    var asianStudiesConcentrationRequirements = [electives(courses)];

    return {
      result: _.all(asianStudiesConcentrationRequirements, "result"),
      details: asianStudiesConcentrationRequirements };
  });
}

var asianStudiesConcentration = {
  title: "Asian Studies",
  type: "concentration",
  id: "c-asian",
  departmentAbbr: "ASIAN",

  check: checkAsianStudiesConcentration,
  _requirements: {
    electives: electives } };

module.exports = asianStudiesConcentration;