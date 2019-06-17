<?php  
  $day = new DateTime('NOW');
  $version = date('dm',$day->getTimestamp());
  // $version = 31072;
?>
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width">
    <title>App - Sipaf</title>

    <!-- CORE CSS-->        
    <link href="css/materialize.css?version=1410" rel="stylesheet">
    <link href="css/style.css?version=1410" rel="stylesheet">

    <!-- Favicons-->
    <link rel="icon" href="images/favicon/favicon-32x32.png" sizes="32x32">
    <!-- Favicons-->
    <link rel="apple-touch-icon-precomposed" href="images/favicon/apple-touch-icon-152x152.png">
    <!-- For iPhone -->
    <meta name="msapplication-TileColor" content="#00bcd4">
    <meta name="msapplication-TileImage" content="images/favicon/mstile-144x144.png">
    <!-- For Windows Phone -->

    <!-- INCLUDED PLUGIN CSS ON THIS PAGE -->    
    <link href="css/perfect-scrollbar.css" type="text/css" rel="stylesheet" media="screen,projection">
    <link href="css/jquery.dataTables.css" type="text/css" rel="stylesheet" media="screen,projection">
    <link href="css/chartist.min.css" type="text/css" rel="stylesheet" media="screen,projection">

    <!-- jQuery Library -->
    <!-- <script type="text/javascript" src="js/plugins/jquery-1.11.2.min.js"></script> -->
    <script type="text/javascript" src="js/plugins/jquery-3.2.1.min.js"></script>
    <script type="text/javascript" src="js/plugins/jquery.dataTables.min.js"></script>

    <!-- angularjs js -->
    <script src="js/plugins/angular.js"></script>
    <script src="js/plugins/angular-datatables.min.js"></script>
    <script src="js/plugins/angular-ui-router.js"></script>

    <!-- pdf js -->
    <script src="js/plugins/pdf/jspdf.min.js"></script>
    <script src="js/plugins/pdf/jspdf.plugin.autotable.js"></script>

    <!-- your app's js -->
    <script src="js/app.js?version=<?php echo $version; ?>"></script>
    <script src="js/controllers.js?version=<?php echo $version; ?>"></script>
    <script src="js/services.js?version=<?php echo $version; ?>"></script>

    <script src="js/Cursos/Cursos.js?version=<?php echo $version; ?>"></script>
    <script src="js/Cursos/Estudante.js?version=<?php echo $version; ?>"></script>
    <script src="js/Cursos/CursoProfessor.js?version=<?php echo $version; ?>"></script>
    <script src="js/Cursos/EstudanteProfessor.js?version=<?php echo $version; ?>"></script>

    <script src="js/Notificacion/Estudantes.js?version=<?php echo $version; ?>"></script>
    <script src="js/Notificacion/Curso.js?version=<?php echo $version; ?>"></script>

    <script src="js/Historial/Estudante.js?version=<?php echo $version; ?>"></script>   

    <script src="js/Reportes/Estudante.js?version=<?php echo $version; ?>"></script>

  </head>

  <body ng-app="starter">
  
    <div ui-view></div>

  <!--materialize js-->
  <script type="text/javascript" src="js/plugins/materialize.js"></script>
  <!--scrollbar-->
  <script type="text/javascript" src="js/plugins/perfect-scrollbar.min.js"></script>  
  <!-- validate -->
  <script type="text/javascript" src="js/plugins/jquery.validate.min.js"></script>
  <!-- chartjs -->
  <script type="text/javascript" src="js/plugins/chart.min.js"></script>
  <!-- sparkline -->
  <script type="text/javascript" src="js/plugins/jquery.sparkline.min.js"></script>
  <!-- sweetalert -->
  <script type="text/javascript" src="js/plugins/sweetalert2.all.min.js"></script> 
  <!-- xlsx -->
  <script type="text/javascript" src="js/plugins/xlsx.full.min.js"></script>   
  </body>
</html>
