myApp

.config(function($stateProvider) {

  var carpeta = 'templates/Cursos/';
  
  $stateProvider

  .state('app.cursos', {
    url: '/cursos',
    templateUrl: carpeta+'Cursos.html?version='+version,
    controller: 'CursosCtrl'
  })
});

controllers

.controller('CursosCtrl',function($scope,$state,$timeout,CursosService,AjaxService,DashService){
  
  $scope.clickCurso = function(curso){    
    $scope.setClickedCurso(curso);
    $state.go('app.estudantes'); 
  }  

  $scope.asistenciaCurso = function(dia){
    var today = new Date().setHours(0, 0, 0, 0);
    if(dia != null)
    {
      var date = new Date(dia).setHours(0, 0, 0, 0);
      if(date == today)
        return true;
      else
        return false;
    }
  }

  var carregarCursos = function(){
    CursosService.getCursos(AjaxService.miAjax).then(function(cursos){
      $scope.cursos = cursos;       
    }, function(a){
      $scope.alert('Error_Red');        
    });
  }

  if(DashService.role() == "Professor")
    $state.go('app.cursoProfessor'); 
  else
    carregarCursos();
})