angular.module('dinnerDaddy.location', [])

.controller('locationController', function ($scope, $rootScope, $location, $cookies, LocationFactory) {

  $scope.username = $cookies.get('name');

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

  /* Dummy data for user/restaurant distances */
  var userData = [
    {
      username: 'Gar Lee',
      location: [38, -122.4]
    },
    {
      username: 'Albert Huynh',
      location: [37.1, -122.2]
    },
    {
      username: 'Akshay Buddiga',
      location: [37.2, -122.1]
    }
  ]

  var restaurant = {
    name: 'PhoKing',
    location: [35, -122]
  };

  setTimeout(LocationFactory.getDistance(userData, restaurant), 1000)
  /* ---- End of Dummy data ----- */
  
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
    var usercoordinates = [position.coords.latitude, position.coords.longitude];

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


  var getDistance = function (userData, restaurant) {

    // var query = {
    //   origins: [],
    //   destinations: restaurant.location,
    //   travelMode: google.maps.TravelMode.WALKING,
    //   unitSystem: google.maps.UnitSystem.IMPERIAL
    // }

    // //preparing all users locations to the query
    // for (var i=0; i < userData.length; i++) {
    //   query.origins.push(userData[i].location)
    // }

    // var distanceMatrix = new google.maps.DistanceMatrixService();
    // var directionService = new google.maps.DirectionsService();
    // var directionRenderer = new google.maps.DirectionsRenderer({preserveViewport: true});

    // directionRenderer.setMap(map);

    // var origin1 = new google.maps.LatLng(55.930385, -3.118425)
    // console.log('origin1: ', origin1)

    // distanceMatrix.getDistanceMatrix(query, function (response, status) {
    //   if (status === 'OK') {
    //     console.log('response: ', response.rows)
    //   }
    // });
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