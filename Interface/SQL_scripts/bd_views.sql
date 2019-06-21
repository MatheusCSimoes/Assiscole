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

-- criando views
DROP VIEW IF EXISTS inscricoes;
DROP VIEW IF EXISTS estudantes;
DROP VIEW IF EXISTS responsaveisEstudantes;
DROP VIEW IF EXISTS listaPresenca;
DROP VIEW IF EXISTS notificacoes2;

CREATE VIEW inscricoes AS
    SELECT ins.fk_Estudante_CPF, ins.Nota, ins.Situacao FROM Inscricao_inscrito ins;

CREATE VIEW estudantes AS
    SELECT e.Nome, e.CPF FROM Estudante e;

CREATE VIEW responsaveisEstudantes AS
    SELECT r.Nome, r.Telefone FROM Responsaveis r;

CREATE VIEW listaPresenca AS
    SELECT p.Dia, p.fk_Estudante_CPF, p.Tipo FROM Presenca p;

CREATE VIEW notificacoes2 AS
    SELECT n.Data, n.Mensagem FROM Notificacoes n;

-- criando papéis
DROP ROLE IF EXISTS 'professor';
DROP ROLE IF EXISTS 'funcionario';

CREATE ROLE IF NOT EXISTS professor;
CREATE ROLE IF NOT EXISTS funcionario;

-- dando privilegios sobres as views para os papéis
GRANT SELECT ON inscricoes TO professor;
GRANT UPDATE ON inscricoes TO professor;
GRANT INSERT ON inscricoes TO professor;

GRANT SELECT ON estudante TO professor;
GRANT UPDATE ON estudante TO professor;
GRANT INSERT ON estudante TO professor;

GRANT SELECT ON listaPresenca TO professor;
GRANT UPDATE ON listaPresenca TO professor;
GRANT INSERT ON listaPresenca TO professor;

GRANT SELECT ON estudante TO funcionario;
GRANT UPDATE ON estudante TO funcionario;
GRANT INSERT ON estudante TO funcionario;

GRANT SELECT ON responsaveisEstudantes TO funcionario;
GRANT UPDATE ON responsaveisEstudantes TO funcionario;
GRANT INSERT ON responsaveisEstudantes TO funcionario;

GRANT SELECT ON notificacoes TO funcionario;
GRANT UPDATE ON notificacoes TO funcionario;
GRANT INSERT ON notificacoes TO funcionario;

CREATE USER IF NOT EXISTS 'Admin'@'%' IDENTIFIED WITH mysql_native_password;
SET PASSWORD FOR 'Admin'@'%' = 'admin';
GRANT ALL PRIVILEGES ON *.* TO 'Admin'@'%';
GRANT ALL PRIVILEGES ON `assiscole`.* TO 'Admin'@'%';

CREATE USER IF NOT EXISTS 'Matheus'@'%' IDENTIFIED WITH mysql_native_password;
SET PASSWORD FOR 'Matheus'@'%' = 'matheus';
GRANT SELECT, INSERT, UPDATE ON *.* TO 'Matheus'@'%';
GRANT ALL PRIVILEGES ON `assiscole`.* TO 'Matheus'@'%';

CREATE USER IF NOT EXISTS 'Daniel'@'%' IDENTIFIED WITH mysql_native_password;
SET PASSWORD FOR 'Daniel'@'%' = 'troll';
GRANT SELECT, INSERT, UPDATE, DELETE, FILE ON *.* TO 'Daniel'@'%';
GRANT ALL PRIVILEGES ON `assiscole`.* TO 'Daniel'@'%';

CREATE USER IF NOT EXISTS 'funcionario_01'@'%' IDENTIFIED WITH mysql_native_password;
SET PASSWORD FOR 'funcionario_01'@'%' = '12345';
GRANT USAGE ON *.* TO 'funcionario_01'@'%';
GRANT funcionario TO 'funcionario_01'@'%';

CREATE USER IF NOT EXISTS 'professor_01'@'%' IDENTIFIED WITH mysql_native_password;
SET PASSWORD FOR 'professor_01'@'%' = '12345';
GRANT USAGE ON *.* TO 'professor_01'@'%';
GRANT professor TO 'professor_01'@'%';

