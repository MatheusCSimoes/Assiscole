myApp

.config(function($stateProvider) {

  var carpeta = 'templates/Notificacao/';
  
  $stateProvider

  .state('app.notificacaoEstudantes', {
    url: '/notificacaoEstudantes',
    templateUrl: carpeta+'Estudantes.html?version='+version,
    controller: 'NotificacaoEstudantesCtrl'
  })

});

controllers

.controller('NotificacaoEstudantesCtrl',function($scope,$state,$timeout,NotificacaoService,AjaxService,DashService){
  $scope.Tipo = null;
  $scope.estudantesEncontrados = [];
  $scope.estudanteNP = false;
  $scope.estudanteNPS = false;
  $scope.estudantesSeleccionados = [];
  $('textarea#textareaNotificacoes').characterCounter();

  var preferenciasMulti = function(pref){
    if(pref == "preferenciasFiltroEstudante"){
      $scope.botonEstudante = "mdi-content-add";  
      $scope.botonProcurar = 1;
    }
    if(pref == "preferenciasEstudantesSeleccionados"){
      $scope.mensajeFaltaDatos = "Datos Incompletos, No se le enviará Mensaje";  
    }
  }

  $scope.getTemplateMulti = function(html,pref){
    preferenciasMulti(pref);
    return multi+html+'.html?version='+version;
  }

  $scope.procurar = function(){
    if($('#procurarEstudante').val().length > 3)
    NotificacaoService.getEstudantebyNome($('#procurarEstudante').val(),AjaxService.miAjax).then(function(a){
      $scope.estudanteNP = true;
      if(a.length == 0)
        $scope.estudantesEncontrados = [{Nome:'Sin Resultados'}];
      else
        $scope.estudantesEncontrados = a;
      //console.log(a);
    }, function(a){
      $scope.alert('Error_Red');
    });
  }

  $scope.seleccionarEstudante = function(estudante){
    $scope.estudanteNPS = true;
    $scope.estudanteNP = false;
    var estudanteSeleciconar = $.grep($scope.estudantesSeleccionados, function(e){ return e.Documento == estudante.Documento; });
    if(estudanteSeleciconar.length == 0)
      $scope.estudantesSeleccionados.push(estudante);
    $scope.estudantesEncontrados = [];
  }

  $scope.desseleccionarEstudante = function(estudante){
    var index = $scope.estudantesSeleccionados.indexOf(estudante);
    $scope.estudantesSeleccionados.splice(index, 1);
    if($scope.estudantesSeleccionados.length == 0)
      $scope.estudanteNPS = false;
  }

  $scope.enviarNotificacoes = function(){
    var estudantesEnviados = [];
    var estudantesPorEnviar = [];

    if($scope.estudantesSeleccionados.length>0 && $('#textareaNotificacoes').val().length > 10 && $('#textareaNotificacoes').val().length < 159)
    {
      var tamanoTotal = $scope.estudantesSeleccionados.length;
      $('#cantidadProgress').html('0/'+$scope.estudantesSeleccionados.length);

      var insertarDatos = function(estudantesEnviados){
        NotificacaoService.insertNotificacao(DashService.idUser(),estudantesEnviados,$('#textareaNotificacoes').val(),AjaxService.miAjax).then(function(a){
          $state.go('app.cursos');
          $scope.alert('Alert_NotificacaoEnviada');
        }, function(a){
          $state.go('app.cursos');
          $scope.alert('Alert_NotificacaoEnviada');
        });
      }
      
      var posConfirm = function(){
        $("#enviarNotificacoes").attr('disabled',true);
        $("#enviarNotificacoes").text('Enviando Mensajes...');
        $('#progress').show();    
        swal.close();  
        for (var i = 0; i < $scope.estudantesSeleccionados.length; i++) {
          tamanoTotal = tamanoTotal--;
          tamanoTotal = tamanoTotal<0?0:tamanoTotal;
          var countEstudantes = $scope.estudantesSeleccionados.length - tamanoTotal;
          $('#cantidadProgress').html(countEstudantes+"/"+$scope.estudantesSeleccionados.length);
          countEstudantes = countEstudantes*100/$scope.estudantesSeleccionados.length;
          countEstudantes = countEstudantes>100?100:countEstudantes;
          $('.determinate').width(countEstudantes+'%')
        }
        insertarDatos($scope.estudantesSeleccionados)
      }

      $scope.confirm("Confirmación","Vai mandar essa notififcação a "+$scope.estudantesSeleccionados.length+" Estudantes, tem certeza?",posConfirm);
    }
    else
    {
      if($scope.estudantesSeleccionados.length==0)
        $scope.alert('Predet','Precaución: No se selecciono ningun estudante');
      else if($('#textareaNotificacoes').val().length == 0)
        $scope.alert('Predet','Precaución: El mensaje no puede estar vacio');
      else if($('#textareaNotificacoes').val().length < 10)
        $scope.alert('Predet','Precaución: El mensaje es demasiado corto');
      else if($('#textareaNotificacoes').val().length > 159)
        $scope.alert('Predet','Precaución: El mensaje es demasiado largo');
    }
  }

  $timeout(function(){      
    $("#formValidate").validate({
        rules: {
            procurarEstudante: {
              required: true,
              minlength: 4
            },
        },
        //For custom messages
        messages: {
            procurarEstudante:{
              required: "Campo requerido",
              minlength: "Debe ser mayor a 4 carcteres"
            },
        },
        errorElement : 'div',
        errorPlacement: function(error, element) {
          var placement = $(element).data('error');
          if (placement) {
            $(placement).append(error)
          } else {
            error.insertAfter(element);
          }
        }
      });

      $("#formValidate").submit(function(e){
        e.preventDefault();
      })  
  },200);
})