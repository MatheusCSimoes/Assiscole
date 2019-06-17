myApp

.config(function($stateProvider) {

  var carpeta = 'templates/Cursos/';
  
  $stateProvider

  .state('app.estudantesProfessor', {
    url: '/estudantesProfessor',
    templateUrl: carpeta+'EstudantesProfessor.html?version='+version,
    controller: 'EstudantesProfessorCtrl'
  })
});

controllers

.controller('EstudantesProfessorCtrl',function($scope,$state,$timeout,EstudantesService,AjaxService,DashService,CursosService){  
  $scope.estudantesAsistencia = [];
  $scope.estudante = {};
  $scope.chamadas = [];
  $scope.novoEstudante = {};
  $scope.cursosAdicionales = {};
  var diaAnterior = false;

  if(Object.keys($scope.clickedCurso).length == 0)
    $state.go('app.cursoProfessor');

  var carregarForm = function(){
    $timeout(function(){        
      var rules = {

      }

      for (var i = 0; i < $scope.estudantes.length; i++) {
        rules["estudanteNota"+$scope.estudantes[i].Documento] = {
          digits: true
        }
      }

      $scope.activarFormulario(rules);

      },500);    
  }

  var carregarEstudantes = function(idCurso,callback){
    EstudantesService.getEstudantesDisciplina(idCurso,AjaxService.miAjax).then(function(estudantes){
      $scope.estudantes = estudantes;       
      carregarForm();
    }, function(a){
      $scope.alert('Error_Red');        
    });
  }

  $scope.atualizarNotas = function(){
    console.log($scope.estudantes);
    var tamanoTotal = $scope.estudantes.length;
    var insertarDatos = function(estudantesEnviados){
      EstudantesService.insertNotas(DashService.idUser(),$scope.clickedCurso,estudantesEnviados,AjaxService.miAjax).then(function(a){
        $state.go('app.cursos');
        $scope.alert('Bien','Notas Atualizadas');
      }, function(a){
        $state.go('app.cursos');
        $scope.alert('Bien','Notas Atualizadas');
      });
    }

    $scope.confirm('Confirmación',"Vai atualizar as notas de "+$scope.estudantes.length+" Estudante(s), Tem certeza?",function(){
      $("#tomarAsistencia").attr('disabled',true);
      $("#tomarAsistencia").text('Atualizando Notas...');
      $('#progress').show();
      $('#cantidadProgress').html('0/'+$scope.estudantes.length);
      for (var i = 0; i < $scope.estudantes.length; i++) {
        tamanoTotal--;
        var countEstudante = $scope.estudantes.length - tamanoTotal;
        $('#cantidadProgress').html(countEstudante+"/"+$scope.estudantes.length);
        $('.determinate').width(countEstudante*100/$scope.estudantes.length+'%')
      }        
      insertarDatos($scope.estudantes);
    });
  }

  carregarEstudantes($scope.clickedCurso.Id);
})