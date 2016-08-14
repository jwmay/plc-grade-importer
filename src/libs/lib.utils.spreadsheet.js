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
 * Base class that assists in working with a Spreadsheet instance in a
 * standalone project that may be dynamically bound to a Spreadsheet (as an
 * add-on), but also may run separate (testing, Execution API, etc.).
 * 
 * @constructor
 * @param {grade-importer.json.Configuration} config An optional valid
 *     configuration object instance.
 */
var BaseSpreadsheet = function(config) {
  this.config = config !== undefined ? config : Configuration.getCurrent();
};


/**
 * Returns a Spreadsheet instance. Instance is retrieved by ID if an ID
 * has been set by test code in the configuration.
 * 
 * @return {object} A Spreadsheet instance.
 */
BaseSpreadsheet.prototype.getSpreadsheet = function() {
  var loadLocal = ((typeof this.config.debugSpreadsheetId !== 'undefined') &&
      (this.config.debugSpreadsheetId !== ''));
  if (loadLocal) {
    return SpreadsheetApp.openById(this.config.debugSpreadsheetId);
  } else {
    return SpreadsheetApp.getActiveSpreadsheet();
  }
};


/**
 * Returns an array containing the name of every sheet in the spreadsheet
 * as a string.
 * 
 * @return {array} An array of sheet names as strings.
 */
BaseSpreadsheet.prototype.getSheetNames = function() {
  var sheets = this.getSpreadsheet().getSheets();
  var sheetNames = [];
  for (var i = 0; i < sheets.length; i++) {
    sheetNames.push(sheets[i].getName());
  }
  return sheetNames;
};


/**
 * Returns true if the given sheet name is found in the spreadsheet.
 * 
 * @param {string} name The sheet name.
 * @return {boolean} True if the sheet name is found, otherwise, false.
 */
BaseSpreadsheet.prototype.hasSheet = function(name) {
  var sheetNames = this.getSheetNames();
  var index = sheetNames.indexOf(name);
  var found = index > -1 ? true : false;
  return found;
};


/**
 * Shows a toast message in the current active spreadsheet.
 * 
 * @param {string} msg The message to display.
 * @param {string} title The title of the toast.
 */
BaseSpreadsheet.prototype.showToast = function(msg, title) {
  this.getSpreadsheet().toast(msg, title, 4);
};


/**
 * Returns true if the current user is the owner of the current spreadsheet.
 * 
 * @return {boolean} True if the current user is the owner of the Drive file.
 */
BaseSpreadsheet.prototype.currentUserIsOwner = function() {
  var ownerEmail = this.getSpreadsheet().getOwner().getEmail();
  return (ownerEmail === Session.getEffectiveUser().getEmail());
};


/**
 * Sheets-specific utility. Find a sheet within the spreadsheet with
 * the given id. If not present, return null.
 * 
 * @param {number} sheetId A Sheet id.
 * @return {object} A Sheet instance, or null if not found.
 */
BaseSpreadsheet.prototype.getSheetById = function(sheetId) {
  if ((typeof sheetId === 'undefined') || (!sheetId)) {
    return null;
  }
  var sheets = this.getSpreadsheet().getSheets();
  for (var i = 0; i < sheets.length; i++) {
    if (sheets[i].getSheetId() === sheetId) {
      return sheets[i];
    }
  }
  return null;
};


/**
 * Sheets-specific utility. Given a base title for a sheet, check
 * that it is unique in the spreadsheet. If not, find an integer suffix
 * to append to it to make it unique and return. This function is used
 * to avoid name collisions while adding or renaming sheets automatically.
 * 
 * @param {string} baseName Initial suggested title for a sheet.
 * @return {string} A unique title for the sheet, based on the
 *     given base title.
 */
BaseSpreadsheet.prototype.getUniqueSheetName = function(baseName) {
  var sheetName = baseName;
  var i = 2;
  while (this.getSpreadsheet().getSheetByName(sheetName) !== null) {
    sheetName = baseName + ' ' + i++;
  }
  return sheetName;
};