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
          $this->querySql['query'] = 'INSERT INTO Estudante (CPF,Nome) VALUES (:documento,:nome);';
          $this->querySql['query'] .= "INSERT INTO Pertence(fk_Estudante_CPF, fk_Curso_Id, Ano) VALUES (:documento,:curso,$this->ano);";
          $this->querySql['query'] .= 'REPLACE INTO Responsaveis(Nome, CPF, Telefone) VALUES (:responsavelNome,:responsavelDocumento,:responsavelCel);';
          $this->querySql['query'] .= 'INSERT INTO Possui(fk_Estudante_CPF, fk_Responsaveis_CPF) VALUES (:documento,:responsavelDocumento);';
            array_push($arrayOptions,'documento','nome','curso','responsavelNome','responsavelDocumento','responsavelCel');            
          break;

        case 'asistencia':
          $this->querySql['query'] = 'INSERT INTO Presenca (Tipo,Dia,fk_Estudante_CPF) VALUES ';
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
          $this->querySql['query'] .= 'INSERT INTO Informa_Funcionarios_Notificações_Estudante (fk_Funcionarios_fk_Usuários_CPF,fk_Notificações_Id,fk_Estudante_CPF) VALUES';
            //(:idEstudante,:tipo,LAST_INSERT_ID());
          for ($i=0; $i < count($_POST['idEstudantes']); $i++) { 
            $idEst = $_POST['idEstudantes'][$i];
            if($i > 0)
            $this->querySql['query'] .= ',';
            $this->querySql['query'] .= "(:idUser,LAST_INSERT_ID(),'$idEst')";
          }
          array_push($arrayOptions,'dia','mensaje','idUser');
          break;

        case 'notas':
          $this->querySql['query'] = '';
          for ($i=0; $i < count($_POST['estudantes']); $i++) { 
            $documento = $_POST['estudantes'][$i]["Documento"];
            $situacao = $_POST['estudantes'][$i]["Situacao"];
            $nota = $_POST['estudantes'][$i]["Nota"];
            $this->querySql['query'] .= "UPDATE inscricao_inscrito SET Nota=$nota,Situacao='$situacao' WHERE fk_Professores_fk_Usuarios_CPF=:idUser and fk_Estudante_CPF='$documento' and fk_Disciplina_Id=:idDisciplina;";
          }
          array_push($arrayOptions,'idUser','idDisciplina');
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
