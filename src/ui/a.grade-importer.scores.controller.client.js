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
 * Run initializations on dialog load.
 */  
$(function() {
  // Display the list of imported gradebook sheets as checkboxes.
  google.script.run
    .withSuccessHandler(updateDisplay)
    .displayGradebooks();
});


/**
 * Handler for the selectGradebooks click response. 
 */
function selectGradebooks_onclick() {
  var gradebooks = getCheckedBoxes_('gradebooks');
  showLoading();
  google.script.run
    .withSuccessHandler(updateDisplay)
    .processGradebooks(gradebooks);
}


/**
 * Handler for the selectAssignments click response. 
 */
function selectAssignments_onclick() {
  var assignments = getCheckedBoxes_('assignments');
  showLoading();
  google.script.run
    .withSuccessHandler(updateDisplay)
    .displayMasteryData(assignments);
}


/**
 * Handler for the importMasteryData click response. 
 */
function importMasteryData_onclick() {
  var valid = importMasteryData_validateForm();
  if (valid === true) {
    importMasteryData_submitForm();
  }
}


/**
 * Validates the mastery data form. Primary function is to ensure each select
 * has a valid option selected and highlights unselected elements.
 * 
 * @returns {boolean} True if the form is valid, otherwise, false.
 */
function importMasteryData_validateForm() {
  $('.form-group.error').removeClass('error');
  $('.lgNums option:selected:disabled').each(function() {
    $(this).parent('select').parent('.form-group').addClass('error');
  });
  if ($('.form-group.error').length === 0) {
    return true;
  }
  $('#errorDisplay').show().html('Select a Learning Goal for each assignment');
  return false;
}


/**
 * Gets the values from the mastery data import form and imports the data.
 */
function importMasteryData_submitForm() {
  var assignments = getValues_('input[name="assignment"]');
  var lgNums = getValues_('select[name="lgNums"]');
  var lgNames = getValues_('input[name="lgName"]');
  var retakes = getCheckboxStatus_('retake');
  showLoading('Importing scores. Do not close this window.');
  google.script.run
    .withSuccessHandler(updateDisplay)
    .importMasteryData(assignments, lgNums, lgNames, retakes);
}


/**
 * Remove error class from corrected select elements.
 */
$(document).click(function() {
  $('.lgNums').change(function() {
    $(this).parent('.form-group.error').removeClass('error');
  });
});