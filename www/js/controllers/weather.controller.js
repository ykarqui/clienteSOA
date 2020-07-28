angular.module('weather.controllers', ['starter.services', 'angularPaho', 'chart.js']) 

.controller('WeatherCtrl', function($scope, $timeout, $http, $state, MqttClient) {
    $scope.CurrentDate = new Date();
    MqttClient.subscribe("/home/weather");
    function sleep(ms) {
      return new Promise(resolve => $timeout(resolve, ms));
    }
    async function getMessage() {  
      // Chart
      $scope.time = [0];
      $scope.data = [0];
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

      $scope.getHistoric = function () {
        $state.go('weatherHistoric');
      },
      function (err) {
        console.log("error" + err);
        $ionicPopup.alert({
          title: 'NOT FOUND',
          content: 'Page not found.'
        })
      }
  
      var lastTimestamp = "";
      while (true) {
        await sleep(2000);
        if(MqttClient.message){
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
            $scope.time.push(messageJson.timestamp);
            $scope.data.push($scope.weatherData.temperature);
            lastTimestamp = messageJson.timestamp;
          }
        }
        
      }
    }
    getMessage();
  
  })
  