myApp

.config(function($stateProvider) {

  var carpeta = 'templates/Historial/';
  
  $stateProvider

  .state('app.estudanteHistorial', {
    url: '/estudanteHistorial',
    templateUrl: carpeta+'Estudante.html?version='+version,
    controller: 'EstudanteHistorialCtrl'
  })
});


controllers

.controller('EstudanteHistorialCtrl',function($scope,$state,$timeout,NotificacaoService,HistorialService,EstudantesService,AjaxService){
  $scope.estudantesEncontrados = [];
  $scope.obsevacion = {};
  //mostrar resultado de la busqueda
  $scope.estudanteNP = false;
  //mostrar el estudante seleccionado
  $scope.estudanteNPS = false;

  $scope.estudanteSeleccionado = {};

  var files = {};
  var historiales = [];

  var preferenciasMulti = function(pref){
    if(pref == "preferenciasFiltroEstudante"){
      $scope.botonEstudante = "mdi-action-visibility";
      $scope.botonBuscar = 1;  
    }
  }

  $scope.getTemplateMulti = function(html,pref){
    preferenciasMulti(pref);
    return multi+html+'.html?version='+version;
  }

  $scope.procurar = function(){
    if($('#procurarEstudante').val().length > 2)
    NotificacaoService.getEstudantebyNome($('#procurarEstudante').val(),AjaxService.miAjax).then(function(a){
      $scope.estudanteNP = true;
        $scope.estudantesEncontrados = a;
    }, function(a){
      $scope.alert('Error_Red');
    });
  }

  $scope.seleccionarEstudante = function(estudante){
    $scope.estudanteNPS = true;
    $scope.estudanteNP = false;
    $scope.historial = [];
    historiales = [];
    $scope.estudanteSeleccionado = estudante;
    HistorialService.getHistorialEstudanteId(estudante.Documento,AjaxService.miAjax).then(function(historial){
      $scope.historial = historial[0];
      //console.log(a);
    }, function(a){
      $scope.alert('Error_Red');
    });
  }

  $scope.getFecha = function(dia, mes){
    var meses = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Júlio","Agosto","Setembro","Outubro","Novembro","Dezembro"]
    return meses[mes-1] + " " + dia;
  }

  $scope.getLlamada = function(falla,texto){
    if(falla == texto)
      return "X";
    else
      return " ";
  }

  $scope.modalgenerarPdf = function(){
    var texto = "Gerando reporte de: "+$scope.estudanteSeleccionado.Nombre;
    texto += "\n Tem certeza?";
    $scope.confirm("Generando PDF",texto,function() {
      $scope.generarPdf();  
    });
  }

  $scope.generarPdf = function(){

    var doc = new jsPDF();
    var posY = 16;

    var escribir = function(text){
      doc.text(text, 14, posY);
      posY+=8;
    }

    doc.setFontSize(22);
    escribir("Reporte de Fallas y Notificaciones");
    posY+=4;
    doc.setFontSize(14);
    escribir("Estudante: "+$scope.estudanteSeleccionado.Nombre);
    escribir("Curso: "+$scope.estudanteSeleccionado.Curso);
    if($scope.Adds.cursoextra){
      escribir("Curso Extracurricular: "+$scope.estudanteSeleccionado.CursoAux);
    }
    escribir("Acudiente: "+$scope.estudanteSeleccionado.Contacto.Nombre + " " + $scope.estudanteSeleccionado.Contacto.Apellido);
    escribir("Telefono: "+$scope.estudanteSeleccionado.Contacto.Cel);
    if($scope.estudanteSeleccionado.Contacto.Direccion != "")
      escribir("Direccion: "+$scope.estudanteSeleccionado.Contacto.Direccion);
    posY+=10;
    // if($scope.estudanteSeleccionado.Contacto2.Nombre != ""){
    //   escribir("Acudiente 2: "+$scope.estudanteSeleccionado.Contacto2.Nombre + " " + $scope.estudanteSeleccionado.Contacto2.Apellido);
    //   escribir("Telefono: "+$scope.estudanteSeleccionado.Contacto2.Cel);
    //   if($scope.estudanteSeleccionado.Contacto2.Direccion != "")
    //   escribir("Direccion: "+$scope.estudanteSeleccionado.Contacto2.Direccion);      
    // }

    doc.setFontSize(20);
    escribir("Fallas");
    doc.autoTable(getColumnsFallasPdf(), getDataFallasPdf(), {
      startY: posY,
      theme: 'grid',
      styles: {
            halign: 'center',
            cellPadding: 0.5, 
            fontSize: 10,
            columnWidth:20,
            overflow: 'visible'
        },
      columnStyles: {
          day: {
            halign: 'center',
            // columnWidth:'auto',
            columnWidth:30,
          }
      },
      tableWidth: 'wrap',
      drawHeaderCell: function (cell, data) {
        // if (data.column.raw.title == 'Dia') {
          // cell.width = 40;
          // Para no mostrar return false
          // return false;
        // }
        // else if (data.column.raw.title != 'Nombre'){
          // cell.width = cell.width*$scope.chamadas.length;
          // cell.x = cell.x + 8;
        // }
      }
    });
     doc.setProperties({
      title: 'Reporte de ' + $scope.estudanteSeleccionado.Nombre,
      // subject: 'A jspdf-autotable example pdf (' + funcStr + ')'
    });
    doc.save($scope.estudanteSeleccionado.Nombre+'.pdf');
  }

  function getColumnsFallasPdf(){
    var columnas = [];
    columnas.push({
      title: "Dia",
      dataKey: "day"
    })

    for (var j = 0; j < $scope.chamadas.length; j++) {
      var llamado = $scope.chamadas[j];
      columnas.push({
        title: llamado.Nombre,
        dataKey: llamado.Alias
      })
    }

    // if($scope.Adds.arcjust){
      columnas.push({
        title: "Justificada",
        dataKey: "just"
      })
    // }

    console.log(columnas);
    return columnas;
  }

  function getDataFallasPdf(){
    var DataContent = [];
    for (var j = 0; j < $scope.historial.Falla.length; j++) {
      var historia = $scope.historial.Falla[j];
      DataContent.push({
        day: $scope.getFecha(historia.Dia,historia.Mes),
      })
      for (var k = 0; k < $scope.chamadas.length; k++) {
        var llamado = $scope.chamadas[k];
        DataContent[DataContent.length-1][llamado.Alias] = $scope.getLlamada(llamado.Nombre,historia.Tipo);
      }
      // if($scope.Adds.arcjust){
        DataContent[DataContent.length-1]["just"] = historia.Justificado == 1?"Si":"";
      // }
    }

    console.log(DataContent);
    return DataContent;
  }  

  var cargarForm = function(){
    var rules = {
        procurarEstudante: {
          required: true,
          minlength: 3
        }
      }
    $scope.activarFormulario(rules);
  }

  $scope.fallaJustificada = function(justificado){
    return (justificado == "1");
  }

  $scope.chamadas = [{"Nome":"Ausencia","Alias":"Aus","Id":"1"},{"Nome":"Retardo","Alias":"Ret","Id":"2"}];
  cargarForm();        
})