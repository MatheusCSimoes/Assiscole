myApp
 
.service('DashService', function($q, $http, USER_ROL) {
  var LOCAL_TOKEN_KEY = '12345';
  var username = '';
  var role = '';
  var descripcionRol = '';
  var authToken;
  var id;
  var adds = [];
  var modulos = [];
  var bd = '';

  function useCredentials(token) {
    // username = token.Nombre;
    // isAuthenticated = true;
    // authToken = token.Token;
    role = token.Rol;
    id = token.RG;
    // descripcionRol = token.RolNombre;
    // adds = _adds;
    modulos = token.Modulos;    
    // bd = base;  
 
  }
 
  function destroyUserCredentials() {
    authToken = undefined;
    username = '';
    isAuthenticated = false;
    $http.defaults.headers.common['X-Auth-Token'] = undefined;
  }
 
  var getUser = function(datos,functionAjax) {

    return $q(function(resolve, reject) {
      var getsuccess = function(data){
        //console.log(data);
        if(data.contenido[0] == undefined)
        {
          window.location.href = "../Login/";
          return;
        }
        else{
          useCredentials(datos.bd);  
        }
        resolve([data.contenido[0].Nombre]);
      }

      var geterror = function(response){
        //console.log(response);
        reject('no funciona');
      }

      var data = {
        alias:datos.alias,
        get: 'login'
      };

      functionAjax(getsuccess,geterror,data,'get');
    });
  };

  var getSedesJornadas = function(functionAjax){
    return $q(function(resolve, reject) {
      var getsuccess = function(data){
        //console.log(data);
        resolve(data.contenido);
      }

      var geterror = function(response){
        //console.log(response);
        reject('no funciona');
      }

      var data = {
        get: 'sedesjornadas',
      };
      functionAjax(getsuccess,geterror,data,'get');
    });
  };

  var getCursos = function(sede,jornada,functionAjax){
    return $q(function(resolve, reject) {
      var getsuccess = function(data){
        //console.log(data);
        resolve(data.contenido);
      }

      var geterror = function(response){
        //console.log(response);
        reject('no funciona');
      }

      var year = new Date().getFullYear();
      var data = {
        idSede:sede.Id,
        idJornada:jornada.Id,
        tipoJornada:jornada.Tipo,
        ano:year,
        get: 'cursos'
      };
      functionAjax(getsuccess,geterror,data,'get');
    });
  };

  var getCursosPromocion = function(sede,jornada,functionAjax){
    return $q(function(resolve, reject) {
      var getsuccess = function(data){
        //console.log(data);
        resolve(data.contenido);
      }

      var geterror = function(response){
        //console.log(response);
        reject('no funciona');
      }

      var year = new Date().getFullYear();
      var data = {
        idSede:sede.Id,
        idJornada:jornada.Id,
        tipoJornada:jornada.Tipo,
        ano:year,
        anoAnt:year-1,
        get: 'cursosPromocion'
      };
      functionAjax(getsuccess,geterror,data,'get');
    });
  };

  var getCursosHoy = function(functionAjax){

    return $q(function(resolve, reject) {
      var getsuccess = function(data){
        // console.log(data);
        resolve(data.contenido);
      }

      var geterror = function(response){
        // console.log(response);
        reject('no funciona');
      }

      var data = {
        get: 'cursosAsistidosHoy'
      };

      functionAjax(getsuccess,geterror,data,'get');
    });
  }

  var getActividadReciente = function(functionAjax){
    return $q(function(resolve, reject) {
      var getsuccess = function(data){
        //console.log(data);
        resolve(data.contenido);
      }

      var geterror = function(response){
        //console.log(response);
        reject('no funciona');
      }

      var data = {
        get: 'actividadreciente',
      };

      functionAjax(getsuccess,geterror,data,'get');
    });
  };

  var getMensajesHoy = function(functionAjax){
    return $q(function(resolve, reject) {
      var getsuccess = function(data){
        //console.log(data);
        resolve(data.contenido);
      }

      var geterror = function(response){
        //console.log(response);
        reject('no funciona');
      }

      var data = {
        get: 'mensajesHoy',
      };

      functionAjax(getsuccess,geterror,data,'get');
    });
  };

  var getMensajesMes = function(functionAjax,fecha = null){
    return $q(function(resolve, reject) {
      var getsuccess = function(data){
        //console.log(data);
        resolve(data.contenido);
      }

      var geterror = function(response){
        //console.log(response);
        reject('no funciona');
      }

      var d = new Date();
      d.setDate(d.getDate()+1);
      var month = '' + (d.getMonth() + 1), day = d.getDate(), year = d.getFullYear();
      var month2 = month;
      if (day.length < 2) 
        day = '0' + day;

      //ultimo dia del mes despues de que se le sumo 1
      if (day == "01"){
        month2 = '0' + (month-1);
      }
      
      if (month.length < 2){
        month = '0' + month;
      }

      fecha = fecha==null?[year, month2, "01"].join('-'):fecha;
      var data = {
        fecha: [year, month, day].join('-'),
        fecha2: fecha,
        get: 'mensajesMes'
      };

      functionAjax(getsuccess,geterror,data,'get');
    });
  };

  var getAusenciaMes = function(functionAjax,fecha = null){
    return $q(function(resolve, reject) {
      var getsuccess = function(data){
        //console.log(data);
        resolve(data.contenido);
      }

      var geterror = function(response){
        //console.log(response);
        reject('no funciona');
      }

      var d = (new Date()).getTime() - (7*24*60*60*1000);
      var d2 = (new Date()).getTime() + (1*24*60*60*1000);
      var data = {
        fecha: new Date(d2).toISOString().slice(0, 10),
        fecha2: fecha==null?new Date(d).toISOString().slice(0, 10):fecha.toISOString().slice(0, 10),
        get: 'ausenciasMes'
      };

      functionAjax(getsuccess,geterror,data,'get');
    });
  };
 
  return {
    // getCursos: getCursos,
    // getCursosPromocion: getCursosPromocion,
    getUser: getUser,
    // getSedesJornadas: getSedesJornadas,
    // logout: logout,
    // username: function() {return username;},
    role: function() {return role;},
    idUser: function() {return id;},
    // adds: function() {return adds;},
    modulos: function() {return modulos;},
    // bd: function() {return bd;},
    // getCursosHoy: getCursosHoy,
    // getActividadReciente: getActividadReciente,
    // getMensajesHoy:getMensajesHoy,
    // getMensajesMes:getMensajesMes,
    // getAusenciaMes:getAusenciaMes,
    useCredentials: useCredentials
  };
})

.service('AjaxService', function($q, $http, DashService){

  function miAjax(successCall,errorCall,info,tipo){
    var data = $.param(info);
    $http({
      method: 'POST',
      url: 'php/vistas/'+tipo+'Asistcole.php',
      dataType: "json",
      data,
      headers : {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      }
      }).then(function successCallback(response) {
        // console.log(response.data)
        successCall(response.data);
        // successCall(response);
      }, function errorCallback(response) {
        errorCall(response);
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });
  }

  function miAjaxImage(successCall,errorCall,data){
    console.log(data);
    // var data = $.param(info);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'php/images/cargarImages.php', true);
    xhr.upload.onprogress = function(e) {
      if (e.lengthComputable) {
        var percentComplete = (e.loaded / e.total) * 100;
        // $('#barraProgreso').width(percentComplete+'%');
        console.log(percentComplete + '% uploaded');
      }
    };
    xhr.onload = function() {
      if (this.status == 200) {
        var resp = JSON.parse(this.response);
        console.log(resp);
        successCall(resp);
      }
      else
        errorCall(resp);
    };
    xhr.send(data);
  }

  function enviarCorreo(successCall,errorCall,info,tipo){
    // //console.log(info,tipo);
    var data = $.param(info);
    $http({
      method: 'POST',
      url: 'email/sendEmail.php',
      dataType: "json",
      data,
      headers : {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      }
      }).then(function successCallback(response) {
        // console.log(response.data)
        successCall(response.data);
        // successCall(response);
      }, function errorCallback(response) {
        errorCall(response);
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });
  }

  function itcloud(successCall,errorCall,objectData){
    if(DashService.bd() == "aplicand_Pafi_Toscana"){
      objectData.user='toscana@aplicando.com.co'; 
      objectData.password='IXMr8nJLoD';  
    }
    else if(DashService.bd() == "aplicand_Pafi_Juan_Lozano"){
      objectData.user='lozano@sipaf.aplicando.com.co'; 
      objectData.password='-J2*oEfNjG';  
    }
    else if(DashService.bd() == "aplicand_Pafi_Delia_Zapata"){
      objectData.user='delia@sipaf.aplicando.com.co'; 
      objectData.password='mUh5eBOufT';  
    }
    else if(DashService.bd() == "aplicand_Pafi_Possenti"){
      objectData.user='possenti@sipaf.aplicando.com.co'; 
      objectData.password='ybYKRZTHf1';  
    }
    else if(DashService.bd() == "aplicand_Pafi_Nicolas_Buenaventura"){
      objectData.user='buenaventura@sipaf.aplicando.com.co'; 
      objectData.password='iBArjXXW6Y';  
    }
    else if(DashService.bd() == "aplicand_Pafi_Morales"){
      objectData.user='morales@aplicando.com.co'; 
      objectData.password='sgo6WDhp49';  
    }
    else if(DashService.bd() == "aplicand_Pafi_Nauman"){
      objectData.user='nauman@aplicando.com.co'; 
      objectData.password='njxr4Uq5K1';  
    }
    else if(DashService.bd() == "aplicand_Pafi_Usaquen"){
      objectData.user='usaquen@aplicando.com.co'; 
      objectData.password='TrcDtOwNMz';  
    }
    else if(DashService.bd() == "aplicand_Pafi_Rafael_Bernal"){
      objectData.user='rafaelbernal@aplicando.com.co'; 
      objectData.password='NXDWz*x0iu';  
    }
    else if(DashService.bd() == "aplicand_Pafi_Andres_Bello"){
      objectData.user='andresbello@sipaf.aplicando.com.co'; 
      objectData.password='JHwqGYBrcn';  
    }
    else if(DashService.bd() == "aplicand_Pafi_Nueva_Colombia"){
      objectData.user='nuevacolombia@sipaf.aplicando.com.co'; 
      objectData.password='EJbyEWRV*n';  
    }
    else if(DashService.bd() == "aplicand_Pafi_Gaitana"){
      objectData.user='gaitana@sipaf.aplicando.com.co'; 
      objectData.password='jmgR2vhf3o';
    }
    else{
      objectData.user='aplicacionesangelsas@gmail.com'; 
      objectData.password='Cl00dekrzO';  
    }
    var date = new Date();
    var dia = date.getFullYear() + '-' + ('00' + (date.getMonth() + 1)).slice(-2) + '-' + ('00' + date.getDate()).slice(-2) + ' ' + ('00' + date.getHours()).slice(-2) + ':' + ('00' + date.getMinutes()).slice(-2) + ':' + ('00' + date.getSeconds()).slice(-2);
    var info = {
        dia: dia,
        bd: DashService.bd(),
        get: 'itcloud',
        object: JSON.stringify(objectData),
      };
    var data = $.param(info);
    // objectData = JSON.parse('')

    $http({
      method: 'POST',
      url: 'php/vistas/insertAsistcole.php',
      dataType: "json",
      data,
      headers : {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      }
      }).then(function successCallback(response) {
        // console.log(response.data)
        // successCall(response.data);
        // successCall(response);
        if(objectData.GSM.length>0)  
          mandarDespues();
        else
          successCall(response);
      }, function errorCallback(response) {
        errorCall(response);
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });

    function mandarDespues(){
      $.ajax({
          url: "https://sistemasmasivos.com/itcloud/api/sendsms/send.php",
          //url: "https://sistemasmasivos.com/itcloud/api/sendsms/send.php?user=juanesnr7@gmail.com",
          cache: false,
          dataType: "jsonp",
          timeout: 50000,
          method: "get",
          data: objectData
      }).fail(function(xhr, status, error) {
        // console.log(xhr, status, error);
        successCall(xhr);
      }).done(function(xhr, status, error) {
        // //console.log(xhr, status, error);
        errorCall(xhr);               
      });
    }
  }

  return {
    miAjax:miAjax,
    miAjaxImage:miAjaxImage,
    itcloud:itcloud,
    enviarCorreo:enviarCorreo
  };
})

.service('CursosService', function($q, $http){

  var getCursos = function(functionAjax){
    return $q(function(resolve, reject) {
      var getsuccess = function(data){
        //console.log(data);
        resolve(data.contenido);
      }

      var geterror = function(response){
        //console.log(response);
        reject('no funciona');
      }

      var year = new Date().getFullYear();
      var data = {
        ano:year,
        get: 'cursos'
      };
      functionAjax(getsuccess,geterror,data,'get');
    });
  };

  return {
    getCursos:getCursos,
  };  
})

.service('EstudantesService', function($q, $http){

  var getEstudantes = function(idCurso,functionAjax){
    return $q(function(resolve, reject) {
      var getsuccess = function(data){
        //console.log(data);
        resolve(data.contenido);
      }

      var geterror = function(response){
        //console.log(response);
        reject('no funciona');
      }

      var date = new Date();
      var dia = date.getFullYear() + '-' + ('00' + (date.getMonth() + 1)).slice(-2) + '-' + ('00' + date.getDate()).slice(-2);
      var data = {
        fecha: dia,
        idCurso: idCurso,
        ano: date.getFullYear(),
        get: 'estudantes'
      };
      functionAjax(getsuccess,geterror,data,'get');
    });
  };

  var insertAsistencia = function(curso,EstudantesEnviados,functionAjax){
    return $q(function(resolve, reject) {
      var getsuccess = function(data){
        //console.log(data);
        resolve('funciona');
      }

      var geterror = function(response){
        //console.log(response);
        reject('no funciona');
      }

      var date = new Date();
      var dia = date.getFullYear() + '-' + ('00' + (date.getMonth() + 1)).slice(-2) + '-' + ('00' + date.getDate()).slice(-2);
      var idEstudantes = [];
      var idTipoasistencia = [];
      for (var i = 0; i < EstudantesEnviados.length; i++) {
        idEstudantes.push(EstudantesEnviados[i].Documento);
        idTipoasistencia.push(EstudantesEnviados[i].tipo);
      }

      var data = {
        idCurso: curso.Id,
        idEstudantes: idEstudantes,
        idTipoasistencia: idTipoasistencia,
        dia: dia,
        get: 'asistencia'
      };

      // //console.log(user);
      functionAjax(getsuccess,geterror,data,'insert');
    });
  };

  var insertEstudante = function(estudante,functionAjax){
    return $q(function(resolve, reject) {
      var getsuccess = function(data){
        //console.log(data);
        resolve('funciona');
      }

      var geterror = function(response){
        reject(response.data.contenido);
      }

      var datos = [];
      if(estudante.Fecha!=null)
        datos = estudante.Fecha.split("-");

      var data = {
        nome: estudante.Nome.toUpperCase() + " " + estudante.Sobrenome.toUpperCase(),
        documento: estudante.Documento,
        responsavelNome: estudante.Responsavel.Nome.toUpperCase(),
        responsavelCel: estudante.Responsavel.Cel,
        responsavelDocumento: estudante.Responsavel.Documento,
        curso:  estudante.Curso,
        get: 'estudante'
      };
      functionAjax(getsuccess,geterror,data,'insert');
    });
  };

  var deleteEstudante = function(estudante,functionAjax){
    return $q(function(resolve, reject) {
      var getsuccess = function(data){
        //console.log(data);
        resolve('funciona');
      }

      var geterror = function(response){
        //console.log(response);
        reject('no funciona');
      }

      var data = {
        idEstudante: estudante.RG,
        get: 'estudante'
      };
      functionAjax(getsuccess,geterror,data,'delete');
    });
  };

  var editEstudante = function(estudante,estudanteNuevo,functionAjax){
    return $q(function(resolve, reject) {
      var getsuccess = function(data){
        //console.log(data);
        resolve('funciona');
      }

      var geterror = function(response){
        //console.log(response);
        reject('no funciona');
      }

      var data = {
        nome: estudanteNuevo.Nome.toUpperCase(),
        documento: estudanteNuevo.Documento,
        documentoAntigo: estudante.Documento,
        responsavelNome: estudanteNuevo.Responsavel.Nome.toUpperCase(),
        responsavelCel: estudanteNuevo.Responsavel.Cel,
        responsavelDocumentoAntigo: estudante.Responsavel.Documento,
        responsavelDocumento: estudanteNuevo.Responsavel.Documento,
        get: 'estudante'
      };
      functionAjax(getsuccess,geterror,data,'edit');
      //console.log(data);
      // reject('no funciona');
    });
  };

  return {
    getEstudantes: getEstudantes,
    insertAsistencia: insertAsistencia,
    insertEstudante: insertEstudante,
    deleteEstudante: deleteEstudante,
    editEstudante: editEstudante
  };
})

.service('NotificacaoService', function($q, $http){

  var getCursos = function(functionAjax){
    return $q(function(resolve, reject) {
      var getsuccess = function(data){
        //console.log(data);
        resolve(data.contenido);
      }

      var geterror = function(response){
        //console.log(response);
        reject('no funciona');
      }

      var data = {
        ano: (new Date().getFullYear()),
        get: 'cursosPorSede'
      };
      functionAjax(getsuccess,geterror,data,'get');
    });
  };  

  var getEstudantesCursos = function(cursos,functionAjax){
    return $q(function(resolve, reject) {
      var getsuccess = function(data){
        //console.log(data);
        resolve(data.contenido);
      }

      var geterror = function(response){
        //console.log(response);
        reject('no funciona');
      }

      var data = {
        cursos: cursos,
        get: 'estudantesMuchosCursos'
      };
      functionAjax(getsuccess,geterror,data,'get');
    });
  };

  var getGrupos = function(functionAjax){
    return $q(function(resolve, reject) {
      var getsuccess = function(data){
        //console.log(data);
        resolve(data.contenido);
      }

      var geterror = function(response){
        //console.log(response);
        reject('no funciona');
      }

      var data = {
        get: 'grupos'
      };
      functionAjax(getsuccess,geterror,data,'get');
    });
  }; 

  var getMiembrosGrupos = function(idGrupo,functionAjax){
    return $q(function(resolve, reject) {
      var getsuccess = function(data){
        //console.log(data);
        resolve(data.contenido);
      }

      var geterror = function(response){
        //console.log(response);
        reject('no funciona');
      }

      var data = {
        idGrupo: idGrupo,
        get: 'miembrosGrupo'
      };
      functionAjax(getsuccess,geterror,data,'get');
    });
  };

  var getEstudantebyNome = function(nome,functionAjax){
    return $q(function(resolve, reject) {
      var getsuccess = function(data){
        //console.log(data);
        resolve(data.contenido);
      }

      var geterror = function(response){
        //console.log(response);
        reject('no funciona');
      }

      var data = {
        get: 'getEstudantebyNome',
        nome: nome
      };
      functionAjax(getsuccess,geterror,data,'get');
    });
  };

  var getEstudantebyId = function(idEstudante,functionAjax){
    return $q(function(resolve, reject) {
      var getsuccess = function(data){
        //console.log(data);
        resolve(data.contenido);
      }

      var geterror = function(response){
        //console.log(response);
        reject('no funciona');
      }

      var data = {
        get: 'estudantebyId',
        idEstudante: idEstudante
      };
      functionAjax(getsuccess,geterror,data,'get');
    });
  };

  var getEstudantesbyDocumento = function(idsEstudantes,functionAjax){
    return $q(function(resolve, reject) {
      var getsuccess = function(data){
        //console.log(data);
        resolve(data.contenido);
      }

      var geterror = function(response){
        //console.log(response);
        reject('no funciona');
      }

      var ids = "";
      for (var i = 0; i < idsEstudantes.length; i++) {
        if(i != 0)
          ids += ",";
        ids += idsEstudantes[i];
      }

      var data = {
        get: 'estudantesbyDocumento',
        idsEstudantes: ids
      };
      functionAjax(getsuccess,geterror,data,'get');
    });
  };

  var enviarMensajeNotificacion = function(numeros,mensaje,estudantes,functionAjax){
    return $q(function(resolve, reject) {
      var getsuccess = function(data){
        //console.log(data);
        resolve([estudantes,'resolve']);
      }

      var geterror = function(response){
        //console.log(response);
        reject([estudantes,'reject']);
      }

      var data = {        
        GSM: numeros,
        SMSText:mensaje
      };

      functionAjax(getsuccess,geterror,data); 
    });
  };

  var insertNotificacao = function(user,estudantes,mensaje,functionAjax){
    return $q(function(resolve, reject) {
      var getsuccess = function(data){
        //console.log(data);
        resolve('funciona');
      }

      var geterror = function(response){
        //console.log(response);
        reject('no funciona');
      }

      var date = new Date();
      var dia = date.getFullYear() + '-' + ('00' + (date.getMonth() + 1)).slice(-2) + '-' + ('00' + date.getDate()).slice(-2) + ' ' + ('00' + date.getHours()).slice(-2) + ':' + ('00' + date.getMinutes()).slice(-2) + ':' + ('00' + date.getSeconds()).slice(-2);
      var idEstudantes = [];
      for (var i = 0; i < estudantes.length; i++) {
        idEstudantes.push(estudantes[i].Documento);
      }

      var data = {
        idEstudantes: idEstudantes,
        mensaje: mensaje,
        dia: dia,
        idUser: user,
        // get: i>0?'notifiacionCursosContinuacion':'notifiacionCursos',
        get: 'notifiacionCursos',
      };
      functionAjax(getsuccess,geterror,data,'insert');
    });
  };

  var insertNotificacionGrupo = function(user,miembros,mensaje,functionAjax){
    return $q(function(resolve, reject) {
      var tamanoTotal = 0;
      var tamanoMemb = 0;
      var getsuccess = function(data){
        tamanoTotal = tamanoTotal-tamanoMemb;
        tamanoTotal = tamanoTotal<0?0:tamanoTotal;
        //console.log(data);
        if(tamanoTotal == 0){
            resolve('funciona');
        }
      }

      var geterror = function(response){
        tamanoTotal = tamanoTotal-tamanoMemb;
        tamanoTotal = tamanoTotal<0?0:tamanoTotal;
        //console.log(data);
        if(tamanoTotal == 0){
            reject('no funciona');
        }
      }

      var date = new Date();
      var dia = date.getFullYear() + '-' + ('00' + (date.getMonth() + 1)).slice(-2) + '-' + ('00' + date.getDate()).slice(-2) + ' ' + ('00' + date.getHours()).slice(-2) + ':' + ('00' + date.getMinutes()).slice(-2) + ':' + ('00' + date.getSeconds()).slice(-2);
      var idMiembros = [];
      var numContactos = [];
      for (var i = 0; i < miembros.length; i++) {
        idMiembros.push(miembros[i].Id);
        numContactos.push(miembros[i].Cel)
      }
      tamanoTotal = idMiembros.length;
      tamanoMemb = idMiembros.length>10?10:idMiembros.length;
      // tamanoMemb = Math.ceil(idMiembros.length/10)>200?200:Math.ceil(idMiembros.length/10); 
      var random = Math.floor((Math.random() * 1000) + 1);
      if (idMiembros.length > 0){
        for (var i = 0; i < idMiembros.length; i=i+tamanoMemb) {        
          var b = 0;
          if(i>=idMiembros.length-tamanoMemb)
            b = idMiembros.length-i;
          else
            b= tamanoMemb;

          var tempids = [];
          var tempnums = [];
          for (var j = 0; j < b; j++) {
            tempids.push(idMiembros[i+j]);
            tempnums.push(numContactos[i+j]);
          } 
          var data = {
            random: random,
            idMiembros: tempids,
            numContactos: tempnums,
            mensaje: mensaje,
            dia: dia,
            idUser: user,
            get: 'notifiacionGrupos',
          };
          functionAjax(getsuccess,geterror,data,'insert');
        }
      }
      else{
        getsuccess();
      }
    });
  };

  var insertGrupo = function(grupo,functionAjax){
    return $q(function(resolve, reject) {
      var getsuccess = function(data){
        //console.log(data);
        resolve('funciona');
      }

      var geterror = function(response){
        //console.log(response);
        reject('no funciona');
      }

      var data = {
        nombre: grupo.charAt(0).toUpperCase() + grupo.slice(1),
        get: 'grupo'
      };
      functionAjax(getsuccess,geterror,data,'insert');
    });
  };  

  var insertMiembro = function(miembro,functionAjax){
    return $q(function(resolve, reject) {
      var getsuccess = function(data){
        resolve('funciona');
      }

      var geterror = function(response){
        reject('no funciona');
      }

      var data = {
        nombre: miembro.Nombre.toUpperCase(),
        cel: miembro.Cel,
        grupo: miembro.IdGrupo,
        get: 'miembro'
      };
      functionAjax(getsuccess,geterror,data,'insert');
    });
  }; 

  var deleteGrupo = function(id,functionAjax){
    return $q(function(resolve, reject) {
      var getsuccess = function(data){
        //console.log(data);
        resolve('funciona');
      }

      var geterror = function(response){
        //console.log(response);
        reject('no funciona');
      }

      var data = {
        idGrupo: id,
        get: 'grupo'
      };
      functionAjax(getsuccess,geterror,data,'delete');
    });
  };

  var deleteMiembro = function(miembro,functionAjax){
    return $q(function(resolve, reject) {
      var getsuccess = function(data){
        //console.log(data);
        resolve('funciona');
      }

      var geterror = function(response){
        //console.log(response);
        reject('no funciona');
      }

      var data = {
        idMiembro: miembro.Id,
        get: 'miembro'
      };
      functionAjax(getsuccess,geterror,data,'delete');
    });
  };

  var editGrupo = function(id,grupo,functionAjax){
    return $q(function(resolve, reject) {
      var getsuccess = function(data){
        //console.log(data);
        resolve('funciona');
      }

      var geterror = function(response){
        //console.log(response);
        reject('no funciona');
      }

      var data = {
        nombre: grupo.charAt(0).toUpperCase() + grupo.slice(1),
        id: id,
        get: 'grupo'
      };
      functionAjax(getsuccess,geterror,data,'edit');
      //console.log(data);
      // reject('no funciona');
    });
  };

  var editMiembro = function(miembro,functionAjax){
    return $q(function(resolve, reject) {
      var getsuccess = function(data){
        //console.log(data);
        resolve('funciona');
      }

      var geterror = function(response){
        //console.log(response);
        reject('no funciona');
      }

      var date = new Date();
      var dia = date.getFullYear() + '-' + ('00' + (date.getMonth() + 1)).slice(-2) + '-' + ('00' + date.getDate()).slice(-2) + ' ' + ('00' + date.getHours()).slice(-2) + ':' + ('00' + date.getMinutes()).slice(-2) + ':' + ('00' + date.getSeconds()).slice(-2);

      var data = {
        nombre: miembro.Nombre,
        cel: miembro.Cel,
        id: miembro.Id,
        get: 'miembro'
      };
      functionAjax(getsuccess,geterror,data,'edit');
    });
  };

  return {
    // getCursos: getCursos,    
    // getGrupos: getGrupos,
    // getEstudantesCursos: getEstudantesCursos,
    // getMiembrosGrupos: getMiembrosGrupos,
    getEstudantebyNome:getEstudantebyNome,
    // getEstudantebyId:getEstudantebyId,
    // getEstudantesbyDocumento:getEstudantesbyDocumento,
    // enviarMensajeNotificacion: enviarMensajeNotificacion,
    insertNotificacao: insertNotificacao,
    // insertNotificacionGrupo: insertNotificacionGrupo,
    // insertGrupo: insertGrupo,
    // insertMiembro: insertMiembro,
    // deleteGrupo: deleteGrupo,
    // deleteMiembro: deleteMiembro,
    // editGrupo:editGrupo,
    // editMiembro:editMiembro
  };
})

.service('HistorialService', function($q, $http){

  var getHistorial = function(fecha1,fecha2,idJornada,idSede,idUser,functionAjax){
    return $q(function(resolve, reject) {
      var getsuccess = function(data){
        //console.log(data);
        resolve(data.contenido);
      }

      var geterror = function(response){
        //console.log(response);
        reject('no funciona');
      }

      var data = {
        get: 'historial',
        fecha: fecha1,
        IdJornada: idJornada,
        IdSede: idSede,
        IdUser: idUser,
        fecha2: fecha2
      };

      functionAjax(getsuccess,geterror,data,'get');
    });
  };

  var getHistorialNotificacionId = function(id,functionAjax){
    return $q(function(resolve, reject) {
      var getsuccess = function(data){
        //console.log(data);
        resolve(data.contenido);
      }

      var geterror = function(response){
        //console.log(response);
        reject('no funciona');
      }

      var data = {
        get: 'historialNotificacionId',
        id: id
      };

      functionAjax(getsuccess,geterror,data,'get');
    });
  };

  var getHistorialCursoId = function(id,functionAjax){
    return $q(function(resolve, reject) {
      var getsuccess = function(data){
        //console.log(data);
        resolve(data.contenido);
      }

      var geterror = function(response){
        //console.log(response);
        reject('no funciona');
      }

      var data = {
        get: 'historialCursoId',
        id: id
      };

      functionAjax(getsuccess,geterror,data,'get');
    });
  };

  var getHistorialEstudanteId = function(id,functionAjax){
    return $q(function(resolve, reject) {
      var getsuccess = function(data){
        //console.log(data);
        resolve(data.contenido);
      }

      var geterror = function(response){
        //console.log(response);
        reject('no funciona');
      }

      var data = {
        get: 'historialEstudanteId',
        id: id
      };

      functionAjax(getsuccess,geterror,data,'get');
    });
  };

  var getUsuarios = function(functionAjax){
    return $q(function(resolve, reject) {
      var getsuccess = function(data){
        //console.log(data);
        resolve(data.contenido);
      }

      var geterror = function(response){
        //console.log(response);
        reject('no funciona');
      }

      var data = {
        get: 'usuarios',
      };

      functionAjax(getsuccess,geterror,data,'get');
    });
  };

  var insertImages = function(fd,functionAjax){
    return $q(function(resolve, reject) {
      var getsuccess = function(data){
        //console.log(data);
        resolve(data.contenido);
      }

      var geterror = function(response){
        //console.log(response);
        reject('no funciona');
      }

      functionAjax(getsuccess,geterror,fd);
    });
  };

  var insertImageinBd = function(id,nombre,functionAjax){
    return $q(function(resolve, reject) {
      var getsuccess = function(data){
        //console.log(data);
        resolve('funciona');
      }

      var geterror = function(response){
        //console.log(response);
        reject('no funciona');
      }

      var data = {
        url: nombre,
        idFalla: id,
        get: 'imagen'
      };

      functionAjax(getsuccess,geterror,data,'edit');
    });
  };

  var insertObservacion = function(observacion,estudante,functionAjax){
    return $q(function(resolve, reject) {
      var getsuccess = function(data){
        //console.log(data);
        resolve(data.contenido);
      }

      var geterror = function(response){
        //console.log(response);
        reject('no funciona');
      }

      var date = new Date();
      var dia = date.getFullYear() + '-' + ('00' + (date.getMonth() + 1)).slice(-2) + '-' + ('00' + date.getDate()).slice(-2) + ' ' + ('00' + date.getHours()).slice(-2) + ':' + ('00' + date.getMinutes()).slice(-2) + ':' + ('00' + date.getSeconds()).slice(-2);

      var data = {
        get: 'observacion',
        Responsavel: observacion.Responsavel,
        descripcion: observacion.Descripcion,
        accion: observacion.Accion,
        compromiso: observacion.Compromiso,
        dia:dia,
        idEstudante: estudante.Id,
      };
      functionAjax(getsuccess,geterror,data,'insert');
    });
  }

  return {
    // getHistorial: getHistorial,
    // getHistorialCursoId: getHistorialCursoId,
    // getHistorialNotificacionId: getHistorialNotificacionId,
    getHistorialEstudanteId:getHistorialEstudanteId,
    // getUsuarios: getUsuarios,
    // insertImages:insertImages,
    // insertImageinBd:insertImageinBd,
    // insertObservacion:insertObservacion,
  };
})

.service('GraficasService', function($q, $http){

  var getHistorialMensajes = function(fecha1,fecha2,functionAjax){
    return $q(function(resolve, reject) {
      var getsuccess = function(data){
        //console.log(data);
        resolve(data.contenido);
      }

      var geterror = function(response){
        //console.log(response);
        reject('no funciona');
      }

      var data = {
        get: 'historialMensajes',
        fecha: fecha1,
        // IdSede: idSede,
        // IdUser: idUser,
        fecha2: fecha2
      };

      functionAjax(getsuccess,geterror,data,'get');
    });
  };  

  var getAusenciaSumatoria = function(config,fecha1,fecha2,functionAjax){
    return $q(function(resolve, reject) {
      var getsuccess = function(data){
        //console.log(data);
        resolve(data.contenido);
      }

      var geterror = function(response){
        //console.log(response);
        reject('no funciona');
      }

      var data = {
        get: 'AusenciasSumatoria',
        fecha: fecha1,
        config: config,
        fecha2: fecha2
      };

      functionAjax(getsuccess,geterror,data,'get');
    });
  };  

  var getAusenciaDias = function(config,fecha1,fecha2,functionAjax){
    return $q(function(resolve, reject) {
      var getsuccess = function(data){
        //console.log(data);
        resolve(data.contenido);
      }

      var geterror = function(response){
        //console.log(response);
        reject('no funciona');
      }

      var data = {
        get: 'AusenciasDias',
        fecha: fecha1,
        config: config,
        fecha2: fecha2
      };

      functionAjax(getsuccess,geterror,data,'get');
    });
  };

  var getLlamadasTomadas = function(config,fecha1,fecha2,functionAjax){
    return $q(function(resolve, reject) {
      var getsuccess = function(data){
        //console.log(data);
        resolve(data.contenido);
      }

      var geterror = function(response){
        //console.log(response);
        reject('no funciona');
      }

      var data = {
        get: 'LlamadasTomadas',
        fecha: fecha1,
        config: config,
        fecha2: fecha2
      };

      functionAjax(getsuccess,geterror,data,'get');
    });
  };

  return {
    getHistorialMensajes:getHistorialMensajes,
    getAusenciaSumatoria:getAusenciaSumatoria,
    getAusenciaDias:getAusenciaDias,
    getLlamadasTomadas:getLlamadasTomadas,    
  };
})

.service('ReporteServices', function($q, $http){

  var getCursoEstudantes = function(idCurso,functionAjax){
    return $q(function(resolve, reject) {
      var getsuccess = function(data){
        //console.log(data);
        resolve(data.contenido);
      }

      var geterror = function(response){
        //console.log(response);
        reject('no funciona');
      }

      var data = {
        idCurso: idCurso,
        get: 'cursoEstudantes'
      };
      functionAjax(getsuccess,geterror,data,'get');
    });
  };

  var getAsistenciasCursos = function(mes,cursos,functionAjax){
    return $q(function(resolve, reject) {
      var getsuccess = function(data){
        //console.log(data);
        resolve(data.contenido);
      }

      var geterror = function(response){
        //console.log(response);
        reject('no funciona');
      }

      var year = (new Date()).getFullYear();
      var fecha = new Date(year, mes, 1);
      var fecha2 = new Date(year, mes + 1, 1);

      var data = {
        cursos: cursos,
        fecha: fecha.toISOString().substring(0,10),
        fecha2: fecha2.toISOString().substring(0,10),
        get: 'asistenciasCursos'
      };
      functionAjax(getsuccess,geterror,data,'get');
    });
  };

  var getAsistenciaAuxilio = function(estudantes,fecha1,fecha2,functionAjax){
    return $q(function(resolve, reject) {
      var getsuccess = function(data){
        //console.log(data);
        resolve(data.contenido);
      }

      var geterror = function(response){
        //console.log(response);
        reject('no funciona');
      }

      var data = {
        estudantes: estudantes,
        fecha1: fecha1,
        fecha2: fecha2,
        get: 'asistenciaAuxilio'
      };
      functionAjax(getsuccess,geterror,data,'get');
    });
  };

  return {
    getCursoEstudantes: getCursoEstudantes,
    getAsistenciasCursos: getAsistenciasCursos,
    getAsistenciaAuxilio: getAsistenciaAuxilio,
  };
})

.service('HerramientaService', function($q, $http){

  var getCursosDatosFaltantes = function(functionAjax){
    return $q(function(resolve, reject) {
      var getsuccess = function(data){
        //console.log(data);
        resolve(data.contenido);
      }

      var geterror = function(response){
        //console.log(response);
        reject('no funciona');
      }

      var data = {
        get: 'cursosDatosFaltantes'
      };
      functionAjax(getsuccess,geterror,data,'get');
    });
  };  

  var getEstudantesDatosFaltantes = function(idCurso,functionAjax){
    return $q(function(resolve, reject) {
      var getsuccess = function(data){
        //console.log(data);
        resolve(data.contenido);
      }

      var geterror = function(response){
        //console.log(response);
        reject('no funciona');
      }

      var data = {
        idCurso: idCurso,
        get: 'estudantesDatosFaltantes'
      };
      functionAjax(getsuccess,geterror,data,'get');
    });
  };  

  return {
    getCursosDatosFaltantes : getCursosDatosFaltantes,
    getEstudantesDatosFaltantes : getEstudantesDatosFaltantes
  };
})

.service('PromocionService', function($q, $http){

  var insertCurso = function(cursoAnterior,nombreNuevoCurso,functionAjax){
    return $q(function(resolve, reject) {
      var getsuccess = function(data){
        // console.log(data);
        resolve('funciona');
      }

      var geterror = function(response){
        // console.log(response);
        reject('no funciona');
      }

      var data = {
        idSedeJornada: cursoAnterior.IdSedeJornada,
        idCurso: cursoAnterior.Id,
        nombre: nombreNuevoCurso,
        ano: new Date().getFullYear(),
        get: 'curso'
      };
      functionAjax(getsuccess,geterror,data,'insert');
    });
  };

  var deleteCurso = function(idCurso,functionAjax){
    return $q(function(resolve, reject) {
      var getsuccess = function(data){
        //console.log(data);
        resolve('funciona');
      }

      var geterror = function(response){
        //console.log(response);
        reject('no funciona');
      }

      var data = {
        idCurso: idCurso,
        ano: new Date().getFullYear(),
        get: 'curso'
      };
      functionAjax(getsuccess,geterror,data,'delete');
    });
  }; 

  var getEstudantesPromocion = function(idCurso,functionAjax){
    return $q(function(resolve, reject) {
      var getsuccess = function(data){
        //console.log(data);
        resolve(data.contenido);
      }

      var geterror = function(response){
        //console.log(response);
        reject('no funciona');
      }


      var data = {
        ano: (new Date().getFullYear())-1,
        idCurso: idCurso,
        get: 'estudantesPromocion'
      };
      functionAjax(getsuccess,geterror,data,'get');
    });
  };

  var promoverEstudantes = function(estudantesPromover,functionAjax){
    return $q(function(resolve, reject) {
      var getsuccess = function(data){
        //console.log(data);
        resolve(data.contenido);
      }

      var geterror = function(response){
        //console.log(response);
        reject('no funciona');
      }


      var data = {
        estudantes: estudantesPromover,
        ano: (new Date().getFullYear()),
        get: 'estudantesPromocion'
      };
      functionAjax(getsuccess,geterror,data,'insert');
    });
  };

  var getTodoslosCursos = function(functionAjax){
    return $q(function(resolve, reject) {
      var getsuccess = function(data){
        //console.log(data);
        resolve(data.contenido);
      }

      var geterror = function(response){
        //console.log(response);
        reject('no funciona');
      }


      var data = {
        ano: (new Date().getFullYear()),
        get: 'todoslosCursos'
      };
      functionAjax(getsuccess,geterror,data,'get');
    });
  };
  
  return {
    insertCurso: insertCurso,
    deleteCurso: deleteCurso,
    getEstudantesPromocion : getEstudantesPromocion,
    getTodoslosCursos: getTodoslosCursos,
    promoverEstudantes: promoverEstudantes, 
  };
})

.service('SoporteService', function($q, $http){

  var enviarSoporte = function(soporte,functionAjax){
    return $q(function(resolve, reject) {
      var getsuccess = function(data){
        //console.log(data);
        resolve(data);
      }

      var geterror = function(response){
        //console.log(response);
        reject('no funciona');
      }

      var data = {
        prioridad: soporte.prioridad,
        tipo: soporte.tipo,
        nombre: soporte.nombre,
        correo: soporte.correo,
        mensaje: soporte.mensaje,
        colegio: soporte.colegio
      };

      functionAjax(getsuccess,geterror,data);
    });
  };

  return {
    enviarSoporte : enviarSoporte
  };
})
