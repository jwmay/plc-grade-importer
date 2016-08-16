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
function displayGradebooksForRemoval() {
  var masteryTracker = new MasteryTracker();
  var gradebookSheets = masteryTracker.getUserCreatedSheets();
  var gradebookItems = constructSheetSelectItems_(gradebookSheets);

  // Construct the html form.
  var form = [];
  form.push('<form class="block" id="gradebooks">' +
      '<div class="form-group">' +
        '<p>The following sheets will be permanently deleted from this ' +
            'spreadsheet. Imported mastery data will not be lost. Uncheck a ' +
            'gradebook to skip it.</p>');

  // Construct the checkboxes for each assignment.
  form.push('<div class="form-options">' +
      showCheckboxes('gradebooks', gradebookItems, true) +
    '</div></div>');

  // Construct the form control buttons.
  form.push('<div class="btn-bar">' +
      '<input type="button" value="Delete gradebooks" class="create" ' +
          'onclick="selectGradebooksForRemoval_onclick();">' +
      showCloseButton() +
    '</div></form>');

  return form.join('');
}


/**
 * Deletes all sheets with the given sheetIds and returns an HTML-formatted
 * string with a success message and close button.
 * 
 * @param {array} sheetIds An array of numbers representing the sheet ids.
 * @returns An HTML-formatted string.
 */
function removeGradebooks(sheetIds) {
  for (var i = 0; i < sheetIds.length; i++) {
    var sheetId = sheetIds[i];
    var gradebook = new Gradebook(sheetId);
    gradebook.remove();
  }

  // Construct display message and close button for return.
  var complete = 'Sheet removal complete. You may close this window.' +
      '<div class="block">' +
        showCloseButton() +
      '</div>';

  return complete;
}