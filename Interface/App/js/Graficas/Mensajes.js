myApp

.config(function($stateProvider) {

  var carpeta = 'templates/Graficas/';
  
  $stateProvider

  .state('app.graficaMensajes', {
    url: '/graficaMensajes',
    templateUrl: carpeta+'Mensajes.html?version='+version,
    controller: 'GraficaMensajesCtrl'
  })
});

controllers

.controller('GraficaMensajesCtrl',function($state,$scope,$timeout,AjaxService,GraficasService){
  $scope.setLoaded($scope.mostrarloaded);
  var dias = [];
  $scope.historiales = [];

  $timeout(function(){     
    $scope.setLoaded(1);
    $('select').not('.disabled').material_select();
  },200);
  
  $('.datepicker1').pickadate({
    selectMonths: true, // Creates a dropdown to control month
    selectYears: 15 // Creates a dropdown of 15 years to control year
  });
  $('.datepicker2').pickadate({
    selectMonths: true, // Creates a dropdown to control month
    selectYears: 15 // Creates a dropdown of 15 years to control year
  });
  var $input1 = $('.datepicker1').pickadate();
  var $input2 = $('.datepicker2').pickadate();

  // Use the picker object directly.
  var picker1 = $input1.pickadate('picker');
  var picker2 = $input2.pickadate('picker');

  picker2.set('select', new Date()); 
  picker1.set('select', Date.now() - (6*24*60*60*1000)); 
  picker2.set('min', Date.now());
  picker1.set('max', Date.now() - (6*24*60*60*1000));
  picker2.set('max', Date.now());

  picker1.on({
    close: function() {
      var a = picker1.get('select').pick + (6*24*60*60*1000);
      picker2.set('min', new Date(a));
      $scope.cargarLabels(picker1.get('select').pick,picker2.get('select').pick+(24*60*60*1000));
    },
  })
  
  picker2.on({
    close: function() {
      var a = picker2.get('select').pick - (6*24*60*60*1000);
      picker1.set('max',  new Date(a));
      $scope.cargarLabels(picker1.get('select').pick,picker2.get('select').pick+(24*60*60*1000));
    },
  })

  $scope.cargarLabels = function(fecha1, fecha2){
    dias = [];
    while(fecha2 > fecha1){
      var date = new Date(fecha1);
      var mes = date.getMonth() + 1;
      var dia = date.getDate();
      dias.push(mes + '/' + dia);
      fecha1 = fecha1 + (24*60*60*1000);
    }
  }

  $scope.cargarLabels(picker1.get('select').pick,picker2.get('select').pick+(24*60*60*1000));

  $scope.graficar = function(){
    $scope.cargarHistorial(picker1.get('select', 'yyyy-mm-dd'),picker2.get('select', 'yyyy-mm-dd'));
  }

  $scope.cargarHistorial = function(fecha1,fecha2 = null){
    var tempFecha = new Date(fecha2);
    tempFecha = new Date(tempFecha.getTime() + (24*60*60*1000));
    GraficasService.getHistorialMensajes(fecha1,tempFecha.toISOString().substring(0,10),AjaxService.miAjax).then(function(historial){
      //console.log(historial);
      var data = [];
      $scope.historiales = [];
      $scope.cantidadTotal = 0;
      for (var i = 0; i < dias.length; i++) {
        data.push(0);
        $scope.historiales.push({
          Dia: dias[i],
          Cantidad: 0
        });
        for (var j = 0; j < historial.length; j++) {
          var date = new Date(historial[j].Dia);
          var mes = date.getUTCMonth() + 1;
          var dia = date.getUTCDate();
          if(dias[i] == mes + '/' + dia)
          {
            $scope.historiales[i].Cantidad = data[i] + parseInt(historial[j].Cantidad);
            data[i] = data[i] + parseInt(historial[j].Cantidad);
            $scope.cantidadTotal+=parseInt(historial[j].Cantidad);
          }
        }
      }
      if(window.LineChartSample != undefined)
        window.LineChartSample.destroy()

    var LineChartSampleData = {
        labels: dias,
        datasets: [{
          label: "Historial",
          fillColor: "rgba(0,172,193,0.2)",
          strokeColor: "rgba(0,172,193,1)",
          pointColor: "rgba(0,172,193,1)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(220,220,220,1)",
          data: data
        }]
      };

      window.LineChartSample = new Chart(document.getElementById("graficaHistorial").getContext("2d")).Line(LineChartSampleData,{
        responsive:true
      });

    }, function(a){
      $scope.setLoaded(1);
      $scope.alert('Error_Red');
    });
  }

  //Y-m-d
  // var dateObj = new Date();
  // var month = dateObj.getMonth() + 1; //months from 1-12
  // var day = dateObj.getDate();
  // var year = dateObj.getFullYear();
  // month = month<10?'0'+month:month;
  // day = day<10?'0'+day:day;
  // newdate = year+"-"+month+"-"+day;
  // $scope.fecha = newdate;
  // $scope.cargarHistorial(0,0,newdate);
})