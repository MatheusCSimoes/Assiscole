myApp

.config(function($stateProvider) {

  var carpeta = 'templates/Promocion/';
  
  $stateProvider

  .state('app.promocionEstudiantes', {
    url: '/promocionEstudiantes',
    templateUrl: carpeta+'Estudiantes.html?version='+version,
    controller: 'PromocionEstudiantesCtrl'
  })
});

controllers

.controller('PromocionEstudiantesCtrl',function($scope,$state,$timeout,PromocionService,AjaxService,DashService,CursosService){  
  $scope.setLoaded($scope.mostrarloaded);
  $scope.estudiantes = {};
  $scope.cursosPromocion = {};
  var diaAnterior = false;
  var cursoFuturo;

  if(Object.keys($scope.clickedCurso).length == 0)
    $state.go('app.cursos');

  var cargarEstudiantes = function(idCurso){
    PromocionService.getEstudiantesPromocion(idCurso,AjaxService.miAjax).then(function(estudiantes){
      $scope.estudiantes = estudiantes;
      $scope.cargarCursos($scope.clickedSede,$scope.clickedJornada,function(){
        $scope.cursosPromocion = $scope.cursos;
        var cursoCero = ($.grep($scope.cursosPromocion, function(e){ return e.Id == 0; }))[0];
        if(cursoCero == null)
          $scope.cursosPromocion.push({Id:"0",Nombre:"Sale del colegio"});
        cursoDefault();
      });
      
    }, function(a){
      $scope.alert('Error_Red');        
    });
  }

  var cursoDefault = function(){
    var cursosSelectSwal = {
      "-1":"Cambio de Sede y/o de Jornada"
    };
    for (var i = 0; i < $scope.cursosPromocion.length; i++) {
      var c = $scope.cursosPromocion[i];
      cursosSelectSwal[i] = c.Nombre;
    }
    swal({
      title: 'A que curso son promovidos?',
      input: 'select',
      inputOptions: cursosSelectSwal,
      inputPlaceholder: 'Seleccione',
      inputValidator: (value) => {
        return new Promise((resolve) => {
          if (value == "") {
            resolve('Seleccione un curso')
          } else {
            resolve()
          }
        })
      },
    }).then((result) => {
      if (result.value) {
        if(result.value == -1){
          cursoDefaultExtra();
        }
        else{
          cursoFuturo = $scope.cursosPromocion[result.value];
          for (var i = 0; i < $scope.estudiantes.length; i++) {
            $scope.estudiantes[i].CursoFuturo = cursoFuturo.Id;
          }
        }
      }
      else if (result.dismiss === Swal.DismissReason.cancel) {
      }
      $scope.setLoaded(1);
      $scope.$apply();
      $('select').material_select();
    }).catch(err => {
      console.log(err);
      swal.close();
    });
  }

  var cursoDefaultExtra = function(){
    PromocionService.getTodoslosCursos(AjaxService.miAjax).then(function(cursos){
      var cursosSelectSwal = {};
      $scope.cursosPromocion = cursos;
      $scope.cursosPromocion.push({Id:"0",Nombre:"Sale del colegio"});
      for (var i = 0; i < $scope.cursosPromocion.length; i++) {
        var c = $scope.cursosPromocion[i];
        if(c.Id == 0)
          cursosSelectSwal[i] = c.Nombre ;
        else
          cursosSelectSwal[i] = c.NombreSede + "-" + c.NombreJornada  + "-" + c.Nombre ;
      }
      swal({
        title: 'A que curso son promovidos?',
        input: 'select',
        inputOptions: cursosSelectSwal,
        inputPlaceholder: 'Seleccione',
        inputValidator: (value) => {
          return new Promise((resolve) => {
            if (value == "") {
              resolve('Seleccione un curso')
            } else {
              resolve()
            }
          })
        },
      }).then((result) => {
        if (result.value) {
          cursoFuturo = $scope.cursosPromocion[result.value];
          for (var i = 0; i < $scope.estudiantes.length; i++) {
            $scope.estudiantes[i].CursoFuturo = cursoFuturo.Id;
          }
        }
        else if (result.dismiss === Swal.DismissReason.cancel) {
        }
        $scope.setLoaded(1);
        $scope.$apply();
        $('select').material_select();
      }).catch(err => {
        console.log(err);
        swal.close();
      });
    }, function(a){
      $scope.alert('Error_Red');
    });    
  }

  $scope.actualizarEstudiantes = function(){
    // console.log($scope.estudiantes);
    var aceptar = true;
    var estudianteFaltante;
    var estudiantesPromover = [];
    for (var i = 0; i < $scope.estudiantes.length; i++) {
      if($scope.estudiantes[i].CursoFuturo == null){
        aceptar = false;
        estudianteFaltante = $scope.estudiantes[i].Nombre;
        break;
      }
      estudiantesPromover.push({
        cursoFuturo: $scope.estudiantes[i].CursoFuturo,
        cursoFuturoAux: $scope.estudiantes[i].CursoAd,
        idEstudiante: $scope.estudiantes[i].Id
      });
    }
    if(aceptar){
      var enviarCall = function(a){     
        PromocionService.promoverEstudiantes(estudiantesPromover,AjaxService.miAjax).then(function(a){
          var funcionSucess = function(){
            $state.go('app.promocionCursos');
            $scope.alert('Bien','Curso Promovido');
          }
          $scope.cargarCursosPromocion($scope.clickedSede,$scope.clickedJornada,funcionSucess);
        }, function(a){
          $scope.alert('Error_Red');
        });
      }
      $scope.confirm('Alerta','Seguro quieres promover el curso '+$scope.clickedCurso.Nombre+' al '+ cursoFuturo.Nombre, enviarCall);
    }
    else{
      $scope.alert('Predet','Falto escojer el estudiante ' + estudianteFaltante);
    }
  }

  $scope.verificarInfoContacto = function(estudiante){
    var numero = estudiante.Contacto.Cel;
    if(numero.length != 10 || numero[0] != 3)
      return false;
    else
      return true;
  }

  $scope.NombreCurso = function(curso){
    if(curso.NombreSede != undefined && curso.NombreJornada != undefined)
      return curso.NombreSede + "-" + curso.NombreJornada  + "-" + curso.Nombre ;
    else
      return curso.Nombre
  }
  
  cargarEstudiantes($scope.clickedCurso.Id);  
})