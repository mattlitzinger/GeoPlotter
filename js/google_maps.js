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

function addMarkers(zip_codes) {
  infoWindow = new google.maps.InfoWindow();

  for (var i = 0; i < zip_codes.length; i++) {
    if( zip_codes[i] != '' ) {
      $.ajax({
        async: false,
        type: 'GET',
        url: 'https://maps.googleapis.com/maps/api/geocode/json?address='+zip_codes[i]+'&key=AIzaSyAlFG419Vy83pr6a6NA1GmXiJZI3fNLm3E',
        success: function(data) {
          if(data.results[0] != undefined) {
            var location = { lat: data.results[0].geometry.location.lat, lng: data.results[0].geometry.location.lng };

            locations.push(location);

            var marker = new google.maps.Marker({
              position: location,
            });
            markers.push(marker);

            google.maps.event.addListener(marker, 'click', function() {
              infoWindow.close();
              infoWindow.setContent('<div style="color:#333;">' + 
                '<strong>' + data.results[0].formatted_address + '</strong><br>' + 
                'lat: ' + data.results[0].geometry.location.lat + '<br>' + 
                'lng: ' + data.results[0].geometry.location.lng + '<br>' + 
                '</div>');
              infoWindow.open(map, marker);
            });
          }
        },
        error: function (response) {
          console.log(response);
        }  
      });
    }
  } 

  markerCluster = new MarkerClusterer(map, markers, {imagePath: 'https://cdn.rawgit.com/googlemaps/js-marker-clusterer/gh-pages/images/m'});
}

function clearMarkers() {
  if(markerCluster) {
    markerCluster.clearMarkers();
  }
  
  markers = [];

  document.getElementById('filter_options').style.display = 'none';
}

