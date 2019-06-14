myApp

.config(function($stateProvider) {

  var carpeta = 'templates/Reportes/';
  
  $stateProvider

  .state('app.reporteEstudiantesCurso', {
    url: '/reporteEstudiantesCurso',
    templateUrl: carpeta+'EstudiantesCurso.html?version='+version,
    controller: 'ReporteEstudiantesCursoCtrl'
  })
});

controllers

.controller('ReporteEstudiantesCursoCtrl',function($scope,$state,$timeout,NotificacionService,ReporteServices,EstudiantesService,AjaxService){
  $scope.meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  $scope.mesesChecked = [];
  $scope.setLoaded($scope.mostrarloaded);
  $scope.sedeReporte = 0;
  $scope.cursosFiltro = [];
  $scope.checkCurso = false;  
  $scope.checkMes = false;
  $scope.llamados = [];

  var nombreCurso = "";

  var preferenciasMulti = function(pref){
    if(pref == "preferenciasFiltroCursosSede"){
      // $scope.botonEstudiante = "mdi-content-add";  
      $scope.inputSede = 0;
      $scope.inputJornada = 0;
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
          $scope.estudiantes = [];
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

  $scope.checkCursoFiltro = function(IdSede,IdJornada,IdCurso){
    $scope.checkCurso = $('#curso'+IdCurso+IdJornada+IdSede).prop("checked");
    var sedeCheck = $.grep($scope.cursosFiltro, function(e){ return e.IdSede == IdSede; })[0];
    var jornadaCheck = $.grep(sedeCheck.Jornadas, function(e){ return e.IdJornada == IdJornada; })[0];
    var cursoCheck = $.grep(jornadaCheck.Cursos, function(e){ return e.Id == IdCurso; })[0];
    nombreCurso = "Curso " + cursoCheck.Nombre + ", Jornada " + jornadaCheck.NombreJornada + ", " + sedeCheck.NombreSede;

    for (var i = 0; i < sedeCheck.Jornadas.length; i++) {
      var tempJornada = sedeCheck.Jornadas[i];
      for (var j = 0; j < tempJornada.Cursos.length; j++) {
        if(tempJornada.Cursos[j].Id != IdCurso)
          $('#curso'+tempJornada.Cursos[j].Id+tempJornada.IdJornada+IdSede).prop("checked",false);
      }
    }    

    if($scope.checkCurso)
      cargarTabla(IdCurso);      
    else
      $scope.estudiantes = [];    
  }

  $scope.checkMesReportes = function(){
    $scope.mesesChecked = [];
    $scope.checkMes = false;
    var mesesHabilitados = [];

    for (var j = 0; j < $scope.meses.length; j++) {
      if($('#mes'+j).prop("checked") == true)
      {
        $scope.checkMes = true;
        $scope.mesesChecked.push({
          mes:$scope.meses[j],
          pos:j
        });
        mesesHabilitados.push(j);
      }
    }

    $scope.mesesChecked.push({
      mes:"Total",
      pos:$scope.meses.length
    });

    var posTotal = $scope.meses.length;

    for (var i = 0; i < $scope.estudiantes.length; i++) {
      for (var k = 0; k < $scope.llamados.length; k++) {
        $scope.estudiantes[i].Meses[posTotal][k] = 0;  
      }
      for (var j = 0; j < $scope.estudiantes[i].Meses.length - 1; j++) {
        
        var a = mesesHabilitados.indexOf(j);
        if(a > -1){
          for (var k = 0; k < $scope.llamados.length; k++) {
            $scope.estudiantes[i].Meses[posTotal][k] += $scope.estudiantes[i].Meses[j][k];
          }
        }
      }
    }
  }

  $scope.checkestudiante = function(index){
    $scope.estudiantes[index].Habilitar = !$scope.estudiantes[index].Habilitar;  
  }

  $scope.checkestudiantes = function(){
    var check = $('#todosestudiantes').prop("checked") == true;
    for (var i = 0; i < $scope.estudiantes.length; i++) {
      $scope.estudiantes[i].Habilitar = check;  
    }
  }

  function cargarTabla(idCurso){
    ReporteServices.getCursoEstudiantes(idCurso,AjaxService.miAjax).then(function(estudiantes){
      var objetosEstudiantes = [];
      var k = 1;
      var posTotal = $scope.meses.length;
      for(var i=0;i<estudiantes.length;i++){
        if(i>0){
          if(estudiantes[i].Id == objetosEstudiantes[i-k].Id ){
            k++;
            if(estudiantes[i].Mes > 0)
              for (var o = 0; o < $scope.llamados.length; o++) {
                if(estudiantes[i].Tipo == $scope.llamados[o].Nombre){
                    objetosEstudiantes[objetosEstudiantes.length-1].Meses[estudiantes[i].Mes-1][o]++;
                }
                break;  
              }
          }
          else{
            continuacion();
          }
        }
        else{
          continuacion();
        }

        function continuacion(){
          objetosEstudiantes.push({
            Id:estudiantes[i].Id,
            Nombre:estudiantes[i].Nombre,
            Habilitar:true,
            Meses:[]
          })
          var arrayllamados = [];
          for(var j = 0; j < $scope.llamados.length;j++)
            arrayllamados.push(0);
          objetosEstudiantes[objetosEstudiantes.length-1].Meses[posTotal] = clone(arrayllamados);
          for (var j = 0; j < posTotal; j++) {
            objetosEstudiantes[objetosEstudiantes.length-1].Meses[j] = clone(arrayllamados);
          }
          for (var j = 0; j < posTotal; j++) {
            if(estudiantes[i].Mes != 0 && estudiantes[i].Mes == j+1){
              for (var o = 0; o < $scope.llamados.length; o++) {
                if(estudiantes[i].Tipo == $scope.llamados[o].Nombre){
                  objetosEstudiantes[objetosEstudiantes.length-1].Meses[j][o]++;
                  break;
                }
              }
            }
          }
        }
      }
      $scope.estudiantes = objetosEstudiantes;
      $('#todosestudiantes').prop("checked",true);
      $scope.checkMesReportes();
        //console.log($scope.cursosFiltro);
    }, function(a){
      $scope.alert('Error_Red');
      //console.log(a);
    });
  }

  $scope.mirarError = function(pos,cantidad){
    if(cantidad>0){
      switch(pos){
        case 0:
          return "red";
          break;
        case 1:
          return "blue";
          break;
        case 2:
          return "green";
          break;
        case 3:
          return "indigo";
          break;
        case 4:
          return "lime";
          break;
      }
    }
    else{
      return "transparent";
    }
  }

  $scope.mirarCantidad = function(c){
    if(c>0)
      return c;
    else
      return ' ';
  }

  var cargarLlamadas = function(){
    EstudiantesService.getTipoAsistencia(AjaxService.miAjax).then(function(llamados){
      $scope.llamados = llamados;
    }, function(a){
      $scope.alert('Error_Red');
    });
  }

  $scope.modalgenerarPdf = function(){
    var texto = "Generando PDF de: "+nombreCurso+" \nCon los siguientes meses: ";
    for (var j = 0; j < $scope.mesesChecked.length; j++) {
      var mes = $scope.mesesChecked[j];
      if(j != $scope.mesesChecked.length-1){
        texto += mes.mes;
        if(j != $scope.mesesChecked.length-2)
          texto += ", ";
      }
    }
    texto += "\n Esta seguro?";
    $scope.confirm("Generando PDF",texto,function() {
      generarPdf();  
    });
  }

  function generarPdf(){
    var doc = new jsPDF();
    doc.text("Reporte de: " + nombreCurso, 14, 16);
    doc.autoTable(getColumnsPdf(), getDataPdf(), {
      startY: 20,
      margin: {horizontal: 14},
      theme: 'grid',
      styles: {
            // halign: 'center',
            cellPadding: 0.5, 
            fontSize: 8,
            columnWidth:8,
            overflow: 'visible'
        },
      columnStyles: {
          nombre: {
            halign: 'left',
            columnWidth:'auto',
          }
      },
      tableWidth: 'wrap',
      drawHeaderCell: function (cell, data) {
        if (data.column.raw.title == ' ') {
          cell.width = 0;
          return false;
        }
        else if (data.column.raw.title != 'Nombre'){
          cell.width = cell.width*$scope.llamados.length;
          // cell.x = cell.x + 8;
        }
      }
    });
    doc.setProperties({
      title: 'Reporte ' + nombreCurso,
      // subject: 'A jspdf-autotable example pdf (' + funcStr + ')'
    });
    doc.save('Reporte ' + nombreCurso + '.pdf');
  }

  function getColumnsPdf(){
    var columnas = [];
    columnas.push({
      title: "Nombre",
      dataKey: "nombre"
    })

    for (var i = 0; i < $scope.mesesChecked.length; i++) {
      for (var j = 0; j < $scope.llamados.length; j++) {
        if(j == 0)
          columnas.push({
            title: $scope.mesesChecked[i].mes,
            dataKey: $scope.mesesChecked[i].mes+$scope.llamados[j].Alias
          })
        else
          columnas.push({
            title: " ",
            dataKey: $scope.mesesChecked[i].mes+$scope.llamados[j].Alias
          })
      }
    }

    // console.log(columnas);
    return columnas;
  }

  function getDataPdf(){
    var DataContent = [];

    DataContent.push({
      nombre: "",
    })
    for (var j = 0; j < $scope.mesesChecked.length; j++) {
      var mes = $scope.mesesChecked[j];
      for (var k = 0; k < $scope.llamados.length; k++) {
        DataContent[DataContent.length-1][mes.mes+$scope.llamados[k].Alias] = $scope.llamados[k].Alias;
      }
    }

    for (var i = 0; i < $scope.estudiantes.length; i++) {
      if($scope.estudiantes[i].Habilitar){
        var est = $scope.estudiantes[i];
        DataContent.push({
          nombre: est.Nombre,
        })
        for (var j = 0; j < $scope.mesesChecked.length; j++) {
          var mes = $scope.mesesChecked[j];
          for (var k = 0; k < $scope.llamados.length; k++) {
            DataContent[DataContent.length-1][mes.mes+$scope.llamados[k].Alias] = $scope.mirarCantidad(est.Meses[mes.pos][k])
          }
        }
      }
    }

    // console.log(DataContent);
    return DataContent;
  }
})