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

    Script de Procedimentos e Relatórios
*/

DROP PROCEDURE IF EXISTS definir_falta_com_justificativa;
DROP PROCEDURE IF EXISTS desconto_contrato;
DROP PROCEDURE IF EXISTS atualizar_situacao;
DROP PROCEDURE IF EXISTS alunos_aprovados_reprovados_por_disciplina;
DROP PROCEDURE IF EXISTS alunos_com_desempenho_para_receber_bolsa;
DROP FUNCTION IF EXISTS percentage;
DROP PROCEDURE IF EXISTS alunos_aprovados_por_professor;
DROP PROCEDURE IF EXISTS increver_aluno_na_disciplina_do_curso;

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                                                             *
 *    PROCEDURES DE MANIPULAÇÃO                                *
 *                                                             *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

DELIMITER $$
-- Procedimento definir_falta_com_justificativa
-- Define que o aluno faltou a uma aula e adiciona uma justificativa.
-- Se o status já estiver definido será preciso passar o argumento `sobrescrever` como TRUE para ter efeito.
-- A primeira chamada sempre deve ser feita com o valor `sobrescrever` como FALSE,
-- pois o procedimento irá indicar o motivo da falha que deve ser revisado e verificado.
-- Retorno:
--    ok - indica se o status do aluno foi definido com sucesso
--    msg - indica uma mensagem de sucesso ou de erro que pode ser lida por um humano
 CREATE PROCEDURE definir_falta_com_justificativa (
    IN cpf_estudante VARCHAR(11),
    IN dia_da_falta DATE,
    IN justificativa VARCHAR(200),
    IN sobrescrever BOOLEAN,
    OUT ok BOOLEAN,
    OUT msg VARCHAR(64)
)
BEGIN
    -- verificando se o aluno já possui falta no dia indicado
    -- Tipo 1 = Ausente
    -- Tipo 2 = Presente
    
    DECLARE presenca_id INT;
    
    START TRANSACTION;
    
    IF EXISTS (
            SELECT Id
            FROM Presenca AS p
            WHERE p.fk_Estudante_CPF = cpf_estudante AND p.Dia = dia_da_falta AND p.Tipo = 2
            LIMIT 1
        ) THEN
        IF sobrescrever THEN
            -- aluno foi dado como presente, mas agora vamos alterar para ausente
            -- e adicionar uma justificativa
            
			SELECT Id
			INTO presenca_id
			FROM Presenca AS p
			WHERE p.fk_Estudante_CPF = cpf_estudante AND p.Dia = dia_da_falta AND p.Tipo = 2
			LIMIT 1;

            UPDATE Presenca SET
                Tipo = 1
            WHERE Id = presenca_id AND fk_Estudante_CPF = cpf_estudante AND Dia = dia_da_falta;
            
            INSERT INTO Justificativas (Texto, fk_Presenca_Id)
            VALUES (justificativa, presenca_id);
            
            SET ok = TRUE;
            SET msg = 'Status de presença do aluno(a) redefinido como ausente.';
            
        ELSE
        
            SET ok = FALSE;
            SET msg = 'Status de presença do aluno(a) já está definido.';
        
        END IF;
    ELSEIF EXISTS (
            SELECT Id
            FROM Presenca AS p
            WHERE p.fk_Estudante_CPF = cpf_estudante AND p.Dia = dia_da_falta AND p.Tipo = 1
            LIMIT 1
        ) THEN
        IF sobrescrever THEN
            -- aluno foi dado como ausente, então vamos alterar a justificativa apenas
            
            SELECT Id
            INTO presenca_id
            FROM Presenca AS p
            WHERE p.fk_Estudante_CPF = cpf_estudante AND p.Dia = dia_da_falta AND p.Tipo = 1
            LIMIT 1;

            UPDATE Justificativas SET
                Texto = justificativa
            WHERE fk_Presenca_Id = presenca_id;
            
            SET ok = TRUE;
            SET msg = 'Status de presença do aluno(a) ausente com nova justificativa.';
            
        ELSE
        
            SET ok = FALSE;
            SET msg = 'Status de presença do aluno(a) já está definido.';
        
        END IF;
    ELSE
        -- aluno não possui status de presença, temos que adicionar a ausência e a justificativa
        
        INSERT INTO Presenca (fk_Estudante_CPF, Tipo, Dia) VALUES
        (cpf_estudante, 1, dia_da_falta);
        
        INSERT INTO Justificativas (Texto, fk_Presenca_Id) VALUES
        (justificativa, LAST_INSERT_ID());
        
        SET ok = TRUE;
        SET msg = 'Status de presença do aluno(a) definido como ausente.';
        
    END IF;
    
    COMMIT;
    
    -- retornando o set (status, mensagem)
    SELECT ok as status, msg as mensagem;
    
END $$
DELIMITER ;

-- Procedimento que desconta 10% do valor do contrato.
delimiter $$
create procedure desconto_contrato(in Id_contrato INT)
	BEGIN
	START TRANSACTION;
	UPDATE Contrato SET Valor = Valor-Valor/10 WHERE Id = Id_contrato;
	COMMIT;
	END $$
delimiter ;

delimiter $$
-- inscreve um aluno em uma disciplina do curso que ele esteja cadastrado
create procedure increver_aluno_na_disciplina_do_curso(
	in cpf_estudante varchar(11),
    in nome_disciplina varchar(40),
    in ano int,
    in cpf_professor varchar(11),
    OUT ok BOOLEAN,
    OUT msg VARCHAR(64)
)
BEGIN
	declare disciplina_id int;
    
	START TRANSACTION;
	
    -- se aluno inativo gerar erro
    if exists ( select * from estudante where cpf = cpf_estudante and Ativo = 0 )
    then
		
        set ok = false;
        set msg = 'Aluno inativo não pode se inscrever em disciplina';
	
    -- se aluno esta em 2 cursos no mesmo ano, retornar erro
    elseif ( select count(*) from Pertence P where cpf_estudante = fk_estudante_cpf and P.ano = ano ) > 1
    then
		
        set ok = false;
        set msg = 'Aluno cadastrado em mais de um curso neste ano';
	
    else

		-- verificar se a disciplina está no curso que o aluno pertence
		set @cnt_disciplina = (
			select Count(*)
			from
				Pertence EC,
				Contem CD,
				disciplina D
			where
				cpf_estudante = EC.fk_estudante_cpf and
				EC.fk_curso_id = CD.fk_curso_id and
				CD.fk_disciplina_id = D.id and
				D.nome = nome_disciplina and
				EC.ano = ano
		);
		
		if @cnt_disciplina = 1 then
        
			select D.Id
            into disciplina_id
			from
				Pertence EC,
				Contem CD,
				disciplina D
			where
				cpf_estudante = EC.fk_estudante_cpf and
				EC.fk_curso_id = CD.fk_curso_id and
				CD.fk_disciplina_id = D.id and
				D.nome = nome_disciplina and
				EC.ano = ano
			;
			
			-- se o aluno já possui inscrição com situação pendente na disciplina, retorna mensagem dizendo que aluno já está inscrito
			if exists (
				select *
				from
					inscricao_inscrito I
				where
					disciplina_id = I.fk_Disciplina_Id and
					cpf_estudante = I.fk_Estudante_CPF and
					I.Situacao = ''
				)
			then
				
				set ok = true;
				set msg = 'Já está inscrito nesta disciplina!';
			
            else
            			
				-- criar a inscrição e definir a situação como pendente
				INSERT INTO Inscricao_inscrito
                (Nota, Situacao, fk_Professores_fk_Usuarios_CPF, fk_Estudante_CPF, fk_Disciplina_Id)
                VALUES (0, '', cpf_professor, cpf_estudante, disciplina_id);
				
				set ok = true;
				set msg = 'Aluno inscrito na disciplina com sucesso!';

			end if;
		else
		
			set ok = false;
			set msg = 'Disciplina não encontrada para o curso ao qual o aluno pertence';
        
		end if;
    
    end if;
    
	COMMIT;
    
    -- retornando o set (status, mensagem)
    SELECT ok as status, msg as mensagem;

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
        Situacao = 'Reprovado'
    WHERE fk_Disciplina_Id = id_disciplina AND Nota < 7;

    UPDATE Inscricao_inscrito SET
        Situacao = 'Aprovado'
    WHERE fk_Disciplina_Id = id_disciplina AND Nota >= 7;

    COMMIT;
    
END $$
DELIMITER ;

/*
select * from Inscricao_inscrito;
Antes: 
+------+-----------+
| Nota | Situacao  |
+------+-----------+
|  5.5 |           |
|  6.5 |           |
|    6 |           |
|    7 |           |
|  8.5 |           |
|  5.5 |           |
|  6.5 |           |
|    6 |           |
|    7 |           |
|  8.5 |           |
|  5.5 |           |
|  6.5 |           |
|    6 |           |
|    7 |           |
|  8.5 |           |
+------+-----------+
Depois: 
+------+-----------+
| Nota | Situacao  |
+------+-----------+
|  5.5 | Reprovado |
|  6.5 | Reprovado |
|    6 | Reprovado |
|    7 | Aprovado  |
|  8.5 | Aprovado  |
|  5.5 | Reprovado |
|  6.5 | Reprovado |
|    6 | Reprovado |
|    7 | Aprovado  |
|  8.5 | Aprovado  |
|  5.5 | Reprovado |
|  6.5 | Reprovado |
|    6 | Reprovado |
|    7 | Aprovado  |
|  8.5 | Aprovado  |
+------+-----------+
*/ 

delimiter $$
CREATE FUNCTION percentage( val real, digits int )
returns varchar(32) deterministic
return concat(round(val*100, digits), '%')
$$
delimiter ;


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                                                             *
 *    RELATÓRIOS                                               *
 *                                                             *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

-- report: alunos_aprovados_reprovados_por_disciplina
-- Indica a quantidade de alunos aprovados e reprovados por disciplina.
-- (somente leva em conta os alunos com inscrição ativa)
DELIMITER $$
CREATE PROCEDURE alunos_aprovados_reprovados_por_disciplina( )
BEGIN

    SELECT D.Id AS Id,
           D.Nome AS Nome,
           SUM(IF(I.Situacao = 'Aprovado', 1, 0)) as Aprovados,
           SUM(IF(I.Situacao = 'Reprovado', 1, 0)) as Reprovados
    FROM
        Estudante as E,
        Disciplina as D,
        Inscricao_inscrito as I
    WHERE E.CPF = I.fk_Estudante_CPF
      AND I.fk_Disciplina_Id = D.Id
      AND E.Ativo = 1
    GROUP BY D.Id, D.Nome
    ;

END $$
DELIMITER ;

-- report: alunos_com_desempenho_para_receber_bolsa
-- Indica quais alunos podem receber bolsa de acordo com os seus desempenhos.
-- (somente para os alunos com inscrição ativa)
DELIMITER $$
CREATE PROCEDURE alunos_com_desempenho_para_receber_bolsa(  )
BEGIN

    SELECT E.CPF,
           E.Nome,
           AVG(I.Nota) AS Media_Notas,
           IF(AVG(I.Nota) > 9.5, '100%', '35%') AS Desconto_Autorizado
    FROM
        Estudante as E,
        Inscricao_inscrito as I
    WHERE E.Ativo = 1 AND E.cpf = I.fk_estudante_cpf
    GROUP BY E.CPF, E.Nome
    HAVING AVG(I.Nota) > 8;
    
END $$
DELIMITER ;

-- report: alunos_aprovados_por_professor
-- Indica o desempenho dos professores em termos de aprovação de alunos
DELIMITER $$
CREATE PROCEDURE alunos_aprovados_por_professor( )
BEGIN

	SELECT *,
	   percentage(Aprovados / Total, 0) As Taxa_Aprovacao
    FROM (
		SELECT U.CPF,
			   U.Nome,
			   SUM(IF(I.Situacao = 'Aprovado', 1, 0)) AS Aprovados,
			   SUM(IF(I.Situacao = 'Reprovado', 1, 0)) AS Reprovados,
			   SUM(IF(I.Situacao = '', 1, 0)) AS Pendente,
			   COUNT(*) AS Total
		FROM
			professores as P,
			usuarios as U,
			Inscricao_inscrito as I
		WHERE P.fk_Usuarios_CPF = I.fk_Professores_fk_Usuarios_CPF AND P.fk_Usuarios_CPF = U.cpf
			AND U.Ativo = 1
		GROUP BY U.CPF, U.Nome
	) as T
    ;
    
END $$
DELIMITER ;

