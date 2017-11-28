document.addEventListener('DOMContentLoaded', function() {

	var csv_data = [];

	var upload_field = document.getElementById('upload_file');
	upload_field.addEventListener('change', function () {
		validateFile(this.files);
	});

	var zip_code_field = document.getElementById('zip_code_filter');
	zip_code_field.addEventListener('change', function () {
		// console.log($(this).val());
		buildZipCodeMap( unescape( $(this).val() ) );
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
	  		// Split the result to an array of lines
	  		var lines = this.result.split('\n');

		    // Split the lines themselves by the specified delimiter, such as a comma
		    var result = lines.map(function(line) {
		    	return line.split(',');
		    });

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
		    	for(j = 0; j < data.length; j++) {
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
		for(var i = csv_data.length - 1; i >= 0; i--) {
			zip_codes.push(csv_data[i][array_key]);
		}
		addMarkers(zip_codes);
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

});
