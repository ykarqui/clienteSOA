angular
  .module('lighting.controllers', ['starter.services', 'angularPaho', 'chart.js'])
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