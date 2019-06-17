/* ALUNOS:                                  DRE:
    1) Matheus Cunha Simões                     117091021
    2) Rodrigo Carvalho de Figueiredo           117053497
    3) Daniel Fernando Jimenez Sepúlveda        117028769
    4) Tomás Bizet de Barros                    116183736
    5) Caio Silva de Freitas                    117032792
    6) Miguel Angelo Santos Bicudo		116033119

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
