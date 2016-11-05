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

  // Construct the html form if there are imported gradebook sheets.
  var form = [];
  if (gradebookSheets.length > 0) {
    form.push('<form class="block" id="gradebooks">' +
        '<div class="form-group">' +
          '<p>Scores will be imported from the following gradebooks. ' +
              'Uncheck a gradebook to skip it. <strong><em>Selected gradebooks ' +
              'must have identical assignments.</em></strong></p>');

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
  } else {
    form.push('<div class="warning">' +
        '<p>' +
          'No gradebooks have been loaded into the tracker. ' +
          'You must <strong><em>complete step 1</em></strong> first.' +
        '</p>' +
      '</div>' +
      showCloseButton());
  }

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
  var form = [];

  if (sheetIds.length > 0) {
    // Save the current and remaining sheetIds for later use.
    var storage = new PropertyStore();
    storage.setProperty('sheetIds', sheetIds, true);
    
    var gradebook = new Gradebook(sheetId);  
    var assignments = gradebook.getAssignmentNames();
    var assignmentItems = constructColumnSelectItems_(assignments, 2);
    
    // Construct the html form.
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
  } else {
    form.push('<div class="information">' +
        'No gradebooks were selected. You may close this window.' +
      '</div>' +
      showCloseButton());
  }

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

    // Get the class period.
    var period = gradebook.getClassPeriod();

    // Get the CC flag.
    var isCC = gradebook.isCC();

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
      // Append data for CC classes.
      var scores = gradebook.getAssignmentScores(assignment);
      if (isCC === false) {
        masteryData.clearLearningGoalScores(period, lgNum, retake);
        masteryData.setLearningGoalScores(period, lgNum, scores, retake);
      } else {
        masteryData.appendLearningGoalScores(period, lgNum, scores, retake);
      }
    }
  }

  // Construct display message and close button for return.
  var complete = '<div class="information">' + 
        'Import complete. You may close this window and ' +
        'complete step 3.' +
      '</div>' +
      showCloseButton();

  return complete;
}