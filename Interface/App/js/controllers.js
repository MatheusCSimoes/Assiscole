var controllers = angular.module('starter.controllers',[]);
var tempDate = new Date();
var version =('00' + (tempDate.getMonth() + 1)).slice(-2) + ('00' + tempDate.getDate()).slice(-2);

controllers
.controller('AppCtrl', function($scope,$state,DashService,AjaxService,$timeout,$sce,USER_ROL) {
  $scope.cursos = [{Nombre:'Cargando'}];

  $scope.clickedCurso = {};
  $scope.clickedGrupo = {};

  $scope.templateModal = '';
  $scope.contentModal = '';

  $scope.modulosExtra = 0;
  $scope.worker = false;
  $scope.ano = new Date().getFullYear();

  //Mensajes restantes del contrato, si esta en 0 el sistema no envia mas mensajes
  $scope.restanteContrato = 0;

  //si el mensaje principal ya se mostro, se pone en 1
  //asi no se muestra mas de una vez por sesion
  $scope.mostrarMensajeInicial = 0;

  $scope.controllerToController = {};

  $scope.setTemplateModal = function(a,b){
    $scope.templateModal = modales+a;
    if(b != undefined)
      $scope.contentModal = b;
  }
  $scope.getTemplateModal = function(){
    return $scope.templateModal;
  }

  $scope.setRestanteContrato = function(a){
      $scope.restanteContrato = a;
  }

  $scope.setControllerToController = function(a){
    $scope.controllerToController = a;
  }
  $scope.getControllerToController = function(){
    return $scope.controllerToController;
  }

  $scope.cargarInicio = function(){
    $timeout(function(){
      $('.collapsible').collapsible({
        accordion: false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
      });
      //dropdown del menu de la izquierda
      $('.dropdown-button').dropdown({
        inDuration: 300,
        outDuration: 125,
        constrain_width: true, // Does not change width of dropdown to that of the activator
        hover: false, // Activate on click
        alignment: 'left', // Aligns dropdown to left or right edge (works with constrain_width)
        gutter: 0, // Spacing from edge
        belowOrigin: true // Displays dropdown below the button
      });    

      //scroll bar de la navegacion de la derecha y de la izquierda
      var leftnav = $(".page-topbar").height();  
      var leftnavHeight = window.innerHeight - leftnav;
      $('.leftside-navigation').height(leftnavHeight).perfectScrollbar({
        suppressScrollX: true
      });
      var righttnav = $("#chat-out").height();
      $('.rightside-navigation').height(righttnav).perfectScrollbar({
        suppressScrollX: true
      });

      //Main Left Sidebar Menu
      $('.sidebar-collapse').sideNav({
        edge: 'left', // Choose the horizontal origin      
      });

      $(".notification-button").dropdown({
        inDuration: 300,
        outDuration: 225,
        constrain_width: !1,
        hover: !0,
        gutter: -200,
        belowOrigin: !0,
        alignment: "left"
      });
    },10);   
  }

  var sesion = JSON.parse(sessionStorage.getItem('DatosPrincipales'));

  DashService.useCredentials(sesion[0]);
  if(sesion != null){
    $scope.username = sesion.Nome;
    $scope.dataContrato = sesion.dataContrato;
    var d = (new Date(sesion.dataFinContrato)).getTime() + (24*60*60*1000);
    $scope.dataFinContrato = new Date(d);
    $scope.nombreColegio = sesion.nombreColegio;
    $scope.Modulos = sesion.modulos;
    if($scope.Modulos && $scope.Modulos.length > 0 && $scope.Modulos[0].Alias != null)
      $scope.modulosExtra = 1;
    $scope.cargarInicio();
  }
  else
    window.location.href = "../Login/";

  $scope.mostrarAsistencia = function(){
    if(DashService.role() == "Funcionario"){
      return true;
    }
    return false;
  }

  $scope.mostrarNotificaciones = function(){
    if(DashService.role() == "Funcionario"){
      return true;
    }
    return false;
  }

  $scope.mostrarHistorial = function(){
    if(DashService.role() == "Funcionario"){
      return true;
    }
    return false;
  }

  $scope.mostrarNotas = function(){
    if(DashService.role() == "Professor"){
      return true;
    }
    return false;
  }

  $scope.mostrarReporte = function(){
    if(DashService.role() == "Funcionario"){
      return true;
    }
    return false;
  }

  $scope.clickSalir = function(){
    sessionStorage.clear();
    window.location.href = "../Login/";
  }

  $scope.setClickedCurso = function(a){
    $scope.clickedCurso = a;
  }

  $scope.setClickedGrupo = function(a){
    $scope.clickedGrupo = a;
  }

  $scope.clickModulo = function(modulo){
    $state.go('app.'+modulo);
  }

  if (typeof(Worker) !== "undefined") {
    $scope.worker = true;
  }

  //tipo: error,success,warning,info
  $scope.alert = function(tipo,_texto){
    var texto = "";
    switch(tipo) {
      case 'Error_Red':
          titulo = 'Error';
          texto = 'Error na rede, tenta depois';
          tipoAlerta = "error";
          break;
      case 'Mal':
          titulo = "Error";
          texto = _texto;
          tipoAlerta = "error";
          break;
      case 'Bien':
          titulo = "Confirmação";
          texto = _texto;
          tipoAlerta = "success";
          break;
      case 'Info':
          titulo = "Info";
          texto = _texto;
          tipoAlerta = "info";
          break;
      case 'Predet':
          titulo = 'Mensaje';
          texto = _texto;
          tipoAlerta = "warning";
          break;
      case 'Alert_EstudianteModificado':
          titulo = 'Confirmação';
          texto = 'Estudante Modificado';
          tipoAlerta = "success";
          break;
      case 'Alert_EstudianteNoModificado':
          titulo = 'Error';
          texto = 'Estudante não foi modificado, Tente depois';
          tipoAlerta = "error";
          break;      
      case 'Alert_NotificacionEnviada':
          titulo = 'Confirmação';
          texto = 'Notificacion Enviada';
          tipoAlerta = "success";
          break;
      case 'SinSaldo':
          titulo = 'Alerta';
          texto = "Lastimosamente la cantidad de mensajes disponibles para enviar es menor que la cantidad que estas intentando enviar, comunicate al 3006513170";
          tipoAlerta = "error";
          break;
      case 'SinContrato':
          titulo = 'Alerta';
          texto = "El contrato a finalizado, los mensajes que intenten enviar ahora no llegaran al destinatario, comunicarse con Luis Jimenez al 3006513170";
          tipoAlerta = "error";
          break;
      default:
          titulo = 'Error';
          texto = 'Erro Indefinido';
          tipoAlerta = "error";
          break;
    }

    $timeout(function() {
      swal({
        title: titulo,
        text: texto,
        type: tipoAlerta,
      });
    }, 10);
  }

  $scope.confirm = function(titulo,texto,callBack,callBackCancel){
    swal({  
      title: titulo,   
      text: texto,   
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.value) {
          callBack();
        }
        // else if (result.dismiss === Swal.DismissReason.cancel) {
        // }
        else{
          if(callBackCancel != undefined)
            callBackCancel();
        }
    }).catch((err) => {
      console.log(err);
      swal.close();
    });;
  }

  $scope.activarFormulario = function(reglas,agregarClase = null,newform = null){

    var form = "#formValidate";
    if(newform != undefined)
      form += newform;
    $(form).find('.active').removeClass('active');
    for (var i = 0; i < $(form).find('input').length; i++) {
      if($(form).find('input')[i].value != ""){
        var name = $(form).find('input')[i].name;
        if(name != ""){
          $($(form).find('label[for='+name+']')).addClass("active");
          // $($(form).find('i')[i]).addClass("active");
          $($(form).find('input')[i]).addClass("valid");  
        }
      }
      else{
        $($(form).find('label[for='+name+']')).addClass("active");
      }
    }
    for (var j = 0; j < $(form).find('textarea').length; j++) {
      if($(form).find('textarea')[j].value != ""){
        var name = $(form).find('textarea')[j].name;
        if(name != ""){
          $($(form).find('label[for='+name+']')).addClass("active");
          // $($(form).find('i')[i+j]).addClass("active");
          $($(form).find('textarea')[j]).addClass("valid");
        }
      }
    }

    for (var j = 0; j < $(form).find('select').length; j++) {
      if($(form).find('select')[j].value != ""){
        var name = $(form).find('select')[j].name;
        if(name != ""){
          $($(form).find('label[for='+name+']')).addClass("active");
          // $($(form).find('i')[i+j]).addClass("active");
          $($(form).find('select')[j]).addClass("valid");
        }
      }
    }

    $(form).validate({
        rules: reglas,
        errorElement : 'div',
        errorPlacement: function(error, element) {
          var placement = $(element).data('error');
          if(agregarClase != undefined)
            error.addClass(agregarClase);
          if (placement) {
            $(placement).append(error)
          } else {
            error.insertAfter(element);
          }
        }
    });

    $("#formValidate").submit(function(e){
      e.preventDefault();
    })  
  }
})

function clone(obj) {
  var copy;

  // Handle the 3 simple types, and null or undefined
  if (null == obj || "object" != typeof obj) return obj;

  // Handle Date
  if (obj instanceof Date) {
    copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
  }

  // Handle Array
  if (obj instanceof Array) {
    copy = [];
    for (var i = 0, len = obj.length; i < len; i++) {
      copy[i] = clone(obj[i]);
    }
    return copy;
  }

  // Handle Object
  if (obj instanceof Object) {
    copy = {};
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
    }
    return copy;
  }

  throw new Error("Unable to copy obj! Its type isn't supported.");
}