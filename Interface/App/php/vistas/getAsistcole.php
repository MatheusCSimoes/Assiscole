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
        //Falta que pertence a escola
        case 'cursos':
          $this->querySql['query'] = 'SELECT c.Id,c.Nome,COUNT(pe.fk_Curso_Id) AS Estudiantes FROM Curso as c left JOIN Pertence as pe ON (c.Id = pe.fk_Curso_Id and pe.Ano = :ano) GROUP BY c.Id ORDER by Id';  
          // ORDER by Nombre + 0
            array_push($arrayOptions,"ano");
          break;
        case 'estudantes':
            $fecha = $_POST['fecha'];
            $this->querySql['query'] = 'SELECT e.CPF as IdEstudante,e.Nome as NomeEstudante,r.*, max(pr.Dia) as Dia, pr.Tipo from Estudante as e left join Possui as po on e.CPF = po.fk_Estudante_CPF left join Responsaveis as r on r.CPF = po.fk_Responsaveis_CPF inner join Pertence as pe on pe.fk_Estudante_CPF = e.CPF and pe.Ano = :ano left join Presenca as pr on e.CPF = pr.fk_Estudante_CPF where pe.fk_Curso_Id = :idCurso and e.Ativo = 1 GROUP by e.CPF ORDER BY e.Nome asc';
            array_push($arrayOptions,"idCurso","ano");
            break;
        case 'getEstudantebyNome':
          $this->querySql['query'] = "SELECT e.CPF as IdEstudiante, e.Nome as NomeEstudante, c.Nome as Curso, co.* FROM Estudante as e inner join Pertence as epc on (epc.fk_Estudante_CPF = e.CPF and epc.Ano = $this->ano) inner join Curso as c on c.Id = epc.fk_Curso_Id inner join Possui as ce on e.CPF = ce.fk_Estudante_CPF inner join Responsaveis as co on co.CPF = ce.fk_Responsaveis_CPF WHERE e.Nome LIKE '%".$_POST['nome']."%' and e.Ativo = 1 group by e.CPF ORDER by e.Nome asc, co.CPF";
          break;
        case 'historialEstudanteId':
          $this->querySql['query'] = 'SELECT "Falla" as Tipo, ae.Tipo as TipoFalla, ae.Dia, ju.Texto, ae.Id as IdFalla from Presenca as ae left join Justificativas as ju on ae.Id = ju.fk_Presenca_Id where ae.fk_Estudante_CPF = :id Union SELECT "Notificacao", n.Mensagem, n.Data, n.Id, "" from Informa_Funcionarios_Notificacoes_Estudante as ne inner join Notificacoes as n on ne.fk_Notificacoes_Id = n.Id where ne.fk_Estudante_CPF = :id Union SELECT "Observacion", o.Observacao, "", "", "" from Informa_Funcionarios_Estudante_Observacoes as oe inner join Observacoes as o on oe.fk_Observacoes_Id = o.Id where oe.fk_Estudante_CPF = :id order by Tipo, Dia desc';
          array_push($arrayOptions,"id");
            break;

        case 'todoslosCursos':
          $this->querySql['query'] = 'SELECT c.Id,c.Nome,COUNT(pe.fk_Curso_Id) AS Estudiantes FROM Curso as c left JOIN Pertence as pe ON (c.Id = pe.fk_Curso_Id and pe.Ano = :ano) left join Possui as po on pe.fk_Estudante_CPF = po.fk_Estudante_CPF left join Responsaveis as r on r.CPF = po.fk_Responsaveis_CPF where EXISTS (SELECT fk_Estudante_CPF FROM Pertence as p WHERE c.Id = p.fk_Curso_Id) GROUP BY c.Id ORDER by Id';  
          // ORDER by Nombre + 0
            array_push($arrayOptions,"ano");
          break;

        case 'estudantesMuchosCursos':
          $this->querySql['query'] = "SELECT e.CPF as IdEstudiante,e.Nome as Estudante,c.* from Estudante as e inner join Possui as ce on e.CPF = ce.fk_Estudante_CPF inner join Responsaveis as c on c.CPF = ce.fk_Responsaveis_CPF inner join Pertence as epc on (e.CPF = epc.fk_Estudante_CPF and epc.Ano = $this->ano) where epc.fk_Curso_Id in (";
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
          $this->querySql['query'] .= ') and e.Ativo = 1 Group by e.CPF ORDER BY Estudante asc, c.CPF';
          break;

        case 'cursoProfessor':
          $this->querySql['query'] = 'SELECT d.Id, d.Nome From Disciplina as d inner join Lecionam as l on d.Id = l.fk_Disciplina_Id inner join Professores as p on p.fk_Usuarios_CPF = l.fk_Professores_fk_Usuarios_CPF where p.fk_Usuarios_CPF = :idUser';  
          // ORDER by Nombre + 0
            array_push($arrayOptions,"idUser" );
          break;

        case 'estudantesDiscplina':
          $this->querySql['query'] = 'SELECT e.Nome, e.CPF, ii.Nota From disciplina as d inner join inscricao_inscrito as ii on d.Id = ii.fk_Disciplina_Id inner join estudante as e on ii.fk_Estudante_CPF = e.CPF where d.Id = :idDisciplina';
          array_push($arrayOptions,"idDisciplina");
          break;
          
        case 'estudantesIndiciplinados':
          $this->querySql['query'] = 'SELECT count(*) as Cantidade,e.CPF as IdEstudante, e.Nome as NomeEstudante from estudante as e inner join (select p1.fk_Estudante_CPF from presenca as p1 inner join chamadas as c on p1.Tipo = c.Id GROUP by p1.fk_Estudante_CPF, c.Id) as p2 on e.CPF = p2.fk_Estudante_CPF inner join pertence as p on e.CPF = p.fk_Estudante_CPF where p.fk_Curso_Id = :idCurso GROUP by e.CPF HAVING COUNT(*) = (select COUNT(*) from chamadas)';
          array_push($arrayOptions,"idCurso");
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
                  "Documento" => $row['CPF'],
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
                    "CPF" => $row['CPF'],
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
                  "CPF" => $row['CPF'],
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
            case 'cursoProfessor':
              while ($row=$stmt->fetch()) {
                $arreglo[]=array(
                  "Id" => $row['Id'],
                  "Nome" => $row['Nome'],
                  );
              }
              break;

            case 'estudantesDiscplina':
              while ($row=$stmt->fetch()) {
                $arreglo[] = array(
                "Documento" => $row['CPF'],
                "Nome" => $row['Nome'],
                "Nota" => $row['Nota'],
                );
              }
              break;


            case 'estudantesIndiciplinados':
              while ($row=$stmt->fetch()) {
                $arreglo[] = array(
                "Documento" => $row['IdEstudante'],
                "Nome" => $row['NomeEstudante'],
                );
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

