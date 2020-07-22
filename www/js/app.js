// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'weather.controllers', 'token.controllers', 'register.controllers', 
  'starter.services', 'range.controllers', 'lighting.controllers', 'auth.controllers'])

.run(function($ionicPlatform, $rootScope, $state, User) { 

    $rootScope.$on('$stateChangeStart', function (event, toState) {
      if (!User.isLoggedIn() && toState.name !== 'auth') {         //Si no estamos logeados vamos al estado login.
        if (toState.name !== 'register') {
          event.preventDefault();
          $state.go('auth');
        }
      }
    });

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs).
    // The reason we default this to hidden is that native apps don't usually show an accessory bar, at
    // least on iOS. It's a dead giveaway that an app is using a Web View. However, it's sometimes
    // useful especially with forms, though we would prefer giving the user a little more room
    // to interact with the app.
    if (window.cordova && window.Keyboard) {
      window.Keyboard.hideKeyboardAccessoryBar(true);
    }

    if (window.StatusBar) {
      // Set the statusbar to use the default style, tweak this to
      // remove the status bar on iOS or change it to use white instead of dark colors.
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('auth', {
    url: '/',
    templateUrl: 'templates/auth.html',
    controller: 'AuthCtrl'
  })
  
  // register user
  .state('register', {
    url: '/register',
    templateUrl: 'templates/register.html',
    controller: 'RegisterCtrl'
  })

  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  .state('tab.weather', {
    url: '/weather',
    views: {
      'tab-weather': {
        templateUrl: 'templates/tab-weather.html',
        controller: 'WeatherCtrl'
      }
    }
  })

  .state('tab.range', {
    url: '/range',
    views: {
      'tab-range': {
        templateUrl: 'templates/tab-range.html',
        controller: 'RangeCtrl'
      }
    }
  })

  .state('tab.lighting', {
    url: '/lighting',
    views: {
      'tab-lighting': {
        templateUrl: 'templates/tab-lighting.html',
        controller: 'LightingCtrl'
      }
    }
  })

  .state('tab.token', {
    url: '/token',
    views: {
      'tab-token': {
        templateUrl: 'templates/tab-token.html',
        controller: 'TokenCtrl'
      }
    }
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/weather');

});
