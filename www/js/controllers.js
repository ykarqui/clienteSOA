angular.module('starter.controllers', ['starter.services', 'angularPaho']) /*, 'zingchart-angularjs'*/
//

.controller('WeatherCtrl', function($scope, $http, $state, MqttClient) {   /**/
  $scope.CurrentDate = new Date();
  MqttClient.subscribe("/home/weather");
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
        console.log(`LLEGA AL CONTROLLER WEATHER EL DATO : ${messageJson}`)
        if (messageJson.timestamp != lastTimestamp){
          $scope.$apply(function () {
            var ts = new Date(messageJson.timestamp)
            $scope.weatherData = {
              timestamp: ts.toLocaleString(),
              temperature: parseInt(messageJson.temperature),
              humidity: parseInt(messageJson.humedity)
            }
            console.log(`Temperature: ${temperature}`);
            console.log(`Humidity: ${humedity}`);
            times.push(messageJson.timestamp);
            temps.push(parseInt(messageJson.temperature));
            hums.push(parseInt(messageJson.humidity));

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
        console.log(`LLEGA AL CONTROLLER RANGE EL DATO : ${messageJson}`)
        if (messageJson.timestamp != lastTimestamp){
          $scope.$apply(function () {
            //var ts = new Date(messageJson.timestamp)
            $scope.rangeData = {
              //timestamp: ts.toLocaleString(),
              distance: parseInt(messageJson)
            }
            //times.push(messageJson.timestamp);
            distance.push(parseInt(messageJson));
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
    User.auth($scope.credentials).then(
      function (respuesta) {
        $ionicHistory.nextViewOptions({ historyRoot: true });
        console.log(`Llega al controller de aythctrl`);
        $state.go('tab.weather');
        //var cliente = ClienteSingleton;
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
})
