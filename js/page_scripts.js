document.addEventListener('DOMContentLoaded', function() {
    
	/*
	 * ESTABLISH PROJECT VARIABLES
	 */
	var csv_data = [];

	var upload_field = document.getElementById('upload_file');
	upload_field.addEventListener('change', function () {
		validateFile(this.files);
	});

	var zip_code_field = document.getElementById('zip_code_filter');
	zip_code_field.addEventListener('change', function () {
		buildZipCodeMap( unescape( $(this).val() ) );
		// buildSubscriberList();
	});

	/*
	 * VALIDATE THE FILE TYPE AND SIZE
	 */
	function validateFile(files) {
		if(files.length == 1) { // Only one file uploaded at a time
			var file = files[0];
			if(file.type == 'text/csv') { // File type must be .CSV
	  		if(file.size <= 26214400) { // File size must be less than 25MB
	  			var alert_bar = document.querySelector('.app-alert-bar');
	  			alert_bar.style.display = 'none';
	  			parseCSV(file).then(function(response){
	  				csv_data = response;
	  				buildSelectBox(Object.keys(response[0]));
	  			}).catch(function(){
	  				triggerAlertBar('There was an issue loading the file.');
	  			});
	  		} else {
	  			triggerAlertBar('Sorry, files must be less than 25MB.');
	  		}
	  	} else {
	  		triggerAlertBar('Sorry, only CSV files are allowed.');
	  	}
	  } else {
			triggerAlertBar('Sorry, only one file can be uploaded at a time.');
		}
	}

	 /*
	 * PARSE CSV FILE INTO ARRAY OF OBJECTS
	 */
	function parseCSV(file) {
		var reader = new FileReader();
		var result_object = [];

		return new Promise(function(resolve, reject) {
	  	reader.onload = function() {

		    var result = CSVToArray( this.result, ',' );

		    console.log(result);

		    // Remove empty values from array
		    var clean_result = [];
		    for(i = 0; i < result.length; i++) {
		    	if(result[i] != '') {
		    		clean_result[i] = result[i];
		    	}
		    }
		    result = clean_result;

		    // Create object with inline headers 
		    var keys = result[0]; 
		    for(i = 1; i < result.length; i++) { // offset by 1 for header row
		    	var data = result[i];
		    	var obj = {};
		    	for(j = 0; j < (data.length); j++) {
			    	obj[keys[j].trim()] = data[j].trim();
			    }
		    	result_object.push(obj);
		    };

		    resolve(result_object);
			}

			reader.onerror = function() {
	    	return reject(this);
	    };

			reader.readAsText(file);
		});
	}

	/*
	 * BUILD SELECT BOX FOR ZIP CODES
	 */
	function buildSelectBox(keys) {
		clearMarkers();

		var zip_code_filter = document.getElementById('zip_code_filter');
		var filter_options = document.getElementById('filter_options');

		var html = '<option value="" selected>--</option>';
		for(i = 0; i < keys.length; i++) {
			html = html + '<option value="' + escape(keys[i]) + '">' + keys[i] + '</option>';
		}
		zip_code_filter.innerHTML = html;
		filter_options.style.display = 'block';

		var loading_overlay = document.querySelector('.loading-overlay');
		loading_overlay.style.display = 'block';
		console.log('Waiting on user input...');
	}

	/*
	 * TRIGGER ALERT BAR W/ MESSAGE
	 */
	function triggerAlertBar(message) {
		var alert_bar = document.querySelector('.app-alert-bar');
	  alert_bar.style.display = 'block';
		alert_bar.textContent = message;
	}

	/*
	 * CONSTRUCT ZIP CODE MAP
	 */
	function buildZipCodeMap(key) {
		var zip_codes = [];
		var array_key = key;

		console.log('Assembling location data...');

		for(var i = csv_data.length - 1; i >= 0; i--) {
			zip_codes.push(csv_data[i][array_key]);
		}
		
		addMarkers(zip_codes, function(){
			var loading_overlay = document.querySelector('.loading-overlay');
		  loading_overlay.style.display = 'none';
		  console.log('Map data loaded.');
		});
	}

	/*
	 * DRAG & DROP FILE UPLOAD
	 */
	var isAdvancedUpload = function() {
	  var div = document.createElement('div');
	  return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
	}();

	if (isAdvancedUpload) {
		var droppedFiles = false;

	  var app_header = document.querySelector('.app-header');

	  addClass(app_header, 'has-advanced-upload');

	  ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach(function(e) {
	    app_header.addEventListener(e, function(e) {
		  	e.preventDefault();
		    e.stopPropagation();
		  });
	  });

	  ['dragover', 'dragenter'].forEach(function(e) {
	    app_header.addEventListener(e, function() {
		  	addClass(this, 'is-dragover');
		  });
	  });

	  ['dragleave', 'dragend', 'drop'].forEach(function(e) {
	    app_header.addEventListener(e, function() {
		  	removeClass(this, 'is-dragover');
		  });
	  });

	  app_header.addEventListener('drop', function(e) {
	  	droppedFiles = e.dataTransfer.files;
	    validateFile(droppedFiles);
	  });
	}

	// Add class helper
	function addClass(el, className) {
		if (el.classList)
		  el.classList.add(className);
		else
		  el.className += ' ' + className;
	}

	// Remove class helper
	function removeClass(el, className) {
		if (el.classList)
		  el.classList.remove(className);
		else
		  el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
	}

	/*
	 * Parse a delimited string into an array of arrays
	 */
  function CSVToArray( strData, strDelimiter ){
    // Check to see if the delimiter is defined. If not, then default to comma.
    strDelimiter = (strDelimiter || ",");

    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp((
      // Delimiters.
      "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

      // Quoted fields.
      "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

      // Standard fields.
      "([^\"\\" + strDelimiter + "\\r\\n]*))"
    ), "gi");

    // Create an array to hold our data. Give the array a default empty first row.
    var arrData = [[]];

    // Create an array to hold our individual pattern matching groups.
    var arrMatches = null;

    // Keep looping over the regular expression matches until we can no longer find a match.
    while (arrMatches = objPattern.exec( strData )){

      // Get the delimiter that was found.
      var strMatchedDelimiter = arrMatches[ 1 ];

      // Check to see if the given delimiter has a length
      // (is not the start of string) and if it matches
      // field delimiter. If id does not, then we know
      // that this delimiter is a row delimiter.
      if (
        strMatchedDelimiter.length &&
        strMatchedDelimiter !== strDelimiter
        ){

        // Since we have reached a new row of data,
        // add an empty row to our data array.
        arrData.push( [] );
      }

      var strMatchedValue;

      // Now that we have our delimiter out of the way, 
      // let's check to see which kind of value we 
      // captured (quoted or unquoted).
      if (arrMatches[ 2 ]){
        // We found a quoted value. When we capture this value, unescape any double quotes.
        strMatchedValue = arrMatches[ 2 ].replace( new RegExp( "\"\"", "g" ), "\"" );
      } else {
        // We found a non-quoted value.
        strMatchedValue = arrMatches[ 3 ];
      }

      // Now that we have our value string, let's add it to the data array.
      arrData[ arrData.length - 1 ].push( strMatchedValue );
    }

    // Return the parsed data.
    return( arrData );
  }

});
