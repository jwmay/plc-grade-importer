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
 * Open a dialog window using an HTML template with the given dimensions.
 * 
 * @param {string} source Name of the HTML template file.
 * @param {string} title Title to display on dialog window.
 * @param {integer} width Width of dialog window.
 * @param {integer} height Height of dialog window.
 */
function showDialog(source, title, width, height) {
  var ui = HtmlService.createTemplateFromFile(source)
      .evaluate()
      .setWidth(width)
      .setHeight(height);
  SpreadsheetApp.getUi().showModalDialog(ui, title);
}


/**
 * Open a sidebar using an HTML template.
 * 
 * @param {string} source Name of the HTML template file.
 * @param {string} title Title to display on sidebar.
 */
function showSidebar(source, title) {
  var ui = HtmlService.createTemplateFromFile(source)
      .evaluate()
      .setTitle(title);
  SpreadsheetApp.getUi().showSidebar(ui);
}


/**
 * Insert any HTML file in the project into an outer HTML file.
 * Called from within the outer HTML file.
 * 
 * @param {String} filename Name of the file in the project.
 *    Do not include ".html".
 * @return {String} HTML markup for the requested file.
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}