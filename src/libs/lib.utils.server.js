// Copyright 2015 Google Inc. All Rights Reserved.
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
 * Compares two arrays to determine if they are equal. If sort is set to true,
 * the arrays are sorted before comparison. The default sort is false, so the
 * order of the arrays is taken into account during the comparison.
 * 
 * @param {array} array1 The first array to compare.
 * @param {array} array2 The second array to compare.
 * @param {boolean=} sort True if the arrays are to be sorted.
 *    Default is false, the array order does matter.
 * @returns 
 */
function arraysEqual(array1, array2, sort) {
  var a = array1;
  var b = array2;

  if (a === b) return true;
  if (a === null || b === null) return false;
  if (a.length != b.length) return false;

  // If sort set to true, then the arrays are sorted
  // and compared, otherwise, the arrays will be compared
  // taking into account the order of the elements.
  var doSort = sort === undefined ? false : sort;
  if (doSort) {
    a.sort();
    b.sort();
  }

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}


/**
 * Logs an Apps Script exception, including the call stack
 * @private
 * @param {Object} e Apps Script runtime error object
 */
function logException_(e) {
  Logger.log('Apps Script runtime exception:');
  Logger.log(e.message);
  Logger.log('\n' + e.stack + '\n');
}