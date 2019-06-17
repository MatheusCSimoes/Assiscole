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
CREATE VIEW inscricoes AS
    SELECT insc.fk_Estudante_CPF, ins.Nota, ins.Situacao FROM Inscricao_inscrito ins;

CREATE VIEW estudante AS
    SELECT e.Nome, e.CPF FROM Estudante e;

CREATE VIEW responsaveisEstudantes AS
    SELECT r.Nome, r.Telefone FROM Responsaveis r;

CREATE VIEW listaPresenca AS
    SELECT p.Dia, p.fk_Estudante_CPF, p.Tipo FROM Presenca p;

CREATE VIEW notificacoes AS
    SELECT n.Data, n.Mensagem FROM Notificacoes n;

-- criando papéis
CREATE ROLE professor;
CREATE ROLE funcionario;

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

CREATE USER 'Admin'@'%' IDENTIFIED VIA mysql_native_password USING '***';
GRANT ALL PRIVILEGES ON *.* TO 'Admin'@'%' REQUIRE NONE WITH GRANT OPTION MAX_QUERIES_PER_HOUR 0 MAX_CONNECTIONS_PER_HOUR 0 MAX_UPDATES_PER_HOUR 0 MAX_USER_CONNECTIONS 0;
GRANT ALL PRIVILEGES ON `assiscole`.* TO 'Admin'@'%';

CREATE USER 'Matheus'@'%' IDENTIFIED VIA mysql_native_password USING '***';
GRANT SELECT, INSERT, UPDATE ON *.* TO 'Matheus'@'%' REQUIRE NONE WITH MAX_QUERIES_PER_HOUR 0 MAX_CONNECTIONS_PER_HOUR 0 MAX_UPDATES_PER_HOUR 0 MAX_USER_CONNECTIONS 0;
GRANT ALL PRIVILEGES ON `assiscole`.* TO 'Matheus'@'%';

CREATE USER 'Daniel'@'%' IDENTIFIED VIA mysql_native_password USING '***';
GRANT SELECT, INSERT, UPDATE, DELETE, FILE ON *.* TO 'Daniel'@'%' REQUIRE NONE WITH MAX_QUERIES_PER_HOUR 0 MAX_CONNECTIONS_PER_HOUR 0 MAX_UPDATES_PER_HOUR 0 MAX_USER_CONNECTIONS 0;
GRANT ALL PRIVILEGES ON `assiscole`.* TO 'Daniel'@'%';

CREATE USER 'funcionario_01'@'%' IDENTIFIED VIA mysql_native_password USING '***';
GRANT USAGE ON *.* TO 'funcionario_01'@'%' REQUIRE NONE WITH MAX_QUERIES_PER_HOUR 0 MAX_CONNECTIONS_PER_HOUR 0 MAX_UPDATES_PER_HOUR 0 MAX_USER_CONNECTIONS 0;
GRANT funcionario TO 'funcionario_01'@'%';

CREATE USER 'professor_01'@'%' IDENTIFIED VIA mysql_native_password USING '***';
GRANT USAGE ON *.* TO 'professor_01'@'%' REQUIRE NONE WITH MAX_QUERIES_PER_HOUR 0 MAX_CONNECTIONS_PER_HOUR 0 MAX_UPDATES_PER_HOUR 0 MAX_USER_CONNECTIONS 0;
GRANT professor TO 'professor_01'@'%';

