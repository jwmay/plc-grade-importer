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
  showLoading_();
  google.script.run
    .withSuccessHandler(updateDisplay)
    .displayAssignments(gradebooks);
}


/**
 * Handler for the selectAssignments click response. 
 */
function selectAssignments_onclick() {
  var assignments = getCheckedBoxes_('assignments');
  showLoading_();
  google.script.run
    .withSuccessHandler(updateDisplay)
    .displayMasteryData(assignments);
}


/**
 * Handler for the importMasteryData click response. 
 */
function importMasteryData_onclick() {
  // Get the form data.
  var assignments = getValues_('input[name="assignment"]');
  var lgNums = getValues_('select[name="learningGoals"]');
  var lgNames = getValues_('input[name="lgName"]');
  var retakes = getCheckboxStatus_('retake');
  showLoading_('Importing scores. Do not close this window.');
  google.script.run
    .withSuccessHandler(updateDisplay)
    .importMasteryData(assignments, lgNums, lgNames, retakes);
}