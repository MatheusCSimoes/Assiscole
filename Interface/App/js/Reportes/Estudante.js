myApp

.config(function($stateProvider) {

  var carpeta = 'templates/Reportes/';
  
  $stateProvider

  .state('app.reporteEstudante', {
    url: '/reporteEstudante',
    templateUrl: carpeta+'ReporteEstudantes.html?version='+version,
    controller: 'ReporteEstudantesCtrl'
  })
});

controllers

.controller('ReporteEstudantesCtrl',function($scope,$state,$timeout,CursosService,ReporteServices,AjaxService,DashService){
  $scope.cursosFiltro = [];
  $scope.nuevoEstudiante = {};
  $scope.estudiante = {};
  $scope.checkCurso = false;

  $scope.cargarCursosFiltro = function(){
    CursosService.getCursos(AjaxService.miAjax).then(function(cursos){
      $scope.cursosFiltro = cursos;       
    }, function(a){
      $scope.alert('Error_Red');        
    });
    // CursosService.getcursosFiltro(AjaxService.miAjax).then(function(cursos){
    //   $scope.cursosFiltro = cursos;
    //   //console.log($scope.cursosFiltro);
    // }, function(a){
    //   $scope.alert('Error_Red');
    // });
  }

    var preferenciasMulti = function(pref){
    if(pref == "preferenciasFiltroCursosSede"){
      // $scope.botonEstudiante = "mdi-content-add";  
      $scope.inputSede = 1;
      $scope.inputJornada = 1;
    }
  }

  $scope.getTemplateMulti = function(html,pref){
    preferenciasMulti(pref);
    return multi+html+'.html?version='+version;
  }

  $scope.cargarCursosFiltro();    

  $scope.checkCursoFiltro = function(idCurso){
    $scope.checkCurso = $('#curso'+idCurso).prop("checked");
    $scope.setClickedCurso($.grep($scope.cursosFiltro, function(e){ return e.Id == idCurso; })[0]);

    for (var k = 0; k < $scope.cursosFiltro.length; k++) {
      if($scope.cursosFiltro[k].Id != idCurso)
        $('#curso'+$scope.cursosFiltro[k].Id).prop("checked",false);
    }

    if($scope.checkCurso)
      cargarestudantes(idCurso);
    else
      $scope.estudantes = [];  

    // console.log(cursoCheck);    
  }

  function cargarestudantes(idCurso){
    ReporteServices.getEstudantesIndiciplinado(idCurso,AjaxService.miAjax).then(function(estudantes){
      $scope.estudantes = estudantes;
      console.log($scope.estudantes);
    }, function(a){
      $scope.alert('Error_Red');        
    });
  }
})