angular
  .module('range.controllers', ['starter.services', 'angularPaho', 'chart.js'])
  .controller('RangeCtrl', function($scope, MqttClient, $state) {
    $scope.CurrentDate = new Date();
    MqttClient.subscribe("/home/range");
    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Chart
    $scope.time = [0];
    $scope.data = [0];
    $scope.itemsRange = [0];
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
      $state.go('rangeHistoric');
    },
    function (err) {
      console.log("error" + err);
      $ionicPopup.alert({
        title: 'NOT FOUND',
        content: 'Page not found.'
      })
    }

    async function getMessage() {
      let lastTimestamp = '';
      console.log(`Intenta entrar al whiule`);
      while (true) {
        await sleep(2000);   // Sleep in loop
        if (MqttClient.message){
          console.log(`Ingresa al mensaje`);
          if (MqttClient.message.destinationName == "/home/range" && MqttClient.message.payloadString.length > 0) {
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
          }
        }
        
      }
    }
    getMessage();
    
  })