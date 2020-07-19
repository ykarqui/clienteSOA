angular.module('starter.controllers', ['starter.services', 'angularPaho']) /*, 'zingchart-angularjs'*/
//

.controller('WeatherCtrl', function($scope, $timeout, $http, $state, MqttClient) {   /**/
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
    console.log("Entra getMessage de waether");
    while (true) {
      await sleep(2000);   // Sleep in loop
      if (MqttClient.message.payloadString.length > 0 && MqttClient.message.destinationName == "/home/weather") {
        let messageJson = JSON.parse(MqttClient.message.payloadString);
        console.log(`LLEGA AL CONTROLLER WEATHER EL DATO : ${messageJson.timestamp}`)
        if (messageJson.timestamp != lastTimestamp){
          $scope.$apply(function () {
            var ts = new Date(messageJson.timestamp)
            $scope.weatherData = {
              timestamp: ts.toLocaleString(),
              temperature: parseInt(messageJson.temperature),
              humidity: parseInt(messageJson.humidity)
            }
            console.log(`Temperature: ${$scope.weatherData.temperature}`);
            console.log(`Humidity: ${$scope.weatherData.humidity}`);
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
  async function getMessage() {
    // var times = [];
    var distance = [];

    var lastTimestamp = "";
    console.log("Entra getMessage de range");
    while (true) {
      await sleep(2000);   // Sleep in loop
      if (MqttClient.message.destinationName == "/home/range") {
        let messageJson = JSON.parse(MqttClient.message.payloadString);
        console.log(`LLEGA AL CONTROLLER RANGE EL DATO : ${messageJson.timestamp}`)
        if (messageJson.timestamp != lastTimestamp){
          $scope.$apply(function () {
            //var ts = new Date(messageJson.timestamp)
            $scope.rangeData = {
              //timestamp: ts.toLocaleString(),
              distance: parseInt(messageJson.range)
            }
            //times.push(messageJson.timestamp);
            console.log(`Range: ${$scope.rangeData.distance}`);
          })
        }
        lastTimestamp = messageJson.timestamp;
      }
    }
  }

  console.log("Entra al controller range");
  getMessage();
})

.controller('LightingCtrl', function($scope, MqttClient) {
   $scope.ledOn = function () {
    message = new Paho.MQTT.Message("true");
    message.destinationName = "/home/lighting/on";
    MqttClient.send(message);
  }


  $scope.ledOff = function () {
    message = new Paho.MQTT.Message("false");
    message.destinationName = "/home/lighting/off";
    MqttClient.send(message);
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
  $scope.credentials = {
    user: '',
    password: ''
  };

  $scope.auth = function () {
    console.log("Entrando a la funcion auth()")
    User.auth($scope.credentials).then(
      function (respuesta) {
        $ionicHistory.nextViewOptions({ historyRoot: true });
        console.log(`Paso authctrl`);
        $state.go('tab.weather');
        console.log(`Paso weather`);
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
    console.log("Entrando a la funcion register()")
    $state.go('register');
    console.log("Pasando a la funcion register()")
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
  console.log("Entrando al controller Register")
  $scope.nu = {
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    mail: ''
  };

  $scope.registerUser = function () {
    console.log(`username ${$scope.nu.username}`);
    console.log(`password ${$scope.nu.password}`);
    console.log(`firstName ${$scope.nu.firstName}`);
    console.log(`lastName ${$scope.nu.lastName}`);
    console.log(`mail ${$scope.nu.mail}`);

    UserRegister.registerService($scope.nu).then(
      function (respuesta) {
        // $ionicHistory.nextViewOptions({ historyRoot: true });
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

