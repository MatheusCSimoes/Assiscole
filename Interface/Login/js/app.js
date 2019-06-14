angular.module('starter', ['ui.router', 'starter.controllers'])

.config(function($stateProvider,$urlRouterProvider) {
  
  $stateProvider

  .state('app', {
    url: '/App',
    templateUrl: 'templates/app.html',
    controller: 'AppCtrl'
  })

  .state('app.login', {
    url: '/Login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl'
  })

  .state('app.lista', {
    url: '/Lista',
      templateUrl: 'templates/lista.html',
      controller: 'ListaCtrl'
  })

  $urlRouterProvider.otherwise(function ($injector, $location) {
    var $state = $injector.get("$state");
    $state.go("app.login");
  });
})