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

    Script de Views e Papéis
*/

DELIMITER $$
-- Procedimento definir_falta_com_justificativa
-- Define que o aluno faltou a uma aula e adiciona uma justificativa.
-- Se o status já estiver definido será preciso passar o argumento `sobrescrever` como TRUE para ter efeito.
-- A primeira chamada sempre deve ser feita com o valor `sobrescrever` como FALSE,
-- pois o procedimento irá indicar o motivo da falha que deve ser revisado e verificado.
-- Retorno:
--    ok - indica se o status do aluno foi definido com sucesso
--    msg - indica uma mensagem de sucesso ou de erro que pode ser lida por um humano
 CREATE PROCEDURE definir_falta_com_justificativa(
    IN cpf_estudante VARCHAR(11),
    IN dia_da_falta DATE,
    IN justificativa VARCHAR(200),
    IN sobrescrever BOOLEAN,
    OUT ok BOOLEAN,
    OUT error VARCHAR(32)
)
BEGIN
    -- verificando se o aluno já possui falta no dia indicado
    -- Tipo 1 = Ausente
    -- Tipo 2 = Presente
    
    DECLARE presenca_id INT;
    
    START TRANSACTION;
    
    IF EXISTS (
            SELECT Id
            INTO presenca_id
            FROM Presenca AS p
            WHERE p.fk_Estudante_CPF = cpf_estudante AND p.Tipo = 2
            LIMIT 1
        ) THEN
        IF sobrescrever THEN
            -- aluno foi dado como presente, mas agora vamos alterar para ausente
            -- e adicionar uma justificativa
            
            UPDATE Presenca SET
                Tipo = 1,
                Dia = dia_da_falta
            WHERE fk_Estudante_CPF = cpf_estudante;
            
            INSERT INTO Justificativas (Texto, fk_Presenca_Id)
            VALUES (justificativa, presenca_id);
            
            ok = TRUE;
            msg = "Status de presença do aluno(a) redefinido como ausente.";
            
            
        ELSE
        
            ok = FALSE;
            msg = "Status de presença do aluno(a) já está definido.";
        
        END IF;
    ELSEIF EXISTS (
            SELECT Id
            INTO presenca_id
            FROM Presenca AS p
            WHERE p.fk_Estudante_CPF = cpf_estudante AND p.Tipo = 1
            LIMIT 1
        ) THEN
        IF sobrescrever THEN
            -- aluno foi dado como ausente, então vamos alterar a justificativa apenas
            
            UPDATE Presenca SET
                Tipo = 1,
                Dia = dia_da_falta
            WHERE fk_Estudante_CPF = cpf_estudante;
            
            UPDATE Justificativas SET
                Texto = justificativa
            WHERE fk_Presenca_Id = presenca_id;
            
            ok = TRUE;
            msg = "Status de presença do aluno(a) ausente com nova justificativa.";
            
        ELSE
        
            ok = FALSE;
            msg = "Status de presença do aluno(a) já está definido.";
        
        END IF;
    ELSE
        -- aluno não possui status de presença, temos que adicionar a ausência e a justificativa
        
        INSERT INTO Presenca (fk_Estudante_CPF, Tipo, Dia) VALUES
        (cpf_estudante, 1, dia_da_falta);
        
        INSERT INTO Justificativas (Texto, fk_Presenca_Id) VALUES
        (justificativa, LAST_INSERT_ID());
        
        ok = TRUE;
        msg = "Status de presença do aluno(a) definido como ausente.";
        
    END IF;
    
    COMMIT;
    
END $$
DELIMITER ;


--Procedimento que desconta 10% do valor do contrato.

delimiter $$
create procedure desconto_contrato(in Id_contrato INT)
	BEGIN
	START TRANSACTION;
	UPDATE Contrato SET Valor = Valor-Valor/10 WHERE Id = Id_contrato;
	COMMIT;
	END $$
delimiter ;

/* Antes do procedimento:

select * from contrato where Id = 1;

+----+------------+--------------+--------------+-------+
| Id | Data_Final | Data_Inicial | fk_Escola_Id | Valor |
+----+------------+--------------+--------------+-------+
|  1 | 2019-12-31 | 2019-01-01   |            1 |   1001|
+----+------------+--------------+--------------+-------+

Depois do procedimento:

select * from contrato where Id = 1;

+----+------------+--------------+--------------+-------+
| Id | Data_Final | Data_Inicial | fk_Escola_Id | Valor |
+----+------------+--------------+--------------+-------+
|  1 | 2019-12-31 | 2019-01-01   |            1 |   901 |
+----+------------+--------------+--------------+-------+
*/

-- Procedimento para atualizar situação de alunos para uma dada disciplina.
-- No final do curso, se os alunos tiverem nota menor que 7 serao reprovados.

DELIMITER $$

CREATE PROCEDURE atualizar_situacao( IN id_disciplina INT )
    BEGIN
    START TRANSACTION;

    UPDATE Inscricao_inscrito SET
        Situacao = 'Reprovado.'
    WHERE fk_Disciplina_Id = id_disciplina AND Nota < 7;

    UPDATE Inscricao_inscrito SET
        Situacao = 'Aprovado.'
    WHERE fk_Disciplina_Id = id_disciplina AND Nota >= 7;

    COMMIT;
    
END $$
DELIMITER ;
