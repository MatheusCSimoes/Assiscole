myApp

.config(function($stateProvider) {

  var carpeta = 'templates/Reportes/';
  
  $stateProvider

  .state('app.reporteAuxilio', {
    url: '/reporteAuxilio',
    templateUrl: carpeta+'Auxilio.html?version='+version,
    controller: 'ReporteAuxilioCtrl'
  })

});

controllers

.controller('ReporteAuxilioCtrl',function($scope,$state,$timeout,NotificacionService,ReporteServices,AjaxService){
  $scope.Tipo = null;
  $scope.setLoaded($scope.mostrarloaded);
  $scope.estudiantesEncontrados = [];
  $scope.estudianteNP = false;
  $scope.estudianteNPS = false;
  $scope.estudiantesSeleccionados = [];
  $('textarea#textareaNotificaciones').characterCounter();

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
    },
  })
  
  picker2.on({
    close: function() {
      var a = picker2.get('select').pick - (6*24*60*60*1000);
      picker1.set('max',  new Date(a));
    },
  })

  var preferenciasMulti = function(pref){
    if(pref == "preferenciasFiltroEstudiante"){
      $scope.botonEstudiante = "mdi-content-add";  
      $scope.botonBuscar = 1;
    }
    if(pref == "preferenciasEstudiantesSeleccionados"){
      $scope.mensajeFaltaDatos = "Datos Incompletos";  
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

  $scope.seleccionarEstudiante = function(estudiante){
    $scope.estudianteNPS = true;
    $scope.estudianteNP = false;
    var estudianteSeleciconar = $.grep($scope.estudiantesSeleccionados, function(e){ return e.Id == estudiante.Id; });
    if(estudianteSeleciconar.length == 0)
      $scope.estudiantesSeleccionados.push(estudiante);
    $scope.estudiantesEncontrados = [];
  }

  $scope.desseleccionarEstudiante = function(estudiante){
    var index = $scope.estudiantesSeleccionados.indexOf(estudiante);
    $scope.estudiantesSeleccionados.splice(index, 1);
    if($scope.estudiantesSeleccionados.length == 0)
      $scope.estudianteNPS = false;
  }

  $scope.modalgenerarPdf = function(){
    swal({
      title: 'Ingresa el nombre ciclo',
      input: 'text',
      showCancelButton: true,
      inputValidator: (value) => {
        return !value && 'Nombre Invalido!'
      },
    })
    .then((result) => {
      if (result.value) {
        generarPdf(result.value);
      }
      else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    }).catch(err => {
      console.log(err);
      swal.close();
    });
  }

  var generarPdf = function(ciclo){
    var fecha1 = picker1.get('select', 'yyyy-mm-dd');
    var fecha2 = picker2.get('select', 'yyyy-mm-dd');
    var idEstudiantes = [];
    for (var i = 0; i < $scope.estudiantesSeleccionados.length; i++) {
      idEstudiantes.push($scope.estudiantesSeleccionados[i].Id);
    }
    ReporteServices.getAsistenciaAuxilio(idEstudiantes,fecha1,fecha2,AjaxService.miAjax).then(function(response){
      var meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
      var posY = 16;
      var doc = new jsPDF('landscape');
      doc.setFontSize(22);
      doc.text("Reporte de Inasistencia", 14, posY);
      posY+=6;
      doc.setFontSize(14);
      doc.text("Fecha: "+ parseInt(picker1.get('select', 'dd')) + " de " + meses[parseInt(picker1.get('select', 'mm'))-1] + "-" + parseInt(picker2.get('select', 'dd')) + " de " + meses[parseInt(picker2.get('select', 'mm'))-1], 14, posY);
      posY+=4;
      doc.autoTable(getColumnsPdf(), getDataPdf(response,ciclo), {
        startY: posY,
        margin: {horizontal: 14},
        theme: 'grid',
        styles: {
              halign: 'center',
              cellPadding: 1, 
              fontSize: 10,
              // columnWidth:24,
              cellWidth: 'wrap',
              overflow: 'visible',
              rowPageBreak: 'auto'
          },
        // columnStyles: {
            // nombre: {
              // halign: 'left',
              // columnWidth:'auto',
            // }
        // },
        tableWidth: 'wrap',
        drawHeaderCell: function (cell, data) {
          // if (data.column.raw.title == '%') {
            // cell.width = 7;
          // }
          // else{
            // cell.width = 18;
          // }
        }
      });
      doc.setProperties({
        title: 'Reporte de Inasistencia',
        // subject: 'A jspdf-autotable example pdf (' + funcStr + ')'
      });
      doc.save('Reporte de Inasistencia.pdf');
    }, function(a){
      $scope.alert('Error_Red');
    });
  }

  var getColumnsPdf = function(){
    var columnas = [
      {
        title: "#",
        dataKey: "numero"
      },
      {
        title: "TD",
        dataKey: "td"
      },
      {
        title: "DOCUMENTO",
        dataKey: "documento"
      },
      {
        title: "NOMBRES Y APELLIDOS",
        dataKey: "nombres"
      },
      // {
      //   title: "JORNADA",
      //   dataKey: "jornada"
      // },
      {
        title: "GRADO",
        dataKey: "grado"
      },
      {
        title: "GRUPO",
        dataKey: "grupo"
      },
      {
        title: "CICLO A\nVERIFICAR",
        dataKey: "ciclo"
      },
      // {
      //   title: "PERIODO\nCOMPRENDIDO",
      //   dataKey: "periodo"
      // },
      {
        title: "AUSENCIAS",
        dataKey: "ausencia"
      },
      {
        title: "JUSTIFICADAS",
        dataKey: "justificada"
      },
      {
        title: "INJUSTIFICADAS",
        dataKey: "injustificada"
      },
    ];
    return columnas;
  }

  var getDataPdf = function(data,ciclo){    
    var DataContent = [];
    var numero = 1;
    var IdAnterior = 0;
    for (var j = 0; j < data.length; j++) {
      var tempData;
      if(DataContent.length == 0 || IdAnterior != data[j].IdEstudiante){
        tempData = {
          numero: numero++,
          td: 3,
          documento: data[j].Documento,
          nombres: data[j].ApellidosNombres,
          // jornada: data[j].Jornada,
          grado: data[j].Curso,
          ciclo: ciclo,
          // periodo: fecha1 + "-\n" + fecha2,
          ausencia: data[j].Asistencia == null?"":1,
          justificada: data[j].Asistencia == null?"":data[j].Justificada == null?0:1,
          injustificada: data[j].Asistencia == null?"":data[j].Justificada == null?1:0,
        };
        DataContent.push(tempData);
        IdAnterior = data[j].IdEstudiante;
      }
      else{
        DataContent[DataContent.length-1].ausencia++;
        if(data[j].Justificada != null){
          DataContent[DataContent.length-1].Justificada++;
        }
        else{
          DataContent[DataContent.length-1].injustificada++;
        }
      }

      // tempData = DataContent[DataContent.length-1];

      // if(tempData)

      // var totalAsistencia = data[j].CantidadLlamadas*data[j].CantidadEstudiantes;
      // if(data[j].AliasAsistencia == "Aus"){
      //   var ausInJus = data[j].CantidadAusencias - data[j].CantidadJustificaciones;
      //   tempData.ausInjus = ausInJus;
      //   tempData.ausJus = data[j].CantidadJustificaciones;
      //   tempData.porcentajeAusJus = Math.floor(data[j].CantidadJustificaciones*100/totalAsistencia);
      //   tempData.porcentajeAusInjus = Math.floor(ausInJus*100/totalAsistencia);
      //   tempData.ausTotal = data[j].CantidadAusencias;
      //   tempData.porcentajeAusTotal = Math.floor(data[j].CantidadAusencias*100/totalAsistencia);
      // }
      // else{
      //   tempData[data[j].AliasAsistencia] = data[j].CantidadAusencias;
      //   tempData["porcentaje"+data[j].AliasAsistencia] = Math.floor(data[j].CantidadAusencias*100/totalAsistencia);
      // }

      // DataContent[DataContent.length-1] = tempData;
    }

    console.log(DataContent);
    return DataContent;
  }

  $timeout(function(){      
    $scope.setLoaded(1);
    var rules = {
      buscarEstudiante: {
        required: true,
        minlength: 4
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