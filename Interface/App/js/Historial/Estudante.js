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

  $timeout(function() {$scope.setTemplateModal('ConfirmarImagen.html',"");}, 500);  
  
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
    var meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]
    return meses[mes-1] + " " + dia;
  }

  $scope.getLlamada = function(falla,texto){
    if(falla == texto)
      return "X";
    else
      return " ";
  }

  $scope.setFiles = function(element,p) {
    $scope.$apply(function($scope) {
      console.log('files:', element.files);
      // Turn the FileList object into an Array
        files = {
          imagen:element.files[0],
          id: element.id,
        }
        var file = element.files[0];
        if(historiales.length == 0){
          // alert("El archivo no puede ser de mas de 2MB")
          $scope.alert('Predet','No se ha seleccionado ninguna falla');
          element.value = "";
        } else if(file.size > 2000000){
          // alert("El archivo no puede ser de mas de 2MB")
          $scope.alert('Predet','El archivo no puede ser de mas de 2MB');
          element.value = "";
        } else if(!extensionValida(file)){
          // alert("El archivo no es valido, revise que sea jpg, png o jpeg")
          $scope.alert('Predet','El archivo no es valido, revise que sea jpg, png o jpeg');
          element.value = "";
        } else {
          $scope.setTemplateModal('ConfirmarImagen.html?version=1',"");
          setTimeout(function() {
            $('#modalPrincipal').openModal();
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#imgLoad').attr('src', e.target.result);
            }
            reader.readAsDataURL(element.files[0]);
            // $(".materialboxed").materialbox();
          }, 500);
        }
      });
    console.log(files);

    function extensionValida(file){
      var ext = file.name.split('.').pop().toLowerCase();
      if(ext == "jpg" || ext == "png" || ext == "jpeg"){
        return true;
      }
      return false;
    }
  }

  $scope.confirmarImagen = function(){
    var fd = new FormData();
    fd.append('image', files.imagen);    
    HistorialService.insertImages(fd,AjaxService.miAjaxImage).then(function(res){
      HistorialService.insertImageinBd(historiales,files.imagen.name,AjaxService.miAjax).then(function(res){
        console.log(res);
        $scope.alert('Bien','Imagen Agregada');
        $scope.seleccionarEstudante($scope.estudanteSeleccionado);
      }, function(a){
        $scope.alert('Error_Red');
      });
    }, function(a){
      $scope.alert('Error_Red');
    });
  }

  $scope.modalgenerarPdf = function(){
    var texto = "Generando PDF del estudante: "+$scope.estudanteSeleccionado.Nombre;
    texto += "\n Esta seguro?";
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
    // PENDIENTES LAS NOTIFICACIONES, PARA SABER SI VAN TAMBIEN
    // posY+=8*$scope.historial.Falla.length;
    // escribir("Notificaciones");
    // doc.autoTable(getColumnsFallasPdf(), getDataFallasPdf(), {
    //   startY: posY,
    //   theme: 'grid',
    //   styles: {
    //         halign: 'center',
    //         cellPadding: 0.5, 
    //         fontSize: 10,
    //         columnWidth:20,
    //         overflow: 'visible'
    //     },
    //   columnStyles: {
    //       day: {
    //         halign: 'center',
    //         // columnWidth:'auto',
    //         columnWidth:30,
    //       }
    //   },
    //   tableWidth: 'wrap',
    //   drawHeaderCell: function (cell, data) {
    //     // if (data.column.raw.title == 'Dia') {
    //       // cell.width = 40;
    //       // Para no mostrar return false
    //       // return false;
    //     // }
    //     // else if (data.column.raw.title != 'Nombre'){
    //       // cell.width = cell.width*$scope.chamadas.length;
    //       // cell.x = cell.x + 8;
    //     // }
    //   }
    // });
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

  var cargarEstudante = function(idEstudante,callback){
    NotificacaoService.getEstudantebyId(idEstudante,AjaxService.miAjax).then(function(a){
      $scope.seleccionarEstudante(a[0])      
      callback()
    }, function(a){
      $scope.alert('Error_Red');
    });  
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

  $scope.fallaUrl = function(url){
    return (url != null && url != "");
  }

  $scope.fallaJustificada = function(justificado){
    return (justificado == "1");
  }

  $scope.justificarMasivo = function(){
    var posConfirm = function(){
      HistorialService.insertImageinBd(historiales,null,AjaxService.miAjax).then(function(res){
        $scope.alert('Bien','Falla Justificada');
        $scope.seleccionarEstudante($scope.estudanteSeleccionado);
      }, function(a){
        $scope.alert('Error_Red');
      });
    }

    if(historiales.length == 0)
      $scope.alert('Predet','No se ha seleccionado ninguna falla');
    else
      $scope.confirm("Confirmación","Esta a punto justificar las Fallas Seleccionadas, Esta seguro?",posConfirm);
  }

  $scope.checkHistorial = function(idFalla){
    if($('#historial'+idFalla)[0].checked)
    {
      historiales.push(idFalla);      
    }
    else
    {
      var pos = $.inArray(idFalla,historiales);
      historiales = $.grep(historiales, function( n, i ) {
        return i != pos;
      });
    }
  }

  $scope.modalNuevaObservacion = function(){
    $scope.obsevacion = {
      Acudiente:"",
      Descripcion:"",
      Accion:"",
      Compromiso:"",
    }
    swal({  
      title: "Observador",   
      html:
        // '<div class="input-field col s12">'+
        //   '<i class="mdi-action-account-circle prefix"></i>'+
        //   '<input id="observadorDocente" type="text" class="validate" required="" aria-required="true">'+
        //   '<label class="labelsweet" for="observadorDocente">Docente</label>'+
        // '</div>'+
        '<div class="input-field col s12">'+
          '<i class="mdi-action-account-circle prefix"></i>'+
          '<input ng-model="obsevacion.Acudiente" id="observadorAcudiente" type="text" class="validate" required="" aria-required="true">'+
          '<label class="labelsweet" for="observadorAcudiente">Acudiente</label>'+
        '</div>'+
        '<div class="input-field col s12 m6 l6">'+
          '<textarea ng-model="obsevacion.Descripcion" id="textareaDescripcion" class="materialize-textarea"></textarea>'+
          '<label class="labelsweet" for="textareaDescripcion">Descripcion de la situacion</label>'+
        '</div>' +
        '<div class="input-field col s12 m6 l6">'+
          '<textarea ng-model="obsevacion.Accion" id="textareaAccion" class="materialize-textarea"></textarea>'+
          '<label class="labelsweet" for="textareaAccion">Accion Pedagogica</label>'+
        '</div>'+
        '<div class="input-field col s12 m6 l6">'+
          '<textarea ng-model="obsevacion.Descargo" id="textareaCompromiso" class="materialize-textarea"></textarea>'+
          '<label class="labelsweet" for="textareaCompromiso">Descargos y compromisos del estudante</label>'+
        '</div>',
      onBeforeOpen: function(){
        const observadorAcudiente = $('#observadorAcudiente')[0];
        const textareaDescripcion = $('#textareaDescripcion')[0];
        const textareaAccion = $('#textareaAccion')[0];
        const textareaCompromiso = $('#textareaCompromiso')[0];
        observadorAcudiente.addEventListener('input', function(){
          $scope.obsevacion.Acudiente = this.value;
        })
        textareaDescripcion.addEventListener('input', function(){
          $scope.obsevacion.Descripcion = this.value;
        })
        textareaAccion.addEventListener('input', function(){
          $scope.obsevacion.Accion = this.value;
        })
        textareaCompromiso.addEventListener('input', function(){
          $scope.obsevacion.Compromiso = this.value;
        })
      },
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.value) {
          agregarObservacion($scope.obsevacion);
        }
        else if (result.dismiss === Swal.DismissReason.cancel) {
        }
    }).catch((err) => {
      console.log(err);
      swal.close();
    });;
  }

  var agregarObservacion = function(observacion){
    HistorialService.insertObservacion(observacion,$scope.estudanteSeleccionado,AjaxService.miAjax).then(function(a){
      $scope.alert('Bien','Observacion Guardada');
      $scope.seleccionarEstudante($scope.estudanteSeleccionado);
    }, function(a){
      $scope.alert('Error_Red');
    });
  }

  $scope.chamadas = [{"Nome":"Ausencia","Alias":"Aus","Id":"1"},{"Nome":"Retardo","Alias":"Ret","Id":"2"}];
  cargarForm();        
})