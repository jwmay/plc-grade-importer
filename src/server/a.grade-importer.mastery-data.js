// Copyright 2017 Joseph W. May. All Rights Reserved.
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
 * An object representing the Mastery Data sheet.
 * Inherits from the BaseSheet class.
 * 
 * @constructor
 */
var MasteryData = function() {
  // Get the sheet name from the configuration object.
  this.config = Configuration.getCurrent();
  this.sheetName = this.config.sheets.masteryDataSheet.name;

  // Get the sheet id.
  var masteryTracker = new MasteryTracker(); 
  this.sheetId = masteryTracker.getSheetId(this.sheetName);

  // Inherit from BaseSheet.
  BaseSheet.call(this, this.sheetId);
};
inherit_(MasteryData, BaseSheet);


/**
 * Returns an array of the learning goal numbers in the mastery data sheet.
 * 
 * @return {array} An array of numbers.
 */
MasteryData.prototype.getLearningGoalNumbers = function() {
  var lgNums = this.getRow(2, 2).getValues();
  return removeEmpty(lgNums[0]);
};


/**
 * Returns an array of the learning goal names in the mastery data sheet.
 * 
 * @return {array} An array of strings.
 */
MasteryData.prototype.getLearningGoalNames = function() {
  var lgNames = this.getRow(3, 2).getValues();
  return removeEmpty(lgNames[0]);
};


/**
 * Returns an HTML select element with the learning goal numbers and names
 * as options.
 * 
 * @return {string} An HTML select element.
 */
MasteryData.prototype.getLearningGoalSelector = function() {
  var lgs = removeEmpty2D(this.getRows(2, 2, 2).getValues());
  var lgNums = lgs[0];
  var lgNames = lgs[1];

  var selector = [];
  selector.push('<select name="lgNums" class="lgNums" required>');
  selector.push('<option value="" disabled selected>' +
      'Select a Learning Goal...' +
    '</option>');
  for (var i = 0; i < lgNums.length; i++) {
    var option = '<option value="' + lgNums[i] + '">' +
        'Learning Goal ' + lgNums[i] + ' - ' + lgNames[i] +
      '</option>';
    selector.push(option);
  }
  selector.push('</select>');
  return selector.join('');
};


/**
 * Writes the name for the learning goal number to the mastery data sheet.
 * 
 * @param {number} lgNum The learning goal number.
 * @param {string} name The learning goal name.
 */
MasteryData.prototype.setLearningGoalName = function(lgNum, name) {
  var colNum = (2 + 12 * (lgNum - 1));
  var nameCell = this.sheet.getRange(3, colNum);
  nameCell.setValue(name);
};


/**
 * Sets the given learning goal with the provided scores for the specified
 * period. The retake flag sets the data in the retake column rather than the
 * original column.
 * 
 * @param {number} period The class period.
 * @param {number} lgNum The learning goal number.
 * @param {array} scores The array of scores.
 * @param {boolean} retake True if the data is for a retake. 
 */
MasteryData.prototype.setLearningGoalScores =
        function(period, lgNum, scores, retake) {
  var colNum = this.getScoresColumn(period, lgNum, retake);
  var numRows = scores.length;
  var range = this.getColumn(colNum, 9, numRows);
  range.setValues(scores);
};


/**
 * Appends the provided scores for the given learning goal and period. The
 * retake flag sets the data in the retake column rather than the original
 * column.
 * 
 * @param {number} period The class period.
 * @param {number} lgNum The learning goal number.
 * @param {array} scores The array of scores.
 * @param {boolean} retake True if the data is for a retake. 
 */
MasteryData.prototype.appendLearningGoalScores =
        function(period, lgNum, scores, retake) {
  // Get the assignment column number.
  var colNum = this.getScoresColumn(period, lgNum, retake);

  // Get the last row containing data.
  var startRow = this.getLastRow(colNum) + 1;

  // Append the scores.
  var numRows = scores.length;
  var range = this.getColumn(colNum, startRow, numRows);
  range.setValues(scores);
};


/**
 * Clears the given learning goal scores for the specified period. The retake
 * flag clears the retake column rather than the original column.
 * 
 * @param {number} period The class period.
 * @param {number} lgNum The learning goal number.
 * @param {boolean} retake True if the data is for a retake. 
 */
MasteryData.prototype.clearLearningGoalScores = 
        function(period, lgNum, retake) {
  var colNum = this.getScoresColumn(period, lgNum, retake);
  var numRows = this.config.properties.maxNumScores;
  var range = this.getColumn(colNum, 9, numRows);
  range.clearContent();
};


/**
 * Returns the column number for the given learning goal number for the
 * specified period. The retake flag returns the retake column number rather
 * than the original column number.
 * 
 * @param {number} period The class period.
 * @param {number} lgNum The learning goal number.
 * @param {boolean} retake True if the data is for a retake.
 * @return {number} The column number.
 */
MasteryData.prototype.getScoresColumn = function(period, lgNum, retake) {
  var colNum = (2 + 12 * (lgNum - 1) + 2 * (period - 1));
  colNum += retake === true ? 1 : 0;
  return colNum;
};