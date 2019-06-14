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

        case 'estudante':
          $this->querySql['query'] = 'INSERT INTO Estudante (RG,Nome) VALUES (:documento,:nome);';
          $this->querySql['query'] .= "INSERT INTO Pertence(fk_Estudante_RG, fk_Curso_Id, Ano) VALUES (:documento,:curso,$this->ano);";
          $this->querySql['query'] .= 'REPLACE INTO Responsaveis(Nome, RG, Telefone) VALUES (:responsavelNome,:responsavelDocumento,:responsavelCel);';
          $this->querySql['query'] .= 'INSERT INTO Possui(fk_Estudante_RG, fk_Responsaveis_RG) VALUES (:documento,:responsavelDocumento);';
            array_push($arrayOptions,'documento','nome','curso','responsavelNome','responsavelDocumento','responsavelCel');            
          break;

        case 'asistencia':
          $this->querySql['query'] = 'INSERT INTO Presenca (Tipo,Dia,fk_Estudante_RG) VALUES ';
            //(:idEstudante,:tipo,LAST_INSERT_ID());
          for ($i=0; $i < count($_POST['idEstudantes']); $i++) { 
            $idEst = $_POST['idEstudantes'][$i];
            $idTip = $_POST['idTipoasistencia'][$i];
            if($i > 0)
            $this->querySql['query'] .= ',';
            $this->querySql['query'] .= "($idTip,:dia,'$idEst')";
          }
          array_push($arrayOptions,'dia');
          break;
        
        case 'notifiacionCursos':
          $this->querySql['query'] = 'INSERT INTO Notificacoes (Mensagem,Data) VALUES (:mensaje,:dia);';
          $this->querySql['query'] .= 'INSERT INTO Informa_Funcionarios_Notificações_Estudante (fk_Funcionarios_fk_Usuários_RG,fk_Notificações_Id,fk_Estudante_RG) VALUES';
            //(:idEstudante,:tipo,LAST_INSERT_ID());
          for ($i=0; $i < count($_POST['idEstudantes']); $i++) { 
            $idEst = $_POST['idEstudantes'][$i];
            if($i > 0)
            $this->querySql['query'] .= ',';
            $this->querySql['query'] .= "(:idUser,LAST_INSERT_ID(),'$idEst')";
          }
          array_push($arrayOptions,'dia','mensaje','idUser');
          break;












          
          
          case 'notifiacionGrupos':
            $this->querySql['query'] = 'INSERT INTO notificaciones (Texto,Dia,User,Continuacion) VALUES (:mensaje,:dia,:idUser,:random);';
            $this->querySql['query'] .= 'INSERT INTO notificacionespormiembro (IdMiembro, IdNotificacion,Numero) VALUES';
             //(:idEstudante,:tipo,LAST_INSERT_ID());
            for ($i=0; $i < count($_POST['idMiembros']); $i++) { 
              $idMemb = $_POST['idMiembros'][$i];
              $numCont = $_POST['numContactos'][$i];
              if($i > 0)
              $this->querySql['query'] .= ',';
              $this->querySql['query'] .= "($idMemb,LAST_INSERT_ID(),$numCont)";
            }
            array_push($arrayOptions,'dia','mensaje','idUser','random');
            break;
          case 'curso':
            $this->querySql['query'] = 'SET @Orden = (SELECT Orden FROM cursos where Id = :idCurso);';

            $this->querySql['query'] .= 'UPDATE cursos SET Orden = Orden + 1 where IdSedeJornada = :idSedeJornada and orden > @Orden;';

            $this->querySql['query'] .= 'INSERT INTO cursos (Nome, IdSedeJornada, IdSedeJornadaExtra, Especial, Orden) SELECT :nome,:idSedeJornada,IdSedeJornadaExtra,Especial,Orden+1 FROM cursos where Id = :idCurso;';
            $this->querySql['query'] .= 'INSERT INTO cursosporano (IdCurso,Ano) Values(LAST_INSERT_ID(),:ano)';
            array_push($arrayOptions,'nome','idSedeJornada','idCurso','ano');
              break;
          case 'cursoSinAusencia':
            $this->querySql['query'] = 'INSERT INTO asistenciaporcurso (Dia,IdCurso,IdSedeJornada,User) VALUES (:dia,:idCurso,:idSedeJornada,:idUser);';
            array_push($arrayOptions,'dia','idCurso','idUser','idSedeJornada');
            break;
          
          case 'grupo':
            $this->querySql['query'] = 'INSERT INTO grupos (Nome) VALUES (:nome);';
            array_push($arrayOptions,'nome');
            break;
          case 'miembro':
            $this->querySql['query'] = 'INSERT INTO miembros (Nome, Telefono, IdGrupo) VALUES (:nome,:cel,:grupo);';
              array_push($arrayOptions,'nome','cel','grupo');            
            break;
          case 'itcloud':
            $this->querySql['query'] = 'INSERT INTO itcloud (Dia,Objeto) VALUES (:dia,:object);';
            array_push($arrayOptions,'dia','object');
            break;
          case 'estudantesPromocion':
            $this->querySql['query'] = 'INSERT INTO estudantesporcurso (IdEstudante,IdCurso,IdCursoAux,Ano) VALUES ';
             //(:idEstudante,:tipo,LAST_INSERT_ID());
            for ($i=0; $i < count($_POST['estudantes']); $i++) { 
              $idEstudante = $_POST['estudantes'][$i]['idEstudante'];
              $cursoFuturo = $_POST['estudantes'][$i]['cursoFuturo'];
              $cursoFuturoAux = $_POST['estudantes'][$i]['cursoFuturoAux'];
              if($i > 0)
              $this->querySql['query'] .= ',';
              $this->querySql['query'] .= "($idEstudante,$cursoFuturo,$cursoFuturoAux,:ano)";
            }
            array_push($arrayOptions,'ano');
            break;
          case 'observacion':
            $this->querySql['query'] = 'INSERT INTO observaciones (IdEstudante,Descripcion,Accion,Compromiso,Dia,Acudiente) VALUES (:idEstudante,:descripcion,:accion,:compromiso,:dia,:acudiente);';
            array_push($arrayOptions,'idEstudante','descripcion','accion','compromiso','dia','acudiente');
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
      $stmt = $this->db->prepare($this->querySql['query']);
      try {
        $this->res = $stmt->execute($this->options);
        if(!$this->res){
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
