angular
  .module('weatherhistoric.controllers', ['starter.services', 'angularPaho'])
  .controller('WeatherHistoricCtrl', function($scope, MqttClient, $state) {
    $scope.CurrentDate = new Date();
    MqttClient.subscribe("/home/weather/historic");
    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function getMessage() {
      let lastTimestamp = '';
      console.log(`Ingreso al historic`);
      while (true) {
        await sleep(2000);   // Sleep in loop
        if(MqttClient.message){
          console.log(`Ingreso al mqtt`);
          if (MqttClient.message.destinationName == "/home/weather/historic") {
            let messageJson = JSON.parse(MqttClient.message.payloadString);
            
            $scope.$apply(function () {
              // $scope.rangeHistoric = {
              //   distance: parseInt(messageJson.distance)
              // }
              let i;
              $scope.itemsWeather = [0];
              console.log(`Ingreso al apply`);
              for(i = 0; i < messageJson.length; i ++) {
                console.log("ItemRange[" + i + "]: " + messageJson[i].temperature + " + " + messageJson[i].humidity)
                $scope.itemsWeather.push(messageJson[i]);
              }
              
            })
          }
        }
        
      }
    }
    getMessage();


    $scope.goWeather = function () {
      $state.go('tab.weather');
    },
    function (err) {
      console.log("error" + err);
      $ionicPopup.alert({
        title: 'NOT FOUND',
        content: 'Page not found.'
      })
    }
  })