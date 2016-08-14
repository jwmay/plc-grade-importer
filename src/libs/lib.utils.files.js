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
 * Returns an object of valid and invalid file arrays. An array of file objects
 * returned from the Goolge Picker API is the required input.
 * 
 * @param {array} files An array of file objects returned from Google Picker.
 * @param {string} fileType The MIME-type for valid files.
 * @returns
 */
function validateFiles(files, fileType) {
  // Storage for valid and invalid files.
  var validatedFiles = {
    valid: [],
    invalid: []
  };
  
  // Filter out files with a valid filetype.
  validatedFiles.valid = files.filter(function(file) {
    return file.mimeType === fileType;
  });
  
  // Filter out file with an invalid filetype.
  validatedFiles.invalid = files.filter(function(i) {
    return validatedFiles.valid.indexOf(i) < 0;
  });
  
  return validatedFiles;
}