myApp

.config(function($stateProvider) {

  var carpeta = 'templates/Historial/';
  
  $stateProvider

  .state('app.diarioHistorial', {
    url: '/diarioHistorial',
    templateUrl: carpeta+'Diario.html?version='+version,
    controller: 'DiarioHistorialCtrl'
  })
});

controllers

.controller('DiarioHistorialCtrl',function($scope,AjaxService,HistorialService){
  $scope.setLoaded($scope.mostrarloaded);
  $scope.historiales = [];
  $scope.estudiantesHistorial = [];
  $scope.mensaje = "";
  $scope.fecha = "";
  $scope.clickHistorial = {};
  $('.datepicker').pickadate({
    selectMonths: true, // Creates a dropdown to control month
    selectYears: 15 // Creates a dropdown of 15 years to control year
  });

  var $input = $('.datepicker').pickadate();

  // Use the picker object directly.
  var picker = $input.pickadate('picker');
  picker.set('select', new Date()); 
  picker.on({
    close: function() {
      // //console.log(picker.get('select', 'yyyy-mm-dd'));
      if($scope.fecha != picker.get('select', 'yyyy-mm-dd'))
      {
        $scope.fecha = picker.get('select', 'yyyy-mm-dd');
        $scope.clickHistorial = {};
        $scope.cargarHistorial(0,0,0,picker.get('select', 'yyyy-mm-dd'));
      }
    },
  })

  $scope.cargarHistorial = function(idJornada,idSede,idUser,fecha1,fecha2 = null){
    HistorialService.getHistorial(fecha1,fecha2,idJornada,idSede,idUser,AjaxService.miAjax).then(function(historial){
      $scope.setLoaded(1);      
      $('#notificacion-details').fadeOut("slow");
      $('#historial-details').fadeOut("slow");
      if(historial == 0)
        $scope.historiales = [
        {
          Sede: 'Ningun',
          Jornada: 'Registro',
        }
      ]
      else
        $scope.historiales = historial;
    }, function(a){
      $scope.setLoaded(1);
      $scope.alert('Error_Red');
    });
  }

  //Y-m-d
  var dateObj = new Date();
  var month = dateObj.getMonth() + 1; //months from 1-12
  var day = dateObj.getDate();
  var year = dateObj.getFullYear();
  month = month<10?'0'+month:month;
  day = day<10?'0'+day:day;
  newdate = year+"-"+month+"-"+day;
  $scope.fecha = newdate;
  $scope.iniciar(function(){
    $scope.cargarHistorial(0,0,0,newdate);
  });
  

  $scope.clickHistorialCursoId = function(historial){
    $('#historial-details').css("display", "none");
    $('#notificacion-details').css("display", "none");
    $scope.clickHistorial = historial;
    var id = historial.Id;
    if(historial.Jornada == "Notificacion")
      HistorialService.getHistorialNotificacionId(id,AjaxService.miAjax).then(function(historial){
        //console.log(historial);
        $scope.mensaje = historial[0].Texto;
        $scope.notificacionesHistorial = historial;
        $('#notificacion-details').fadeIn("slow");
      }, function(a){
        $scope.alert('Error_Red');
      });
    else
      HistorialService.getHistorialCursoId(id,AjaxService.miAjax).then(function(historial){
        //console.log(historial);
        $scope.estudiantesHistorial = historial;
        $('#historial-details').fadeIn("slow");
      }, function(a){
        $scope.alert('Error_Red');
      });
  }

  $scope.verificarEnviado = function(estudiante){
    if(estudiante.Enviado == 0)
      return true;
    else
      return false;
  }
})