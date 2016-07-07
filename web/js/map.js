var geocoder;
var map;
var marker;
var currentInput;
var currentInput2;
var infowindow = new google.maps.InfoWindow({size: new google.maps.Size(150, 50)});
function initialize() {
    geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(50.529, 30.517);
    var mapOptions = {
        zoom: 5,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        rotateControl: false,
    };
    map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
    google.maps.event.addListener(map, 'click', function () {
        infowindow.close();
    });

    autocomplete = new google.maps.places.Autocomplete(
        /** @type {!HTMLInputElement} */(document.getElementById('address')),
        {types: ['geocode']});

    autocomplete.addListener('place_changed', function () {
        codeAddress('address');
    });
}

function clone(obj) {
    if (obj == null || typeof(obj) != 'object') return obj;
    var temp = new obj.constructor();
    for (var key in obj) temp[key] = clone(obj[key]);
    return temp;
}

var getLatLng = function(lat, lng) {
    return new google.maps.LatLng(lat, lng);
};

var markers = {};

var getMarkerUniqueId = function(lat, lng) {
    return lat + '_' + lng;
}


function geocodePosition(pos, inputId) {
    currentInput = inputId;
    geocoder.geocode({
        latLng: pos
    }, function (responses) {
        if (responses && responses.length > 0) {
            marker.formatted_address = responses[0].formatted_address;
        } else {
            marker.formatted_address = 'Адрес не понятен';
        }
        infowindow.setContent(marker.formatted_address);
        // infowindow.open(map, marker);

        document.getElementById(currentInput).value = marker.formatted_address;
    });
}

function codeAddress(inputId) {
    var address = document.getElementById(inputId).value;
    geocoder.geocode({'address': address}, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            map.setCenter(results[0].geometry.location);
            map.fitBounds(results[0].geometry.viewport);

            marker = markers[inputId];

            if(!marker) {
                var pinColor = Math.floor(Math.random() * 16777215).toString(16);
                var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
                    new google.maps.Size(21, 34),
                    new google.maps.Point(0, 0),
                    new google.maps.Point(10, 34));
                var pinShadow = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_shadow",
                    new google.maps.Size(40, 37),
                    new google.maps.Point(0, 0),
                    new google.maps.Point(12, 35));

                marker = new google.maps.Marker({
                    map: map,
                    draggable: true,
                    position: results[0].geometry.location,
                    icon: pinImage,
                    shadow: pinShadow,
                    id: 'marker_' + inputId
                });
            }else {
                marker.setPosition(results[0].geometry.location);
            }

            markers[inputId] = marker;

            google.maps.event.addListener(marker, 'dragend', function () {
                // updateMarkerStatus('Drag ended');
                geocodePosition(this.getPosition(), inputId);
            });
            google.maps.event.addListener(marker, 'click', function () {
                if (marker.formatted_address) {
                    infowindow.setContent(marker.formatted_address);
                } else {
                    infowindow.setContent(address);
                }
                infowindow.open(map, marker);
            });
            // google.maps.event.trigger(marker, 'click');
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}


//======Autocomplete=====
// This example displays an address form, using the autocomplete feature
// of the Google Places API to help users fill in the information.

var autocomplete, autocomplete2;

// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
function geolocate() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var geolocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            var circle = new google.maps.Circle({
                center: geolocation,
                radius: position.coords.accuracy
            });
            autocomplete.setBounds(circle.getBounds());
        });
    }
}

$(document).ready(function ($) {
    initialize();
});