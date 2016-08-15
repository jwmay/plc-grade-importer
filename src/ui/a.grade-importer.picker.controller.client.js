    var DEVELOPER_KEY = 'AIzaSyCgyLaEarqrUnu9jmF82pl2R4WD_ywry2Q';
    var DIALOG_DIMENSIONS = {width: 600, height: 425};
    var pickerApiLoaded = false;


    /**
     * Loads the Google Picker API.
     */
    function onApiLoad() {
      gapi.load('picker', {
        'callback': function() {
          pickerApiLoaded = true;
        }
      });
      google.script.run
          .withSuccessHandler(createPicker)
          .withFailureHandler(showError)
          .getOAuthToken();
    }


    /**
     * Creates a Picker that can access the user's spreadsheets. This function
     * uses advanced options to hide the Picker's left navigation panel and
     * default title bar.
     *
     * @param {string} token An OAuth 2.0 access token that lets Picker access
     *     the file type specified in the addView call.
     */
    function createPicker(token) {
      if (pickerApiLoaded && token) {
        var picker = new google.picker.PickerBuilder()
            
            // Allow user to upload documents to a selected Google Drive folder.
            .addView(new google.picker.DocsUploadView()
                .setIncludeFolders(true))
            
            // Instruct Picker to display *.csv files only.
            .addView(new google.picker.View(google.picker.ViewId.DOCS)
                .setQuery('*.csv'))
            
            // Allow user to choose more than one document in the picker.
            .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
            
            // Hide title bar since an Apps Script dialog already has a title.
            .hideTitleBar()
            
            .setOAuthToken(token)
            .setDeveloperKey(DEVELOPER_KEY)
            .setCallback(pickerCallback)
            .setOrigin(google.script.host.origin)
            
            // Instruct Picker to fill the dialog, minus 2 px for the border.
            .setSize(DIALOG_DIMENSIONS.width - 2,
                DIALOG_DIMENSIONS.height - 2)
            .build();

        picker.setVisible(true);
      } else {
        showError(
          '<p>Unable to load the file picker. Please try again.</p>' +
          closeButton()
        );
      }
    }


    /**
     * A callback function that extracts the chosen document's metadata from the
     * response object. For details on the response object, see
     * https://developers.google.com/picker/docs/results
     *
     * @param {object} data The response object.
     */
    function pickerCallback(data) {
      if (data.action == google.picker.Action.PICKED) {
        updateDisplay('<em>Importing...</em>');
        google.script.run
            .withSuccessHandler(updateDisplay)
            .loadSelectedFiles(data.docs);
      } else if (data.action == google.picker.Action.CANCEL) {
        var close = '<p>Load gradebooks canceled. You may close this window.</p>';
        close += closeButton();
        updateDisplay(close);
      }
    }


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
      var button = [];
      button.push('<div class="block">');
      button.push('<input type="button" value="Close" class="btn" onclick="google.script.host.close();">');
      button.push('</div>');
      return button.join('');
    }