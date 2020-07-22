angular.module('token.controllers', ['starter.services', 'angularPaho', 'chart.js']) 

.controller('TokenCtrl', function ($scope, $rootScope, $state, $ionicPopup, TokenService) {
  $scope.username = {
    username: $rootScope.credentials.user,
  };
  // check token valid
  function isValid() {
    TokenService.checkToken($scope.username).then(
      function (respuesta) {
        $ionicPopup.alert({
          title: 'VALID TOKEN',
          content: 'You are authorized to manage actuators'
        })
      },
      function (err) {
        console.log("error" + err.toString());
        $ionicPopup.alert({
          title: 'EXPIRED TOKEN',
          content: 'You need to generate a new token!'
        })
      }
    );
  }
  isValid();

  // generate new token by button
  $scope.generateNewToken = function () {
    TokenService.generateToken($scope.username).then(
      function (respuesta) {
        $ionicPopup.alert({
          title: 'NEW TOKEN GENERATED',
          content: 'You have been  authorized to manage actuators now!'
        })
      },
      function (err) {
        console.log("error" + err.toString());
        $ionicPopup.alert({
          title: 'NOT FOUND',
          content: 'Cant generate a new token.'
        })
      }
    );
  }
})

