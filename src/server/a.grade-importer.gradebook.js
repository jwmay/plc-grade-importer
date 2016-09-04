// Copyright 2016 Joseph W. May. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


/**
 * An object representing a Gradebook sheet. Inherits from the BaseSheet class.
 * 
 * @constructor
 */
var Gradebook = function(sheetId) {
  BaseSheet.call(this, sheetId);
};
inherit_(Gradebook, BaseSheet);


/**
 * Return an array of assignment names from an imported gradebook. This method
 * takes into account the first empty column in the gradebook files.
 * 
 * @return An array of strings containing the assignment names.
 */
Gradebook.prototype.getAssignmentNames = function() {
  var assignments = this.getRow(1, 2);
  var assignmentNames = assignments.getValues();
  return assignmentNames[0];
};


/**
 * Returns the assignment name given its column position.
 * 
 * @param {number} assignmentNumber The column number of the assignment.
 * @return {string} The name of the assignment.
 */
Gradebook.prototype.getAssignmentName = function(assignmentNumber) {
  var assignmentNames = this.getAssignmentNames();
  var arrayIndex = assignmentNumber - 2;  // account for array index
  var assignmentName = assignmentNames[arrayIndex];
  return assignmentName;
};


/**
 * Returns a 2d-array of values representing the scores for the given
 * assignment number.
 * 
 * @param {number} assignmentNumber The assignment number.
 * @return {array} A two-dimensional array.
 */
Gradebook.prototype.getAssignmentScores = function(assignmentNumber) {
  var lastRow = this.sheet.getLastRow() - 2;
  var scores = this.getColumn(assignmentNumber, 3, lastRow).getValues();
  return scores;
};


/**
 * Attempts to find the class period in the sheet name. If the class period
 * cannot be found, null is returned.
 * 
 * @return A string or null if the class period is not found.
 */
Gradebook.prototype.getClassPeriod = function() {
  var sheetName = this.sheetName;
  var periodRegex = new RegExp(/[period]*(\d)+[\.csv]*/);
  var periodMatch = periodRegex.exec(sheetName);
  var period = periodMatch !== null ? periodMatch[1] : null;
  return period;
};