angular.module('dinnerDaddy.location', [])

.controller('locationController', function ($scope, $location, $cookies, LocationFactory) {

  $scope.username = $cookies.get('name');
  
  /* Dummy data for user/restaurant distances */
  $scope.usersInGroup = [];

  var verify = function (username) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(LocationFactory.success);
    } else {
      console.error('User rejected location access');
    }
  };

  $scope.findDistance = function (users) {
    LocationFactory.findDistance(users)
    .then(function (distances) {
      //handle array of distances of each user to the target restaurant
    })
  };

  $scope.updateMode = function (mode) {
    if (document.getElementById('mode').value === 'driving') {
      LocationFactory.updateMode('driving');
    }
    if (document.getElementById('mode').value === 'walking') {
      LocationFactory.updateMode('walking');
    }
    if (document.getElementById('mode').value === 'bus') {
      LocationFactory.updateMode('bus');
    }
  };

  verify();
})

.factory('LocationFactory', function ($http, $cookies) {

  var username = $cookies.get('name');

  //default map location to SF
  var map = new google.maps.Map(document.getElementById('mapcontainer'), {
    center: {
      lat: 37.75,
      lng: -122.4
    },
    scrollwheel: false,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    zoom: 11
  });

  var info = new google.maps.InfoWindow();

/* 
The plan is to have a marker type specific to users, and a marker type for the designated restaurant
In a given session, each user will have unique coordinates and in the success function,
the coordinates will be fed into the server socket. The deployed version will give a shared socket,
so the coordinates for all group members can bubble up from server to each client */

  var success = function (position, username) {
    //gathering coordinates from user geolocation
    var coords = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    
    //setting up options for new google Maps Marker
    var marker = new google.maps.Marker({
      position: coords,
      title: username,
      map: map
    });
    google.maps.event.addListener(marker, 'click', (function (marker) {
      return function () {

        info.setContent($cookies.get('name'));
        info.open(map, marker);
      }
    })(marker));
  };

  var getDistance = function () {

  };

  var updateMode = function (mode) {
    console.log(mode)
  };

  return {
    success: success,
    getDistance: getDistance,
    updateMode: updateMode
  }

});