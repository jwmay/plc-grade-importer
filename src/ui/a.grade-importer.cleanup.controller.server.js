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
  if (gradebookSheets.length > 0) {
    form.push('<form class="block" id="gradebooks">' +
        '<div class="form-group">' +
          '<p>The following sheets will be permanently deleted from this ' +
              'spreadsheet. Imported mastery data will not be lost. Uncheck a ' +
              'gradebook to skip it.</p>');

    // Construct the checkboxes for each assignment.
    form.push('<div class="form-options">' +
        showCheckboxes('gradebooks', gradebookItems, true) +
      '</div>');

    // Add option to remove files from Google Drive.
    form.push('<div class="form-options">' +
        '<div>' +
          '<label>' +
            '<input type="checkbox" name="removeFiles" value="remove" checked>' +
            'Remove all imported gradebook files from Google Drive' +
          '</label>' +
        '</div>' +
      '</div></div>');

    // Construct the form control buttons.
    form.push('<div class="btn-bar">' +
        '<input type="button" value="Delete gradebooks" class="create" ' +
            'onclick="selectGradebooksForRemoval_onclick();">' +
        showCloseButton() +
      '</div></form>');
  } else {
    form.push('<div class="msg msg-information">' +
        '<p>' +
          'There are no sheets to remove. ' +
        '</p>' +
      '</div>' +
      showCloseButton());
  }

  return form.join('');
}


/**
 * Deletes all sheets with the given sheetIds and returns an HTML-formatted
 * string with a success message and close button. If removeFiles is true, the
 * corresponding imported gradebook files for each sheet will be removed from
 * the user's Google Drive.
 * 
 * @param {array} sheetIds An array of numbers representing the sheet ids.
 * @param {boolean} removeFiles If true, remove the imported gradebook files
 *         from Google Drive, otherwise, do not remove the files.
 * @returns An HTML-formatted string.
 */
function removeGradebooks(sheetIds, removeFiles) {
  for (var i = 0; i < sheetIds.length; i++) {
    var sheetId = sheetIds[i];
    var gradebook = new Gradebook(sheetId);
    gradebook.remove();
  }

  // Remove imported gradebook files from Google Drive.
  if (removeFiles === true) {
    var storage = new PropertyStore();
    var importedFileIds = storage.getProperty('importedFileIds', true);
    for (var j = 0; j < importedFileIds.length; j++) {
      var fileId = importedFileIds[j];
      var file = DriveApp.getFileById(fileId);
      file.setTrashed(true);
    }
    // Clear the stored file ids.
    storage.setProperty('importedFileIds', [], true);
  }

  // Construct display message and close button for return.
  var complete = '<div class="msg msg-information">' + 
        'Sheet removal complete. You may close this window.' +
      '</div>' +
      showCloseButton();

  return complete;
}