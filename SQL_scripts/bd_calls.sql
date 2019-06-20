/* ALUNOS:                                     DRE:
    1) Matheus Cunha Simões                     117091021
    2) Rodrigo Carvalho de Figueiredo           117053497
    3) Daniel Fernando Jimenez Sepúlveda        117028769
    4) Tomás Bizet de Barros                    116183736
    5) Caio Silva de Freitas                    117032792
    6) Miguel Angelo Santos Bicudo              116033119

    Disciplina: Banco de dados 1
    Turma: 2019.1

    Trabalho Prático 1

    Testando os procedimentos
*/

-- definir um dia com falta para o aluno
CALL definir_falta_com_justificativa('12345671110', '2015-07-21', 'Traficante do morro foi morto', FALSE, @ok, @msg);
-- tentando redefinir a falta: agora vai dar erro pois o aluno já possui falta nesse dia
CALL definir_falta_com_justificativa('12345671110', '2015-07-21', 'Traficante do morro foi morto de novo', FALSE, @ok, @msg);
-- tentando redefinir a falta com a flag para sobrescrever
CALL definir_falta_com_justificativa('12345671110', '2015-07-21', 'Traficante do morro foi morto de novo', TRUE, @ok, @msg);
-- tentando definir uma outra falta para o mesmo aluno em outro dia diferente
CALL definir_falta_com_justificativa('12345671110', '2015-07-30', 'Guerra do tráfico', FALSE, @ok, @msg);
-- visualizando as alterações anteriores
SELECT * FROM Justificativas AS J, Presenca AS P, estudante AS E
WHERE P.id = J.fk_presenca_id and E.cpf = P.fk_estudante_cpf
	and E.cpf = '12345671110';

CALL alunos_com_desempenho_para_receber_bolsa();

CALL alunos_aprovados_reprovados_por_disciplina( );

-- testando atualizar_situacao, passando o id da disciplina de matemática
-- primeiro limpo os valores para depois chamar a procedure que irá repopular com os valores corretos
SET @id_matematica = (SELECT Id FROM disciplina WHERE Nome = 'Matemática' LIMIT 1);
SELECT @id_matematica;
UPDATE inscricao_inscrito SET Situacao = '' WHERE fk_Disciplina_Id = @id_matematica;
SELECT * FROM inscricao_inscrito WHERE fk_Disciplina_Id = @id_matematica;

CALL atualizar_situacao( @id_matematica );

SELECT * FROM inscricao_inscrito WHERE fk_Disciplina_Id = @id_matematica;
