<?php  
  $day = new DateTime('NOW');
  $version = date('dm',$day->getTimestamp());  
?>
<!DOCTYPE html>
<html lang="en">

<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="msapplication-tap-highlight" content="no">
  <meta name="description" content="Tomar asistencia y notificaciones para los colegios de manera inmediata">
  <meta name="keywords" content="sipaf, pafi, asistencia inmediata, mensajes, colegios, notificaciones">
  <meta name="generator" content="Angular">
  <title>Login - Sipaf</title>

  <!-- Favicons-->
  <link rel="icon" href="images/favicon/favicon-32x32.png" sizes="32x32">
  <!-- Favicons-->
  <link rel="apple-touch-icon-precomposed" href="images/favicon/apple-touch-icon-152x152.png">
  <!-- For iPhone -->
  <meta name="msapplication-TileColor" content="#00bcd4">
  <meta name="msapplication-TileImage" content="images/favicon/mstile-144x144.png">
  <!-- For Windows Phone -->


  <!-- CORE CSS-->  
  <link href="css/materialize.css" type="text/css" rel="stylesheet" media="screen,projection">
  <link href="css/style.css" type="text/css" rel="stylesheet" media="screen,projection">
  <link href="css/page-center.css" type="text/css" rel="stylesheet" media="screen,projection">

  <!-- jQuery Library -->
  <script type="text/javascript" src="js/plugins/jquery-1.11.2.min.js"></script>

  <!-- angularjs js -->
  <script src="js/plugins/angular.js"></script>
  <script src="js/plugins/angular-ui-router.js"></script>

  <!-- <script type="text/javascript" language="javascript">  
    var versionUpdate = (new Date()).getTime();  
    var scripts = ["app","controllers","services"];
    for (var i = 0; i < scripts.length; i++) {
      var script = document.createElement("script");  
      script.type = "text/javascript";  
      script.src = "js/"+scripts[i]+".js?v=" + versionUpdate;  
      document.body.appendChild(script);  
    }
  </script>   -->
  <!-- your app's js -->
  <script src="js/app.js?version=<?php echo $version; ?>"></script>
  <script src="js/controllers.js?version=<?php echo $version; ?>"></script>
  <script src="js/services.js?version=<?php echo $version; ?>"></script>

  <!-- INCLUDED PLUGIN CSS ON THIS PAGE -->
  <!-- <link href="css/prism.css" type="text/css" rel="stylesheet" media="screen,projection"> -->
  <link href="js/plugins/perfect-scrollbar/perfect-scrollbar.css" type="text/css" rel="stylesheet" media="screen,projection">
  
</head>

<body class="orange" ng-app="starter">

  <div ui-view></div>

  <!--materialize js-->
  <script type="text/javascript" src="js/plugins/materialize.js"></script>
  <!-- validate -->
  <script type="text/javascript" src="js/plugins/jquery.validate.min.js"></script> 
  <!--scrollbar-->
  <script type="text/javascript" src="js/plugins/perfect-scrollbar/perfect-scrollbar.min.js"></script>

  <!--plugins.js - Some Specific JS codes for Plugin Settings-->
  <!-- <script type="text/javascript" src="js/plugins.js"></script> -->
  <!-- <script type="text/javascript" src="js/app.js"></script> -->
</body>

</html>