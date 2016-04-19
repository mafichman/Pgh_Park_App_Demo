// Leaflet map setup
var map = L.map('map', {
  center: [40.444413, -79.98771220],
  zoom: 13,
  zoomControl: false
});

var Stamen_TonerLite = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
}).addTo(map);

//toggle the map
// $(function() {
//   var $body = $('body');
//   $('#toggle-sidebar').click(function() {
//     $body.toggleClass('sidebar-open');
//   });
// });

// Leaflet draw setup
var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

// Initialise the draw control and pass it the FeatureGroup of editable layers
var drawControl = new L.Control.Draw({
  edit: {
    featureGroup: drawnItems
  },
  draw: {
    polyline: false,
    polygon: false,
    circle: false,
    rectangle: false,
  }
});

var inputID;
var marker;

$('#AddressForm').keypress(function(e){
var query = $('#AddressForm').val();
if (e.keyCode == 13) {
console.log(query);
    $.ajax({
      url: "http://nominatim.openstreetmap.org/search?format=json&addressdetails=0&limit=1&countrycodes=US&q="+query+" pittsburgh pa",
    }).done(function(data) {
      if(marker){map.removeLayer(marker);}
      var latitude = _.first(data).lat;
      var longitude = _.first(data).lon;
      console.log(latitude);
      console.log(longitude);
      marker = L.marker([latitude, longitude]);
      map.setView([latitude,longitude],16);
      map.addLayer(marker);
      nClosest(marker._latlng, 4);
    });
  }
});

//Geolocation button
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    marker = L.marker([lat, lon]);
    map.setView([lat,lon],16);
    map.addLayer(marker);
}

function mapLocation(){
    if(marker){map.removeLayer(marker);}
    var latitude = _.first(data).lat;
    var longitude = _.first(data).lon;
    console.log(latitude);
    console.log(longitude);  
}

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert ("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert ("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert ("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert ("An unknown error occurred.");
            break;
    }
}

// Handling the creation of Leaflet.Draw layers
// Note here, the use of drawnLayerID - this is undoubdtedly the way you should approach
//  remembering and removing layers
// var drawnLayerID;
// map.addControl(drawControl);
// map.on('draw:created', function (e) {
//   var type = e.layerType;
//   var layer = e.layer;
//   //console.log('draw created:', e);
//
//   if (type === 'marker') {
//     if(marker){map.removeLayer(marker);}
//     nClosest(layer._latlng, 4);
//     map.setView(layer._latlng, 16);
//   }
//
//   if (drawnLayerID) { map.removeLayer(map._layers[drawnLayerID]); }
//   map.addLayer(layer);
//   drawnLayerID = layer._leaflet_id;
// });

// The viz.json output by publishing on cartodb
var layerUrl = 'https://mfichman.cartodb.com/api/v2/viz/4d2bbaa8-fb46-11e5-bf0b-0ecfd53eb7d3/viz.json';

// Use of CartoDB.js
cartodb.createLayer(map, layerUrl)
  .addTo(map)
  .on('done', function(layer) {
    // layer is a cartodb.js Layer object - can call getSubLayer on it!
    // console.log(layer);
    layer.on('featureClick', function(e, latlng, pos, data) {
      // nClosest(latlng[0], latlng[1], 10);
      // console.log(e, latlng, pos, data);
    });
  }).on('error', function(err) {
    // console.log(err):
  });
