myApp

.config(function($stateProvider) {

  var carpeta = 'templates/Notificacao/';
  
  $stateProvider

  .state('app.notificacaoCursos', {
    url: '/notificacaoCursos',
    templateUrl: carpeta+'Cursos.html?version='+version,
    controller: 'NotificacaoCursosCtrl'
  })
});

controllers

.controller('NotificacaoCursosCtrl',function($scope,$state,$timeout,NotificacaoService,AjaxService,DashService){
  $scope.sedeNotificacionesCurso = 0;
  $scope.cursosFiltro = [];
  $('textarea#textareaNotificaciones').characterCounter();
  var cargarCursosFiltro = function(){
    NotificacaoService.getCursos(AjaxService.miAjax).then(function(cursos){
      $scope.cursosFiltro = cursos;
    }, function(a){
      $scope.alert('Error_Red');
    });
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

  $scope.enviarNotificacoes = function(){    
    var cursosNotificacion = [];
    $scope.estudiantesNotificaciones = [];

    for (var i = 0; i < $('input[id^="curso"]').length; i++) {
      if($($('input[id^="curso"]')[i]).prop("checked") == true)
        cursosNotificacion.push($($('input[id^="curso"]')[i]).data('curso'));
    }

    if(cursosNotificacion.length>0 && $('#textareaNotificaciones').val().length > 10 && $('#textareaNotificaciones').val().length < 159)
    {     
      $("#enviarNotificaciones").attr('disabled',true);
      NotificacaoService.getEstudantesCursos  (cursosNotificacion,AjaxService.miAjax).then(function(estudiantes){
        if(estudiantes != 0)
          $scope.estudiantesNotificaciones = estudiantes;
        var tamanoTotal = $scope.estudiantesNotificaciones.length;
        $('#cantidadProgress').html('0/'+$scope.estudiantesNotificaciones.length);
        //console.log($scope.estudiantesNotificaciones);        

        var posConfirm = function(){
          $("#enviarNotificaciones").text('Enviando Mensajes...');
          $('#progress').show();    
          swal.close();  
          for (var i = 0; i < $scope.estudiantesNotificaciones.length; i++) {
            tamanoTotal = tamanoTotal-1;
            tamanoTotal = tamanoTotal<0?0:tamanoTotal;
            var countEstudiantes = $scope.estudiantesNotificaciones.length - tamanoTotal;
            $('#cantidadProgress').html(countEstudiantes+"/"+$scope.estudiantesNotificaciones.length);
            countEstudiantes = countEstudiantes*100/$scope.estudiantesNotificaciones.length;
            countEstudiantes = countEstudiantes>100?100:countEstudiantes;
            $('.determinate').width(countEstudiantes+'%')
          }
          insertarDatos($scope.estudiantesNotificaciones);
        }

        var insertarDatos = function(estudiantesEnviados){
          var numeros = [];
          NotificacaoService.insertNotificacao(DashService.idUser(),estudiantesEnviados,$('#textareaNotificaciones').val(),AjaxService.miAjax).then(function(a){
            $scope.alert('Alert_NotificacionEnviada');
            $state.go('app.cursos');
          }, function(a){
            $state.go('app.cursos');
            $scope.alert('Alert_NotificacionEnviada');
          });
        }   

        $scope.confirm("Confirmação","Vai mandar essa mensagen pra "+$scope.estudiantesNotificaciones.length+" estudantes, Tem certeza?",posConfirm,function(){$("#enviarNotificaciones").attr('disabled',false);});
      }, function(a){
        $scope.alert('Error_Red');
      });
    }
    else
    {
      if(cursosNotificacion.length==0)
        $scope.alert('Predet','Precaución: No se selecciono ningun curso');
      else if($('#textareaNotificaciones').val().length == 0)
        $scope.alert('Predet','Precaución: El mensaje no puede estar vacio');
      else if($('#textareaNotificaciones').val().length < 10)
        $scope.alert('Predet','Precaución: El mensaje es demasiado corto');
      else if($('#textareaNotificaciones').val().length > 159)
        $scope.alert('Predet','Precaución: El mensaje es demasiado largo');
      //$("#enviarNotificaciones").attr('disabled',false);
    }
  }

  $('select').not('.disabled').material_select();
  cargarCursosFiltro();    
  $("select[name='selectSedeFiltro']").on('change', function(){
    var a = this.value;
    $timeout(function(){    
      $scope.sedeNotificacionesCurso = a;
    },100);
    if($scope.cursosFiltro.length == 0)
      cargarCursosFiltro();
  });      
})