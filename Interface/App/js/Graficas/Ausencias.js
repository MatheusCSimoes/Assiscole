myApp

.config(function($stateProvider) {

  var carpeta = 'templates/Graficas/';
  
  $stateProvider

  .state('app.graficaAusencias', {
    url: '/graficaAusencias',
    templateUrl: carpeta+'Ausencias.html?version='+version,
    controller: 'GraficaAusenciasCtrl'
  })
});

controllers

.controller('GraficaAusenciasCtrl',function($state,$scope,$timeout,AjaxService,GraficasService,NotificacionService){
  $scope.setLoaded($scope.mostrarloaded);  
  $scope.mostrar = {
    columnaAlumno: false,
    tablaColor: false,
  }
  $scope.grafica = {
    historiales: [],
    titulo: "Fecha",
    nombres: [],
    totalLlamadas: 0,
  }
  $scope.configGrafica = {
    sede: "",
    jornada: "",
    curso: "",
    tipo: "1",
    dias: "1",
  }
  $scope.configBuscador = {
    sedes: [],
    jornadas: [],
    cursos: [],
    tipos: [
      {Id:1,Nombre:"Sedes"},
      {Id:2,Nombre:"Jornadas"},
      {Id:3,Nombre:"Cursos"},
      {Id:4,Nombre:"Alumnos"},
    ]
  }

  var sedes = [];
  var dias = [];

  $scope.iniciar(function(){
    $timeout(function(){     
      cargarSedesJornadas();       
    },200);  
  });

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
  picker1.set('max', Date.now() - (1*24*60*60*1000));
  picker2.set('max', Date.now());

  picker1.on({
    close: function() {
      var a = picker1.get('select').pick;
      picker2.set('min', new Date(a));
      cargarDiasHabiles(picker1.get('select').pick,picker2.get('select').pick+(24*60*60*1000));
    },
  })
  picker2.on({
    close: function() {
      var a = picker2.get('select').pick;
      picker1.set('max',  new Date(a));
      cargarDiasHabiles(picker1.get('select').pick,picker2.get('select').pick+(24*60*60*1000));
    },
  })

  var cargarDiasHabiles = function(fecha1, fecha2){
    dias = [];
    while(fecha2 > fecha1){
      var date = new Date(fecha1);
      var mes = date.getMonth() + 1;
      var dia = date.getDate();
      if (date.getDay() != 6 && date.getDay() != 0) {
        dias.push(mes + '/' + dia);
      }
      fecha1 = fecha1 + (24*60*60*1000);
    }
    //console.log(dias);
  }

  cargarDiasHabiles(picker1.get('select').pick,picker2.get('select').pick+(24*60*60*1000));

  $scope.getColor = function(index){
    if(index == 0)
      return 'red lighten-2';
    else if(index == 1)
      return 'yellow lighten-2';
    else if(index == 2)
      return 'green lighten-2';
  }

  $scope.graficarAusencias = function(){
    // $scope.cargarHistorial(picker1.get('select', 'yyyy-mm-dd'),picker2.get('select', 'yyyy-mm-dd'));
    // console.log($scope.configGrafica);
    $("#BotonGraficar").attr('disabled',true);
    $("#BotonGraficar").text('Cargando...');
    $('.determinate').width(0+'%');
    $('#progress').show();    
    switch($scope.configGrafica.dias) {
      case "1":
        cargarAusenciasSumatoria(picker1.get('select', 'yyyy-mm-dd'),picker2.get('select', 'yyyy-mm-dd'));
        break;
      case "2":        
        cargarAusenciasDias($scope.configGrafica,picker1.get('select', 'yyyy-mm-dd'),picker2.get('select', 'yyyy-mm-dd'),false);
        break;
      case "3":
        cargarAusenciasDias($scope.configGrafica,picker1.get('select', 'yyyy-mm-dd'),picker2.get('select', 'yyyy-mm-dd'),true);
        break;
      default:
        $scope.alert("Error Grafica Ausencias");
    }

    cargarDiasLlamados(picker1.get('select', 'yyyy-mm-dd'),picker2.get('select', 'yyyy-mm-dd'));
  }

  $scope.verEstudiante = function(historial){
    $scope.setControllerToController({
      estudiante:historial.Id,
      fuente:"AusenciaEstudiante",
    })
    $state.go('app.estudianteHistorial');
  }

  var cargarSedesJornadas = function(){
    NotificacionService.getCursos(AjaxService.miAjax).then(function(_sedes){
      sedes = _sedes;
      for (var i = 0; i < sedes.length; i++) {
        var objectSede = {
            Id:sedes[i].IdSede,
            Nombre:sedes[i].NombreSede,
          }
        $scope.configBuscador.sedes.push(objectSede);
        for (var j = 0; j < sedes[i].Jornadas.length; j++) {
          var objectJornada = {
            Id:sedes[i].Jornadas[j].IdJornada,
            Nombre:sedes[i].Jornadas[j].NombreJornada,
          }
          var jornada = $.grep($scope.configBuscador.jornadas, function(e){ return e.Id == objectJornada.Id; })[0];
          if(jornada == undefined){
            $scope.configBuscador.jornadas.push(objectJornada);          
          }
        }
      }    
      // console.log($scope.configBuscador);

      $timeout(function(){     
        $scope.setLoaded(1);
        // $('select').material_select('destroy');
        // $('select').not('.disabled').material_select();
        $('select').material_select();
        $("select[name='selectSedeFiltro']").on('change', function(){
          if($scope.configGrafica.sede != "" && $scope.configGrafica.jornada != "")
            cargarCursosFiltro();
          else if($scope.configBuscador.cursos.length != 0)
            actualizarSelectCursos([]);
        });
        $("select[name='selectJornadaFiltro']").on('change', function(){
          if($scope.configGrafica.sede != "" && $scope.configGrafica.jornada != "")
            cargarCursosFiltro();
          else if($scope.configBuscador.cursos.length != 0)
            actualizarSelectCursos([]);
        });
      },200); 
    }, function(a){
      $scope.alert('Error_Red');
    });
  }  

  var cargarCursosFiltro = function(){
    var sedeSelect = $.grep(sedes, function(e){ return e.IdSede == $scope.configGrafica.sede; })[0];
    var jornadaSelect = $.grep(sedeSelect.Jornadas, function(e){ return e.IdJornada == $scope.configGrafica.jornada; })[0];
    if(jornadaSelect != undefined){
      actualizarSelectCursos(jornadaSelect.Cursos);
    }
    else{
      actualizarSelectCursos([]);
    }
  }

  var actualizarSelectCursos = function(arrayCursos){    
    $scope.configGrafica.curso = "";
    $scope.configBuscador.cursos = arrayCursos;
    $scope.$apply();
    $("select[name='selectCursoFiltro']").material_select();
  }

  var cargarAusenciasSumatoria = function(fecha1,fecha2){
    $scope.grafica.titulo = $scope.configBuscador.tipos[$scope.configGrafica.tipo-1].Nombre;
    var tempFecha = new Date(fecha2);
    tempFecha = new Date(tempFecha.getTime() + (24*60*60*1000));
    GraficasService.getAusenciaSumatoria($scope.configGrafica,fecha1,tempFecha.toISOString().substring(0,10),AjaxService.miAjax).then(function(historial){
      //console.log(historial);
      $('#cantidadProgress').html('0/' + (historial == 0?0:historial.length) + " Datos Procesados");
      var data = [];
      var nombres = [];
      $scope.grafica.historiales = [];
      $scope.cantidadTotal = 0;

      if($scope.worker){
        var worker = new Worker('js/Workers/cargarAusenciasSumatoria.js');
        worker.onmessage = function (e) {
          // console.log(e);
          var dW = e.data;
          switch (dW.caso) {
            case 'atualizar':
              $scope.grafica.historiales.push(dW.historialTemp);       
              data.push(historial[dW.j].CantidadAusencias);
              $scope.cantidadTotal += parseInt(historial[dW.j].CantidadAusencias);
              //Si son alumnos no se coloca el nombre, se colocan son numeros y se etiquetan en la tabla
              if($scope.configGrafica.tipo == 4)
                nombres.push((dW.j+1));
              else
                nombres.push(historial[dW.j].Nombre);

              $('#cantidadProgress').html((dW.j+1)+"/"+historial.length + " Datos Procesados");
              $('.determinate').width(((dW.j+1)*100/historial.length)+'%')

              break;
            case 'fin':
              continuarGrafica();
              break;
            default:
              console.log("Worker sin saber que hacer");
          };
        };
        worker.postMessage(
          {
            historial: historial, 
            tipo: $scope.configGrafica.tipo
          });
      }
      else{
        for (var j = 0; j < historial.length; j++) {
          //Si son alumnos no se coloca Id
          var historialTemp = {};
          if(tipo == 4){
            historialTemp = {
              Id: historial[j].Id, //Id me sirve para buscarlo despues en la lupa
              Numero: (j+1),
            }
          }
          historialTemp.Dia = historial[j].Nombre;
          historialTemp.Cantidad = historial[j].CantidadAusencias;
          historialTemp.CantidadLlamadas = historial[j].CantidadLlamadas;
          historialTemp.Porcentaje = Math.round((historial[j].CantidadAusencias*100)/(historial[j].CantidadEstudiantes*historial[j].CantidadLlamadas/historial[j].CantidadCursos)*10)/10
          
          $scope.grafica.historiales.push(historialTemp);       
          data.push(historial[j].CantidadAusencias);
          $scope.cantidadTotal += parseInt(historial[j].CantidadAusencias);
          //Si son alumnos no se coloca el nombre, se colocan son numeros y se etiquetan en la tabla
          if($scope.configGrafica.tipo == 4)
            nombres.push((j+1));
          else
            nombres.push(historial[j].Nombre);

          $('#cantidadProgress').html((j+1)+"/"+historial.length + " Datos Procesados");
          $('.determinate').width(((j+1)*100/historial.length)+'%')
        }
        continuarGrafica();
      }

      var continuarGrafica = function(){        
        // console.log($scope.grafica.historiales);
        //Rellena las sedes o las jornadas faltantes
        if($scope.configGrafica.tipo == 1 || $scope.configGrafica.tipo == 2){
          var relleno = $scope.configGrafica.tipo == 1?$scope.configBuscador.sedes:$scope.configBuscador.jornadas;
          if(nombres.length < relleno.length){
            for (var i = 0; i < relleno.length; i++) {
              if(nombres.indexOf(relleno[i].Nombre) == -1){
                nombres.push(relleno[i].Nombre);
                data.push(0);
                $scope.grafica.historiales.push({
                  Dia: relleno[i].Nombre,
                  Cantidad: 0
                });
              }
            }
          }
        }

        if(window.BarChart != undefined)
          window.BarChart.destroy()

        var BarChartSampleData = {
          labels: nombres,
          datasets: [
            {
              label: "Dataset",
              fillColor: "rgba(0,188,212,0.5)",
              strokeColor: "rgba(0,188,212,0.8)",
              highlightFill: "rgba(0,188,212,0.75)",
              highlightStroke: "rgba(0,188,212,1)",
              data: data,
            }
          ]
        };

        window.BarChart = new Chart(document.getElementById("graficaHistorial").getContext("2d")).Bar(BarChartSampleData,{
          responsive:true,
        });

        terminarCargaGrafica(true);        
      }
    }, function(a){
      $scope.setLoaded(1);
      $scope.alert('Error_Red');
    });
  }
  
  var cargarAusenciasDias = function(tipo,fecha1,fecha2,esDiasSemana){
    $scope.grafica.titulo = "Fecha";
    $scope.grafica.nombres = [];
    var diasSemana = ["Lunes","Martes","Miercoles","Jueves","Viernes"];
    var tempFecha = new Date(fecha2);
    tempFecha = new Date(tempFecha.getTime() + (24*60*60*1000));    
    $('#cantidadProgress').html('0/'+dias.length + " Dias Procesados");
    GraficasService.getAusenciaDias(tipo,fecha1,tempFecha.toISOString().substring(0,10),AjaxService.miAjax).then(function(historial){
      var data = [];
      var nombres = [];
      var pos = [];      

      if($scope.worker){
        var worker = new Worker('js/Workers/cargarAusenciasDias.js');
        worker.onmessage = function (e) {
          console.log(e);
          var dW = e.data;
          switch (dW.caso) {
            case 'atualizar':
              $('#cantidadProgress').html((dW.i+1)+"/"+dias.length + " Dias Procesados");
              $('.determinate').width(((dW-i+1)*100/dias.length)+'%')
              break;
            case 'fin':
              data = dW.data;
              nombres = dW.nombres;
              pos = dW.pos;
              continuarGrafica();
              break;
            default:
              console.log("Worker sin saber que hacer");
          };
        };
        worker.postMessage(
          {
            dias: dias, 
            nombres: nombres,
            historial: historial, 
            data: data,
            esDiasSemana: esDiasSemana,
          });  
      }    
      else{
        for (var i = 0; i < historial.length; i++) {
          if(nombres.indexOf(historial[i].Nombre) < 0){
            nombres.push(historial[i].Nombre);      
            if(!esDiasSemana)    
              dataW.push([]);
            else
              dataW.push([0,0,0,0,0]);
            pos.push({
              index:pos.length,
              cantidad:0,
            })
          }
        }

        for (var i = 0; i < dias.length; i++) {
          //Luego los nombres (Sedes,Jornadas,Cursos o Alumnos)
          for (var k = 0; k < nombres.length; k++) {
            if(!esDiasSemana)
              data[k].push(0);
            //Revisa lo que respondio la consulta para cargar las ausencias
            for (var j = 0; j < historial.length; j++) {
              if(historial[j].Nombre == nombres[k]){              
                var date = new Date(historial[j].Dia);
                var mes = date.getUTCMonth() + 1;
                var dia = date.getUTCDate();
                if(dias[i] == mes + '/' + dia)
                {
                  if(!esDiasSemana)    
                    data[k][i] += parseInt(historial[j].Cantidad);
                  else
                    data[k][date.getDay()] += parseInt(historial[j].Cantidad);
                  pos[k].cantidad += parseInt(historial[j].Cantidad);
                }
              }
            }          
          }

          $('#cantidadProgress').html((i+1)+"/"+dias.length + " Dias Procesados");
          $('.determinate').width(((i+1)*100/dias.length)+'%')
        }
        continuarGrafica();
      }

      var continuarGrafica = function(){
        if(window.BarChart != undefined)
          window.BarChart.destroy()

        var BarChartSampleData = {
          labels: esDiasSemana?diasSemana:dias,
          datasets: []
        };

        if(pos.length > 0){
          $scope.grafica.nombres.push(nombres[pos[0].index]);
          BarChartSampleData.datasets.push({
            label: "Dataset",
            fillColor: "rgba(229,115,115,0.5)",
            strokeColor: "rgba(229,115,115,0.8)",
            highlightFill: "rgba(229,115,115,0.75)",
            highlightStroke: "rgba(229,115,115,1)",
            data: data[pos[0].index]
          })
        }

        if(pos.length > 1){
          $scope.grafica.nombres.push(nombres[pos[1].index]);
          BarChartSampleData.datasets.push({
            label: "Dataset",
            fillColor: "rgba(255,241,118,0.5)",
            strokeColor: "rgba(255,241,118,0.8)",
            highlightFill: "rgba(255,241,118,0.75)",
            highlightStroke: "rgba(255,241,118,1)",          
            data: data[pos[1].index]
          })
        }

        if(pos.length > 2){
          $scope.grafica.nombres.push(nombres[pos[2].index]);
          BarChartSampleData.datasets.push({
            label: "Dataset",
            fillColor: "rgba(129,199,132,0.5)",
            strokeColor: "rgba(129,199,132,0.8)",
            highlightFill: "rgba(129,199,132,0.75)",
            highlightStroke: "rgba(129,199,132,1)",
            data: data[pos[2].index]
          })
        }

        terminarCargaGrafica(false);

        window.BarChart = new Chart(document.getElementById("graficaHistorial").getContext("2d")).Bar(BarChartSampleData,{
          responsive:true
        });
      }

    }, function(a){
      $scope.setLoaded(1);
      $scope.alert('Error_Red');
    });
  }

  var cargarDiasLlamados = function(fecha1,fecha2){
    var tempFecha = new Date(fecha2);
    tempFecha = new Date(tempFecha.getTime() + (24*60*60*1000));
    GraficasService.getLlamadasTomadas($scope.configGrafica,fecha1,tempFecha.toISOString().substring(0,10),AjaxService.miAjax).then(function(response){
      var cursosTomados = response.length;
      var cantidadLlamadas = 0;
      for (var i = 0; i < response.length; i++) {
        if(response[i].CantidadLlamadas != null)
        cantidadLlamadas += parseInt(response[i].CantidadLlamadas);
      }

      $scope.grafica.totalLlamadas = cursosTomados*dias.length;
      var PieDoughnutChartData = [
        {
            value: $scope.grafica.totalLlamadas - cantidadLlamadas,
            color:"#ffab91",
            highlight: "#ff8a65",
            label: "Asistencia sin tomar"
        },
        {
            value: cantidadLlamadas,
            color: "#c5e1a5",
            highlight: "#aed581",
            label: "Asistencia Tomada"
        },
      ]

      if(window.DoughnutChart != undefined)
        window.DoughnutChart.destroy()

      window.DoughnutChart = new Chart(document.getElementById("doughnut-chart").getContext("2d")).Pie(PieDoughnutChartData,{
       responsive:true
      });
      actualizarTorta = false;
    }, function(a){
      $scope.setLoaded(1);
      $scope.alert('Error_Red');
    });
 }

  var terminarCargaGrafica = function(dias){
    if(!dias){
      $scope.mostrar.tablaColor = true;
      $scope.mostrar.columnaAlumno = false;
    }
    else{
      $scope.mostrar.tablaColor = false;
      if($scope.configGrafica.tipo == 4)
        $scope.mostrar.columnaAlumno = true;
      else
        $scope.mostrar.columnaAlumno = false;
    }
    $("#BotonGraficar").attr('disabled',false);
    $("#BotonGraficar").html('Graficar <i class="mdi-editor-insert-chart right"></i>');
    $('#progress').show();   
    $scope.$apply(); 
  }
})