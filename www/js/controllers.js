angular.module('starter.controllers', ['starter.services', 'angularPaho']) /*, 'zingchart-angularjs'*/
//

.controller('WeatherCtrl', function($scope, $http, $state, MqttClient) {   /**/
  $scope.CurrentDate = new Date();
  MqttClient.subscribe("/home/weather");
  $http.get('http://192.168.0.178:8093/cse/v1/user/weather')
  .then(function(response) {

      $scope.weatherData = response.data;
      $scope.tmp = angular.fromJson($scope.weatherData);

    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  });


  /* async function getMessage() {
    var times = [];
    var temps = [];
    var hums = [];

    $scope.historial = {
      backgroundColor: "#434343",
      backgroundColor: "#434343",
      globals: {
        shadow: false,
        fontFamily: "Helvetica"
      },
      type: 'line',
      legend: {
        layout: "x4",
        backgroundColor: "transparent",
        borderColor: "transparent",
        marker: {
          borderRadius: "50px",
          borderColor: "transparent"
        },
        item: {
          fontColor: "white"
        }
      },
      scaleX: {
        maxItems: 8,
        transform: {
          type: 'date'
        },
        zooming: false,
        values: times,
        lineColor: "white",
        lineWidth: "1px",
        tick: {
          lineColor: "white",
          lineWidth: "1px"
        },
        item: {
          fontColor: "white"
        },
        guide: {
          visible: false
        }
      },
      scaleY: {
        lineColor: "white",
        lineWidth: "1px",
        tick: {
          lineColor: "white",
          lineWidth: "1px"
        },
        guide: {
          lineStyle: "solid",
          lineColor: "#626262"
        },
        item: {
          fontColor: "white"
        }
      },
      tooltip: {
        visible: false
      },
      crosshairX: {
        scaleLabel: {
          backgroundColor: "#fff",
          fontColor: "black"
        },
        plotLabel: {
          backgroundColor: "#434343",
          fontColor: "#FFF",
          _text: "Number of hits : %v"
        }
      },
      plot: {
        lineWidth: "2px",
        aspect: "spline",
        marker: {
          visible: false
        }
      },
      series: [
        { values: hums,
          text: 'Humedad'},
        { values: temps,
          text: 'Temperatura'}
      ]
    };
    var lastTimestamp = "";

    while (true) {
      await sleep(2000);   // Sleep in loop
      if (MqttClient.message.payloadString.length > 0 && MqttClient.message.destinationName == "/home/weather") {
        let messageJson = JSON.parse(MqttClient.message.payloadString);
        if (messageJson.timestamp != lastTimestamp){
          $scope.$apply(function () {
            var ts = new Date(messageJson.timestamp)
            $scope.datosDhT = {
              timestamp: ts.toLocaleString(),
              temperatura: parseInt(messageJson.temperatura),
              humedad: parseInt(messageJson.humedad)
            }
            times.push(messageJson.timestamp);
            temps.push(parseInt(messageJson.temperatura));
            hums.push(parseInt(messageJson.humedad));

          })
        }
        lastTimestamp = messageJson.timestamp;
      }
    }
  }


  getMessage(); */
})

.controller('RangeCtrl', function($scope) {
  $scope.CurrentDate = new Date();
  MqttClient.subscribe("/home/range");
  $http.get('http://192.168.0.178:8093/cse/v1/user/range')
  .then(function(response) {

      $scope.rangeData = response.data;
      $scope.tmp = angular.fromJson($scope.rangeData);

    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  });
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
})

/* .controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
 */

.controller('AuthCtrl', function ($rootScope, $scope, $state, $ionicHistory, User, $ionicPopup, ClienteSingleton) {
  $scope.credentials = {
    user: '',
    password: ''
  };

  $scope.auth = function () {
    User.auth($scope.credentials).then(
      function (respuesta) {
        $ionicHistory.nextViewOptions({ historyRoot: true });
        $state.go('tab.weather');
        var cliente = ClienteSingleton;
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
