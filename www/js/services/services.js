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

  //Token
  .factory('TokenService', function ($http) {

    return {
      generateToken: function (payload) {
        let username = payload.username
        console.log(`body: ${JSON.stringify(username)}`);
      // CSE server
        return $http.get('http://localhost:8093/cse/v1/user/gentoken?username=' + username);
      },
      checkToken: function(payload) {
        let username = payload.username
        return $http.get('http://localhost:8093/cse/v1/user/token?username=' + username);
      }
    };
  })
  