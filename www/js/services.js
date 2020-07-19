angular.module('starter.services', ['angularPaho'])
  //Login
  .factory('User', function ($http) {

    var loggedIn = false;
    console.log('LLEGA A SERVICE.js!!')
    return {
      auth: function (credentials) {
        let data = {
          'username': credentials.user,
          'password': credentials.password
        };

        loggedIn = true;
        console.log('Data in serveices.js:' + data.toString());
        // CSE server
        return $http.post('http://localhost:8093/cse/v1/user/login', data);
      },

      isLoggedIn: function () {
        return loggedIn;
      }

    };
  })

  //Register
  .factory('UserRegister', function ($http) {

    return {
      registerService: function (payload) {
        let newUser = {
          'username': payload.username,
          'password': payload.password,
          'firstName': payload.firstName,
          'lastName': payload.lastName,
          'email': payload.mail,
        };
      // CSE server
        return $http.post('http://localhost:8093/cse/v1/user', newUser);
      },
    };
  })

 // Singleton
  .factory('ClienteSingleton', function (MqttClient) {
    var ip = 'localhost'; //IP de MQTT (Docker en Notebook)
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
