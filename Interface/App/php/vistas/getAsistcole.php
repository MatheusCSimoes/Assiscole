<?php 
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: X-Requested-With, Content-Type, X-Auth-Token, Origin, Authorization');
$req_method = $_SERVER['REQUEST_METHOD'];
// $_POST = $_GET;
class nuevoPDO
{
  private $querySql = array();
  private $options = array();
  public $res;
  public $resquery;
  public $content = "";
  private $db;
  private $token;
  private $ano = 2019;

    public function __construct()
    {
      if(isset($_POST['bd']))
        define('db', $_POST['bd']);
      include "../conexion/connectPDO.php";
        $this->db = $db;
        $this->token = $token;

        $this->createQuery();
        $this->executeQuery();  
    }

    private function createQuery(){
      $arrayOptions = array();

      switch ($_POST['get']) {
        case 'cursos':
          $this->querySql['query'] = 'SELECT c.Id,c.Nome,COUNT(pe.fk_Curso_Id) AS Estudiantes FROM Curso as c left JOIN Pertence as pe ON (c.Id = pe.fk_Curso_Id and pe.Ano = :ano) GROUP BY c.Id ORDER by Id';  
          // ORDER by Nombre + 0
            array_push($arrayOptions,"ano");
          break;
        case 'estudantes':
            $fecha = $_POST['fecha'];
            $this->querySql['query'] = 'SELECT e.RG as IdEstudante,e.Nome as NomeEstudante,r.*, max(pr.Dia) as Dia, pr.Tipo from Estudante as e left join Possui as po on e.RG = po.fk_Estudante_RG left join Responsaveis as r on r.RG = po.fk_Responsaveis_RG inner join Pertence as pe on pe.fk_Estudante_RG = e.RG and pe.Ano = :ano left join Presenca as pr on e.RG = pr.fk_Estudante_RG where pe.fk_Curso_Id = :idCurso and e.Ativo = 1 GROUP by e.RG ORDER BY e.Nome asc';
            array_push($arrayOptions,"idCurso","ano");
            break;
        case 'getEstudantebyNome':
          $this->querySql['query'] = "SELECT e.RG as IdEstudiante, e.Nome as NomeEstudante, c.Nome as Curso, co.* FROM Estudante as e inner join Pertence as epc on (epc.fk_Estudante_RG = e.RG and epc.Ano = $this->ano) inner join Curso as c on c.Id = epc.fk_Curso_Id inner join Possui as ce on e.RG = ce.fk_Estudante_RG inner join Responsaveis as co on co.RG = ce.fk_Responsaveis_RG WHERE e.Nome LIKE '%".$_POST['nome']."%' and e.Ativo = 1 group by e.RG ORDER by e.Nome asc, co.RG";
          break;
        case 'historialEstudanteId':
          $this->querySql['query'] = 'SELECT "Falla" as Tipo, ae.Tipo as TipoFalla, ae.Dia, ju.Texto, ae.Id as IdFalla from Presenca as ae left join Justificativas as ju on ae.Id = ju.fk_Presença_Id where ae.fk_Estudante_RG = :id Union SELECT "Notificacao", n.Mensagem, n.Data, n.Id, "" from Informa_Funcionarios_Notificações_Estudante as ne inner join Notificacoes as n on ne.fk_Notificações_Id = n.Id where ne.fk_Estudante_RG = :id Union SELECT "Observacion", o.Observacao, o.Data, "", "" from Informa_Funcionarios_Estudante_Observações as oe inner join Observacoes as o on oe.fk_Observações_Id = o.Id where oe.fk_Estudante_RG = :id order by Tipo, Dia desc';
          array_push($arrayOptions,"id");
            break;

        case 'todoslosCursos':
          $this->querySql['query'] = 'SELECT c.Id,c.Nome,COUNT(pe.fk_Curso_Id) AS Estudiantes FROM Curso as c left JOIN Pertence as pe ON (c.Id = pe.fk_Curso_Id and pe.Ano = :ano) where EXISTS (SELECT fk_Estudante_RG FROM Pertence as p WHERE c.Id = p.fk_Curso_Id) GROUP BY c.Id ORDER by Id';  
          // ORDER by Nombre + 0
            array_push($arrayOptions,"ano");
          break;


        case 'estudantesMuchosCursos':
          $this->querySql['query'] = "SELECT e.RG as IdEstudiante,e.Nome as Estudante,c.* from Estudante as e inner join Possui as ce on e.RG = ce.fk_Estudante_RG inner join Responsaveis as c on c.RG = ce.fk_Responsaveis_RG inner join Pertence as epc on (e.RG = epc.fk_Estudante_RG and epc.Ano = $this->ano) where epc.fk_Curso_Id in (";
          // if(count($_POST['cursos']) == 1){

          // }
          // else{
            for ($i=0; $i < count($_POST['cursos']); $i++) { 

              $idCur = $_POST['cursos'][$i];
              if($i > 0)
              $this->querySql['query'] .= ',';
              $this->querySql['query'] .= "$idCur";
            }
          // }
          $this->querySql['query'] .= ') and e.Ativo = 1 Group by e.RG ORDER BY Estudante asc, c.RG';
          break;

            ///////////////////////////////////
        //----------DashService----------//
        ///////////////////////////////////
          
          case 'sedesjornadas':
            $this->querySql['query'] = 'SELECT sj.IdSede,s.Alias as Sede, s.Tipo as TipoSede, sj.IdJornada, j.Alias as Jornada, j.Tipo as TipoJornada from sedesjornadas as sj inner join sedes as s on sj.IdSede = s.Id inner join jornadas as j on sj.IdJornada = j.Id order by s.Alias, j.Id';
            break;
          
          case 'cursosPromocion':
            //Si la jornada es principal P busca en la columna principal de los cursos, si la jornada es secundaria S busca en la columna secundaria de los cursos, si en algun momento un curso depende de 3 jornadas hacemos la tabla adicional de muchos cursos a muchas sedesjornadas
            $tipoJornada = $_POST['tipoJornada'];
            if($tipoJornada == "P"){
              $this->querySql['query'] = 'SELECT c.Id,c.Nombre,COUNT(epc.IdCurso) AS Estudiantes, c.IdSedeJornada, ep.CantidadPromocionEstudiantes FROM cursos as c inner join sedesjornadas as sj on c.IdSedeJornada = sj.Id inner join cursosporano as cpa on cpa.IdCurso = c.Id left JOIN estudiantesporcurso as epc ON (c.Id = epc.IdCurso and epc.Ano = :anoAnt) inner join estudiantes as e on epc.IdEstudiante = e.Id and e.Mostrar = 0 ';
            }
            else if($tipoJornada == "S"){
              $this->querySql['query'] = 'SELECT c.Id,c.Nombre,COUNT(epc.IdCurso) AS Estudiantes, c.IdSedeJornadaExtra as IdSedeJornada, ep.CantidadPromocionEstudiantes FROM cursos as c inner join sedesjornadas as sj on c.IdSedeJornadaExtra = sj.Id inner join cursosporano as cpa on cpa.IdCurso = c.Id left JOIN estudiantesporcurso as epc ON (c.Id = epc.IdCurso and epc.Ano = :ano) inner join estudiantes as e on epc.IdEstudiante = e.Id and e.Mostrar = 0 ';  
            }

            $this->querySql['query'] .= 'LEFT JOIN (SELECT COUNT(ac.IdCurso) as CantidadPromocionEstudiantes, ac.IdCurso FROM estudiantesporcurso as ac INNER JOIN estudiantesporcurso as ac2 on ac.IdEstudiante = ac2.IdEstudiante and ac2.Ano = :ano WHERE ac.Ano = :anoAnt GROUP BY ac.IdCurso) AS ep ON ep.IdCurso = c.Id ';

            $this->querySql['query'] .= 'where sj.IdJornada = :idJornada and sj.IdSede = :idSede and c.Mostrar = 0 and cpa.Ano = :anoAnt GROUP BY c.Id ORDER by c.Orden, Id';
            
            // ORDER by Nombre + 0
              array_push($arrayOptions,"idSede","idJornada","anoAnt","ano");
            break;
          case 'cursosAsistidosHoy':
            $fecha = date('Y-m-d', time() - 3600*5);
            $today = date('Y-m-d H:i:s', time() - 3600*5);
            $this->querySql['query'] = 'SELECT a.Dia, c.Nombre, sj.IdSede as IdSede, sj.IdJornada as IdJornada FROM asistenciaporcurso as a inner join cursos as c on a.IdCurso = c.Id inner join sedesjornadas as sj on a.IdSedeJornada = sj.Id WHERE Dia LIKE "'.$fecha.'%" GROUP By IdCurso ';
            $this->querySql['query'] .= 'UNION ';
            $this->querySql['query'] .= 'SELECT n.Dia, "Notificacion", "","" FROM notificaciones as n WHERE Dia LIKE "'.$fecha.'%" GROUP by n.Continuacion';
            break;
          case 'actividadreciente':
            $this->querySql['query'] = 'SELECT * from actividadreciente as ar ORDER BY Id DESC';
            break;
          case 'mensajesHoy':            
            $fecha = date('Y-m-d', time() - 3600*5);
            $this->querySql['query'] = 'SELECT "asistenciaporestudiante" as Tabla, count(*) as Cantidad FROM asistenciaporcurso as a inner join cursos as c on a.IdCurso = c.Id inner join asistenciaporestudiante as ae on a.Id = ae.IdAsistenciaporcurso ';
            $this->querySql['query'] .= 'WHERE Dia LIKE "'.$fecha.'%" and ae.Enviado = 1 ';
            $this->querySql['query'] .= 'UNION ';
            // $this->querySql['query'] .= 'SELECT COUNT(*) FROM notificaciones as n left join notificacionesporestudiante as ne on n.Id = ne.IdNotificacion left join notificacionespormiembro as nm on n.Id = nm.IdNotificacion ';
            $this->querySql['query'] .= 'SELECT "notificacionesporestudiante", COUNT(*) FROM notificaciones as n inner join notificacionesporestudiante as ne on n.Id = ne.IdNotificacion ';
            $this->querySql['query'] .= 'WHERE Dia LIKE "'.$fecha.'%" and (ne.Enviado = 1) ';
            $this->querySql['query'] .= 'UNION ';
            $this->querySql['query'] .= 'SELECT "notificacionespormiembro", COUNT(*) FROM notificaciones as n inner join notificacionespormiembro as nm on n.Id = nm.IdNotificacion ';                
            $this->querySql['query'] .= 'WHERE Dia LIKE "'.$fecha.'%"';
            break;
          case 'mensajesMes':
            $fecha = $_POST['fecha'];
            $fecha2 = $_POST['fecha2'];
            $this->querySql['query'] = 'SELECT "asistenciaporestudiante" as Tabla, count(ae.Numero) as Cantidad FROM asistenciaporcurso as a inner join cursos as c on a.IdCurso = c.Id inner join asistenciaporestudiante as ae on a.Id = ae.IdAsistenciaporcurso ';
              $this->querySql['query'] .= 'WHERE Dia BETWEEN "'.$fecha2.'%" AND "'.$fecha.'%" and ae.Enviado = 1 ';
            $this->querySql['query'] .= 'UNION ';
            // $this->querySql['query'] .= 'SELECT COUNT(*) FROM notificaciones as n left join notificacionesporestudiante as ne on n.Id = ne.IdNotificacion left join notificacionespormiembro as nm on n.Id = nm.IdNotificacion ';
            $this->querySql['query'] .= 'SELECT "notificacionesporestudiante", COUNT(*) FROM notificaciones as n inner join notificacionesporestudiante as ne on n.Id = ne.IdNotificacion ';
            $this->querySql['query'] .= 'WHERE Dia BETWEEN "'.$fecha2.'%" AND "'.$fecha.'%" and ne.Enviado = 1 ';
            $this->querySql['query'] .= 'UNION ';
            $this->querySql['query'] .= 'SELECT "notificacionespormiembro", COUNT(*) FROM notificaciones as n inner join notificacionespormiembro as nm on n.Id = nm.IdNotificacion ';                
            $this->querySql['query'] .= 'WHERE Dia BETWEEN "'.$fecha2.'%" AND "'.$fecha.'%"';
            break;
          case 'ausenciasMes':
            $fecha = $_POST['fecha'];
            $fecha2 = $_POST['fecha2'];
            $this->querySql['query'] = 'SELECT a.Dia, COUNT(a.Id) as Cantidad FROM asistenciaporcurso as a inner join cursos as c on a.IdCurso = c.Id inner join asistenciaporestudiante as ae on ae.IdAsistenciaporcurso = a.Id inner join sedesjornadas as sj on a.IdSedeJornada = sj.Id WHERE a.Dia BETWEEN "'.$fecha2.'%" AND "'.$fecha.'%" and ae.Enviado = 1 and ae.IdTipoasistencia = 1 group by a.Id';
            break;
          
        ////////////////////////////////////
        //-------EstudiantesService-------//
        ////////////////////////////////////
          
            
          case 'cursosAdicionales':
            $this->querySql['query'] = 'SELECT c.Id, c.Nombre FROM cursos as c inner join sedesjornadas as sj on c.IdSedeJornada = sj.Id inner join jornadas as j on sj.IdJornada = j.Id where c.Especial = 1 and j.Tipo =:tipo';
            array_push($arrayOptions,"tipo");
            break;
          case 'tipoAsistencia':
            $this->querySql['query'] = 'SELECT * FROM tipoasistencia';
            break;
          case 'mensajesLlamado':
            $this->querySql['query'] = 'SELECT s.Id as Sede, j.Id as Jornada, ta.Id as Tipo, msj.Mensaje from mensajessedejornada as msj inner join sedesjornadas as sj on msj.IdSedesJornadas = sj.Id inner join tipoasistencia as ta on msj.IdTipoAsistencia = ta.Id inner join sedes as s on s.Id = sj.IdSede inner join jornadas as j on j.Id = sj.IdJornada where sj.IdJornada = :idJornada and sj.IdSede = :idSede';
              array_push($arrayOptions,"idSede","idJornada");
            break;

        /////////////////////////////////////
        //-------NotificacionService-------//
        /////////////////////////////////////
          
          
          case 'grupos':
            $this->querySql['query'] = 'SELECT * FROM grupos where Mostrar = 0 ORDER by Nombre';
            break;
          case 'miembrosGrupo':
            $this->querySql['query'] = 'SELECT * from miembros where IdGrupo = :idGrupo and Mostrar = 0 ORDER BY Nombre asc';
            array_push($arrayOptions,"idGrupo");
            break;
          // case 'getEstudantebyNome':
          case 'estudiantebyId':
          case 'estudiantesbyDocumento':
            $this->querySql['query'] = "SELECT e.Id as IdEstudiante, e.ApellidosNombres, e.Documento,e.Sexo,e.FechaNacimiento, c.Nombre as Curso, j.Alias as Jornada, j.Tipo as TipoJornada, caux.Nombre as CursoAux, epc.IdCursoAux as CursoAd, s.Alias as Sede, co.*, ce.Mandar FROM estudiantes as e inner join estudiantesporcurso as epc on (epc.IdEstudiante = e.Id and epc.Ano = $this->ano) inner join cursos as c on c.Id = epc.IdCurso inner join sedesjornadas as sj on c.IdSedeJornada = sj.Id inner join sedes as s on s.Id = sj.IdSede inner join jornadas as j on j.Id = sj.IdJornada inner join contactosporestudiante as ce on e.Id = ce.IdEstudiante inner join contactos as co on co.Id = ce.IdContacto left join cursos as caux on epc.IdCursoAux = caux.Id WHERE ";

            if($_POST['get'] == 'estudiantebyNombre')
              $this->querySql['query'] .= "e.ApellidosNombres LIKE '%".$_POST['nombre']."%'";
            else if($_POST['get'] == 'estudiantebyId'){
              $this->querySql['query'] .= "e.Id = :idEstudiante";
              array_push($arrayOptions,"idEstudiante");
            }
            else if($_POST['get'] == 'estudiantesbyDocumento'){
              $this->querySql['query'] .= 'e.Documento in ('.$_POST['idsEstudiantes'].')';
            }
            $this->querySql['query'] .= " and e.Mostrar = 0 group by e.id ORDER by ApellidosNombres asc, co.Id";
            break;
          
        //////////////////////////////////////
        //---------HistorialService---------//
        //////////////////////////////////////
          case 'historial':
            $fecha = $_POST['fecha'];
            $fecha2 = $_POST['fecha2'];
            $this->querySql['query'] = 'SELECT a.Id ,a.Dia, c.Nombre as Curso, s.Alias as Sede, j.Alias as Jornada, u.usuario, u.Color, " " as Continuacion FROM asistenciaporcurso as a inner join cursos as c on a.IdCurso = c.Id left join usuarios as u on u.Id = a.User inner join sedesjornadas as sj on sj.Id = a.IdSedeJornada inner join sedes as s on s.Id = sj.IdSede inner join jornadas as j on j.Id = sj.IdJornada';              
            if($_POST['fecha2'] != ''){
              $this->querySql['query'] .= ' WHERE Dia BETWEEN "'.$fecha.'%" AND "'.$fecha2.'%"';
            }
            else{
              $this->querySql['query'] .= ' WHERE Dia LIKE "'.$fecha.'%"';
            }
            if($_POST['IdJornada'] > 0){
              $this->querySql['query'] .= ' and sj.IdJornada = :IdJornada';
              array_push($arrayOptions,"IdJornada");
            }
            if($_POST['IdSede'] > 0){
              $this->querySql['query'] .= ' and sj.IdSede = :IdSede';
              array_push($arrayOptions,"IdSede");
            }
            if($_POST['IdUser'] > 0){
              $this->querySql['query'] .= ' and a.User = :IdUser';
              array_push($arrayOptions,"IdUser");
            }
            $this->querySql['query'] .= ' UNION ';
            $this->querySql['query'] .= 'SELECT n.Id, n.Dia, " ", " ", "Notificacion", u.usuario, u.Color, n.Continuacion FROM notificaciones as n left join usuarios as u on u.Id = n.User';
            if($_POST['fecha2'] != ''){
              $this->querySql['query'] .= ' WHERE n.Dia BETWEEN "'.$fecha.'%" AND "'.$fecha2.'%"';
            }
            else{
              $this->querySql['query'] .= ' WHERE n.Dia LIKE "'.$fecha.'%"';
            }
            $this->querySql['query'] .= ' ORDER BY Dia DESC, Id';
            break;
          case 'historialNotificacionId':
            $this->querySql['query'] = 'SELECT n.Texto, e.ApellidosNombres, ne.Numero, ne.Enviado, m.Nombre as Miembro, nm.Numero as NumeroMiembro from notificaciones as n left join notificacionesporestudiante as ne on n.Id = ne.IdNotificacion left join estudiantes as e on ne.IdEstudiante = e.Id left join notificacionespormiembro as nm on n.Id = nm.IdNotificacion left join miembros as m on nm.IdMiembro = m.Id where n.Id in  ('.$_POST['id'].') order by e.ApellidosNombres';
            break;
          case 'historialCursoId':
            $this->querySql['query'] = 'SELECT e.ApellidosNombres, ae.Numero, ta.Nombre as Asistencia, ae.Enviado from asistenciaporestudiante as ae inner join asistenciaporcurso as ac on ae.IdAsistenciaporcurso = ac.Id inner join estudiantes as e on ae.IdEstudiante = e.Id inner join tipoasistencia as ta on ta.Id = ae.IdTipoasistencia where ac.Id = :id';
            array_push($arrayOptions,"id");
            break;
          case 'usuarios':
            $this->querySql['query'] = 'SELECT u.Id, u.usuario, r.Nombre FROM usuarios as u inner join roles as r on u.IdRol = r.Id where u.IdRol > 1';
            break;

        /////////////////////////////////////
        //---------ReporteServices---------//
        /////////////////////////////////////
          case 'cursoEstudiantes':
            $this->querySql['query'] = "SELECT e.Id, e.ApellidosNombres, ta.Nombre as Tipo, c.Nombre, ac.Dia from estudiantes as e inner join estudiantesporcurso as epc on (epc.IdEstudiante = e.Id and epc.Ano = $this->ano) inner join cursos as c on epc.IdCurso = c.Id left join asistenciaporestudiante as ae on ae.IdEstudiante = e.Id left join asistenciaporcurso as ac on (ae.IdAsistenciaporcurso = ac.Id and YEAR(ac.Dia) = $this->ano) left join tipoasistencia as ta on ta.Id = ae.IdTipoasistencia WHERE c.Id = :idCurso and e.Mostrar = 0  GROUP By e.Id,ac.Id order by e.ApellidosNombres";
            array_push($arrayOptions,"idCurso");
            break;

          case 'asistenciasCursos':
            $fecha = $_POST['fecha'];
            $fecha2 = $_POST['fecha2'];
            $this->querySql['query'] = 'SELECT c.Nombre, ce.CantidadEstudiantes, cl.CantidadLlamadas, ae.IdTipoasistencia, ta.Alias as AliasAsistencia, count(ae.IdTipoasistencia) as CantidadAusencias, cj.CantidadJustificaciones FROM cursos as c left join asistenciaporcurso as ac on c.Id = ac.IdCurso inner join asistenciaporestudiante as ae on ac.Id = ae.IdAsistenciaporcurso inner join tipoasistencia as ta on ae.IdTipoasistencia = ta.Id ';
            //Cantidad de Estudiantes en el curso
            $this->querySql['query'] .= "LEFT JOIN (SELECT COUNT(c.Id) as CantidadEstudiantes, c.Id FROM cursos AS c LEFT JOIN estudiantesporcurso as epc on (c.Id = epc.IdCurso or c.Id = epc.IdCursoAux) and epc.Ano = $this->ano INNER JOIN estudiantes as e on epc.IdEstudiante = e.Id and e.Mostrar = 0 group by c.Id) as ce ON ce.Id = c.Id ";

            //Cantidad de llamadas que se hizo en el periodo
            $this->querySql['query'] .= 'LEFT JOIN (SELECT COUNT(c.Id) as CantidadLlamadas, c.Id FROM (SELECT c.Id FROM cursos as c left join asistenciaporcurso as ac on c.Id = ac.IdCurso inner join sedesjornadas as sj on c.IdSedeJornada = sj.Id inner join sedes as s on sj.IdSede = s.Id inner join jornadas as j on sj.IdJornada = j.Id WHERE ac.Dia BETWEEN "'.$fecha.'%" AND "'.$fecha2.'%" GROUP By c.Id, CAST(Dia AS DATE)) as c GROUP By c.Id) AS cl ON cl.Id = c.Id ';
            //Cantidad de justificaciones que se hizo en el periodo
            $this->querySql['query'] .= 'LEFT JOIN (SELECT COUNT(ae.IdTipoasistencia) as CantidadJustificaciones, ae.IdTipoasistencia, ac.IdCurso FROM justificaciones as j inner join asistenciaporestudiante as ae on j.IdFalla = ae.Id inner join asistenciaporcurso as ac on ae.IdAsistenciaporcurso = ac.Id WHERE ac.Dia BETWEEN "'.$fecha.'%" AND "'.$fecha2.'%" GROUP BY ae.IdTipoasistencia) AS cj ON cj.IdTipoasistencia = ae.IdTipoasistencia and cj.IdCurso = c.Id ';

            $this->querySql['query'] .= 'where c.Id in (';

            for ($i=0; $i < count($_POST['cursos']); $i++) { 
              $idCur = $_POST['cursos'][$i];
              if($i > 0)
                // $this->querySql['query'] .= 'or ';
                $this->querySql['query'] .= ', ';
              // $this->querySql['query'] .= "c.Id = $idCur ";
              $this->querySql['query'] .= "$idCur";
            }

            $this->querySql['query'] .= ') AND ac.Dia BETWEEN "'.$fecha.'%" AND "'.$fecha2.'%" GROUP BY ae.IdTipoasistencia, c.Id order by c.Orden, c.Id, ae.IdTipoasistencia;';

            break;

          case 'asistenciaAuxilio':
            $fecha = $_POST['fecha1'];
            $fecha2 = $_POST['fecha2'];
            $this->querySql['query'] = 'SELECT e.Id as IdEstudiante, e.Documento, e.ApellidosNombres, c.Nombre as Curso, ae.Id as Asistencia, j.IdFalla as Justificada FROM estudiantes e inner join estudiantesporcurso epc on epc.IdEstudiante = e.Id inner join cursos c on epc.IdCurso = c.Id and epc.Ano = 2019 left join asistenciaporestudiante ae on (e.Id = ae.IdEstudiante and (ae.IdTipoasistencia = 1)) left join asistenciaporcurso as ac on (ae.IdAsistenciaporcurso = ac.Id and (ac.Dia BETWEEN "'.$fecha.'%" AND "'.$fecha2.'%")) left join justificaciones j on j.IdFalla = ae.Id WHERE e.Id in (';
            for ($i=0; $i < count($_POST['estudiantes']); $i++) { 
              $idEstudiante = $_POST['estudiantes'][$i];
              if($i > 0)
                $this->querySql['query'] .= ', ';
              $this->querySql['query'] .= "$idEstudiante";
            }

            $this->querySql['query'] .= ')';
            break;

          // case 'nuevaactividadreciente':
          //     $this->querySql['query'] = 'SELECT * from actividadrecienteporusuario as aru where aru.IdUser = :idUser';
          //     array_push($arrayOptions,"idUser");
          //     break;

        /////////////////////////////////////
        //---------GraficasServices--------//
        /////////////////////////////////////
          case 'historialMensajes':
            $fecha = $_POST['fecha'];
            $fecha2 = $_POST['fecha2'];
            $this->querySql['query'] = 'SELECT a.Dia, COUNT(a.Id) As Cantidad FROM asistenciaporcurso as a inner join cursos as c on a.IdCurso = c.Id inner join asistenciaporestudiante as ae on ae.IdAsistenciaporcurso = a.Id inner join sedesjornadas as sj on a.IdSedeJornada = sj.Id WHERE ae.Enviado = 1 and a.Dia BETWEEN "'.$fecha.'%" AND "'.$fecha2.'%"';
            $this->querySql['query'] .= ' GROUP By CAST(Dia AS DATE) ';

            $this->querySql['query'] .= 'UNION ';
            // $this->querySql['query'] .= "SELECT n.Dia, COUNT(n.Dia) AS Cantidad FROM notificaciones as n inner join notificacionesporestudiante as ne on n.Id = ne.IdNotificacion inner join estudiantes as e on e.Id = ne.IdEstudiante inner join estudiantesporcurso as epc on e.Id = epc.IdEstudiante inner join cursos as c on epc.IdCurso = c.Id inner join sedesjornadas as sj on sj.Id = c.IdSedeJornada WHERE n.Dia BETWEEN '".$fecha."%' AND '".$fecha2."%' and ne.Enviado = 1 ";
            $this->querySql['query'] .= "SELECT n.Dia, COUNT(n.Dia) AS Cantidad FROM notificaciones as n inner join notificacionesporestudiante as ne on n.Id = ne.IdNotificacion inner join estudiantes as e on e.Id = ne.IdEstudiante WHERE n.Dia BETWEEN '".$fecha."%' AND '".$fecha2."%' and ne.Enviado = 1 ";
            $this->querySql['query'] .= 'GROUP By CAST(Dia AS DATE) ';

            $this->querySql['query'] .= 'UNION ';
            $this->querySql['query'] .= 'SELECT n.Dia, COUNT(n.Dia) AS Cantidad FROM notificaciones as n inner join notificacionespormiembro as nm on n.Id = nm.IdNotificacion inner join miembros as m on m.Id = nm.IdMiembro WHERE n.Dia BETWEEN "'.$fecha.'%" AND "'.$fecha2.'%"';

            $this->querySql['query'] .= ' GROUP By CAST(Dia AS DATE)';
            break;

          case 'AusenciasSumatoria':
            $fecha = $_POST['fecha'];
            $fecha2 = $_POST['fecha2'];
            $tipo = $_POST['config']['tipo'];
            $sede = $_POST['config']['sede'];
            $jornada = $_POST['config']['jornada'];
            $curso = $_POST['config']['curso'];

            $this->querySql['query'] = 'SELECT ';
            if($tipo == "1")
              $this->querySql['query'] .= 's.Id, count(s.Id) as CantidadAusencias, s.Alias as Nombre, ce.CantidadEstudiantes, cl.CantidadLlamadas, cc.CantidadCursos ';
            else if($tipo == "2")
              $this->querySql['query'] .= 'j.Id, count(j.Id) as CantidadAusencias, j.Alias as Nombre, ce.CantidadEstudiantes, cl.CantidadLlamadas, cc.CantidadCursos ';
            else if($tipo == "3")
              $this->querySql['query'] .= 'c.Id, count(c.Id) as CantidadAusencias, c.Nombre as Nombre, ce.CantidadEstudiantes, cl.CantidadLlamadas, 1 as CantidadCursos ';
            else if($tipo == "4")
              $this->querySql['query'] .= 'e.Id, count(e.Id) as CantidadAusencias, e.ApellidosNombres as Nombre, 1 as CantidadEstudiantes, cl.CantidadLlamadas, 1 as CantidadCursos ';

            $this->querySql['query'] .= "FROM asistenciaporcurso AS a INNER JOIN cursos AS c ON a.IdCurso = c.Id INNER JOIN asistenciaporestudiante AS ae ON ae.IdAsistenciaporcurso = a.Id INNER JOIN sedesjornadas AS sj ON a.IdSedeJornada = sj.Id INNER JOIN sedes AS s ON sj.IdSede = s.Id INNER JOIN jornadas AS j ON sj.IdJornada = j.Id INNER JOIN estudiantes AS e ON ae.IdEstudiante = e.Id inner join estudiantesporcurso as epc on e.Id = epc.IdEstudiante and epc.Ano = $this->ano ";

            //Cantidad de Estudiantes en la sede, jornada o curso
            if($tipo != "4"){
              $this->querySql['query'] .= 'INNER JOIN (SELECT COUNT(c.Id) as CantidadEstudiantes, ';
              if($tipo == "1")
                $this->querySql['query'] .= 's.Id ';
              else if($tipo == "2")
                $this->querySql['query'] .= 'j.Id ';
              else if($tipo == "3")
                $this->querySql['query'] .= 'c.Id ';

              $this->querySql['query'] .= "FROM cursos AS c INNER JOIN sedesjornadas AS sj ON c.IdSedeJornada = sj.Id INNER JOIN sedes AS s ON s.Id = sj.IdSede INNER JOIN jornadas AS j ON j.Id = sj.IdJornada LEFT JOIN estudiantesporcurso as epc on (c.Id = epc.IdCurso or c.Id = epc.IdCursoAux) and epc.Ano = $this->ano INNER JOIN estudiantes as e on epc.IdEstudiante = e.Id and e.Mostrar = 0 GROUP BY ";

              if($tipo == "1")
                $this->querySql['query'] .= 's.Id ) AS ce ON ce.Id = s.Id ';
              else if($tipo == "2")
                $this->querySql['query'] .= 'j.Id ) AS ce ON ce.Id = j.Id ';
              else if($tipo == "3")
                $this->querySql['query'] .= 'c.Id ) AS ce ON ce.Id = c.Id ';
            }

            //Cantidad de llamadas que se hizo en el periodo
              $this->querySql['query'] .= 'INNER JOIN (SELECT COUNT(k.Id) as CantidadLlamadas, k.Id FROM (SELECT ';
              if($tipo == "1")
                $this->querySql['query'] .= 's.Id ';
              else if($tipo == "2")
                $this->querySql['query'] .= 'j.Id ';
              else if($tipo == "3" or $tipo == "4")
                $this->querySql['query'] .= 'c.Id ';

              $this->querySql['query'] .= 'FROM cursos as c left join asistenciaporcurso as ac on c.Id = ac.IdCurso inner join sedesjornadas as sj on c.IdSedeJornada = sj.Id inner join sedes as s on sj.IdSede = s.Id inner join jornadas as j on sj.IdJornada = j.Id WHERE ac.Dia BETWEEN "'.$fecha.'%" AND "'.$fecha2.'%" GROUP By c.Id, CAST(Dia AS DATE)) as k GROUP By k.Id';

              if($tipo == "1")
                $this->querySql['query'] .= ') AS cl ON cl.Id = s.Id ';
              else if($tipo == "2")
                $this->querySql['query'] .= ') AS cl ON cl.Id = j.Id ';
              else if($tipo == "3")
                $this->querySql['query'] .= ') AS cl ON cl.Id = c.Id ';
              else if($tipo == "4")
                $this->querySql['query'] .= ') AS cl ON cl.Id = epc.IdCurso ';
            //

            //Cantidad de cursos en la sede, jornada
            if($tipo == "1" || $tipo == "2"){
              $this->querySql['query'] .= 'INNER JOIN (SELECT ';
              if($tipo == "1")
                $this->querySql['query'] .= 'COUNT(s.Id) as CantidadCursos, s.Id ';
              else if($tipo == "2")
                $this->querySql['query'] .= 'COUNT(j.Id) as CantidadCursos, j.Id ';

              $this->querySql['query'] .= 'FROM cursos as c inner join sedesjornadas as sj on c.IdSedeJornada = sj.Id inner join sedes as s on sj.IdSede = s.Id inner join jornadas as j on j.Id = sj.IdJornada GROUP BY ';

              if($tipo == "1")
                $this->querySql['query'] .= 's.Id) AS cc ON cc.Id = s.Id ';
              else if($tipo == "2")
                $this->querySql['query'] .= 'j.Id) AS cc ON cc.Id = j.Id ';
            }
            //

            $this->querySql['query'] .= 'WHERE ae.IdTipoasistencia = 1 AND a.Dia BETWEEN "'.$fecha.'%" AND "'.$fecha2.'%" ';

            if($sede > 0){
              $this->querySql['query'] .= "and s.Id = $sede ";
            }
            if($jornada > 0){
              $this->querySql['query'] .= "and j.Id = $jornada ";
            }
            if($curso > 0){
              $this->querySql['query'] .= "and c.Id = $curso ";
            }
            if($tipo == "1")
              $this->querySql['query'] .= 'GROUP By s.Id order by s.Id ';
            else if($tipo == "2")
              $this->querySql['query'] .= 'GROUP By j.Id order by j.Id ';
            else if($tipo == "3")
              $this->querySql['query'] .= 'GROUP By c.Id order by CantidadAusencias desc limit 10 ';
            else if($tipo == "4")
              $this->querySql['query'] .= 'GROUP By e.Id order by CantidadAusencias desc limit 10 ';

            break;

          case 'AusenciasDias':
            $fecha = $_POST['fecha'];
            $fecha2 = $_POST['fecha2'];
            $tipo = $_POST['config']['tipo'];
            $sede = $_POST['config']['sede'];
            $jornada = $_POST['config']['jornada'];
            $curso = $_POST['config']['curso'];
            $this->querySql['query'] = 'SELECT a.Dia, COUNT(a.Id) as Cantidad,';
            if($tipo == "1")
              $this->querySql['query'] .= 's.Alias as Nombre ';
            else if($tipo == "2")
              $this->querySql['query'] .= 'j.Alias as Nombre ';
            else if($tipo == "3")
              $this->querySql['query'] .= 'c.Nombre as Nombre ';
            else if($tipo == "4")
              $this->querySql['query'] .= 'e.ApellidosNombres as Nombre ';

            $this->querySql['query'] .= 'FROM asistenciaporcurso as a inner join cursos as c on a.IdCurso = c.Id inner join asistenciaporestudiante as ae on ae.IdAsistenciaporcurso = a.Id inner join sedesjornadas as sj on a.IdSedeJornada = sj.Id inner join sedes as s on sj.IdSede = s.Id inner join jornadas as j on sj.IdJornada = j.Id inner join estudiantes as e on ae.IdEstudiante = e.Id WHERE ae.IdTipoasistencia = 1 and a.Dia BETWEEN "'.$fecha.'%" AND "'.$fecha2.'%"';
            if($sede > 0){
              $this->querySql['query'] .= " and sj.IdSede = $sede";
            }
            if($jornada > 0){
              $this->querySql['query'] .= " and sj.IdJornada = $jornada";
            }
            if($curso > 0){
              $this->querySql['query'] .= " and c.Id = $curso";
            }
            $this->querySql['query'] .= ' GROUP By CAST(Dia AS DATE)';
            if($tipo == "1")
              $this->querySql['query'] .= ', s.Id ';
            else if($tipo == "2")
              $this->querySql['query'] .= ', j.Id ';
            else if($tipo == "3")
              $this->querySql['query'] .= ', c.Id ';
            else if($tipo == "4")
              $this->querySql['query'] .= ', e.Id ';

            break;

          case 'LlamadasTomadas':
            $fecha = $_POST['fecha'];
            $fecha2 = $_POST['fecha2'];
            // $tipo = $_POST['config']['tipo'];
            $sede = $_POST['config']['sede'];
            $jornada = $_POST['config']['jornada'];
            $curso = $_POST['config']['curso'];

            $this->querySql['query'] = 'SELECT c.Id, cl.CantidadLlamadas FROM cursos as c inner join sedesjornadas as sj on c.IdSedeJornada = sj.Id inner join sedes as s on sj.IdSede = s.Id inner join jornadas as j on j.Id = sj.IdJornada ';

            //Cantidad de llamadas que se hizo en el periodo
              $this->querySql['query'] .= 'LEFT JOIN (SELECT COUNT(c.Id) as CantidadLlamadas, c.Id FROM (SELECT c.Id FROM cursos as c left join asistenciaporcurso as ac on c.Id = ac.IdCurso inner join sedesjornadas as sj on c.IdSedeJornada = sj.Id inner join sedes as s on sj.IdSede = s.Id inner join jornadas as j on sj.IdJornada = j.Id WHERE ac.Dia BETWEEN "'.$fecha.'%" AND "'.$fecha2.'%" GROUP By c.Id, CAST(Dia AS DATE)) as c GROUP By c.Id) AS cl ON cl.Id = c.Id ';
            //
              $this->querySql['query'] .= 'WHERE TRUE ';

              if($sede > 0){
                $this->querySql['query'] .= "and s.Id = $sede ";
              }
              if($jornada > 0){
                $this->querySql['query'] .= "and j.Id = $jornada ";
              }
              if($curso > 0){
                $this->querySql['query'] .= "and c.Id = $curso ";
              }

            break;
            
          
        /////////////////////////////////////
        //-------HerramientasService-------//
        /////////////////////////////////////
          case 'cursosDatosFaltantes':
            $this->querySql['query'] = "SELECT c.Id,c.Nombre, COUNT(e.Id) as Estudiantes, j.Id as IdJornada, j.Alias as NombreJornada,s.Id as IdSede, s.Alias as NombreSede FROM cursos as c left JOIN estudiantesporcurso as epc on (c.Id = epc.IdCurso or c.Id = epc.IdCursoAux) and epc.Ano = $this->ano inner join estudiantes as e ON e.Id = epc.IdEstudiante inner join sedesjornadas as sj on c.IdSedeJornada = sj.Id inner join jornadas as j on sj.IdJornada = j.Id inner join sedes as s on s.Id = sj.IdSede inner join contactosporestudiante as ce on ce.IdEstudiante = e.Id inner join contactos as co on co.Id = ce.IdContacto where c.Mostrar = 0 and e.Mostrar = 0 and length(co.Cel) <> 20 GROUP BY c.Id ORDER by s.Id, j.Id,c.Orden, c.Id, e.Id";
            break;
          case 'estudiantesDatosFaltantes':
            $this->querySql['query'] = "SELECT e.Id as IdEstudiante,e.ApellidosNombres,epc.IdCursoAux,c.*,ce.Mandar from estudiantes as e inner join contactosporestudiante as ce on e.Id = ce.IdEstudiante inner join contactos as c on c.Id = ce.IdContacto inner join estudiantesporcurso as epc on e.Id = epc.IdEstudiante and epc.Ano = $this->ano where (epc.IdCurso = :idCurso or epc.IdCursoAux = :idCurso) and e.Mostrar = 0 and length(c.cel) <> 20 ORDER BY ApellidosNombres asc,c.Id";
            array_push($arrayOptions,"idCurso");
            break;

        ////////////////////////////////////
        //-------PromocionService-------//
        ////////////////////////////////////

          case 'estudiantesPromocion':
            $this->querySql['query'] = 'SELECT e.Id as IdEstudiante,e.ApellidosNombres,epc.IdCursoAux,c.*,ce.Mandar from estudiantes as e left join contactosporestudiante as ce on e.Id = ce.IdEstudiante left join contactos as c on c.Id = ce.IdContacto inner join estudiantesporcurso as epc on epc.IdEstudiante = e.Id and epc.Ano = :ano where (epc.IdCurso = :idCurso or epc.IdCursoAux = :idCurso) and e.Mostrar = 0 group by IdEstudiante ORDER BY ApellidosNombres asc,c.Id DESC';
            array_push($arrayOptions,"idCurso","ano");
            break;
          default:
            http_response_code(405);
            $this->querySql['query'] = '';
      }

      $this->createOptions($arrayOptions);
    }

    private function createOptions($arrayOptions){
          foreach ($arrayOptions as $key => $value) {
          $this->options[':'.$value] = $_POST[$value];
        }
    }

    private function pdo_sql_debug($sql,$placeholders){
        foreach($placeholders as $k => $v){
            // echo $k,$v;
            $sql = preg_replace('/'.$k.'/',"'".$v."'",$sql);
        }
        return $sql;
    }

    private function executeQuery(){      
      $this->resquery = $this->pdo_sql_debug($this->querySql['query'],$this->options);
      // echo $this->resquery,"\n";
      // echo $this->querySql['query'],"\n";
      $stmt = $this->db->prepare($this->querySql['query']);
      try {
        $this->res = $stmt->execute($this->options);
        if($this->res){
          // $this->content = $stmt->fetchAll();   
          $existen=$stmt->rowCount();

          switch ($_POST['get']) {

            case 'cursos':
              while ($row=$stmt->fetch()) {
                $arreglo[]=array(
                  "Estudiantes" => $row['Estudiantes'],
                  "Nome" => $row['Nome'],
                  "Id" => $row['Id'],
                  );
              }
              break;

            case 'estudantes':
              $idContacto = "";
              $dia = "";
              while ($row=$stmt->fetch()) {
                $arreglo[] = array(
                "Nome" => $row['NomeEstudante'],
                "Dia" => $row['Dia'],
                "Documento" => $row['IdEstudante'],
                "Responsavel" => array(
                  "Documento" => $row['RG'],
                  "Nome" => $row['Nome'],
                  "Telefone" => $row['Telefone'],
                  ),
                );
              }
              break;
            case 'getEstudantebyNome':
              while ($row=$stmt->fetch()) {
                  $arreglo[] = array(
                  "Documento" => $row['IdEstudiante'],
                  "Nome" => $row['NomeEstudante'],
                  "Curso" => $row['Curso'],
                  "Responsavel" => array(
                    "RG" => $row['RG'],
                    "Nome" => $row['Nome'],
                    "Cel" => $row['Telefone'],
                    ),
                  );
              }
              break;

            case 'historialEstudanteId':
              $arreglo[]=array(
                "Falla" => array(),
                "Notificacion" => array(),
                "Observacion" => array(),
              );
              while ($row=$stmt->fetch()) {
                if($row['Tipo'] == "Falla")
                {
                  $tempArray = array(
                    "Dia" => intval(substr($row['Dia'],8,2)),
                    "Mes" => intval(substr($row['Dia'],5,2)),
                    "Tipo" => $row['TipoFalla'],
                    "Justificado" => $row['Texto'],
                    "IdFalla" => $row['IdFalla'],
                  );
                  array_push($arreglo[count($arreglo)-1]['Falla'],$tempArray);
                }
                else if($row['Tipo'] == "Notificacao")
                {
                  $tempArray = array(
                    "Dia" => intval(substr($row['Dia'],8,2)),
                    "Mes" => intval(substr($row['Dia'],5,2)),
                    "Mensagem" => $row['TipoFalla'],
                  );
                  array_push($arreglo[count($arreglo)-1]['Notificacion'],$tempArray);
                }
                else if($row['Tipo'] == "Observacao")
                {
                  $tempArray = array(
                    "Dia" => intval(substr($row['Dia'],8,2)),
                    "Mes" => intval(substr($row['Dia'],5,2)),
                    "Observacao" => $row['TipoFalla'],
                  );
                  array_push($arreglo[count($arreglo)-1]['Observacion'],$tempArray);
                }
              }
              break;

            case 'estudantesMuchosCursos':
              while ($row=$stmt->fetch()) {
                $arreglo[] = array(
                "Documento" => $row['IdEstudiante'],
                "Nombre" => $row['Estudante'],
                "Responsavel" => array(
                  "RG" => $row['RG'],
                  "Nome" => $row['Nome'],
                  "Cel" => $row['Telefone'],
                  ),
                );
              }
              break;
            case 'todoslosCursos':
              while ($row=$stmt->fetch()) {
                $arreglo[]=array(
                  "Estudiantes" => $row['Estudiantes'],
                  "Nome" => $row['Nome'],
                  "Id" => $row['Id'],
                );
              }
              break;








  

            ///////////////////////////////////
            //----------DashService----------//
            ///////////////////////////////////
              
              case 'cursosPromocion':
                while ($row=$stmt->fetch()) {
                  $arreglo[]=array(
                    "Estudiantes" => intval($row['Estudiantes']),
                    "Nombre" => $row['Nombre'],
                    "Id" => $row['Id'],
                    "IdSedeJornada" => $row['IdSedeJornada'],
                    "CantidadPromocionEstudiantes" => $row['CantidadPromocionEstudiantes'] == null?0:intval($row['CantidadPromocionEstudiantes']),
                    );
                }
                break;
              case 'cursosAsistidosHoy':
                while ($row=$stmt->fetch()) {
                  $arreglo[]=array(
                    "IdSede" => $row['IdSede'],
                    "Nombre" => $row['Nombre'],
                    "IdJornada" => $row['IdJornada']
                    );
                }
                break;
              case 'actividadreciente':
                while ($row=$stmt->fetch()) {
                  $arreglo[]=array(
                    "Titulo" => $row['Titulo'],
                    "Texto" => $row['Texto'],
                    "Data" => substr($row['Data'],-5,5),
                    );
                }
                break;
              case 'mensajesMes':
              case 'mensajesHoy':
                $cantidad = 0;
                while ($row=$stmt->fetch()) {
                  $cantidad += $row['Cantidad'];
                }
                $arreglo=array(
                  "cantidad" => $cantidad,
                  );
                break;
              case 'ausenciasMes':
                while ($row=$stmt->fetch()) {
                  // if(!is_null($row['Dia']))
                  $arreglo[]=array(
                    "Dia" => substr($row['Dia'],0,10),
                    "Cantidad" =>  $row['Cantidad'],
                    );
                }
                break;

            //////////////////////////////////////////
            //----------EstudiantesService----------//
            //////////////////////////////////////////
              case 'cursosAdicionales':
                while ($row=$stmt->fetch()) {
                  $arreglo[]=array(
                    "Id" => $row['Id'],
                    "Nombre" => strtoupper($row['Nombre']),
                  );
                }
                break;
              case 'tipoAsistencia':
                while ($row=$stmt->fetch()) {
                  $arreglo[]=array(
                    "Nombre" => $row['Nombre'],
                    "Alias" => $row['Alias'],
                    "Id" => $row['Id'],
                    );
                }
                break;
              case 'mensajesLlamado':
                while ($row=$stmt->fetch()) {
                  $arreglo[]=array(
                    "Sede" => intval($row['Sede']),
                    "Jornada" => intval($row['Jornada']),
                    "Tipo" => intval($row['Tipo']),
                    "Mensaje" => $row['Mensaje'],
                    );
                }
                break;

            ///////////////////////////////////////////
            //----------NotificacionService----------//
            ///////////////////////////////////////////
              
              case 'cursosPorSede':
                while ($row=$stmt->fetch()) {
                  if(isset($arreglo) && count($arreglo)>0 && $arreglo[count($arreglo)-1]['IdSede'] == $row['IdSede'])
                  {
                    $anterior = $arreglo[count($arreglo)-1];                                        
                    if($anterior['Jornadas'][count($anterior['Jornadas'])-1]['IdJornada'] == $row['IdJornada']) 
                    {
                      $curso = array(
                        "Estudiantes" => $row['Estudiantes'],
                        "Nombre" => $row['Nombre'],
                        "Id" => $row['Id'],
                        );
                      array_push($arreglo[count($arreglo)-1]['Jornadas'][count($arreglo[count($arreglo)-1]['Jornadas'])-1]['Cursos'],$curso);
                    }
                    else
                    {
                      $arreglo[count($arreglo)-1]['Jornadas'][] = array(
                        "IdJornada" => $row['IdJornada'],
                        "NombreJornada" => $row['NombreJornada'],
                        "Cursos" => array(array(
                          "Estudiantes" => $row['Estudiantes'],
                          "Nombre" => $row['Nombre'],
                          "Id" => $row['Id']
                          ))
                        );
                    }
                  }
                  else{
                    $arreglo[]=array(
                      "IdSede" => $row['IdSede'],
                      "NombreSede" => $row['NombreSede'],
                      "Jornadas" => array(array(
                        "IdJornada" => $row['IdJornada'],
                        "NombreJornada" => $row['NombreJornada'],
                        "Cursos" => array(array(
                          "Estudiantes" => $row['Estudiantes'],
                          "Nombre" => $row['Nombre'],
                          "Id" => $row['Id'],
                        ))
                      ))
                    );
                  }
                }
                break;
              case 'grupos':
                while ($row=$stmt->fetch()) {
                  $arreglo[]=array(
                    "Id" => $row['Id'],
                    "Nombre" => $row['Nombre'],
                    );
                }
                break;
              case 'miembrosGrupo':
                while ($row=$stmt->fetch()) {
                  $arreglo[]=array(
                    "Id" => $row['Id'],
                    "Nombre" => $row['Nombre'],
                    "Cel" => $row['Telefono'],
                    );
                }
                break;
              
              // case 'estudiantesbyDocumento':
              case 'estudiantebyId':
              case 'estudiantebyNombre':
                while ($row=$stmt->fetch()) {
                    $arreglo[] = array(
                    "Id" => $row['IdEstudiante'],
                    "Nombre" => $row['ApellidosNombres'],
                    "Documento" => $row['Documento'],
                    "FechaNacimiento" => $row['FechaNacimiento'],
                    "Sexo" => $row['Sexo'],
                    "Curso" => $row['Curso'],
                    "Jornada" => $row['Jornada'],
                    "TipoJornada" => $row['TipoJornada'],
                    "Sede" => $row['Sede'],
                    "CursoAux" => $row['CursoAux'],
                    "CursoAd" => $row['CursoAd'],                    
                    "Contacto" => array(
                      "Id" => $row['Id'],
                      "Nombre" => $row['Nombres'],
                      "Apellido" => $row['Apellidos'],
                      "Cel" => $row['Cel'],
                      "Direccion" => $row['Direccion'],
                      "Mandar" => intval($row['Mandar']),
                      ),
                    );
                }
                break;

            ////////////////////////////////////////
            //----------HistorialService----------//
            ////////////////////////////////////////

              case 'historial':
                while ($row=$stmt->fetch()) {
                  if($row['usuario'] == null)
                  {
                    $row['usuario'] = " ";
                    $row['Abre'] = " ";
                    $row['Color'] = "teal";
                  }
                  if($_POST['fecha2'] == null)
                    $row['Dia'] = substr($row['Dia'],-8,5);
                  if(isset($arreglo) && count($arreglo)>0 && $arreglo[count($arreglo)-1]['Continuacion'] == $row['Continuacion'] && $arreglo[count($arreglo)-1]["Continuacion"] != ' ')
                  {
                      $arreglo[count($arreglo)-1]["Id"] .= ','.$row['Id'];
                  }
                  else{
                  $arreglo[]=array(
                    "Id" => $row['Id'],
                    "Dia" => $row['Dia'],
                    "Curso" => $row['Curso'],
                    "Sede" => $row['Sede'],
                    "Jornada" => $row['Jornada'],
                    "Usuario" =>  $row['usuario'],
                    "Color" =>  $row['Color'],
                    "Continuacion" =>  $row['Continuacion'],
                    "Abre" =>  substr($row['usuario'], 0,1)
                    );
                  }
                }
                break;
              case 'historialNotificacionId':
                while ($row=$stmt->fetch()) {
                  if($row['Numero'] != null){
                    $arreglo[]=array(
                      "Nombre" => $row['ApellidosNombres'],
                      "Numero" => $row['Numero'],
                      "Texto" => ucfirst($row['Texto']),
                      "Enviado" => intval($row['Enviado']),
                      );
                  }
                  else if($row['NumeroMiembro'] != null){
                    $arreglo[]=array(
                      "Nombre" => $row['Miembro'],
                      "Numero" => $row['NumeroMiembro'],
                      "Texto" => ucfirst($row['Texto']),
                      "Enviado" => 1,
                      );
                  }
                  
                }
                break;
              case 'historialCursoId':
                while ($row=$stmt->fetch()) {
                  $arreglo[]=array(
                    "Nombre" => $row['ApellidosNombres'],
                    "Numero" => $row['Numero'],
                    "Asistencia" => ucfirst($row['Asistencia']),
                    "Enviado" => $row['Enviado'],
                    );
                }
                break;              
              case 'usuarios':
                while ($row=$stmt->fetch()) {
                  $arreglo[]=array(
                    "Nombre" => $row['usuario'],
                    "Id" => $row['Id'],
                    "Rol" => $row['Nombre']
                    );
                }
                break;
              
            ///////////////////////////////////////
            //----------ReportesService----------//
            ///////////////////////////////////////

              case 'cursoEstudiantes':
                while ($row=$stmt->fetch()) {
                  $arreglo[]=array(
                    "Id" => $row['Id'],
                    "Nombre" => $row['ApellidosNombres'],
                    "Dia" => intval(substr($row['Dia'],8,2)),
                    "Mes" => intval(substr($row['Dia'],5,2)),
                    "Tipo" => $row['Tipo'],
                    );
                }
                break;

              case 'asistenciasCursos':
                while ($row=$stmt->fetch()) {
                  $arreglo[]=array(
                    "Nombre" => $row['Nombre'],
                    "CantidadEstudiantes" => intval($row['CantidadEstudiantes']),
                    "CantidadLlamadas" => intval($row['CantidadLlamadas']),
                    "IdTipoasistencia" => $row['IdTipoasistencia'],
                    "CantidadAusencias" => intval($row['CantidadAusencias']),
                    "CantidadJustificaciones" => $row['CantidadJustificaciones'] == null?0:intval($row['CantidadJustificaciones']),
                    "AliasAsistencia" => $row['AliasAsistencia'],
                    );
                }
                break;

              case 'asistenciaAuxilio':
                while ($row=$stmt->fetch()) {
                  $arreglo[]=array(
                    "IdEstudiante" => $row['IdEstudiante'],
                    "Documento" => $row['Documento'],
                    "ApellidosNombres" => $row['ApellidosNombres'],
                    "Curso" => $row['Curso'],
                    "Asistencia" => $row['Asistencia'],
                    "Justificada" => $row['Justificada'],
                    );
                }
                break;

            ///////////////////////////////////////
            //----------GraficasService----------//
            ///////////////////////////////////////
              
              case 'historialMensajes':
                while ($row=$stmt->fetch()) {
                  // if(!is_null($row['Dia']))
                  $arreglo[]=array(
                    "Dia" => substr($row['Dia'],0,10),
                    "Cantidad" =>  $row['Cantidad'],
                    );
                }
                break;

              case 'AusenciasSumatoria':
                while ($row=$stmt->fetch()) {
                  // if(!is_null($row['Dia']))
                  $arreglo[]=array(
                    "Id" => $row['Id'],
                    "Nombre" => $row['Nombre'],
                    "CantidadAusencias" =>  $row['CantidadAusencias'],
                    "CantidadEstudiantes" =>  $row['CantidadEstudiantes'],
                    "CantidadLlamadas" =>  $row['CantidadLlamadas'],
                    "CantidadCursos" =>  $row['CantidadCursos'],
                    );
                }
                break;

              case 'AusenciasDias':   
                while ($row=$stmt->fetch()) {
                  $arreglo[]=array(
                    "Dia" => substr($row['Dia'],0,10),
                    "Cantidad" =>  $row['Cantidad'],
                    "Nombre" =>  $row['Nombre'],
                    );
                }
                break;

              case 'LlamadasTomadas':
                while ($row=$stmt->fetch()) {
                  $arreglo[]=array(
                    "Id" => $row['Id'],
                    "CantidadLlamadas" =>  $row['CantidadLlamadas'],
                    // "Nombre" =>  $row['Nombre'],
                    );
                }
                break;

            /////////////////////////////////////
            //-------HerramientasService-------//
            /////////////////////////////////////

              case 'cursosDatosFaltantes':
                while ($row=$stmt->fetch()) {
                  if(isset($arreglo) && count($arreglo)>0 && $arreglo[count($arreglo)-1]['IdSede'] == $row['IdSede'])
                  {
                    $anterior = $arreglo[count($arreglo)-1];                                        
                    if($anterior['Jornadas'][count($anterior['Jornadas'])-1]['IdJornada'] == $row['IdJornada']) 
                    {
                      $curso = array(
                        "Estudiantes" => $row['Estudiantes'],
                        "Nombre" => $row['Nombre'],
                        "Id" => $row['Id'],
                        );
                      array_push($arreglo[count($arreglo)-1]['Jornadas'][count($arreglo[count($arreglo)-1]['Jornadas'])-1]['Cursos'],$curso);
                    }
                    else
                    {
                      $arreglo[count($arreglo)-1]['Jornadas'][] = array(
                        "IdJornada" => $row['IdJornada'],
                        "NombreJornada" => $row['NombreJornada'],
                        "Cursos" => array(array(
                          "Estudiantes" => $row['Estudiantes'],
                          "Nombre" => $row['Nombre'],
                          "Id" => $row['Id']
                          ))
                        );
                    }
                  }
                  else{
                    $arreglo[]=array(
                      "IdSede" => $row['IdSede'],
                      "NombreSede" => $row['NombreSede'],
                      "Jornadas" => array(array(
                        "IdJornada" => $row['IdJornada'],
                        "NombreJornada" => $row['NombreJornada'],
                        "Cursos" => array(array(
                          "Estudiantes" => $row['Estudiantes'],
                          "Nombre" => $row['Nombre'],
                          "Id" => $row['Id'],
                        ))
                      ))
                    );
                  }
                }
                break;            
                while ($row=$stmt->fetch()) {
                    $arreglo[] = array(
                    "Id" => $row['IdEstudiante'],
                    "Nombre" => $row['ApellidosNombres'],
                    "Dia" => $row['Dia'],
                    "CursoAd" => $row['IdCursoAux'],
                    "Contacto" => array(
                      "Id" => $row['Id'],
                      "Nombre" => $row['Nombres'],
                      "Cel" => $row['Cel'],
                      "Direccion" => $row['Direccion'],
                      "Mandar" => intval($row['Mandar']),
                      ),
                    );
                  }
                  break;
              case 'estudiantesDatosFaltantes':
                while ($row=$stmt->fetch()) {
                    $arreglo[] = array(
                    "Id" => $row['IdEstudiante'],
                    "Nombre" => $row['ApellidosNombres'],
                    "CursoAd" => $row['IdCursoAux'],
                    "Contacto" => array(
                      "Id" => $row['Id'],
                      "Nombre" => $row['Nombres'],
                      "Cel" => $row['Cel'],
                      "Direccion" => $row['Direccion'],
                      ),
                    );
                  }
                  break;

            //////////////////////////////////////////
            //----------PromocionService----------//
            //////////////////////////////////////////
              case 'estudiantesPromocion':
                $idContacto = "";
                $dia = "";
                while ($row=$stmt->fetch()) {
                  if(isset($arreglo) && count($arreglo)>0 && $arreglo[count($arreglo)-1]['Id'] == $row['IdEstudiante'] && $idContacto == $row['Id'])
                  {
                    $arreglo[count($arreglo)-1]['Asistencias'][$row['IdTipoasistencia']] = $row['Cantidad'];
                    if($dia < strtotime($row['Dia'])){
                      $dia = strtotime($row['Dia']);
                      $arreglo[count($arreglo)-1]['Dia'] = $row['Dia'];
                    }

                  }
                  else
                  {
                    $idContacto = $row['Id'];
                    $arreglo[] = array(
                    "Id" => $row['IdEstudiante'],
                    "Nombre" => $row['ApellidosNombres'],
                    "CursoAd" => $row['IdCursoAux'],
                    "Contacto" => array(
                      "Id" => $row['Id'],
                      "Nombre" => $row['Nombres'],
                      "Cel" => $row['Cel'],
                      "Direccion" => $row['Direccion'],
                      "Mandar" => intval($row['Mandar']),
                      ),
                    );
                  }
                }
                  break;

            default:
              http_response_code(405);
              $this->querySql['query'] = '';
          }

          if($existen>0)
          {
            $this->content = $arreglo;
          }
          else
          {
            $this->content = 0;
          }
        }
        else
        {
          $this->content = $stmt->errorInfo();
          http_response_code(406);
        }
      } catch(PDOException $e) {
        $this->content = $stmt->errorInfo();
        http_response_code(400);
      }
      $stmt = NULL;
    }
}

$w = new nuevoPDO();

$respuesta = array(
    'contenido' => $w->content,
    'response' => $w->res,
    'post' => $_POST,
    'method' =>$req_method,
    'query' =>$w->resquery,
  );
// print_r($_POST);
echo json_encode($respuesta);

?>
