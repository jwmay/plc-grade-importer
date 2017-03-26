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
    .displayGradebooksForRemoval();
});


/**
 * Handler for the selectGradebooks click response. 
 */
function selectGradebooksForRemoval_onclick() {
  var gradebooks = getCheckedBoxes_('gradebooks');
  var removeFiles = getCheckedBoxes_('removeFiles')[0] === 'remove' ? true : false;
  showLoading();
  google.script.run
    .withSuccessHandler(updateDisplay)
    .removeGradebooks(gradebooks, removeFiles);
}