myApp

.config(function($stateProvider) {

  var carpeta = 'templates/Promocion/';
  
  $stateProvider

  .state('app.promocionCursosNuevos', {
    url: '/promocionCursosNuevos',
    templateUrl: carpeta+'CursosNuevos.html?version='+version,
    controller: 'PromocionCursosNuevosCtrl'
  })
});

controllers

.controller('PromocionCursosNuevosCtrl',function($scope,$state,$timeout,PromocionService,AjaxService){
  
  if(Object.keys($scope.clickedSede).length == 0 && Object.keys($scope.clickedJornada).length == 0)
    $state.go('app.principal'); 

  $scope.ClickCursoNuevo = function(curso){
    swal({
      title: 'Ingresa el nombre del nuevo curso',
      input: 'text',
      showCancelButton: true,
      inputValidator: (value) => {
        return !value && 'Nombre Invalido!'
      },
    })
    .then((result) => {
      if (result.value) {
        seleccionarCursoAnterior(result.value);
      }
      else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    }).catch(err => {
      console.log(err);
      swal.close();
    });
  }

  var seleccionarCursoAnterior = function(nombreNuevoCurso){
    var cursosSelectSwal = {};
    for (var i = 0; i < $scope.cursos.length; i++) {
      var c = $scope.cursos[i];
      cursosSelectSwal[i] = c.Nombre;
    }
    swal({
      title: 'Despues de cual curso va?',
      input: 'select',
      inputOptions: cursosSelectSwal,
      inputPlaceholder: 'Selecciona',
      inputValidator: (value) => {
        return new Promise((resolve) => {
          if (value == "") {
            resolve('Seleccione un curso')
          } else {
            resolve()
          }
        })
      },
    })
    .then((result) => {
      if (result.value) {
        agregarCurso($scope.cursos[result.value].Id,nombreNuevoCurso)
      }
      else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    }).catch(err => {
      console.log(err);
      swal.close();
    });
  }

  var agregarCurso = function(idAnterior,nombreNuevoCurso){
    var cursoAnterior = ($.grep($scope.cursos, function(e){ return e.Id == idAnterior; }))[0];
    PromocionService.insertCurso(cursoAnterior,nombreNuevoCurso,AjaxService.miAjax).then(function(a){
      $scope.alert('Bien','Curso nuevo creado');
      $scope.cargarCursos($scope.clickedSede,$scope.clickedJornada);
    }, function(a){
      $scope.alert('Error_Red');
    });
  }

  $scope.CLickBorrarCurso = function(curso){
    var enviarCall = function(a){
      borrarCurso(curso.Id);
    }
    $scope.confirm('Alerta','Seguro quieres borrar el curso '+curso.Nombre, enviarCall);
  }

  var borrarCurso = function(idCurso){
    PromocionService.deleteCurso(idCurso,AjaxService.miAjax).then(function(a){
      $scope.alert('Bien','Curso Borrado');
      $scope.cargarCursos($scope.clickedSede,$scope.clickedJornada);
    }, function(a){
      $scope.alert('Error_Red');
    });
  }
})