/* ALUNOS:                                  DRE:
    1) Matheus Cunha Simões                     117091021
    2) Rodrigo Carvalho de Figueiredo           117053497
    3) Daniel Fernando Jimenez Sepúlveda        117028769
    4) Tomás Bizet de Barros                    116183736
    5) Caio Silva de Freitas                    117032792
    6) Miguel Angelo Santos Bicudo				116033119

    Disciplina: Banco de dados 1
    Turma: 2019.1

    Trabalho Prático 1

    Script de Seleção
*/

-- Escolhe os cursos de uma escola
SELECT c.Id,c.Nome FROM Curso as c left JOIN Pertence as pe ON (c.Id = pe.fk_Curso_Id and pe.Ano = '2019') inner join escola e on c.fk_Escola_Id = e.Id where e.Id = 1 GROUP BY c.Id ORDER by Id

-- Escolhe os estudantes de um curso com seus responsaveis, o ultimo dia da chamada e o tipo da chamada
-- Função Group by
SELECT e.CPF as IdEstudante,e.Nome as NomeEstudante,r.*, max(pr.Dia) as Dia, pr.Tipo from Estudante as e left join Possui as po on e.CPF = po.fk_Estudante_CPF left join Responsaveis as r on r.CPF = po.fk_Responsaveis_CPF inner join Pertence as pe on pe.fk_Estudante_CPF = e.CPF and pe.Ano = '2019' left join Presenca as pr on e.CPF = pr.fk_Estudante_CPF where pe.fk_Curso_Id = '1' and e.Ativo = 1 GROUP by e.CPF ORDER BY e.Nome asc

-- Procura um estudante pelo nome e tras seu curso e seu responsavel
SELECT e.CPF as IdEstudiante, e.Nome as NomeEstudante, c.Nome as Curso, co.* FROM Estudante as e inner join Pertence as epc on (epc.fk_Estudante_CPF = e.CPF and epc.Ano = 2019) inner join Curso as c on c.Id = epc.fk_Curso_Id inner join Possui as ce on e.CPF = ce.fk_Estudante_CPF inner join Responsaveis as co on co.CPF = ce.fk_Responsaveis_CPF WHERE e.Nome LIKE '%sepulveda%' and e.Ativo = 1 group by e.CPF ORDER by e.Nome asc, co.CPF

-- Traz as observações, notificações e chamadas do aluno procurado pelo RG
-- Função UNION
SELECT "Falla" as Tipo, ae.Tipo as TipoFalla, ae.Dia, ju.Texto, ae.Id as IdFalla from Presenca as ae left join Justificativas as ju on ae.Id = ju.fk_Presenca_Id where ae.fk_Estudante_CPF = '12345670410' Union SELECT "Notificacao", n.Mensagem, n.Data, n.Id, "" from Informa_Funcionarios_Notificacoes_Estudante as ne inner join Notificacoes as n on ne.fk_Notificacoes_Id = n.Id where ne.fk_Estudante_CPF = '12345670410' Union SELECT "Observacion", o.Observacao, "", "", "" from Informa_Funcionarios_Estudante_Observacoes as oe inner join Observacoes as o on oe.fk_Observacoes_Id = o.Id where oe.fk_Estudante_CPF = '12345670410' order by Tipo, Dia desc

-- Traz os cursos onde existem estudantes com seus repsonsaveis
-- Função EXISTS
SELECT c.Id,c.Nome,COUNT(pe.fk_Curso_Id) AS Estudiantes FROM Curso as c left JOIN Pertence as pe ON (c.Id = pe.fk_Curso_Id and pe.Ano = '2019') left join Possui as po on pe.fk_Estudante_CPF = po.fk_Estudante_CPF left join Responsaveis as r on r.CPF = po.fk_Responsaveis_CPF where EXISTS (SELECT fk_Estudante_CPF FROM Pertence as p WHERE c.Id = p.fk_Curso_Id) GROUP BY c.Id ORDER by Id

-- Traz todos os estudantes dos cursos especificos
-- Função IN
SELECT e.CPF as IdEstudiante,e.Nome as Estudante,c.* from Estudante as e inner join Possui as ce on e.CPF = ce.fk_Estudante_CPF inner join Responsaveis as c on c.CPF = ce.fk_Responsaveis_CPF inner join Pertence as epc on (e.CPF = epc.fk_Estudante_CPF and epc.Ano = 2019) where epc.fk_Curso_Id in (1,2,6) and e.Ativo = 1 Group by e.CPF ORDER BY Estudante asc, c.CPF

-- Traz as disciplinas de um professor
SELECT d.Id, d.Nome From Disciplina as d inner join Lecionam as l on d.Id = l.fk_Disciplina_Id inner join Professores as p on p.fk_Usuarios_CPF = l.fk_Professores_fk_Usuarios_CPF where p.fk_Usuarios_CPF = '52345678910'

-- Traz os estudantes numa disciplina
SELECT e.Nome, e.CPF, ii.Nota From disciplina as d inner join inscricao_inscrito as ii on d.Id = ii.fk_Disciplina_Id inner join estudante as e on ii.fk_Estudante_CPF = e.CPF where d.Id = '1'

-- Função que tras todos os alunos que tiveram falta pelas duas razões, pela falta e pelo retraso
-- Função division with Having
SELECT count(*) as Cantidade,e.CPF as IdEstudante, e.Nome as NomeEstudante from estudante as e inner join (select p1.fk_Estudante_CPF from presenca as p1 inner join chamadas as c on p1.Tipo = c.Id GROUP by p1.fk_Estudante_CPF, c.Id) as p2 on e.CPF = p2.fk_Estudante_CPF inner join pertence as p on e.CPF = p.fk_Estudante_CPF where p.fk_Curso_Id = '1' GROUP by e.CPF HAVING COUNT(*) = (select COUNT(*) from chamadas)

-- Função que traz o usuario consultado pela senha o o usuario
SELECT s.Usuario, s.Ativo, s.Nome, s.CPF, p.fk_Usuarios_CPF as Professor, f.fk_Usuarios_CPF as Funcionario FROM Usuarios as s left join funcionarios as f on s.CPF = f.fk_Usuarios_CPF left join professores as p on s.CPF = p.fk_Usuarios_CPF WHERE s.Usuario = '1' and s.Senha = '1' Limit 1
