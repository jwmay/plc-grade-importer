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
 * Passed into the configuration factory constructor
 * @return {myproj.json.Configuration} Default configuration settings.
 */
function getDefaultConfiguration_() {
  return {
    debug: false,

    debugSpreadsheetId: null,
    
    validFilename: /[period]+([0-9])+(cc)?[\.csv]+/i,

    spreadsheetName: 'PLC Mastery Data Tracker - Teacher Mastery Tracker',

    disabledFor: ['PLC Mastery Data Tracker - PLC Mastery Tracker'],
    
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
      },

      helpSheet: {
        name: 'Help',
        rows: 51,
        cols: 7
      }
    },

    properties: {
      maxNumScores: 60
    }
  };
}