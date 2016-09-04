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
 * Returns an HTML-formatted string to display the imported gradebook
 * file selector.
 * 
 * @returns An HTML-formatted string.
 */
function displayGradebooks() {
  var masteryTracker = new MasteryTracker();
  var gradebookSheets = masteryTracker.getUserCreatedSheets();
  var gradebookItems = constructSheetSelectItems_(gradebookSheets);

  // Construct the html form.
  var form = [];
  form.push('<form class="block" id="gradebooks">' +
      '<div class="form-group">' +
        '<p>Scores will be imported from the following gradebooks. ' +
            'Uncheck a gradebook to skip it. Selected gradebooks must ' +
            'have identical assignments.</p>');

  // Construct the checkboxes for each assignment.
  form.push('<div class="form-options">' +
      showCheckboxes('gradebooks', gradebookItems, true) +
    '</div></div>');

  // Construct the form control buttons.
  form.push('<div class="btn-bar">' +
      '<input type="button" value="Select gradebooks" class="action" ' +
          'onclick="selectGradebooks_onclick();">' +
      showCloseButton() +
    '</div></form>');

  return form.join('');
}


/**
 * Returns an HTML-formatted string to display the assignment selector.
 * 
 * @returns An HTML-formatted string.
 */
function displayAssignments(sheetIds) {
  // Use the first selected assignment to get assignment names. This assumes
  // that all assignment names will be found in the other sheets...perhaps a
  // faulty assumption.
  // TODO: *** Add error catching for this ***
  var sheetId = sheetIds[0];

  // Save the current and remaining sheetIds for later use.
  var storage = new PropertyStore();
  storage.setProperty('sheetIds', sheetIds, true);
  
  var gradebook = new Gradebook(sheetId);  
  var assignments = gradebook.getAssignmentNames();
  var assignmentItems = constructColumnSelectItems_(assignments, 2);
  
  // Construct the html form.
  var form = [];
  form.push('<form class="block" id="assignments">' +
    '<div class="form-group">' +
      '<p>Select learning goal mastery data to import by checking the ' +
      'appropriate gradebook assignments below.</p>');
  
  // Construct the checkboxes for each assignment.
  form.push('<div class="form-options">' +
      showCheckboxes('assignments', assignmentItems) +
    '</div></div>');

  // Construct the form control buttons.
  form.push('<div class="btn-bar">' +
      '<input type="button" value="Select assignments" class="action" ' +
          'onclick="selectAssignments_onclick();">' +
      showCloseButton() +
    '</div></form>');


  return form.join('');
}


/**
 * Returns an HTML-formatted string to display the mastery data importer form.
 * 
 * @returns An HTML-formatted string.
 */
function displayMasteryData(assignments) {
  // Use the first selected assignment to get assignment names. This assumes
  // that all assignment names will be found in the other sheets...perhaps a
  // faulty assumption.
  // TODO: *** Add error catching for this ***
  var storage = new PropertyStore();
  var sheetIds = storage.getProperty('sheetIds', true);
  var sheetId = sheetIds[0];

  // Get the current gradebook.
  var gradebook = new Gradebook(sheetId);
  var masteryData = new MasteryData();

  // Construct the html form.
  var form = [];
  form.push('<form class="block" id="masteryData">' +
      '<div class="form-group">' +
        '<p>Set the learning goal number and title for each imported ' +
           'assignment:</p>');

  // Construct assignments.
  form.push('<ol class="comfy">');
  for (var i = 0; i < assignments.length; i++) {
    form.push(
      '<li>' +
        '<p>' +
          '<strong>' + 
            gradebook.getAssignmentName(assignments[i]) +
          '</strong>' +
        '</p>' +
        '<div class="block form-group">' +
          '<label>Select learning goal:</label>' +
            masteryData.getLearningGoalSelector() +
        '</div>' +
        '<div class="form-group">' +
          '<label for="lgName">Learning goal title:</label>' +
          '<input type="text" name="lgName" id="lgName">' +
        '</div>' +
        '<div>' +
          '<label>' +
            '<input type="checkbox" name="retake"> Re-take ' +
            '<span class="secondary"><em>This will add re-take data to a ' +
                'learning goal rather than replace existing data.</em></span>' +
          '</label>' +
        '</div>' +
        '<input type="hidden" name="assignment" value="' +
          assignments[i] +
        '">' +
      '</li>'
    );
  }
  form.push('</ol>');

  // Construct the form control buttons.
  form.push('<div class="btn-bar">' +
      '<input type="button" value="Import mastery data" class="action" ' +
          'onclick="importMasteryData_onclick();">' +
      showCloseButton() +
    '</div></form>');

  return form.join('');
}


/**
 * Imports the given assignments into the respective learning goal columns of 
 * the mastery data sheet. Takes into account whether an assignment is a retake.
 * 
 * @param {array} assignments Array of assignment numbers to import.
 * @param {array} lgNums Array of learning goal numbers as targets for
 *     the import.
 * @param {array} lgNames Array of learning goal names for the import.
 * @param {array} retakes Array of booleans indicating which learning goals
 *     are to be imported as retakes.
 * @returns An HTML-formatted string dislaying the completion message and
 *     close button.
 */
function importMasteryData(assignments, lgNums, lgNames, retakes) {
  var storage = new PropertyStore();
  var sheetIds = storage.getProperty('sheetIds', true);
  var masteryData = new MasteryData();

  // Loop over the selected spreadsheets containing the imported gradebook data.
  for (var i = 0; i < sheetIds.length; i++) {
    var sheetId = sheetIds[i];
    var gradebook = new Gradebook(sheetId);

    // Get the class period
    // TODO: *** perhaps some error handling here if null ***
    var period = gradebook.getClassPeriod();

    // Verify that the imported data arrays are equal in length.
    if ((assignments.length !== lgNums.length) &&
            (lgNums.length !== lgNames.length) &&
            (lgNames.length !== retakes.length)) {
      throw new Error('There was a problem importing the data. ' +
              'Please try again later.');
    }

    // Loop over the selected learning goal numbers.
    for (var j = 0; j < lgNums.length; j++) {
      var assignment = assignments[j];
      var lgNum = lgNums[j];
      var lgName = lgNames[j];
      var retake = retakes[j];

      // Set the learning goal name if given.
      if (lgName !== undefined && lgName !== null && lgName !== '') {
        masteryData.setLearningGoalName(lgNum, lgName);
      }

      // Set the mastery scores after clearing the old data.
      var scores = gradebook.getAssignmentScores(assignment);
      masteryData.clearLearningGoalScores(period, lgNum, retake);
      masteryData.setLearningGoalScores(period, lgNum, scores, retake);
    }
  }

  // Construct display message and close button for return.
  var complete = 'Import complete. You may close this window and ' +
      'complete step 3.' +
      '<div class="block">' +
        showCloseButton() +
      '</div>';

  return complete;
}


/**
 * Returns the data structure for showCheckboxes() given an array of Sheet
 * objects. The returned data is an array of objects each with a value and
 * label property.
 * 
 * @private
 * @param {array} sheets An array of Sheet objects.
 * @returns An array of objects.
 */
function constructSheetSelectItems_(sheets) {
  var items = [];
  for (var i = 0; i < sheets.length; i++) {
    var sheet = sheets[i];
    var item = {
        value: sheet.getSheetId(),
        label: sheet.getSheetName()
    };
    items.push(item);
  }
  return items;
}


/**
 * Returns the data structure for showCheckboxes() given an array of strings.
 * The returned data is an array of objects each with a value and label
 * property.
 * 
 * @private
 * @param {array} columns An array of strings.
 * @returns An array of objects.
 */
function constructColumnSelectItems_(columns, startIndex) {
  var items = [];
  var firstIndex = startIndex === undefined ? 1 : startIndex;
  for (var i = 0; i < columns.length; i++) {
    var col = columns[i];
    var colNum = i + firstIndex;
    var item = {
      value: colNum,
      label: col
    };
    items.push(item);
  }
  return items;
}