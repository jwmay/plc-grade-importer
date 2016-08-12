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
 * Write the contents of each CSV file to a new sheet in the
 * active sreadsheet. The name of each new sheet will be the
 * name of the imported file.
 *
 * @param {string} fileId The ID number of the file to import.
 * @return {string} The name of the newly created sheet.
 */
function importCsvFile(fileId) {
  // Get the file contents and convert to an array of arrays.
  var file = DriveApp.getFileById(fileId);
  var fileContents = file.getBlob().getDataAsString();
  var csvData = CSVToArray(fileContents);
  
  // Create the new sheet with same name as file name.
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.insertSheet(file.getName());

  // Write the CSV file, row by row, to the new sheet.
  for (var j = 0; j < csvData.length; j++) {
    // Fix for first row of data, which has an empty cell.
    if (j == 0) {
      csvData[j].unshift("");
    }

    // Write the file to the new sheet.
    var range = sheet.getRange(j+1, 1, 1, csvData[j].length);
    range.setValues([csvData[j]]);
  }

  return sheet.getSheetName();
}


/**
 * Parse a delimited string into an array of arrays. The default delimiter is
 * the comma, but this can be overriden in the second argument.
 *
 * Taken from:
 * http://www.bennadel.com/blog/
 *    1504-Ask-Ben-Parsing-CSV-Strings-With-Javascript-Exec-Regular-Expression-Command.htm
 *
 * @param {string} strData The delimited text to parse.
 * @param {string} strDelimiter The delimiter for parsing.
 * @returns {array} An array containing the parsed data.
 */
function CSVToArray(strData, strDelimiter) {
  // Check to see if the delimiter is defined. If not,
  // then default to comma.
  strDelimiter = (strDelimiter || ",");

  // Create a regular expression to parse the CSV values.
  var objPattern = new RegExp(
    (
      // Delimiters.
      "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

      // Quoted fields.
      "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

      // Standard fields.
      "([^\"\\" + strDelimiter + "\\r\\n]*))"
    ),
    "gi"
  );

  // Create an array to hold our data. Give the array
  // a default empty first row.
  var arrData = [[]];

  // Create an array to hold our individual pattern
  // matching groups.
  var arrMatches = null;

  // Keep looping over the regular expression matches
  // until we can no longer find a match.
  while (arrMatches = objPattern.exec(strData)) {

    // Get the delimiter that was found.
    var strMatchedDelimiter = arrMatches[1];

    // Check to see if the given delimiter has a length
    // (is not the start of string) and if it matches
    // field delimiter. If id does not, then we know
    // that this delimiter is a row delimiter.
    if (
      strMatchedDelimiter.length &&
      (strMatchedDelimiter != strDelimiter)
    ){

      // Since we have reached a new row of data,
      // add an empty row to our data array.
      arrData.push([]);

    }


    // Now that we have our delimiter out of the way,
    // let's check to see which kind of value we
    // captured (quoted or unquoted).
    if (arrMatches[2]) {

      // We found a quoted value. When we capture
      // this value, unescape any double quotes.
      var strMatchedValue = arrMatches[ 2 ].replace(
        new RegExp( "\"\"", "g" ),
        "\""
      );

    } else {

      // We found a non-quoted value.
      var strMatchedValue = arrMatches[3];

    }

    // Now that we have our value string, let's add
    // it to the data array.
    arrData[arrData.length - 1].push(strMatchedValue);
  }

  // Return the parsed data.
  return arrData;
}