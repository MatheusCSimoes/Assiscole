myApp

.config(function($stateProvider) {

  var carpeta = 'templates/Cursos/';
  
  $stateProvider

  .state('app.cursoProfessor', {
    url: '/cursoProfessor',
    templateUrl: carpeta+'CursoProfessor.html?version='+version,
    controller: 'CursoProfessorCtrl'
  })
});

controllers

.controller('CursoProfessorCtrl',function($scope,$state,$timeout,CursosService,AjaxService,DashService){
  
  $scope.clickCurso = function(curso){    
    $scope.setClickedCurso(curso);
    $state.go('app.estudantesProfessor'); 
  }  

  var carregarCursos = function(){
    CursosService.getCursosProfessor(DashService.idUser(),AjaxService.miAjax).then(function(cursos){
      $scope.cursos = cursos;       
    }, function(a){
      $scope.alert('Error_Red');        
    });
  }

  if(DashService.role() == "Funcionario")
    $state.go('app.cursos'); 
  else
    carregarCursos();
})