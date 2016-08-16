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
 * Passed into the configuration factory constructor
 * @return {myproj.json.Configuration} Default configuration settings.
 */
function getDefaultConfiguration_() {
  return {
    debug: false,

    debugSpreadsheetId: null,
    
    sheets: {
      classScheduleSheet: {
        name: 'Class Schedule',
        rows: 25,
        cols: 6
      },

      masteryDataSheet: {
        name: 'Mastery Data',
        rows: 68,
        cols: 241
      },

      masteryTrackerSheet: {
        name: 'Mastery Tracker',
        rows: 60,
        cols: 26
      },

      constantsSheet: {
        name: 'Constants',
        rows: 142,
        cols: 8
      }
    },
    
    studentNumberRange: {
      row: 9,
      col: 1,
      numRows: 60
    }
  };
}


/**
 * Imports the given assignments into the respective learning goal columns of 
 * the mastery data sheet. Takes into account whether an assignment is a retake.
 * 
 * @param {number} period The class period.
 * @param {array} assignments Array of assignment numbers to import.
 * @param {array} lgNums Array of learning goal numbers as targets for
 *     the import.
 * @param {array} lgNames Array of learning goal names for the import.
 * @param {array} retakes Array of booleans indicating which learning goals
 *     are to be imported as retakes.
 * @returns A string.
 */
function importMasteryData(period, assignments, lgNums, lgNames, retakes) {
  // Get the current gradebook.
  var storage = new PropertyStore();
  var sheetId = storage.getProperty('currentSheetId');
  var gradebook = new Gradebook(sheetId);
  var masteryData = new MasteryData();

  // Verify that the imported data arrays are equal in length.
  if ((assignments.length !== lgNums.length) &&
          (lgNums.length !== lgNames.length) &&
          (lgNames.length !== retakes.length)) {
    throw new Error('There was a problem importing the data. ' +
            'Please try again later.');
  }

  for (var i = 0; i < lgNums.length; i++) {
    // Set the learning goal name if given.
    masteryData.setLearningGoalName(lgNums[i], lgNames[i]);

    // Set the mastery scores.
    var scores = gradebook.getAssignmentScores(assignments[i]);
    masteryData.setLearningGoalScores(period, lgNums[i], scores, retakes[i]);
  }

  return 'Import complete';
}