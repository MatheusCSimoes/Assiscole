myApp

.config(function($stateProvider) {

  var carpeta = 'templates/Herramientas/';
  
  $stateProvider

  .state('app.datosIncompletos', {
    url: '/datosIncompletos',
    templateUrl: carpeta+'DatosIncompletos.html?version='+version,
    controller: 'DatosIncompletosCtrl'
  })
});

controllers

.controller('DatosIncompletosCtrl',function($scope,$state,$timeout,EstudiantesService,HerramientaService,AjaxService,DashService){
  $scope.setLoaded($scope.mostrarloaded);
  $scope.cursosDatosFaltantes = [];
  $scope.nuevoEstudiante = {};
  $scope.estudiante = {};
  $scope.checkCurso = false;

  $timeout(function() {$scope.setTemplateModalHerramienta('EditarEstudiante.html?version='+version);}, 500);

  $scope.setNuevoEstudiante = function(estudianteEdit){
    $scope.nuevoEstudiante = {
      Id: estudianteEdit.Id,
      Nombre: estudianteEdit.Nombre,
      Apellido: estudianteEdit.Apellido,
      Identificacion: estudianteEdit.Identificacion,
      Fecha: estudianteEdit.FechaNacimiento,
      Direccion: estudianteEdit.Direccion,
      Sexo: estudianteEdit.Sexo,
      Acudiente: {
        Id: estudianteEdit.Contacto.Id,
        Nombre: estudianteEdit.Contacto.Nombre,
        Cel: estudianteEdit.Contacto.Cel,
      },
      CursoAd: estudianteEdit.CursoAd,
    };
  }

  $scope.setTemplateModalHerramienta = function(a,b){
    $scope.templateModal = modales+a;
    if(b != undefined)
      $scope.contentModal = b;
  }

  $scope.getTemplateModalHerramienta = function(){
    return $scope.templateModal;
  }

  $scope.modalEditarEstudiante = function(id){
    $scope.estudiante = ($.grep($scope.estudiantes, function(e){ return e.Id == id; }))[0];
    $scope.setNuevoEstudiante($scope.estudiante);
    //console.log($scope.nuevoEstudiante);
    $scope.setTemplateModalHerramienta('EditarEstudiante.html?version='+version);
    setTimeout(function() {

      $('#modalHerramienta').openModal();

      var rules = {
        nuevoEstudianteNombre: {
          required: true,
          minlength: 10
        },
        nuevoEstudianteAcudiente1Nombre: {
          required: true,
        },
        nuevoEstudianteAcudiente1Apellido: {
          required: true,
        },
        nuevoEstudianteAcudiente1Cel: {
          required: true,
          digits: true,
          minlength: 10,
          maxlength: 10
        },
        nuevoEstudianteAcudiente2Cel: {
          digits: true,
          minlength: 10,
          maxlength: 10
        }
      }

      $scope.activarFormulario(rules);

    }, 200);
  }

  $scope.editarEstudiante = function(){
    if(!$("#formValidate").valid())
      console.log('invalid');
    else
      {
        //console.log($scope.nuevoEstudiante);
        $('#modalHerramienta').closeModal();
        EstudiantesService.editEstudiante(DashService.id(),$scope.estudiante,$scope.nuevoEstudiante,AjaxService.miAjax).then(function(a){
          $scope.alert('Alert_EstudianteModificado');
          cargarEstudiantes($scope.clickedCurso.Id);
        }, function(a){
          $scope.alert('Alert_EstudianteNoModificado');
        });
      }
  }

  $scope.cargarCursosDatosFaltantes = function(){
    HerramientaService.getCursosDatosFaltantes(AjaxService.miAjax).then(function(cursos){
      $scope.cursosDatosFaltantes = cursos;
      //console.log($scope.cursosDatosFaltantes);
    }, function(a){
      $scope.alert('Error_Red');
    });
  }

  $scope.iniciar(function(){
    $timeout(function(){      
      //el set loaded va aqui porque la funcion se llama varias vezes en otros lados
      $scope.setLoaded(1);
      $scope.cargarCursosDatosFaltantes();    
    },200);
  });

  $scope.checkCursoDatoFaltante = function(idSede,idJornada,idCurso){
    $scope.checkCurso = $('#curso'+idCurso+idJornada+idSede).prop("checked");
    var sedeCheck = $.grep($scope.cursosDatosFaltantes, function(e){ return e.IdSede == idSede; })[0];
    var jornadaCheck = $.grep(sedeCheck.Jornadas, function(e){ return e.IdJornada == idJornada; })[0];
    $scope.setClickedCurso($.grep(jornadaCheck.Cursos, function(e){ return e.Id == idCurso; })[0]);

    for (var k = 0; k < $scope.cursosDatosFaltantes.length; k++) {
      var tempSede = $scope.cursosDatosFaltantes[k];
      for (var i = 0; i < tempSede.Jornadas.length; i++) {
        var tempJornada = tempSede.Jornadas[i];
        for (var j = 0; j < tempJornada.Cursos.length; j++) {
          if(tempJornada.Cursos[j].Id != idCurso)
            $('#curso'+tempJornada.Cursos[j].Id+tempJornada.IdJornada+tempSede.IdSede).prop("checked",false);
        }
      }  
    }

    if($scope.checkCurso)
      cargarEstudiantes(idCurso);
    else
      $scope.estudiantes = [];  

    // console.log(cursoCheck);    
  }

  function cargarEstudiantes(idCurso){
    HerramientaService.getEstudiantesDatosFaltantes(idCurso,AjaxService.miAjax).then(function(estudiantes){
      $scope.estudiantes = estudiantes;
      console.log($scope.estudiantes);
    }, function(a){
      $scope.alert('Error_Red');        
    });
  }
})