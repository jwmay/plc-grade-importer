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
 * Base class that assists in working with a Sheet instance in a Spreadsheet.
 * 
 * @constructor
 * @param {string} sheetId The sheet id.
 */
var BaseSheet = function(sheetId) {
  this.sheetId = sheetId;
  this.spreadsheet = new BaseSpreadsheet();
  this.sheet = this.spreadsheet.getSheetById(parseInt(sheetId));
  this.sheetName = this.sheet.getSheetName();
};


/**
 * Returns a Range instance representing a row in the sheet. An optional start
 * postion for the column can be providied.
 * 
 * @param {number} rowNum The row to retrieve.
 * @param {number=} startCol An optional starting column postion.
 * @return {Range} A Range instance representing the row.
 */
BaseSheet.prototype.getRow = function(rowNum, startCol) {
  var colStart = startCol === undefined ? 1 : startCol;
  var maxCols = this.sheet.getMaxColumns();
  var colEnd = maxCols - colStart + 1;
  var row = this.sheet.getRange(rowNum, colStart, 1, colEnd);
  return row;
};


/**
 * Returns a Range instance representing a column in the sheet. An optional
 * start postion for the row can be providied.
 * 
 * @param {number} colNum The column to retrieve.
 * @param {number=} startRow An optional starting row postion.
 * @return {Range} A Range instance representing the column.
 */
BaseSheet.prototype.getColumn = function(colNum, startRow) {
  var rowStart = startRow === undefined ? 1 : startRow;
  var maxRows = this.sheet.getMaxRows();
  var rowEnd = maxRows - rowStart + 1;
  var col = this.sheet.getRange(rowStart, colNum, rowEnd, 1);
  return col;
};