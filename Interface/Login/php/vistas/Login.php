<?php 
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: X-Requested-With, Content-Type, X-Auth-Token, Origin, Authorization');
$req_method = $_SERVER['REQUEST_METHOD'];

class nuevoPDO
{
  private $querySql = array();
  private $options = array();
  public $res;
  public $resquery;
  public $content = "";
  public $login = false;
  private $db;
  private $token;

  public function __construct()
  {
      if(isset($_POST['bd']))
        define('db', $_POST['bd']);
      include "../conexion/connectPDO.php";
      $this->db = $db;
      $this->token = $token;
      $this->guid = "";

      $this->createQuery();
      $this->executeQuery();  
  }

  private function createQuery(){
    $arrayOptions = array();

    switch ($_POST['get']) {
          case 'loginUser':
            $this->querySql['query'] = 'SELECT s.Usuario FROM Usuarios as s WHERE s.Usuario = :user Limit 1';
            array_push($arrayOptions,"user");
            break;
          case 'loginPass':
            $this->querySql['query'] = 'SELECT s.Usuario, s.Ativo, s.Nome, s.RG, p.fk_Usuários_RG as Professor, f.fk_Usuários_RG as Funcionario FROM Usuarios as s left join funcionarios as f on s.RG = f.fk_Usuários_RG left join professores as p on s.RG = p.fk_Usuários_RG WHERE s.Usuario = :user and s.Senha = :pass Limit 1
';
            array_push($arrayOptions, "user", "pass");
            break;
          default:
            $this->querySql['query'] = '';
      }

      $this->createOptions($arrayOptions);
  }

  private function createOptions($arrayOptions) {
    foreach ($arrayOptions as $key => $value) {
        $this->options[':'.$value] = $_POST[$value];
      }
  }

  private function pdo_sql_debug($sql,$placeholders){
    foreach($placeholders as $k => $v){
      $sql = preg_replace('/'.$k.'/',"'".$v."'",$sql);
    }
    return $sql;
  }

  private function executeQuery() {      
    $this->resquery = $this->pdo_sql_debug($this->querySql['query'],$this->options);
    // echo $this->resquery,"\n";
    $stmt = $this->db->prepare($this->querySql['query']);
    $this->res = $stmt->execute($this->options);
      if($this->res){
        // $this->content = $stmt->fetchAll();   
        $existen=$stmt->rowCount();

        switch ($_POST['get']) {
            case 'loginUser':
                while ($row=$stmt->fetch()) {
                  $arreglo[]=array(
                    "Usuario" => $row['Usuario'],
                    );
                }
                break;
            case 'loginPass':
                while ($row=$stmt->fetch()) {
                  $arreglo[]=array(
                    "Ativo" => $row['Ativo'],
                    "Nome" => $row['Nome'],
                    "RG" => $row['RG'],
                    "Professor" => $row['Professor'],
                    "Funcionario" => $row['Funcionario'],
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
      else
      {
        $this->content = $stmt->errorInfo();
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

echo json_encode($respuesta);

?>