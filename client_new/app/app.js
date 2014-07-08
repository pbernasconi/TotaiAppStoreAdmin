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


  // general
  'app.services',
  'app.filters',


  // persona
  'persona.ctrl',

  // apps
  'apps.ctrl',


  'app.ui.ctrls',
  'app.ui.directives',
  'app.ui.services',
  'app.controllers',
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


      .state('ui-typography', {
        url: '/ui/typography',
        templateUrl: 'app/views/ui/typography.html'
      });


    $urlRouterProvider.otherwise('/dashboard');
  });


