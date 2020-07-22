angular.module('register.controllers', ['starter.services', 'angularPaho', 'chart.js']) 
.controller('RegisterCtrl', function ($scope, $state, $ionicPopup, UserRegister) {
    $scope.nu = {
      username: '',
      password: '',
      firstName: '',
      lastName: '',
      mail: ''
    };
    $scope.registerUser = function () {
  
      UserRegister.registerService($scope.nu).then(
        function (respuesta) {
          $state.go('auth');
        },
        function (err) {
          console.log("error" + err.toString());
          $ionicPopup.alert({
            title: 'NOT FOUND',
            content: 'Cant redirect to Login page.'
          })
        }
      );
    }
  });