angular.module('app.services', [])

  .factory('AppsAmazonS3', function ($rootScope, $resource) {
    return $resource('http://www.desa-net.com/TOTAI/db/apps_amazonS3/:SEQ:verb', {}, {
        getAll: {method: 'GET', isArray: true},
        getOne: {method: 'GET', params: {SEQ: '@SEQ'}},
        getWithVersion: {method: 'GET', params: {verb: 'get', version: '@version', apps_SEQ: '@apps_SEQ'}, isArray: true},
        findByName: {method: 'GET', params: {query: '@query'}, isArray: true},
        update: {method: 'PUT', params: {SEQ: '@SEQ'}},
        new: {method: 'POST'},
        delete: {method: 'DELETE', params: {SEQ: '@SEQ'}}
      }
    );
  })

  .factory('Apps', function ($rootScope, $resource) {
    return $resource('http://www.desa-net.com/TOTAI/db/apps/:SEQ:query', {}, {
        getAll: {method: 'GET', isArray: true},
        getOne: {method: 'GET', params: {SEQ: '@SEQ'}},
        findByName: {method: 'GET', params: {query: '@query'}, isArray: true},
        update: {method: 'PUT', params: {SEQ: '@SEQ'}},
        new: {method: 'POST'},
        delete: {method: 'DELETE', params: {SEQ: '@SEQ'}}
      }
    );
  })

  .factory('PersonaApps', function ($rootScope, $resource) {
    return $resource('http://www.desa-net.com/TOTAI/db/persona_apps/:SEQ:verb', {}, {
        getAll: {method: 'GET', isArray: true},
        getOne: {method: 'GET', params: {SEQ: '@SEQ'}, isArray: false},
        getWith: {method: 'GET', params: {verb: 'get', app_SEQ: '', persona_SEQ: '', version: '', nivel_seguridad: ''}, isArray: true},
        findByName: {method: 'GET', params: {query: '@query'}, isArray: true},
        update: {method: 'PUT', params: {SEQ: '@SEQ'}},
        new: {method: 'POST'},
        delete: {method: 'DELETE', params: {SEQ: '@SEQ'}}
      }
    );
  })


  .factory('Persona', function ($rootScope, $resource) {
    return $resource($rootScope.DB_URL + 'persona/:SEQ:verb', {}, {
        getAll: {method: 'GET', isArray: true},
        getOne: {method: 'GET', params: {SEQ: '@SEQ'}},
        getWithName: {method: 'GET', params: {verb: 'get', nombre: ''}},
        update: {method: 'PUT', params: {SEQ: '@SEQ'}},
        newPersona: {method: 'POST', params: {verb: 'X'}},
        delete: {method: 'DELETE', params: {SEQ: '@SEQ'}}
      }
    );
  })

  .factory('PersonaNew', function ($rootScope, $http) {

    this.create = function (usuario, contrasena, nombre, apellido, titulo, funcion, nacido) {
      this.usuario = usuario;
      this.contrasena = contrasena;
      this.nombre = nombre;
      this.apellido = apellido;
      this.titulo = titulo;
      this.nacido = nacido;
    };
    this.destroy = function () {
      this.usuario = null;
      this.contrasena = null;
      this.nombre = null;
      this.apellido = null;
      this.titulo = null;
      this.nacido = null;
    };
    return this;
  })


  .factory('Upload', function ($rootScope, $http) {

    this.create = function (apps_SEQ, nombre, device, OS, OS_version, version, version_antigua, version_nuevo) {
      this.apps_SEQ = apps_SEQ;
      this.nombre = nombre;
      this.device = device;
      this.OS = OS;
      this.OS_version = OS_version;
      this.version_antigua = version_antigua;
      this.version = version;
      this.version_nuevo = version_nuevo;
    };
    this.destroy = function () {
      this.apps_SEQ = null;
      this.nombre = null;
      this.device = null;
      this.OS = null;
      this.OS_version = null;
      this.version_antigua = null;
      this.version = null;
    };
    return this;
  })

  .factory('AuthService', function ($rootScope, $http, Session) {
    return {
      login: function (user) {
        return $http
          .post($rootScope.DB_URL + 'persona/login', user)
          .then(function (res) {

            console.log(res.data);
            Session.create(user.usuario, 'admin');
          });
      },
      isAuthenticated: function () {
        return !!Session.usuario;
      },
      isAuthorized: function (authorizedRoles) {
        if (!angular.isArray(authorizedRoles)) {
          authorizedRoles = [authorizedRoles];
        }
        return (this.isAuthenticated() &&
          authorizedRoles.indexOf(Session.nivel) !== -1);
      }
    };
  })


  .service('Session', function () {
    this.create = function (userId, nivel) {
      this.usuario = userId;
      this.nivel = nivel;
    };
    this.destroy = function () {
      this.usuario = null;
      this.nivel = null;
    };
    return this;
  });