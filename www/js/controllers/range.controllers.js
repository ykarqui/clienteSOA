angular.module('range.controllers', ['starter.services', 'angularPaho', 'chart.js'])
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
      }
    }
  }
  getMessage();
  
})