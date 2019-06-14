var modales = "templates/Modales/";
var multi = "templates/Multi/";

var myApp = angular.module('starter', ['ui.router', 'starter.controllers', 'datatables'])

.config(function($stateProvider,$urlRouterProvider) {
  
  $stateProvider

  .state('app', {
    url: '/app',
    templateUrl: 'templates/menu.html?version='+version,
    controller: 'AppCtrl'
  })

  $urlRouterProvider.otherwise(function ($injector, $location) {
    var $state = $injector.get("$state");
    $state.go("app.cursos");
  });
})