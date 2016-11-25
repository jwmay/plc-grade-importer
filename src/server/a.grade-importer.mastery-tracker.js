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
 * An object representing the Mastery Tracker spreadsheet. Inherits from the
 * BaseSpreadsheet class.
 */
var MasteryTracker = function(config) {
  BaseSpreadsheet.call(this, config);
};
inherit_(MasteryTracker, BaseSpreadsheet);


/**
 * Return true if the Mastery Tracker spreadsheet is properly configured with
 * the correct sheets. The verification is done based on the sheet names present
 * in the spreadsheet.
 * 
 * @return {boolean} Return true if the spreadsheet is properly configured,
 *     otherwise, false.
 */
MasteryTracker.prototype.isConfigured = function() {
  var config = Configuration.getCurrent();
  var configSheets = config.sheets;
  var spreadsheetName = this.getSpreadsheetName();

  // Disable plugin for blacklisted spreadsheets.
  var disabledFor = config.disabledFor;
  for (var i = 0; i < disabledFor.length; i++) {
    var disabled = disabledFor[i];
    if (spreadsheetName.search(disabled) > -1) {
      return false;
    }
  }

  // Disable plugin if any required sheets are missing.
  for (var sheet in configSheets) {
    if (this.hasSheet(configSheets[sheet].name) === false) {
      return false;
    }
  }
  return true;
};