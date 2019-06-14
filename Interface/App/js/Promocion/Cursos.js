myApp

.config(function($stateProvider) {

  var carpeta = 'templates/Promocion/';
  
  $stateProvider

  .state('app.promocionCursos', {
    url: '/promocionCursos',
    templateUrl: carpeta+'Cursos.html?version='+version,
    controller: 'PromocionCursosCtrl'
  })
});

controllers

.controller('PromocionCursosCtrl',function($scope,$state,$timeout,CursosService,AjaxService){
  
  if(Object.keys($scope.clickedSede).length == 0 && Object.keys($scope.clickedJornada).length == 0)
    $state.go('app.principal'); 

  $scope.clickCurso = function(curso){    
    $scope.setClickedCurso(curso);
    $state.go('app.promocionEstudiantes'); 
  }  

  $scope.yaPromovido = function(curso){
    if(curso.CantidadPromocionEstudiantes == curso.Estudiantes && curso.Estudiantes > 0)
      return true;
    return false;
  }
})