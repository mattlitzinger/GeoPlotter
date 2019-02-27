var map;
var locations = [];
var markers = [];
var markerCluster;
var infoWindow;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 3,
    center: new google.maps.LatLng(40.7586, -73.9852),
    mapTypeControl: false, 
    streetViewControl: false,
    scaleControl: false,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: [{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#d3d3d3"}]},{"featureType":"transit","stylers":[{"color":"#808080"},{"visibility":"off"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"visibility":"on"},{"color":"#b3b3b3"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"weight":1.8}]},{"featureType":"road.local","elementType":"geometry.stroke","stylers":[{"color":"#d7d7d7"}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#ebebeb"}]},{"featureType":"administrative","elementType":"geometry","stylers":[{"color":"#a7a7a7"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#efefef"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#696969"}]},{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"visibility":"on"},{"color":"#737373"}]},{"featureType":"poi","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"color":"#d6d6d6"}]},{"featureType":"road","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"color":"#dadada"}]}]
  });
}

function addMarkers(zip_codes, callback) {
  clearMarkers();

  console.log('Loading map data...');

  infoWindow = new google.maps.InfoWindow();

  // console.log(JSON.stringify(zip_codes));

  // var locations = [
  //   {"lat":37.42509,"lng":-122.1675},
  //   {"lat":39.848539,"lng":-74.953498},
  //   {"lat":38.018054,"lng":-76.68611},
  //   {"lat":39.582222,"lng":-104.955576},
  //   {"lat":40.119897,"lng":-82.377784},
  //   {"lat":34.10084,"lng":-117.76784},
  //   {"lat":29.800187,"lng":-95.328888},
  //   {"lat":42.500187,"lng":-71.575864},
  //   {"lat":36.169273,"lng":-115.282751},
  //   {"lat":36.169273,"lng":-115.282751},
  //   {"lat":32.562179,"lng":-86.099371},
  //   {"lat":33.615485,"lng":-111.952235},
  //   {"lat":36.862209,"lng":-119.760793},
  //   {"lat":34.660866,"lng":-86.560608},
  //   {"lat":35.11125,"lng":-81.22646},
  //   {"lat":45.391278,"lng":-121.143152}
  // ];

  var xhr = new XMLHttpRequest();
  var url = 'https://api.geocod.io/v1.3/geocode?api_key=' + config.GEOCODIO_KEY;

  xhr.open('POST', url, true);
  xhr.setRequestHeader('Content-type', 'application/json');

  xhr.onreadystatechange = function() {
    if( xhr.readyState === 4 && xhr.status == 200 ) {
      var data = JSON.parse(xhr.responseText);
      console.log(data);

      for (var i = 0; i < data.results.length; i++) {
        if(data.results[i].response.results.length > 0 && data.results[i].response.results != undefined) {
          var location = { lat: data.results[i].response.results[0].location.lat, lng: data.results[i].response.results[0].location.lng };

          locations.push(location);

          var marker = new google.maps.Marker({
            position: location,
          });

          markers.push(marker);

          var infoWindowContent = '<div style="color:#333;">' + 
              '<strong>' + data.results[i].response.results[0].formatted_address + '</strong><br>' + 
              'lat: ' + data.results[i].response.results[0].location.lat + '<br>' + 
              'lng: ' + data.results[i].response.results[0].location.lng + '<br>' + 
            '</div>';

          google.maps.event.addListener(marker, 'click', (function(marker, infoWindowContent, infoWindow){ 
            return function() {
              infoWindow.close();
              infoWindow.setContent(infoWindowContent);
              infoWindow.open(map, marker);
            };
          })(marker, infoWindowContent, infoWindow));
        }
      }

      console.log(JSON.stringify(locations));

      markerCluster = new MarkerClusterer(map, markers, {imagePath: 'https://cdn.rawgit.com/googlemaps/js-marker-clusterer/gh-pages/images/m'});

      callback();

    } else {
      console.error(xhr.responseText.results.response);
    }
  }

  xhr.send(JSON.stringify(zip_codes));
}

function clearMarkers() {
  if(markerCluster != undefined) {
    markerCluster.clearMarkers();
  }
  
  locations = [];
  markers = [];

  document.getElementById('filter_options').style.display = 'none';
}

