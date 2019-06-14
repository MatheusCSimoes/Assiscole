myApp

.config(function($stateProvider) {

  var carpeta = 'templates/Herramientas/';
  
  $stateProvider

  .state('app.editarEstudiante', {
    url: '/editarEstudiante',
    templateUrl: carpeta+'EditarEstudiante.html?version='+version,
    controller: 'EditarEstudianteCtrl'
  })

});

controllers

.controller('EditarEstudianteCtrl',function($scope,$state,$timeout,NotificacionService,EstudiantesService,AjaxService,DashService){
  $scope.Tipo = null;
  $scope.setLoaded($scope.mostrarloaded);
  $scope.estudiantesEncontrados = [];
  $scope.estudianteNP = false;
  $scope.estudianteNPS = false;
  $scope.nuevoEstudiante = {};
  $scope.estudiante = {};
  $('textarea#textareaNotificaciones').characterCounter();

  var preferenciasMulti = function(pref){
    if(pref == "preferenciasFiltroEstudiante"){
      $scope.botonEstudiante = "mdi-content-add";  
      $scope.botonBuscar = 1;
    }
  }

  $scope.getTemplateMulti = function(html,pref){
    preferenciasMulti(pref);
    return multi+html+'.html?version='+version;
  }

  $scope.buscar = function(){
    if($('#buscarEstudiante').val().length > 3)
    NotificacionService.getEstudiantebyNombre($('#buscarEstudiante').val(),AjaxService.miAjax).then(function(a){
      $scope.estudianteNP = true;
      if(a.length == 0)
        $scope.estudiantesEncontrados = [{Nombre:'Sin Resultados'}];
      else
        $scope.estudiantesEncontrados = a;
      //console.log(a);
    }, function(a){
      $scope.alert('Error_Red');
    });
  }

  $scope.setNuevoEstudiante = function(estudianteEdit){
    $scope.nuevoEstudiante = {
      Id: estudianteEdit.Id,
      Nombre: estudianteEdit.Nombre,
      Apellido: estudianteEdit.Apellido,
      Documento: estudianteEdit.Documento,
      Fecha: $scope.cambiarFechaNacimiento(estudianteEdit.FechaNacimiento),
      Sexo: estudianteEdit.Sexo,
      Acudiente: {
        Id: estudianteEdit.Contacto.Id,
        Nombre: estudianteEdit.Contacto.Nombre,
        Cel: estudianteEdit.Contacto.Cel,
        Direccion: estudianteEdit.Contacto.Direccion,
      },
      CursoAd: estudianteEdit.CursoAd,
    };
  }

  $scope.seleccionarEstudiante = function(estudiante){
    $scope.estudianteNPS = true;
    $scope.estudianteNP = false;
    $scope.setNuevoEstudiante(estudiante);
    $scope.estudiante = clone(estudiante);
    $scope.estudiantesEncontrados = [];

    $timeout(function(){
      var form = "#formValidate";
      for (var i = 0; i < $(form).find('input').length; i++) {
        if($(form).find('input')[i].value != ""){
          var name = $(form).find('input')[i].name;
          if(name != ""){
            $($(form).find('label[for='+name+']')).addClass("active");
            // $($(form).find('i')[i]).addClass("active");
            $($(form).find('input')[i]).addClass("valid");  
          }
        }
        else{
          $($(form).find('label[for='+name+']')).addClass("active");
        }
      }
      if($scope.Adds.cursoextra){
        cargarCursosAdicionales(estudiante.TipoJornada);  
      }
    },100);
  }

  var cargarCursosAdicionales = function(TipoJornada){
    EstudiantesService.getCursosExtracurriculares(TipoJornada,"",AjaxService.miAjax).then(function(cursos){
      $scope.cursosAdicionales = cursos;
      $timeout(function(){
        $('select').not('.disabled').material_select(); 
      },10);
    }, function(a){
      //console.log(a);
    });
  }

  $scope.editarEstudiante = function(){
    if(!$("#formValidate").valid())
      console.log('invalid');
    else
      {
        //console.log($scope.nuevoEstudiante);
        $('#modalEstudiantes').closeModal();
        EstudiantesService.editEstudiante(DashService.id(),$scope.estudiante,$scope.nuevoEstudiante,AjaxService.miAjax).then(function(a){
          $scope.alert('Alert_EstudianteModificado');
          $('html, body').animate({
            scrollTop: $('body').offset().top + 0
          }, 500);
        }, function(a){
          $scope.alert('Alert_EstudianteNoModificado');
        });
      }
  }

  $timeout(function(){
    $scope.setLoaded(1);
      var rules = {
          buscarEstudiante: {
            required: true,
            minlength: 4
          },
      }

      $scope.activarFormulario(rules,null,"Filtro");
        //For custom messages

      rules = {
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
          },
      }

      $scope.activarFormulario(rules);

  },200);

  $scope.verificarInfoContacto = function(estudiante){
    var numero = estudiante.Contacto.Cel;
    if(numero.length != 10 || numero[0] != 3)
      return false;
    else
      return true;
  }
})