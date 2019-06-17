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
    if(token.Professor != null)
      role = "Professor";
    else
      role = "Funcionario";
    id = token.RG;
    // descripcionRol = token.RolNombre;
    // adds = _adds;
    modulos = token.Modulos;    
    // bd = base;  
 
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

  return {
    getUser: getUser,
    role: function() {return role;},
    idUser: function() {return id;},
    modulos: function() {return modulos;},
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

  return {
    miAjax:miAjax,
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

    var getCursosProfessor = function(idUser,functionAjax){
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
        idUser:idUser,
        get: 'cursoProfessor'
      };
      functionAjax(getsuccess,geterror,data,'get');
    });
  };

  return {
    getCursos:getCursos,
    getCursosProfessor:getCursosProfessor,
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

  var getEstudantesDisciplina = function(idCurso,functionAjax){
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
        idDisciplina: idCurso,
        get: 'estudantesDiscplina'
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

  var insertNotas = function(idUser,curso,Estudantes,functionAjax){
    return $q(function(resolve, reject) {
      var getsuccess = function(data){
        //console.log(data);
        resolve('funciona');
      }

      var geterror = function(response){
        //console.log(response);
        reject('no funciona');
      }

      for (var i = 0; i < Estudantes.length; i++) {
        if(Estudantes[i].Nota < 5)
          Estudantes[i].Situacao = "Reprovado"
        else
          Estudantes[i].Situacao = "Aprovado"
      }

      var data = {
        idUser: idUser,
        idDisciplina: curso.Id,
        estudantes: Estudantes,
        get: 'notas'
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
    getEstudantesDisciplina: getEstudantesDisciplina,
    insertNotas: insertNotas,
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
        get: 'todoslosCursos'
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

  return {
    getCursos: getCursos,    
    getEstudantesCursos: getEstudantesCursos,
    getEstudantebyNome:getEstudantebyNome,
    insertNotificacao: insertNotificacao,
  };
})

.service('HistorialService', function($q, $http){

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
  
  return {
    getHistorialEstudanteId:getHistorialEstudanteId,
  };
})

.service('ReporteServices', function($q, $http){

  var getEstudantesIndiciplinado = function(idCurso,functionAjax){
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
        get: 'estudantesIndiciplinados'
      };
      functionAjax(getsuccess,geterror,data,'get');
    });
  };

  return {
    getEstudantesIndiciplinado: getEstudantesIndiciplinado,
  };
})