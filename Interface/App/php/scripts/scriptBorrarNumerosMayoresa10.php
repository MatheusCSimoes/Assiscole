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

    public function __construct()
    {
      include "../conexion/connectPDO.php";
      $this->db = $db;
      $this->token = $token;

      $this->createQuery();
      $this->executeQuery();  
    }

    private function createQuery(){
      $arrayOptions = array();
      switch ($_POST['get']) {
          case 'get':
            $this->querySql['query'] = 'SELECT * FROM contactos where CHAR_LENGTH(Cel) > 10';
            break;
          case 'update':
              $this->querySql['query'] = 'UPDATE contactos as c SET Cel = :cel WHERE c.Id = :id';
              array_push($arrayOptions,"id","cel");
              break;
          default:
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
      $this->res = $stmt->execute($this->options);
      if(!$this->res){
        $this->content = $stmt->errorInfo();
      }
      else if($_POST['get'] == 'get')
      {
        // $this->content = $stmt->fetchAll();   
        $existen=$stmt->rowCount();

        switch ($_POST['get']) {
            case 'get':
                while ($row=$stmt->fetch()) {
                  $arreglo[]=array(
                    "Cel" => $row['Cel'],
                    "Id" => $row['Id'],
                    );
                }
                break;
            default:
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