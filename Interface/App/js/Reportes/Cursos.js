myApp

.config(function($stateProvider) {

  var carpeta = 'templates/Reportes/';
  
  $stateProvider

  .state('app.reporteCurso', {
    url: '/reporteCurso',
    templateUrl: carpeta+'Cursos.html?version='+version,
    controller: 'ReporteCursosCtrl'
  })
});

controllers

.controller('ReporteCursosCtrl',function($scope,$state,$timeout,NotificacionService,ReporteServices,EstudiantesService,AjaxService){
  $scope.meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];  
  $scope.setLoaded($scope.mostrarloaded);
  $scope.sedeReporte = 0;
  $scope.cursosFiltro = [];
  $scope.checkCurso = false;  
  $scope.checkMes = false;

  var mesChecked = 0;
  var nombreCurso = "";
  var cursosChecked = [];
  var llamados = [];

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

  var cargarCursosFiltro = function(){
    NotificacionService.getCursos(AjaxService.miAjax).then(function(cursos){
      $scope.cursosFiltro = cursos;
      //console.log($scope.cursosFiltro);
    }, function(a){
      $scope.alert('Error_Red');
    });
  }

  $scope.iniciar(function(){
    $timeout(function(){
      if(Object.keys($scope.sedesJornadas).length == 0)
        $state.go('app.principal');
      else{
        $scope.setLoaded(1);
        $('select').not('.disabled').material_select();
        $("select[name='selectSedeFiltro']").on('change', function(){
          var a = this.value;
          $timeout(function(){
            $scope.sedeReporte = a;
          },100);
          if($scope.cursosFiltro.length == 0)
            cargarCursosFiltro();
        });
        cargarLlamadas();
      }
    },200);
  });

  var revisarCheckCurso = function(){
    var temp = false;
    for (var i = 0; i < $('input[id^="curso"]').length; i++) {
      if($($('input[id^="curso"]')[i]).prop("checked") == true){
        temp = true;
        break;
      }
    }
    $scope.checkCurso = temp;
  }

  var revisarCheckJornada = function(cursos,idSede,idJornada){
    var revisarCheck = true;
    for (var j = 0; j < cursos.length; j++) {
      if($('#curso'+cursos[j].Id+idJornada+idSede).prop("checked") == false)
      {
        revisarCheck = false;
        break;
      }
    }
    $('#jornada'+idJornada+idSede).prop("checked", revisarCheck);
  }

  var revisarCheckSede = function(jornadas,idSede){
    var revisarCheck = true;
    for (var j = 0; j < jornadas.length; j++) {
      if($('#jornada'+jornadas[j].IdJornada+idSede).prop("checked") == false)
      {
        revisarCheck = false;
        break;
      }
    }
    $('#sede'+idSede).prop("checked", revisarCheck);
  }

  $scope.checkSede = function(idSede){
    var propi = $('#sede'+idSede).prop("checked");
    var sedeCheck = $.grep($scope.cursosFiltro, function(e){ return e.IdSede == idSede; })[0];
    $scope.checkCurso = propi;
    for (var i = 0; i < sedeCheck.Jornadas.length; i++) {
      for (var j = 0; j < sedeCheck.Jornadas[i].Cursos.length; j++) {
        $('#curso'+sedeCheck.Jornadas[i].Cursos[j].Id+sedeCheck.Jornadas[i].IdJornada+idSede).prop("checked",propi);
      }
      $('#jornada'+sedeCheck.Jornadas[i].IdJornada+idSede).prop("checked",propi);
    }
  }

  $scope.checkJornada = function(idSede,idJornada){
    var propi = $('#jornada'+idJornada+idSede).prop("checked");
    var sedeCheck = $.grep($scope.cursosFiltro, function(e){ return e.IdSede == idSede; })[0];
    var jornadaCheck = $.grep(sedeCheck.Jornadas, function(e){ return e.IdJornada == idJornada; })[0];
    var revisarCheck = true;
    for (var j = 0; j < jornadaCheck.Cursos.length; j++) {
      $('#curso'+jornadaCheck.Cursos[j].Id+idJornada+idSede).prop("checked",propi);
    }

    if(propi == false){
      $('#sede'+idSede).prop("checked",false);
      revisarCheckCurso();
    }
    else
    {
      $scope.checkCurso = propi;      
      revisarCheckSede(sedeCheck.Jornadas,idSede);
    }
  }

  $scope.checkCursoFiltro = function(idSede,idJornada,idCurso){
    var propi = $('#curso'+idCurso+idJornada+idSede).prop("checked");
    var sedeCheck = $.grep($scope.cursosFiltro, function(e){ return e.IdSede == idSede; })[0];
    var jornadaCheck = $.grep(sedeCheck.Jornadas, function(e){ return e.IdJornada == idJornada; })[0];

    if(propi == false){
      $('#sede'+idSede).prop("checked",false);
      $('#jornada'+idJornada+idSede).prop("checked",false);
      revisarCheckCurso();
    }
    else
    {
      $scope.checkCurso = propi;
      revisarCheckJornada(jornadaCheck.Cursos,idSede,idJornada);
      revisarCheckSede(sedeCheck.Jornadas,idSede);
    }
  }

  $scope.checkMesReportes = function(index){
    var propi = $('#mes'+index).prop("checked");
    mesChecked = -1;
    $scope.checkMes = propi;

    if(propi){
      mesChecked = parseInt(index);
      for (var j = 0; j < $scope.meses.length; j++) {
        if(j != index)
          $('#mes'+j).prop("checked",false);
      }
    }
  }

  var cargarLlamadas = function(){
    EstudiantesService.getTipoAsistencia(AjaxService.miAjax).then(function(data){
      llamados = data;
    }, function(a){
      $scope.alert('Error_Red');
    });
  }

  $scope.modalgenerarPdf = function(){
    var texto = "Generando PDF del mes de " + $scope.meses[mesChecked];
    texto += "\n Esta seguro?";
    $scope.confirm("Generando PDF",texto,function() {
      generarPdf();  
    });
  }

  var generarPdf = function(){
    var cursosReporteAsistencia = [];
    for (var i = 0; i < $('input[id^="curso"]').length; i++) {
      if($($('input[id^="curso"]')[i]).prop("checked") == true)
        cursosReporteAsistencia.push($($('input[id^="curso"]')[i]).data('curso'));
    }
    if(cursosReporteAsistencia.length>0 && mesChecked > -1)
    {
      ReporteServices.getAsistenciasCursos(mesChecked,cursosReporteAsistencia,AjaxService.miAjax).then(function(response){
        var doc = new jsPDF('landscape');
        doc.text("Reporte del mes: " + $scope.meses[mesChecked], 14, 16);
        doc.autoTable(getColumnsPdf(), getDataPdf(response), {
          startY: 20,
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
          title: 'Reporte ' + nombreCurso,
          // subject: 'A jspdf-autotable example pdf (' + funcStr + ')'
        });
        doc.save('Reporte ' + nombreCurso + '.pdf');
      }, function(a){
        $scope.alert('Error_Red');
      });
    }
    else
    {
      if(cursosReporteAsistencia.length==0)
        $scope.alert('Predet','Precaución: No se selecciono ningun curso');
      else if(mesChecked == -1)
        $scope.alert('Predet','Precaución: No se selecciono ningun mes');
    }
  }

  var getColumnsPdf = function(){
    var columnas = [
      {
        title: "Curso",
        dataKey: "curso"
      },
      {
        title: "No \nEstudiantes",
        dataKey: "estudiantes"
      },
      {
        title: "Dias \nHabiles",
        dataKey: "diasHabiles"
      },
      {
        title: "LLamadas \nHechas",
        dataKey: "llamadas"
      },
    ];

    for (var j = 0; j < llamados.length; j++) {
      if(llamados[j].Alias == "Aus"){
        columnas.push({
          title: llamados[j].Nombre + "\n Injustificada",
          dataKey: "ausInjus"
        });
        columnas.push({
          title: "%",
          dataKey: "porcentajeAusInjus"
        });
        columnas.push({
          title: llamados[j].Nombre + "\n Justificada",
          dataKey: "ausJus"
        });
        columnas.push({
          title: "%",
          dataKey: "porcentajeAusJus"
        });
        columnas.push({
          title: "Total \n" + llamados[j].Nombre,
          dataKey: "ausTotal"
        });
        columnas.push({
          title: "%",
          dataKey: "porcentajeAusTotal"
        });
      }
      else{
        columnas.push({
          title: "Total " + llamados[j].Nombre,
          dataKey: llamados[j].Alias
        });
        columnas.push({
          title: "%",
          dataKey: "porcentaje"+llamados[j].Alias
        });
      }
    }

    console.log(columnas);
    return columnas;
  }

  var getDataPdf = function(data){
    var diasHabiles = cargarDiasHabiles();
    var DataContent = [];

    for (var j = 0; j < data.length; j++) {
      var tempData;
      if(DataContent.length == 0 || DataContent[DataContent.length-1].curso != data[j].Nombre){
        tempData = {
          curso: data[j].Nombre,
          diasHabiles: diasHabiles,
          estudiantes: data[j].CantidadEstudiantes,
          llamadas: data[j].CantidadLlamadas
        };
        DataContent.push(tempData);
      }

      tempData = DataContent[DataContent.length-1];

      var totalAsistencia = data[j].CantidadLlamadas*data[j].CantidadEstudiantes;
      if(data[j].AliasAsistencia == "Aus"){
        var ausInJus = data[j].CantidadAusencias - data[j].CantidadJustificaciones;
        tempData.ausInjus = ausInJus;
        tempData.ausJus = data[j].CantidadJustificaciones;
        tempData.porcentajeAusJus = Math.floor(data[j].CantidadJustificaciones*100/totalAsistencia);
        tempData.porcentajeAusInjus = Math.floor(ausInJus*100/totalAsistencia);
        tempData.ausTotal = data[j].CantidadAusencias;
        tempData.porcentajeAusTotal = Math.floor(data[j].CantidadAusencias*100/totalAsistencia);
      }
      else{
        tempData[data[j].AliasAsistencia] = data[j].CantidadAusencias;
        tempData["porcentaje"+data[j].AliasAsistencia] = Math.floor(data[j].CantidadAusencias*100/totalAsistencia);
      }

      // DataContent[DataContent.length-1] = tempData;
    }

    console.log(DataContent);
    return DataContent;
  }

  var cargarDiasHabiles = function(){
    var dias = 0;
    var year = 2018;
    var fecha1 = (new Date(year, mesChecked, 1)).getTime() ;
    var fecha2 = (new Date(year, mesChecked + 1, 1)).getTime();
    while(fecha2 > fecha1){
      var date = new Date(fecha1);
      var dia = date.getDate();
      if (date.getDay() != 6 && date.getDay() != 0) {
        dias++;
      }
      fecha1 = fecha1 + (24*60*60*1000);
    }
    return dias;
  }
})