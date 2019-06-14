myApp

.config(function($stateProvider) {

  var carpeta = 'templates/Cursos/';
  
  $stateProvider

  .state('app.estudantes', {
    url: '/estudantes',
    templateUrl: carpeta+'Estudantes.html?version='+version,
    controller: 'EstudantesCtrl'
  })
});

controllers

.controller('EstudantesCtrl',function($scope,$state,$timeout,EstudantesService,AjaxService,DashService,CursosService){  
  $scope.estudantesAsistencia = [];
  $scope.estudante = {};
  $scope.chamadas = [];
  $scope.novoEstudante = {};
  $scope.cursosAdicionales = {};
  var diaAnterior = false;

  if(Object.keys($scope.clickedCurso).length == 0)
    $state.go('app.cursos');

  $timeout(function() {
    $scope.setTemplateModalEstudantes('EditarEstudante.html?version='+version);
    $timeout(function() {
      $scope.setTemplateModalEstudantes('DetalhesEstudante.html?version='+version);
      $timeout(function() {
        $scope.setTemplateModalEstudantes('NovoEstudante.html?version='+version);
      }, 200);
    }, 200);
  }, 200);  

  $scope.resetNovoEstudante = function(){
    $scope.novoEstudante = {
      Nome: null,
      Sobrenome: null,
      Documento: null,
      Responsavel: {
        Nome: null,
        Cel: null,
        Documento: null,
      },
    };
  }

  $scope.setNovoEstudante = function(estudanteEdit){    
    console.log(estudanteEdit)
    $scope.novoEstudante = {
      Nome: estudanteEdit.Nome,
      Documento: estudanteEdit.Documento,
      Responsavel: {
        Nome: estudanteEdit.Responsavel.Nome,
        Cel: estudanteEdit.Responsavel.Telefone,
        Documento: estudanteEdit.Responsavel.Documento,
      },
    };
  }

  $scope.setTemplateModalEstudantes = function(a,b){
    $scope.templateModal = modales+a;
    if(b != undefined)
      $scope.contentModal = b;
  }

  $scope.getTemplateModalEstudantes = function(){
    return $scope.templateModal;
  }

  $scope.modalNovoEstudante = function(){
    $scope.resetNovoEstudante();
    $scope.setTemplateModalEstudantes('NovoEstudante.html?version='+version);
    $timeout(function(){        

        $('#modalEstudantes').openModal();    

        var rules = {
          novoEstudanteNome: {
            required: true,
            minlength: 4
          },
          novoEstudanteSobrenome: {
            required: true,
            minlength: 4
          },
          novoEstudanteDocumento: {
            required: true,
            rangeExact: 11,
            digits: true,
          },
          novoEstudanteResponsavelNome: "required",
          novoEstudanteResponsavelCel: {
            required: true,
            digits: true,
            rangeExact: 11,
          },
          novoEstudanteResponsavelDocumento: {
            digits: true,
            required: true,
            rangeExact: 11
          }
        }

        $scope.activarFormulario(rules);

      },500);    
  }

  $scope.agregarEstudante = function(){
    $scope.novoEstudante.Curso = $scope.clickedCurso.Id;
    if(!$("#formValidate").valid())
      console.log('invalid');
    else
      {
        $('#modalEstudantes').closeModal();
        EstudantesService.insertEstudante($scope.novoEstudante,AjaxService.miAjax).then(function(a){
          var funcionSucess = function(){
            $scope.alert('Bem','Estudante Adicionado');
          }
          carregarEstudantes($scope.clickedCurso.Id,funcionSucess);
        }, function(a){
          if(a[2].includes("Duplicate"))
            $scope.alert('Mal','Documento ja existente');
          else
            $scope.alert('Mal','Estudante não agregado, Tenta de novo');
        });
      }
  }

  $scope.asistenciaEstudante = function(dia){
    var today = new Date().setHours(0, 0, 0, 0);
    if(diaAnterior){
      today = new Date(today - 24*60*60*1000);
      while(today.getDay() == 6 || today.getDay() == 0) {
        today = new Date(today - 24*60*60*1000)
      }
    }
    if(dia != null)
    {
      var date = new Date(dia).setHours(0, 0, 0, 0);
      if(date >= today)
        return true;
      else
        return false;
    }
    else
      return false;  
  }

  var carregarEstudantes = function(idCurso,callback){
    $scope.chamadas = [{"Nome":"Ausencia","Alias":"Aus","Id":"1"},{"Nome":"Retardo","Alias":"Ret","Id":"2"}];
    EstudantesService.getEstudantes(idCurso,AjaxService.miAjax).then(function(estudantes){
      $scope.estudantes = estudantes;       
      if(callback != undefined)
        callback();
    }, function(a){
      $scope.alert('Error_Red');        
    });
  }

  $scope.modalBorrarEstudante = function(estudante){
    var enviarCall = function(a){
      $scope.borrarEstudante(estudante);
    }
    $scope.confirm('Alerta','Certeza que quer apagar  o estudante '+estudante.Nome, enviarCall);
  }

  $scope.borrarEstudante = function(estudante){
    EstudantesService.deleteEstudante(estudante,AjaxService.miAjax).then(function(a){
      var funcionSucess = function(){
        $scope.alert('Bien','Estudante \"'+estudante.Nome+'\" Apagado');
      }
      carregarEstudantes($scope.clickedCurso.Id,funcionSucess);
    }, function(a){
      $scope.alert('Mal','Estudante não foi apagado, Tenta de novo');
      //console.log(a);
    });
  }

  $scope.modalDetallesEstudante = function(id){
    $scope.estudante = ($.grep($scope.estudantes, function(e){ return e.Id == id; }))[0];
    $scope.setTemplateModalEstudantes('DetalhesEstudante.html?version='+version);
    setTimeout(function() {$('#modalEstudantes').openModal();}, 500);
  }

  $scope.modalEditarEstudante = function(id){
    $scope.estudante = ($.grep($scope.estudantes, function(e){ return e.Documento == id; }))[0];
    $scope.setNovoEstudante($scope.estudante);
    //console.log($scope.novoEstudante);
    $scope.setTemplateModalEstudantes('EditarEstudante.html?version='+version);
    setTimeout(function() {

      $('#modalEstudantes').openModal();    

      var rules = {
        novoEstudanteNome: {
          required: true,
          minlength: 4
        },
        novoEstudanteSobrenome: {
          required: true,
          minlength: 4
        },
        novoEstudanteDocumento: {
          required: true,
          rangeExact: 11,
          digits: true,
        },
        novoEstudanteResponsavelNome: "required",
        novoEstudanteResponsavelCel: {
          required: true,
          digits: true,
          rangeExact: 11,
        },
        novoEstudanteResponsavelDocumento: {
          digits: true,
          required: true,
          rangeExact: 11
        }
      }

      $scope.activarFormulario(rules);

      $('select').not('.disabled').material_select();

    }, 200);
  }

  $scope.editarEstudante = function(){
    if(!$("#formValidate").valid())
      console.log('invalid');
    else
      {
        //console.log($scope.novoEstudante);
        $('#modalEstudantes').closeModal();
        EstudantesService.editEstudante($scope.estudante,$scope.novoEstudante,AjaxService.miAjax).then(function(a){
          var funcionSucess = function(){
            $scope.alert('Alert_EstudanteModificado');
          }
          carregarEstudantes($scope.clickedCurso.Id,funcionSucess);
        }, function(a){
          $scope.alert('Alert_EstudanteNoModificado');
        });
      }
  }

  $scope.checkEstudante = function(estudante,chamadas,tipo){
    if($('#'+chamadas[tipo].Alias+estudante.Documento)[0].checked)
    {
      var pos = -1;
      //Revisa si en los otros chamadas esta el estudante
      for (var i = 0; i < chamadas.length; i++) {
        if(i != tipo){
          if($('#'+chamadas[i].Alias+estudante.Documento)[0].checked){
            $('#'+chamadas[i].Alias+estudante.Documento).prop( "checked", false );
            pos = $.inArray(estudante,$scope.estudantesAsistencia);
            break;
          }    
        }
      }
      if(pos == -1){
        $scope.estudantesAsistencia.push(estudante);      
        pos = $scope.estudantesAsistencia.length-1;
      }
      $scope.estudantesAsistencia[pos].tipo = chamadas[tipo].Id;
    }
    else
    {
      var pos = $.inArray(estudante,$scope.estudantesAsistencia);
      $scope.estudantesAsistencia = $.grep($scope.estudantesAsistencia, function( n, i ) {
        return i != pos;
      });
    }
  }

  $scope.fazerChamada = function(){
    console.log($scope.estudantesAsistencia);
    var estudantesEnviados = [];
    var estudantesPorEnviar = [];
    var tamanoTotal = $scope.estudantesAsistencia.length;
    if($scope.estudantesAsistencia.length>0)
    { 
      var insertarDatos = function(estudantesEnviados){
        EstudantesService.insertAsistencia($scope.clickedCurso,estudantesEnviados,AjaxService.miAjax).then(function(a){
          $state.go('app.cursos');
          $scope.alert('Bien','Chamada Feita');
        }, function(a){
          $state.go('app.cursos');
          $scope.alert('Bien','Chamada Feita');
        });
      }

      $scope.confirm('Confirmación',"Vai fazer a chamada de "+$scope.estudantesAsistencia.length+" Estudante(s), Tem certeza?",function(){
        $("#tomarAsistencia").attr('disabled',true);
        $("#tomarAsistencia").text('Enviando Mensagens...');
        $('#progress').show();
        $('#cantidadProgress').html('0/'+$scope.estudantesAsistencia.length);
        for (var i = 0; i < $scope.estudantesAsistencia.length; i++) {
          tamanoTotal--;
          var countEstudante = $scope.estudantesAsistencia.length - tamanoTotal;
          $('#cantidadProgress').html(countEstudante+"/"+$scope.estudantesAsistencia.length);
          $('.determinate').width(countEstudante*100/$scope.estudantesAsistencia.length+'%')
        }        
        insertarDatos($scope.estudantesAsistencia);
      });
    }
    else
    {
      $scope.alert('Mal','Não escolheu nenhum estudante');
    }
  }

  carregarEstudantes($scope.clickedCurso.Id);
})