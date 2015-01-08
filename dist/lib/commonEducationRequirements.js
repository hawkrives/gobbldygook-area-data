"use strict";

var _interopRequire = function (obj) {
  return obj && (obj["default"] || obj);
};

var _ = _interopRequire(require("lodash"));

var hasGenEd = _interopRequire(require("sto-helpers/lib/hasGenEd"));

var countGeneds = _interopRequire(require("sto-helpers/lib/countGeneds"));

var acrossAtLeastTwoDepartments = _interopRequire(require("sto-helpers/lib/acrossAtLeastTwoDepartments"));

var isIntercollegiateSport = _interopRequire(require("sto-helpers/lib/isIntercollegiateSport"));

var checkThatCoursesSpanDepartmentsAndGeneds = _interopRequire(require("sto-helpers/lib/checkThatCoursesSpanDepartmentsAndGeneds"));

// TODO: Consider returning matches from these functions, in addition to the boolean.

function firstYearWriting(courses, matriculation) {
  // First-year students are required to complete First-Year Writing (FYW),
  // with two exceptions:
  // NOTE: These two exceptions don't apply to Gobbldygook.

  // The course must be taken in the first year.
  var firstYearCourses = _.filter(courses, { year: matriculation });

  return {
    title: "First Year Writing",
    abbr: "FYW",
    result: countGeneds(firstYearCourses, "FYW") >= 1 };
}

function writingInContext(courses) {
  // WRI - 4 courses in any departments/programs
  return {
    title: "Writing in Context",
    abbr: "WRI",
    result: countGeneds(courses, "WRI") >= 4 };
}

function foreignLanguage(courses) {
  // FOL - 0-4 courses

  // NOTE: This gened is only awarded in the final required course, so there
  // just needs to be one.

  return {
    title: "Foreign Language",
    abbr: "FOL",
    result: countGeneds(courses, "FOL") >= 1 };
}

function oralCommunication(courses) {
  // ORC - 1 course
  return {
    title: "Oral Communication",
    abbr: "ORC",
    result: countGeneds(courses, "ORC") >= 1 };
}

function abstractAndQuantitativeReasoning(courses) {
  // AQR - 1 course
  return {
    title: "Abstract and Quantitative Reasoning",
    abbr: "AQR",
    result: countGeneds(courses, "AQR") >= 1 };
}

function studiesInPhysicalMovement(courses) {
  // SPM - 2 different courses

  // Two different courses, of any credit value, that expand students'
  // experiences in and understanding of movement and promote lifelong
  // health and wellness of the whole person. Students are encouraged to
  // expand their horizons and focus on different activities or modes of
  // movement in order to fulfill the requirements.

  // Only one SPM course credit may be earned by students as a result of
  // participation in an approved intercollegiate sport. This credit must be
  // entered as Exercise Science 171-194 at the registration preceding the
  // sport/participation term. Credit cannot be claimed after the term in
  // which participation took place unless the student completes a petition
  // form; a late fee is assessed. An intercollegiate SPM (.25) credit can
  // only be used within the two-course SPM graduation requirement. An
  // intercollegiate SPM (.25) credit cannot be used as an elective for the
  // purpose of earning a credit toward the 35 full-credit course
  // requirement for graduation. It can only be used once as one half of the
  // two-course SPM requirement.

  // After the two-course SPM requirement has been completed, students may
  // repeat a specific exercise science activity (ESAC) course under the
  // following conditions:

  // - The SPM requirement is completed with two different courses.

  // NOTE: Not currently checked. Should it be?
  // - Each specific exercise science activity course may only be taken a
  // maximum of four times (the first time plus three repeats).

  var uniqueCourses = _.uniq(courses, "crsid");

  var numberOfSpmCourses = _(uniqueCourses).filter(hasGenEd("SPM")) // just the SPM courses
  .reject(isIntercollegiateSport) // remove the sports
  .size(); // and we only care about the number


  var distinctSportsCount = _(uniqueCourses).filter(isIntercollegiateSport) // only the sports
  .size(); // and we only care about if there is more than one

  var hasSportsCredit = distinctSportsCount >= 1;


  if (numberOfSpmCourses < 2 && hasSportsCredit) {
    numberOfSpmCourses += 1;
  }

  var result = numberOfSpmCourses >= 2;

  return {
    title: "Studies in Physical Movement",
    abbr: "SPM",
    result: result };
}

function historicalStudiesInWesternCulture(courses) {
  // HWC - 2 courses
  return {
    title: "Historical Studies in Western Culture",
    abbr: "HWC",
    result: countGeneds(courses, "HWC") >= 2 };
}

function multiculturalDomesticStudies(courses) {
  // MCG,MCD - 2 courses, from different departments
  return {
    title: "Multicultural Studies - Domestic",
    abbr: "MCD",
    result: checkThatCoursesSpanDepartmentsAndGeneds(courses, ["MCD", "MCG"], { gened: "MCD" }) };
}

function multiculturalGlobalStudies(courses) {
  // MCG,MCD - 2 courses, from different departments
  return {
    title: "Multicultural Studies - Global",
    abbr: "MCG",
    result: checkThatCoursesSpanDepartmentsAndGeneds(courses, ["MCD", "MCG"], { gened: "MCG" }) };
}

function artisticStudies(courses) {
  // ALS-A,ALS-L - 2 courses, from different departments
  return {
    title: "Artistic Studies",
    abbr: "ALS-A",
    result: checkThatCoursesSpanDepartmentsAndGeneds(courses, ["ALS-L", "ALS-A"], { gened: "ALS-A" }) };
}

function literaryStudies(courses) {
  // ALS-A,ALS-L - 2 courses, from different departments
  return {
    title: "Literary Studies",
    abbr: "ALS-L",
    result: checkThatCoursesSpanDepartmentsAndGeneds(courses, ["ALS-L", "ALS-A"], { gened: "ALS-L" }) };
}

function biblicalStudies(courses, matriculation) {
  // BTS-B - 1 course

  // We're going to continue under the assumption that the BTS-B must be
  // taken in the first year at Olaf.
  var firstYearCourses = _.filter(courses, { year: matriculation });

  return {
    title: "Biblical and Theological Studies - Bible",
    abbr: "BTS-B",
    result: countGeneds(firstYearCourses, "BTS-B") >= 1 };
}

function theologicalStudies(courses) {
  // BTS-T - 1 course
  return {
    title: "Biblical and Theological Studies - Theology",
    abbr: "BTS-T",
    result: countGeneds(courses, "BTS-T") >= 1 };
}

function scientificExplorationAndDiscovery(courses) {
  // SED,IST - 2 courses, from different departments/programs
  return {
    title: "Scientific Exploration and Discovery",
    abbr: "SED",
    result: checkThatCoursesSpanDepartmentsAndGeneds(courses, ["SED", "IST"], { gened: "SED" }) };
}

function integratedScientificTopics(courses) {
  // SED,IST - 2 courses, from different departments/programs
  return {
    title: "Integrated Scientific Topics",
    abbr: "IST",
    result: checkThatCoursesSpanDepartmentsAndGeneds(courses, ["SED", "IST"], { gened: "IST" }) };
}

function studiesInHumanBehaviorAndSociety(courses) {
  // HBS - 2 courses, from different departments/programs
  var hbsCourses = _.filter(courses, hasGenEd("HBS"));

  var matchingCourses = _.uniq(hbsCourses, "crsid");
  var coversTwoDepartments = acrossAtLeastTwoDepartments(matchingCourses);

  var result = _.all([countGeneds(courses, "HBS") >= 2, coversTwoDepartments]);

  return {
    title: "Studies in Human Behavior and Society",
    abbr: "HBS",
    result: checkThatCoursesSpanDepartmentsAndGeneds(courses, ["HBS"], { courseCount: 1 }) };
}

function ethicalIssuesAndNormativePerspectives(courses) {
  // EIN - 1 course

  // Prerequisite for all EIN courses: completion of the BTS-T requirement
  // or permission of the instructor.

  var termOfFirstBtsT = _.chain(courses).filter(hasGenEd("BTS-T")).pluck("term").min().value();

  var termOfFirstEin = _.chain(courses).filter(hasGenEd("EIN")).pluck("term").min().value();

  var result = _.all([termOfFirstBtsT <= termOfFirstEin, countGeneds(courses, "EIN") >= 1]);

  return {
    title: "Ethical Issues and Normative Perspectives",
    abbr: "EIN",
    result: result };
}

function integrativeCourses(courses) {
  var results = [ethicalIssuesAndNormativePerspectives(courses)];

  return {
    title: "Integrative",
    result: _.all(results),
    details: results };
}

exports.firstYearWriting = firstYearWriting;
exports.writingInContext = writingInContext;
exports.foreignLanguage = foreignLanguage;
exports.oralCommunication = oralCommunication;
exports.abstractAndQuantitativeReasoning = abstractAndQuantitativeReasoning;
exports.studiesInPhysicalMovement = studiesInPhysicalMovement;
exports.historicalStudiesInWesternCulture = historicalStudiesInWesternCulture;
exports.multiculturalDomesticStudies = multiculturalDomesticStudies;
exports.multiculturalGlobalStudies = multiculturalGlobalStudies;
exports.artisticStudies = artisticStudies;
exports.literaryStudies = literaryStudies;
exports.biblicalStudies = biblicalStudies;
exports.theologicalStudies = theologicalStudies;
exports.scientificExplorationAndDiscovery = scientificExplorationAndDiscovery;
exports.integratedScientificTopics = integratedScientificTopics;
exports.studiesInHumanBehaviorAndSociety = studiesInHumanBehaviorAndSociety;
exports.ethicalIssuesAndNormativePerspectives = ethicalIssuesAndNormativePerspectives;
// Foundation


// Core


// Integrative