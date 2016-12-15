// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('tabs', {
      url: '/tab',
      abstract: true,
      templateUrl: 'templates/tabs.html'
    })

    .state('tabs.home', {
      url: '/home',
      views: {
        'home-tab' : {
          templateUrl: 'templates/home.html'
        }
      }
    })

    .state('tabs.list', {
      url: '/list',
      views: {
        'list-tab' : {
          templateUrl: 'templates/list.html',
          controller: 'ListController'
        }
      }
    })

    .state('tabs.detail', {
      url: '/list/:aId',
      views: {
        'list-tab' : {
          templateUrl: 'templates/detail.html',
          controller: 'ListController'
        }
      }
    })
  
      .state('tabs.favdetail', {
      url: '/fav/:aId',
      views: {
        'calendar-tab' : {
          templateUrl: 'templates/detail.html',
          controller: 'ListController'
        }
      }
    })
  
  .state('tabs.map', {
      url: '/map',
      views: {
        'map-tab' : {
          templateUrl: 'templates/map.html',
            controller: 'MapController'
        }
      }
    })

    .state('tabs.calendar', {
      url: '/calendar',
      views: {
        'calendar-tab' : {
          templateUrl: 'templates/calendar.html',
          controller: 'CalendarController'
        }
      }
    })


  $urlRouterProvider.otherwise('/tab/home');
})

.controller('CalendarController', ['$scope', '$http', '$state', 'Fav',
    function($scope, $http, $state, Fav) {
        
        $scope.fav = Fav.getAllFavs();
        
        //for(var i=0;i < $scope.restaurants.length; i++ ) {
          //  console.log($scope.restaurants[i]);
        
       $scope.write = function() {
           console.log(Fav.getAllFavs());
       } 
        
      $scope.toggleStar = function(item) {
        item.star = !item.star;
      }

    
}])

.controller('ListController', ['$scope', '$http', '$state', 'Fav',
    function($scope, $http, $state, Fav) {
    
    $http.get('js/data.json').success(function(data) {
      $scope.restaurants = data.restaurants;
      $scope.whichartist=$state.params.aId;
      $scope.data = { showDelete: false, showReorder: false };

      $scope.doRefresh = function() {
      $http.get('js/data.json').success(function(data) {
          $scope.restaurants = data.restaurants;
          $scope.$broadcast('scroll.refreshComplete'); 
        });
      }

      $scope.toggleStar = function(item) {
        item.star = !item.star;
          if(item.star) {
              item.fav = true;
              Fav.addRest(item.shortname, {item});
              console.log(Fav.getAllFavs());
          } else {
              Fav.removeRest(item.shortname);
              console.log(Fav.getAllFavs());
          }
      }
    });
}])

.controller('MapController', ['$scope', '$http', '$state', 'Fav',
    function($scope, $http, $state, Fav) {
        77.597705
        $scope.latLng = new google.maps.LatLng(43.148378, -77.597705);
        var mapOptions = {
      center: $scope.latLng,
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
 
    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
    
    $http.get('js/data.json').success(function(data) {
    $scope.restaurants = data.restaurants;
        
    google.maps.event.addListenerOnce($scope.map, 'idle', function(){
    var markers = [];
    for(var i = 0; i<$scope.restaurants.length;i++) {
        
        $scope.latLngTemp = new google.maps.LatLng($scope.restaurants[i].lat, 
        $scope.restaurants[i].long);
        
        
        markers[i] = new google.maps.Marker({
          map: $scope.map,
        animation: google.maps.Animation.DROP,
          position: $scope.latLngTemp,
          title: $scope.restaurants.name,
            id: i
        });
        
        var infowindow = new google.maps.InfoWindow({
        content: $scope.restaurants[i].name
    });

    infowindow.open(map, markers[i]);
    google.maps.event.addListener(markers[i], 'click', function () {
    });
                
    }      
});
    
    })
}])

.factory('Fav', function() {
    var favs = {};
    
    return {
    addRest: function(fav, value){
    	favs[fav] = value;
    },
    getAllFavs: function(){
    	return favs;
        
    },
    removeRest: function(keyToDelete){
    	delete favs[keyToDelete];
    }
  }
});


