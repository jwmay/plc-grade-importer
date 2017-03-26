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
 * Base class for testing the Mastery Tracker class.
 */
var MasteryTrackerTests = function() {
  Tests.call(this);
};
inherit_(MasteryTrackerTests, Tests);


/**
 * Test to confirm that the configurations are properly loaded.
 */
MasteryTrackerTests.prototype.testConfigLoad = function() {
  var actualSpreadsheetId = SPREADSHEET_ID;
  var testSpreadsheet = new MasteryTracker();
  var testSpreadsheetId = testSpreadsheet.config.debugSpreadsheetId;
  assertEquals_(actualSpreadsheetId, testSpreadsheetId);
};


/**
 * Test to confirm that the active spreadsheet is loaded.
 */
MasteryTrackerTests.prototype.testSpreadsheetLoad = function() {
  var actualSpreadsheetName = SPREADSHEET_NAME;
  var testSpreadsheet = new MasteryTracker().getSpreadsheet();
  var testSpreadsheetName = testSpreadsheet.getName();
  assertEquals_(actualSpreadsheetName, testSpreadsheetName);
};


/**
 * Test to confirm that the currentUserIsOwner method correctly identifies
 * the email address of the current user and spreadsheet owner.
 */
MasteryTrackerTests.prototype.testCurrentUserIsOwner = function() {
  var testSpreadsheet = new MasteryTracker();
  assertTrue_(testSpreadsheet.currentUserIsOwner(),
          'The current user is not the owner.');
};


/**
 * Test to confirm that the getSheetById method correclty selects the sheet
 * wit the given sheetId.
 */
MasteryTrackerTests.prototype.testGetSheetById = function() {
  var actualSheetName = 'Class Schedule';
  var actualSheetId = 680820455;
  var testSpreadsheet = new MasteryTracker();
  var testSheet = testSpreadsheet.getSheetById(actualSheetId);
  var testSheetName = testSheet.getName();
  assertEquals_(actualSheetName, testSheetName);
};


/**
 * Test to confirm that the getUniqueSheetName method provides a correct
 * sheet name for a new sheet with the same name as an existing sheet.
 */
MasteryTrackerTests.prototype.testGetUniqueSheetName = function() {
  var baseName = 'Class Schedule';
  var actualSheetName = 'Class Schedule (2)';
  var testSpreadsheet = new MasteryTracker();
  var testSheetName = testSpreadsheet.getUniqueSheetName(baseName);
  assertEquals_(actualSheetName, testSheetName);
};


/**
 * Test to confirm that the spreadsheet is properly configured.
 */
MasteryTrackerTests.prototype.testIsConfigured = function() {
  var testSpreadsheet = new MasteryTracker();
  assertTrue_(testSpreadsheet.isConfigured(),
          'The spreadsheet is not properly configured.');
};