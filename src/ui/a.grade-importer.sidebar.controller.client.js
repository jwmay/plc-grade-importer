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


function loadGradebooks_onclick() {
  google.script.run
      .showPicker();
}


function importScores_onclick() {
  google.script.run
      .importScores();
}


function runCleanup_onclick() {
  google.script.run
      .runCleanup();
}


// Not being used right now---steps in sidebar are never obscured.
function advanceStep() {
  var $loadGradebooks = $('#loadGradebooks');
  var $importScores = $('#importScores');
  var $removeSheets = $('#removeSheets');

  if (!$loadGradebooks.hasClass('complete') && 
          $importScores.hasClass('hidden')) {
    $loadGradebooks.addClass('complete');
    $importScores.removeClass('hidden');

  } else if (!$importScores.hasClass('hidden')) {
    $importScores.addClass('complete');
    $removeSheets.removeClass('hidden');

  } else if ($importScores.hasClass('complete')) {
    resetSidebar();
  }
}


// Not being used right now---steps in sidebar are never obscured.
function resetSidebar() {
  var $loadGradebooks = $('#loadGradebooks');
  var $importScores = $('#importScores');
  var $removeSheets = $('#removeSheets');

  $loadGradebooks.removeClass('complete');
  $importScores.removeClass('complete').addClass('hidden');
  $removeSheets.addClass('hidden');
}