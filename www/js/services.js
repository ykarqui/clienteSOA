angular.module('starter.services', ['angularPaho'])
  //Login
  .factory('User', function ($http) {

    var loggedIn = true;
    console.log('LLEGA A SERVICE.js!!')
    return {
      auth: function (credentials) {
        let data = {
          'username': credentials.user,
          'password': credentials.password
        };

        loggedIn = true;
        console.log('Data in serveices.js:' + data);
        // CSE server
        return $http.post('http://192.168.0.178:8093/cse/v1/user/login', data);
      },

      isLoggedIn: function () {
        return loggedIn;
      }

    };
  })

 // Singleton
  .factory('ClienteSingleton', function (MqttClient) {
    var ip = '192.168.0.178'; //IP de MQTT (Docker en Notebook)
    var port = '9001';  //Mosquitto con Websockets
    var id = "";
    MqttClient.init(ip, port, id);
    var message = MqttClient.message;
    return {
      getMessage: function () {
        message = MqttClient.message;
        return message;
      }
    };
  })
