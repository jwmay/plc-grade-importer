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


function getSidebar() {
  var masteryTracker = new MasteryTracker();
  if (masteryTracker.isConfigured()) {
    var controls = '<div id="loadGradebooks">' +
          '<h1><span class="step">1</span> Load gradebooks</h1>' +
          '<p>' +
            'First load the gradebook files exported from Infinite' +
            'Campus into this Google Sheet by clicking the' +
            '<code>Load gradebooks</code> button below.' +
          '</p>' +
          '<div class="block">' +
            '<button class="action" onclick="loadGradebooks_onclick();">Load gradebooks</button>' +
          '</div>' +
        '</div>' +
        '<div id="importScores">' +
          '<h1><span class="step">2</span> Import scores</h1>' +
          '<p>' +
            'Next select final mastery numbers to import by clicking the' +
            '<code>Import scores</code> button below.' +
          '</p>' +
          '<div class="block">' +
            '<button class="action" onclick="importScores_onclick();">Import scores</button>' +
          '</div>' +
        '</div>' +
        '<div id="cleanUp">' +
          '<h1><span class="step">3</span> Clean up</h1>' +
          '<p>' +
            'Lastly clean up by removing the unneeded Infinite Campus gradebook' +
            'sheets that were imported by clicking the <code>Delete sheets</code>' +
            'button below. <em>This will not erase any of the data you imported.</em>' +
          '</p>' +
          '<div class="block">' +
            '<button class="action" onclick="runCleanup_onclick();">Delete sheets</button>' +
          '</div>' +
        '</div>';
    return controls;
  } else {
    var message = '<div class="msg msg-warning" style="margin-top:20px;">' +
          '<h3>Import Plugin Disabled</h3>' +
          '<p>' +
            'Scores cannot be imported into the PLC Mastery Tracker. ' +
            'This plugin can only be used in your personal mastery ' +
            'data tracker.' +
          '</p>' +
        '</div>';
    return message;
  }
}


/**
 * Displays an HTML Service dialog in Google Sheets that contains client-side
 * JavaScript code for the Google Picker API.
 */
function showPicker() {
  showDialog('a.grade-importer.picker.view', 900, 550,
          'Upload or select grade book files');
}


/**
 * Displays an HTML Service dialog in Google Sheets that contains client-side
 * JavaScript code for the score importer.
 */
function importScores() {
  showDialog('a.grade-importer.scores.view', 590, 350,
          'Import assignment scores');
}


/**
 * Displays an HTML Service dialog in Google Sheets that contains client-side
 * JavaScript code for deleting imported gradebook files.
 */
function runCleanup() {
  showDialog('a.grade-importer.cleanup.view', 560, 350,
          'Select imported gradebook sheets to delete');
}