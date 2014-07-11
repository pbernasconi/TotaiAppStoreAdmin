angular.module('app', [
  'ngRoute',
  'ngAnimate',
  'ui.bootstrap',
  'easypiechart',
  'mgo-angular-wizard',
  'textAngular',
  'ui.router',
  'ngResource',
  'ngDraggable',
  'angularFileUpload',
  'ui.utils',

  // general
  'app.controllers',
  'app.services',
  'app.filters',
  'app.directives',


  // persona
  'persona.ctrl',

  // apps
  'apps.ctrl',


  'app.ui.ctrls',
  'app.ui.directives',
  'app.ui.services',
  'app.old.controllers',
  'app.directives',
  'app.form.validation',
  'app.ui.form.ctrls',
  'app.ui.form.directives',
  'app.tables',
  'app.task',
  'app.localization',
  'app.chart.ctrls',
  'app.chart.directives'

])

  .run(function ($rootScope, $state) {

    $rootScope.DB_URL = 'http://www.desa-net.com/TOTAI/db/';
    $rootScope.totaiAppStore = 'http://desa-net.com/totaiAppStore/';
    $rootScope.appName = 'TotaiAppStore';


  })

  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider


      .state('login', {
        url: '/login',
        templateUrl: 'app/login/login.html'
      })

      .state('lockout', {
        url: '/lockout',
        templateUrl: 'app/login/lock-screen.html'
      })


      .state('dashboard', {
        url: '/dashboard',
        templateUrl: 'app/views/dashboard.html'
      })


      // Persona

      .state('persona-table', {
        url: '/persona/table',
        templateUrl: 'app/persona/persona-table.html',
        controller: 'PersonaTableCtrl'
      })

      .state('persona-detail', {
        url: '/persona/detail/:SEQ',
        templateUrl: 'app/persona/persona-detail.html',
        controller: 'PersonaDetailCtrl'
      })

      .state('persona-new', {
        url: '/persona/new',
        templateUrl: 'app/persona/persona-new.html',
        controller: 'PersonaNewCtrl'
      })


      .state('persona-groups', {
        url: '/persona/groups',
        templateUrl: 'app/persona/persona-groups.html',
        controller: 'PersonaGroupsCtrl'
      })


      // APPS

      .state('apps-table', {
        url: '/apps/table',
        templateUrl: 'app/apps/apps-table.html',
        controller: 'AppsTableCtrl'
      })


      .state('apps-detail', {
        url: '/apps/detail/:SEQ',
        templateUrl: 'app/apps/apps-detail.html',
        controller: 'AppsDetailCtrl'
      })

      .state('apps-upload', {
        url: '/apps/upload',
        templateUrl: 'app/apps/apps-upload.html',
        controller: 'AppsUploadCtrl'
      })

      .state('apps-upload-test', {
        url: '/apps/upload-test',
        templateUrl: 'app/apps/apps-upload-test.html',
        controller: 'AppsUploadTestCtrl'
      });

    $urlRouterProvider.otherwise('/dashboard');


  });


