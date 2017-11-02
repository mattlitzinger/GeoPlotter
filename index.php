<!doctype html>
<html class="no-js" lang="">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>GeoPlotter</title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0">

    <link rel="manifest" href="site.webmanifest">
    <link rel="apple-touch-icon" href="icon.png">
    <!-- Place favicon.ico in the root directory -->

    <link rel="stylesheet" href="style.css">
  </head>
  <body>
  	<header class="app-header">
  		<div class="wrap">
  			<h1><span>Geo</span>Plotter</h1>
  			<p>Visualize location data for your fans and subscribers. Upload a file to get started.</p>
				<form class="file-upload-form" method="POST" enctype="multipart/form-data">
			    <input class="inputfile" type="file" name="upload_file" id="upload_file"><br>
			    <label class="button" for="upload_file">Upload .CSV File</label>
				</form>
  		</div>
  	</header><!-- .app-header -->

  	<div class="app-alert-bar">
  		<div class="wrap">
				<div class="app-alert-bar-inner"></div>
			</div>
  	</div><!-- .app-alert-bar -->

    <div id="filter_options" class="app-filter-bar">
      <label for="zip_code_filter">Which column contains your Zip Codes?</label>
      <select id="zip_code_filter" name="zip_code_filter"></select>
    </div>

  	<div class="app-content">
			<div class="wrap">
				<div class="map-container">
          <div id="map"></div>
        </div>
			</div>
  	</div><!-- .app-content -->

  	<footer class="app-footer">
  		<div class="wrap">
				<p>Created with <i>&#9829;</i> by <a href="https://mlitzinger.com" target="_blank">Matt Litzinger</a>.</p>
			</div>
  	</footer><!-- .app-footer -->

		<script src="https://code.jquery.com/jquery-3.2.1.min.js" integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4=" crossorigin="anonymous"></script>
    <script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAlFG419Vy83pr6a6NA1GmXiJZI3fNLm3E"></script>
    <script src="https://cdn.rawgit.com/googlemaps/js-marker-clusterer/gh-pages/src/markerclusterer.js"></script>
		<script src="js/page_scripts.js"></script>
    <script src="js/google_maps.js"></script>

  	<!-- Google Analytics: change UA-XXXXX-Y to be your site's ID. -->
    <script>
      window.ga=function(){ga.q.push(arguments)};ga.q=[];ga.l=+new Date;
      ga('create','UA-XXXXX-Y','auto');ga('send','pageview')
    </script>
    <script src="https://www.google-analytics.com/analytics.js" async defer></script>
  </body>
</html>