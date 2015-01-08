"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var _ = _interopRequire(require("lodash"));

var hasDepartment = _interopRequire(require("sto-helpers/lib/hasDepartment"));

var partialNameOrTitle = require("sto-helpers/lib/partialTitle").partialNameOrTitle;
var checkCoursesFor = _interopRequire(require("sto-helpers/lib/checkCoursesFor"));

var courseMatches = _interopRequire(require("sto-helpers/lib/courseMatches"));

var isRequiredCourse = _interopRequire(require("sto-helpers/lib/isRequiredCourse"));

var exerciseScienceRequiredCourses = [{ deptnum: "BIO 143" }, { deptnum: "BIO 243" }, { deptnum: "ESTH 110" }, { deptnum: "ESTH 255" }, { deptnum: "ESTH 374" }, { deptnum: "ESTH 375" }, { deptnum: "ESTH 390" }, { deptnum: "PSYCH 125" }];

var isRequiredExerciseScienceCourse = _.curry(isRequiredCourse(exerciseScienceRequiredCourses));


function coreBiologyCourses(courses) {
  /*
  	- Biology 143
  	- Biology 243
  */

  var anatAndPhys1 = checkCoursesFor(courses, { deptnum: "BIO 143" });

  var anatAndPhys2 = checkCoursesFor(courses, { deptnum: "BIO 243" });

  var requirements = [{
    title: "Cells and Tissues",
    result: anatAndPhys1,
    description: "**Cells and Tissues:** Biology 143 *(Human Anatomy and Physiology)*" }, {
    title: "Organs and Organ Systems",
    result: anatAndPhys2,
    description: "**Organs and Organ Systems:** Biology 243 *(Human Anatomy and Physiology)*" }];

  return {
    title: "Biology",
    type: "array/boolean",
    description: "- **Cells and Tissues:** Biology 143 *(Human Anatomy and Physiology)*\n- **Organs and Organ Systems:** Biology 243 *(Human Anatomy and Physiology)*",
    result: _.all(requirements, "result"),
    details: requirements };
}

function corePsychologyCourses(courses) {
  /*
  	- Psychology 125
  */

  var principlesOfPsych = checkCoursesFor(courses, { deptnum: "PSYCH 125" });

  var requirements = [{
    title: "Principles of Psychology",
    result: principlesOfPsych,
    description: "**Psychology:** Psychology 125 *(Principles of Psychology)" }];

  return {
    title: "Psychology",
    type: "array/boolean",
    description: "- **Psychology:** Psychology 125 *(Principles of Psychology)",
    result: _.all(requirements, "result"),
    details: requirements };
}

function coreCourses(courses) {
  /* Core courses:
  	- Exercise Science Theory 110
  	- Exercise Science Theory 255
  	- Exercise Science Theory 374
  	- Exercise Science Theory 375
  	- Exercise Science Theory 390
  */

  var nutrition = checkCoursesFor(courses, { deptnum: "ESTH 110" });

  var preventionAndCare = checkCoursesFor(courses, { deptnum: "ESTH 255" });

  var biomechanics = checkCoursesFor(courses, { deptnum: "ESTH 374" });

  var physOfExercise = checkCoursesFor(courses, { deptnum: "ESTH 375" });

  var exerciseScienceSeminar = checkCoursesFor(courses, { deptnum: "ESTH 390" });

  var requirements = [{
    title: "Nutrition and Wellness",
    result: nutrition,
    description: "**Nutrition:** Exercise Science Theory 110 *(Nutrition and Wellness)*" }, {
    title: "Prevention and Care",
    result: preventionAndCare,
    description: "**Prevention and Care:** Exercise Science Theory 255 *(Prevention and Care of Athletic Injuries)*" }, {
    title: "Biomechanics",
    result: biomechanics,
    description: "**Biomechanics:** Exercise Science Theory 374" }, {
    title: "Physiology of Exercise",
    result: physOfExercise,
    description: "**Physiology of Exercise:** Exercise Science Theory 375" }, {
    title: "Exercise Science Seminar",
    result: exerciseScienceSeminar,
    description: "**Exercise Science Seminar:** Exercise Science Theory 390" }];

  return {
    title: "Core",
    type: "array/boolean",
    description: "- **Nurtrition:** Exercise Science Theory 110 *(Nutrition and Wellness)*\n- **Prevention and Care:** Exercise Science Theory 255 *(Prevention and Care of Athletic Injuries)*\n- **Biomechanics:** Exercise Science Theory 374 *(Biomechanics)*\n- **Physiology of Exercise:** Exercise Science Theory 375\n- **Exercise Science Seminar:** Exercise Science Theory 390",
    result: _.all(requirements, "result"),
    details: requirements };
}

function electiveCourses(courses) {
  // Electives: any two from the following
  /*
  	Neuroscience 239
  	Exercise Science Theory 290
  	Exercise Science Theory 376
  	Psychology 230
  	Psychology 241
  	Psychology 247
  	Statistics 110
  	Statistics 212
  	Statistics 214
  */

  var validCourseQualifiers = [{ deptnum: "NEURO 239" }, { deptnum: "ESTH 290" }, { deptnum: "ESTH 376" }, { deptnum: "PSYCH 230" }, { deptnum: "PSYCH 241" }, { deptnum: "PSYCH 247" }, { deptnum: "STAT 110" }, { deptnum: "STAT 212" }, { deptnum: "STAT 214" }];
  var validCourses = _.filter(courses, courseMatches(validDeptNums));

  var numberTaken = _.size(validCourses);
  var numberNeeded = 2;

  return {
    title: "Electives",
    type: "object/number",
    description: "- **Neuroscience:** Neuroscience 239 *(Cellular and Molecular Neuroscience)*\n- **Sport Ethics:** Exercise Science Theory 290*(Sport Ethics in Society)*\n- **Fitness Assessment:** Exercise Science Theory 376 *(Fitness Assessment and Exercise Prescription)*\n- **Research Methods:** Psychology 230 *(Research Methods in Psychology)*\n- **Developmental Psychology:** Psychology 230\n- **Psychopathlogy:** Psychology 247\n -**Statisics:** Statistics 110 *(Principles of Statistics)*\n- **Science Statisics:** Statistics 212 *(Statistics for the Sciences)*\n- **Honors Statisics:** Statistics 214 *(Honors of Statistics)*\n",
    result: numberTaken >= numberNeeded,
    details: {
      has: numberTaken,
      needs: numberNeeded,
      matches: validCourses } };
}

function checkExerciseScienceMajor(student) {
  return student.data().then(function (studentPieces) {
    var courses = studentPieces.courses;


    var exericseScienceMajorRequirements = [coreBiologyCourses(courses), corePsychologyCourses(courses), coreCourses(courses), electiveCourses(courses)];

    return {
      result: _.all(exericseScienceMajorRequirements, "result"),
      details: exericseScienceMajorRequirements };
  });
}

var exerciseScienceMajor = {
  title: "Exercise Science",
  type: "major",
  id: "m-esth",
  departmentAbbr: "ESTH",

  check: checkExerciseScienceMajor,
  _requirements: {
    coreBiologyCourses: coreBiologyCourses,
    corePsychologyCourses: corePsychologyCourses,
    coreCourses: coreCourses,
    electiveCourses: electiveCourses } };

module.exports = exerciseScienceMajor;