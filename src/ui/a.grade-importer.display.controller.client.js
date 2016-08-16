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
 * Update the HTML of the #result div to show the given display. 
 * 
 * @param {string} display The HTML to display.
 */
function updateDisplay(display) {
  document.getElementById('result').innerHTML = display;
}


/**
 * Displays an error message within the #result element.
 *
 * @param {string} message The error message to display.
 */
function showError(message) {
  document.getElementById('result').innerHTML = '<h4 class="error">ERROR</h4>' +
          message;
  document.getElementById('result').className = 'error';
}


/**
 * Returns and HTML-formatted string to display the 'Close' button.
 */
function closeButton() {
  button = '<input type="button" value="Close" class="btn" onclick="google.script.host.close();">';
  return button;
}