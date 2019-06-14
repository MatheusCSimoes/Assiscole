angular.module('starter')
 
.service('AjaxService', function($q, $http){

  function miAjax(successCall,errorCall,info){
    var data = $.param(info);
    $http({
      method: 'POST',
      url: 'php/vistas/Login.php',
      dataType: "json",
      data,
      headers : {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      }
      }).then(function successCallback(response) {
        successCall(response.data);
      }, function errorCallback(response) {
        errorCall(response);
      });
  }

  return {
    miAjax:miAjax,
  };
})

.service('LoginService', function($q){
  var loginUser = function(datos,functionAjax){
    return $q(function(resolve, reject) {
      var getsuccess = function(data){
        resolve(data.contenido);
      }

      var geterror = function(response){
        reject('Algo Inesperado Paso, Vuelva a Intentarlo o Comunicarse al 3006513170');
      }

      var data = {
        user:datos.User,
        pass:datos.Pass,
        get: 'loginUser',
      };
      functionAjax(getsuccess,geterror,data);
    });
  };

  var loginPass = function(datos,functionAjax){
    return $q(function(resolve, reject) {
      var getsuccess = function(data){
        resolve(data.contenido);
      }

      var geterror = function(response){
        reject('Algo Inesperado Paso, Vuelva a Intentarlo o Comunicarse al 3006513170');
      }

      var data = {
        user:datos.User,
        pass:datos.Pass,
        get: 'loginPass',
      };
      functionAjax(getsuccess,geterror,data);
    });
  };

  var loginSave = function(datos,functionAjax){
    return $q(function(resolve, reject) {
      var getsuccess = function(data){
        resolve();
      }

      var geterror = function(response){
        reject('Algo Inesperado Paso, Vuelva a Intentarlo o Comunicarse al 3006513170');
      }

      var data = {
        key:datos.key,
        alias:datos.alias,
        bd:datos.bd,
        get: 'loginSave',
      };
      functionAjax(getsuccess,geterror,data);
    });
  };

  var loginSucess = function(datos,functionAjax){
    return $q(function(resolve, reject) {
      var getsuccess = function(data){
        resolve(data.contenido[0]);
      }

      var geterror = function(response){
        reject('Algo Inesperado Paso, Vuelva a Intentarlo o Comunicarse al 3006513170');
      }

      var data = {
        key:datos.Key,
        alias:datos.Alias,
        get: 'loginSucess',
      };
      functionAjax(getsuccess,geterror,data);
    });
  };

  var loginSucessAdmin = function(datos,functionAjax){
    return $q(function(resolve, reject) {
      var getsuccess = function(data){
        resolve(data.contenido[0]);
      }

      var geterror = function(response){
        reject('Algo Inesperado Paso, Vuelva a Intentarlo o Comunicarse al 3006513170');
      }

      var data = {
        key:datos.Key,
        alias:datos.Alias,
        get: 'loginSucessAdmin',
      };
      functionAjax(getsuccess,geterror,data);
    });
  };

  return {
    loginUser:loginUser,    
    loginPass:loginPass,    
    loginSucess:loginSucess,    
    loginSave:loginSave,
    loginSucessAdmin:loginSucessAdmin
  };
})
