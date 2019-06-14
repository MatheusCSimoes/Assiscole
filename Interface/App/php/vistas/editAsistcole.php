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
  private $Ano = 2019;

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
            $this->querySql['query'] = 'UPDATE Estudante as e SET e.Nome=:nome, e.RG=:documento WHERE e.RG = :documentoAntigo;';
            $this->querySql['query'] .= 'UPDATE Responsaveis as c SET c.Nome=:responsavelNome, c.Telefone=:responsavelCel, c.RG=:responsavelDocumento WHERE c.Id = :responsavelDocumentoAntigo;';
            array_push($arrayOptions,'nome','responsavelDocumentoAntigo','documentoAntigo','responsavelNome','responsavelCel','responsavelDocumento','documento');
            break;
          case 'grupo':
            $this->querySql['query'] = 'UPDATE grupos as e SET e.Nombre=:nombre WHERE e.Id = :id';
            array_push($arrayOptions,'id','nombre');
            break;
          case 'miembro':
            $this->querySql['query'] = 'UPDATE miembros as m SET m.Nombre=:nombre, m.Telefono=:cel WHERE m.Id = :id';
            array_push($arrayOptions,'id','nombre','cel');
            break;
          case 'imagen':
            $this->querySql['query'] = 'REPLACE INTO justificaciones (IdFalla, Url, Justificado) VALUES ';
            for ($i=0; $i < count($_POST['idFalla']); $i++) { 
              $idFalla = $_POST['idFalla'][$i];
              if($i > 0)
              $this->querySql['query'] .= ',';
              $this->querySql['query'] .= "($idFalla, :url, 1)";
            }
            array_push($arrayOptions,'url');
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
      // echo $this->resquery;
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