angular.module('starter.controllers', ['starter.services', 'angularPaho', 'chart.js']) 

.controller('WeatherCtrl', function($scope, $timeout, $http, $state, MqttClient) {
  $scope.CurrentDate = new Date();
  MqttClient.subscribe("/home/weather");
  function sleep(ms) {
    return new Promise(resolve => $timeout(resolve, ms));
  }
  async function getMessage() {
    var times = [];
    var temps = [];
    var hums = [];

    var lastTimestamp = "";
    while (true) {
      await sleep(2000);   // Sleep in loop
      if (MqttClient.message.payloadString.length > 0 && MqttClient.message.destinationName == "/home/weather") {
        let messageJson = JSON.parse(MqttClient.message.payloadString);
        if (messageJson.timestamp != lastTimestamp){
          $scope.$apply(function () {
            var ts = new Date(messageJson.timestamp)
            $scope.weatherData = {
              timestamp: ts.toLocaleString(),
              temperature: parseInt(messageJson.temperature),
              humidity: parseInt(messageJson.humidity)
            }
          })
        }
        lastTimestamp = messageJson.timestamp;
      }
    }
  }

  console.log("Entra al controller weather");
  getMessage();

})

.controller('RangeCtrl', function($scope, MqttClient) {
  $scope.CurrentDate = new Date();
  MqttClient.subscribe("/home/range");
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Chart
  $scope.time = [0];
  // ["0s", "5s", "10s", "15s", "20s", "25s", "30s"];
  $scope.data = [0];
  //  [20, 25, 18, 19, 16, 15, 12]
  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };
  $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }];
  $scope.options = {
    scales: {
      yAxes: [
        {
          id: 'y-axis-1',
          type: 'linear',
          display: true,
          position: 'left'
        }
      ]
    }
  };

  async function getMessage() {

    console.log("Entra getMessage de range");
    let lastTimestamp = '';
    while (true) {
      await sleep(2000);   // Sleep in loop
      if (MqttClient.message.destinationName == "/home/range") {
        let messageJson = JSON.parse(MqttClient.message.payloadString);
        if (messageJson.timestamp != lastTimestamp){
          $scope.$apply(function () {
            $scope.rangeData = {
              distance: parseInt(messageJson.range)
            }
          })
        }
        
        $scope.time.push(messageJson.timestamp);
        $scope.data.push($scope.rangeData.distance);
        lastTimestamp = messageJson.timestamp;
        console.log(`Time chart : ${$scope.time}`);
        console.log(`Data received: ${$scope.data}`)
      }
    }
  }
  getMessage();
  
})

.controller('LightingCtrl', function($scope, $rootScope, MqttClient, TokenService, $ionicPopup) {
   $scope.ledOn = function () {
    TokenService.checkToken($scope.username).then(
      function (){
        message = new Paho.MQTT.Message("true");
        message.destinationName = "/home/lighting/on";
        MqttClient.send(message);
      },
      function (err) {
        console.log("error" + err.toString());
        $ionicPopup.alert({
          title: 'EXPIRED TOKEN',
          content: 'Unauthorized to realize this action, you must generate a new valid token!'
        });
      }
    );
  }
  $scope.username = {
    username: $rootScope.credentials.user,
  };
  
  $scope.ledOff = function () {
    TokenService.checkToken($scope.username).then(
      function (){
        message = new Paho.MQTT.Message("false");
        message.destinationName = "/home/lighting/off";
        MqttClient.send(message);
      },
      function (err) {
        console.log("error" + err.toString());
        $ionicPopup.alert({
          title: 'EXPIRED TOKEN',
          content: 'Unauthorized to realize this action, you must generate a new valid token!'
        });
      }
    );
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function getMessage() {
    // Sleep in loop
    while (true) {
      await sleep(2000);
      if (MqttClient.message.destinationName == "led/1/state") {
        let messageJson = JSON.parse(MqttClient.message.payloadString);
        $scope.$apply(function () {
          $scope.ledState = messageJson;
        })
      }
    }
  }

  getMessage();
})

.controller('AuthCtrl', function ($rootScope, $scope, $state, $ionicHistory, User, $ionicPopup, ClienteSingleton) {
  console.log(`LLega al inicio del controller authctrl!`);
  $rootScope.credentials = {
    user: '',
    password: ''
  };

  $rootScope.auth = function () {
    console.log("Entrando a la funcion auth()")
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
})

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
})

.controller('TokenCtrl', function ($scope, $rootScope, $state, $ionicPopup, TokenService) {
  console.log("Entrando al controller Token")
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

