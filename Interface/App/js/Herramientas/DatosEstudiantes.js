myApp

.config(function($stateProvider) {

  var carpeta = 'templates/Herramientas/';
  
  $stateProvider

  .state('app.datosEstudiantes', {
    url: '/datosEstudiantes',
    templateUrl: carpeta+'DatosEstudiantes.html?version='+version,
    controller: 'DatosEstudiantesCtrl'
  })
});

controllers

.controller('DatosEstudiantesCtrl',function($scope,$state,$timeout,NotificacionService,ReporteServices,EstudiantesService,AjaxService,$sce){
  $scope.setLoaded($scope.mostrarloaded);
  $scope.sedeDatos = 0;
  $scope.cursosFiltro = [];
  $scope.checkCurso = false;
  $scope.nombreCurso = "";

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
      $scope.setLoaded(1);
      $("select[name='selectSedeFiltro']").not('.disabled').material_select();
      $("select[name='selectSedeFiltro']").on('change', function(){
        var a = this.value;
        $scope.estudiantes = [];
        $timeout(function(){
          $scope.sedeDatos = a;
        },100);
        if($scope.cursosFiltro.length == 0)
          cargarCursosFiltro();
      });
      $scope.cargarLlamadas();
    },200);
  });

  $scope.checkCursoFiltro = function(IdSede,IdJornada,IdCurso){
    $scope.checkCurso = $('#curso'+IdCurso+IdJornada+IdSede).prop("checked");
    var sedeCheck = $.grep($scope.cursosFiltro, function(e){ return e.IdSede == IdSede; })[0];
    var jornadaCheck = $.grep(sedeCheck.Jornadas, function(e){ return e.IdJornada == IdJornada; })[0];
    var cursoCheck = $.grep(jornadaCheck.Cursos, function(e){ return e.Id == IdCurso; })[0];
    $scope.nombreCurso = "Curso " + cursoCheck.Nombre + ", Jornada " + jornadaCheck.NombreJornada + ", " + sedeCheck.NombreSede;

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
    EstudiantesService.getEstudiantes(idCurso,AjaxService.miAjax).then(function(estudiantes){
      for(var i=0;i<estudiantes.length;i++){
        estudiantes[i].Habilitar = true;
      }
      $scope.estudiantes = estudiantes;
      $('#todosestudiantes').prop("checked",true);
    }, function(a){
      $scope.alert('Error_Red');
      //console.log(a);
    });
  }

  $scope.cargarLlamadas = function(){
    EstudiantesService.getTipoAsistencia(AjaxService.miAjax).then(function(llamados){
      $scope.llamados = llamados;
    }, function(a){
      $scope.alert('Error_Red');
    });
  }

  $scope.modalgenerarPdf = function(){
    var texto = "Generando PDF con los datos de los estudiantes del curso: "+ $scope.nombreCurso;
    texto += "\n Esta seguro?";
    $scope.confirm("Generando PDF",texto,function() {
      $scope.generarPdf();  
    });
  }

  $scope.generarPdf = function(){
    var doc = new jsPDF();
    doc.text("Lista de Estudiantes de: " + $scope.nombreCurso, 14, 16);
    doc.autoTable(getColumnsPdf(), getDataPdf(), {
      startY: 20,
      margin: {horizontal: 14},
      theme: 'grid',
      styles: {
            // halign: 'center',
            cellPadding: 1, 
            fontSize: 8,
            // columnWidth:8,
            overflow: 'visible',
            columnWidth:'auto',
        },
      columnStyles: {
          // nombre: {
            // halign: 'left',
            // columnWidth:'auto',
          // },
      },
      tableWidth: 'wrap',
      drawHeaderCell: function (cell, data) {
        // if (data.column.raw.title == ' ') {
          // cell.width = 0;
          // return false;
        // }
        // else if (data.column.raw.title != 'Nombre'){
          // cell.width = cell.width;
          // cell.x = cell.x + 8;
        // }
      }
    });
    doc.setProperties({
      title: 'Lista de ' + $scope.nombreCurso,
      // subject: 'A jspdf-autotable example pdf (' + funcStr + ')'
    });
    doc.save('Lista de '+$scope.nombreCurso+'.pdf');
  }

  function getColumnsPdf(){
    var columnas = [
      {
        title: "Nombre",
        dataKey: "nombre"
      },
      {
        title: "Datos Alumno",
        dataKey: "datosAlumno"
      },
      {
        title: "Acudiente",
        dataKey: "acudiente"
      },
      {
        title: "Datos Acudiente",
        dataKey: "datos"
      },
      // {
      //   title: "Acudiente 2",
      //   dataKey: "acudiente2"
      // },
      // {
      //   title: "Datos",
      //   dataKey: "datos2"
      // },
    ];
    
    return columnas;
  }

  function getDataPdf(){
    var DataContent = [];

    for (var i = 0; i < $scope.estudiantes.length; i++) {
      var est = $scope.estudiantes[i];
      if(est.Habilitar){
        DataContent.push({
          nombre: est.Nombre,
          datosAlumno: "Documento: " + est.Documento + "\n" + "Fecha de Nacimiento: " + $scope.cambiarFechaNacimiento(est.FechaNacimiento) + "\n" + "Sexo: " + (est.Sexo!=null?(est.Sexo=="M"?"Masculino":"Femenino"):""),
          acudiente: est.Contacto.Nombre,
          datos: "Celular: " + est.Contacto.Cel + "\n" + "Direccion: \n" + est.Contacto.Direccion,
          // acudiente2: est.Contacto2.Nombre + "\n" + est.Contacto2.Apellido,
          // datos2: est.Contacto2.Cel + "\n" + est.Contacto2.Direccion,
        })
      }
    }

    // console.log(DataContent);
    return DataContent;
  }

  $scope.printDatosEstudiante = function(estudiante){
    var texto = "";
    if(estudiante.Documento != null)
      texto += "Documento: " + estudiante.Documento;
    if(estudiante.FechaNacimiento != null)
      texto += "<br> Nacimiento: " + $scope.cambiarFechaNacimiento(estudiante.FechaNacimiento);
    if(estudiante.Sexo != null){
      if(estudiante.Sexo == "M")
        texto += "<br> Sexo: Masculino";
      else
        texto += "<br> Sexo: Femenino";
    }
    return $sce.trustAsHtml(texto);
  } 

  $scope.printDatosAcudiente = function(contacto){
    var texto = "";
    if(contacto.Cel != null)
      texto += "Celular: " + contacto.Cel;
    if(contacto.Direccion != null)
      texto += "<br> Direccion: " + contacto.Direccion;
    return $sce.trustAsHtml(texto);
  }
})