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
 * Displays an HTML Service dialog in Google Sheets that contains client-side
 * JavaScript code for the Google Picker API.
 */
function showPicker() {
  showDialog('a.grade-importer.picker.view', 600, 425,
          'Upload or select grade book files');
}


/**
 * Displays an HTML Service dialog in Google Sheets that contains client-side
 * JavaScript code for the score importer.
 */
function importScores() {
  showDialog('a.grade-importer.scores.view', 600, 425,
          'Select gradebooks to import scores from');
}


/**
 * Displays an HTML Service dialog in Google Sheets that contains client-side
 * JavaScript code for deleting imported gradebook files.
 */
function runCleanup() {
  showDialog('a.grade-importer.cleanup.view', 600, 425,
          'Select imported gradebook sheets to delete');
}