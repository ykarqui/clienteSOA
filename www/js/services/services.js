angular
  .module('starter.services', ['angularPaho'])
  
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
        return $http.post('http://cse.com/user/login', data);
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
        return $http.post('http://cse.com/user', newUser);
      },
    };
  })

  //Token
  .factory('TokenService', function ($http) {

    return {
      generateToken: function (payload) {
        let username = payload.username
        console.log(`body: ${JSON.stringify(username)}`);
      // CSE server
        return $http.get('http://cse.com/user/gentoken?username=' + username);
      },
      checkToken: function(payload) {
        let username = payload.username
        return $http.get('http://cse.com/user/token?username=' + username);
      }
    };
  })

  .factory('InitializePaho', function (MqttClient){
    const ip = 'mqtt.com/broker/'; //IP de MQTT (Docker en Notebook)
    const port = '';  //Mosquitto con Websockets
    const id = "";
    MqttClient.init(ip, port, id);
    let message = MqttClient.message;
    return {
      getMessage: function () {
        message = MqttClient.message;
        return message;
      }
    };
  })
  