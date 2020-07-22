angular
  .module('auth.controllers', ['starter.services', 'angularPaho', 'chart.js'])
  .controller('AuthCtrl', function ($rootScope, $scope, $state, $ionicHistory, User, $ionicPopup, ClienteSingleton) {
    $rootScope.credentials = {
      user: '',
      password: ''
    };
  
    $rootScope.auth = function () {
      User.auth($rootScope.credentials).then(
        function (respuesta) {
          $state.go('tab.weather');
        },
        function (err) {
          console.log("error" + err);
          $ionicPopup.alert({
            title: 'UNAUTHORIZED',
            content: 'Wrong credentials.'
          })
        }
      );
    }
  
    $scope.register = function (UserRegister) {
      $state.go('register');
    },
    function (err) {
      console.log("error" + err);
      $ionicPopup.alert({
        title: 'NOT FOUND',
        content: 'Page not found.'
      })
    }
  });vpn.tarjetanaranja.com.ar