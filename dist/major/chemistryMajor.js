"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var _ = _interopRequire(require("lodash"));

var hasDepartment = _interopRequire(require("sto-helpers/lib/hasDepartment"));

var partialNameOrTitle = require("sto-helpers/lib/partialTitle").partialNameOrTitle;
var checkCoursesFor = _interopRequire(require("sto-helpers/lib/checkCoursesFor"));

var coursesAtLevel = require("sto-helpers/lib/courseLevels").coursesAtLevel;
var coursesAtOrAboveLevel = require("sto-helpers/lib/courseLevels").coursesAtOrAboveLevel;
var isRequiredCourse = _interopRequire(require("sto-helpers/lib/isRequiredCourse"));

var chemDeptRequiredCourses = [{ deptnum: "CHEM 121" }, { deptnum: "CHEM 123" }, { deptnum: "CHEM 126" }, { deptnum: "CHEM 125" }, { deptnum: "CHEM 126" }, { deptnum: "CHEM/BIO 125" }, { deptnum: "CHEM/BIO 126" }, { deptnum: "CHEM/BIO 227" }, { deptnum: "CHEM 247" }, { deptnum: "CHEM 248" }, { deptnum: "CHEM 255" }, { deptnum: "CHEM 371" }, { deptnum: "CHEM 253" }, { deptnum: "CHEM 254" }, { deptnum: "CHEM 256" }, { deptnum: "CHEM 357" }];

var isRequiredChemistryCourse = _.curry(isRequiredCourse(chemDeptRequiredCourses));

function introductorySequence(courses) {
  // Complete one of the introductory sequences (Chemistry
  // 121/123/126, Chemistry 125/126, or CHEM/BI0 125/126/227).

  var sequences = [[{ deptnum: "CHEM 121" }, { deptnum: "CHEM 123" }, { deptnum: "CHEM 126" }], [{ deptnum: "CHEM 125" }, { deptnum: "CHEM 126" }], [{ deptnum: "CHEM/BIO 125" }, { deptnum: "CHEM/BIO 126" }, { deptnum: "CHEM/BIO 227" }]];

  var checkedSequences = _.map(sequences, function (sequence) {
    return _.map(sequence, function (filter) {
      return checkCoursesFor(courses, filter);
    });
  });

  return {
    title: "Introductory Sequence",
    type: "object/number",
    description: "Complete one of the introductory sequences: Chemistry 121/123/126, Chemistry 125/126, or CH/BI 125/126/227",
    result: _.any(checkedSequences, function (sequence) {
      return _.all(sequence);
    }),
    details: {} };
}

function required(courses) {
  // Additional required courses include 247, 248, 255, 371
  var details = [];

  return {
    title: "Required",
    type: "object/number",
    description: "Additional required courses include 247, 248, 255, 371",
    result: matching >= needs && electivesAreGood,
    details: {
      has: matching,
      needs: needs,
      matches: asianStudiesElectives } };
}

function laboratory(courses) {
  // laboratory courses 253, 254, 256, 357
  var details = [];

  return {
    title: "Laboratory",
    type: "object/number",
    description: "laboratory courses 253, 254, 256, 357",
    result: matching >= needs && electivesAreGood,
    details: {
      has: matching,
      needs: needs,
      matches: asianStudiesElectives } };
}

function electives(courses) {
  // and at least one additional course from 252, 260, 298, 379, 380, 382, 384, 386, 388, 391 or 398.
  var details = [];

  return {
    title: "Electives",
    type: "object/number",
    description: "at least one additional course from 252, 260, 298, 379, 380, 382, 384, 386, 388, 391 or 398",
    result: matching >= needs && electivesAreGood,
    details: {
      has: matching,
      needs: needs,
      matches: chemistryElectives } };
}

function beyondChemistry(courses) {
  // In addition, students majoring in chemistry must take physics through
  // 125 or 232; mathematics through 126 or 128; and attend a total of 12
  // Chemistry Department seminars during their junior and senior years.

  var physics = [];
  var mathematics = [];
  var seminars = true;

  var details = [physics, mathematics, seminars];

  return {
    title: "Beyond Chemistry",
    type: "array",
    description: "In addition, students majoring in chemistry must take physics through 125 or 232; mathematics through 126 or 128; and attend a total of 12 Chemistry Department seminars during their junior and senior years.",
    result: matching >= needs && electivesAreGood,
    details: {
      has: matching,
      needs: needs,
      matches: asianStudiesElectives } };
}

function checkChemistryMajor(student) {
  return student.data().then(function (studentPieces) {
    var courses = studentPieces.courses;


    var chemistryMajorRequirements = [introductorySequence(courses)];

    return {
      result: _.all(chemistryMajorRequirements, "result"),
      details: chemistryMajorRequirements };
  });
}

var chemistryMajor = {
  title: "Chemistry",
  type: "major",
  id: "m-chem",
  departmentAbbr: "CHEM",

  check: checkChemistryMajor,
  _requirements: {
    introductorySequence: introductorySequence,
    required: required,
    laboratory: laboratory,
    electives: electives,
    beyondChemistry: beyondChemistry } };

module.exports = chemistryMajor;
// hasDepartment: matching,
// needs: needs,
// matches: asianStudiesElectives
// required(courses),
// laboratory(courses),
// electives(courses),
// beyondChemistry(courses),