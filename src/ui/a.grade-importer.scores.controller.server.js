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
              'Uncheck a gradebook to skip it.</p>');

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
    form.push('<div class="msg msg-warning">' +
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
 * Sorts gradebook csv files into groups based on the header information
 * contained in the first row. Headers that match are put into the same group.
 * Sorted gradebook files are stored in document properties for later use. 
 * Returns an HTML-formatted string of assignment names for the first group of
 * gradebook files is returned.
 * 
 * @param {array} sheetIds An array of sheet ids.
 * @return {string} An HTML-formatted string of assignment names.
 */
function processGradebooks(sheetIds) {
  // Sort gradebooks into groups based on matching headers.
  var gradebookGroups = [];
  for (var i = 0; i < sheetIds.length; i++) {
    var id_A = sheetIds[i];
    var gradebook_A = new Gradebook(id_A);
    var header_A = gradebook_A.getAssignmentNames();

    if (gradebookGroups.length === 0) {
      gradebookGroups.push([id_A]);
    } else {
      for (var j = 0; j < gradebookGroups.length; j++) {
        var id_B = gradebookGroups[j][0];
        var gradebook_B = new Gradebook(id_B);
        var header_B = gradebook_B.getAssignmentNames();
        
        if (arraysEqual(header_A, header_B) === true) {
          gradebookGroups[j].push(id_A);
          break;
        }
        else if (j + 1 === gradebookGroups.length) {
          gradebookGroups.push([id_A]);
          break;
        }
      }
    }
  }
  // Store the sorted gradebooks and display the assignments.
  var storage = new PropertyStore();
  storage.setProperty('gradebookGroups', gradebookGroups, true);
  return displayAssignments();
}


/**
 * Returns an HTML-formatted string to display the assignment selector.
 * 
 * @returns An HTML-formatted string.
 */
function displayAssignments() {
  var storage = new PropertyStore();
  var gradebookGroups = storage.getProperty('gradebookGroups', true);
  var sheetIds = gradebookGroups.shift();
  storage.setProperty('sheetIds', sheetIds, true);
  storage.setProperty('gradebookGroups', gradebookGroups, true);

  var form = [];
  if (sheetIds !== undefined) {
    var sheetNames = getSheetNames_(sheetIds);
    var sheetId = sheetIds[0];    
    var gradebook = new Gradebook(sheetId);  
    var assignments = gradebook.getAssignmentNames();
    var assignmentItems = constructColumnSelectItems_(assignments, 2);
    
    // Construct the html form.
    form.push('<form class="block" id="assignments">' +
      '<div class="form-group">' +
        '<p>Select learning goal mastery data to import by checking the ' +
        'appropriate gradebook assignments below.</p>' +
        '<p class="small"><strong>Data will be imported from the following ' +
            'sheet(s): </strong>' +
          sheetNames + ' ' +
          '<a href="#" class="tooltip-right" data-tooltip="If you do not see ' +
                'all of the gradebooks you selected, you will be prompted to ' +
                'import data from your other gradebooks shortly">' +
            '<i class="fa fa-info-circle" aria-hidden="true"></i>' +
          '</a>' +
        '</p>');
    
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
    form.push('<div class="msg msg-information">' +
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
      '<li class="assignment">' +
        '<h3>' + 
          '<em>Assignment:</em> ' +
          gradebook.getAssignmentName(assignments[i]) +
        '</h3>' +
        '<div class="block form-group">' +
          '<label>Select learning goal:</label>' +
            masteryData.getLearningGoalSelector() +
        '</div>' +
        '<div class="form-group">' +
          '<label>Learning goal title:</label>' +
          '<input type="text" name="lgName">' +
        '</div>' +
        '<div class="form-group">' +
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
      '<span id="errorDisplay"></span>' +
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

  // Check if the last gradebook group has been processed.
  var gradebookGroups = storage.getProperty('gradebookGroups', true);
  if (gradebookGroups.length === 0) {
    // Construct display message and close button for return.
    var complete = '<div class="msg msg-information">' + 
          'Import complete. You may close this window and ' +
          'complete step 3.' +
        '</div>' +
        showCloseButton();
    return complete;
  } else {
    // Display assignments for next gradebook group.
    return displayAssignments();
  }
}


/**
 * Returns a string of the sheet names for the given array of sheet Ids.
 * 
 * @param {array} sheetIds An array of sheet ids.
 * @return {string} A string of commas-separated sheet names.
 */
function getSheetNames_(sheetIds) {
  var sheetNames = [];
  for (var i = 0; i < sheetIds.length; i++) {
    var sheetId = sheetIds[i];
    var gradebook = new Gradebook(sheetId);
    var sheetName = gradebook.sheetName;
    sheetNames.push(sheetName);
  }
  return sheetNames.join(', ');
}