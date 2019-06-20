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

    Script de Criação
*/

SET NAMES utf8 COLLATE utf8_general_ci;

DROP TABLE IF EXISTS Possui;
DROP TABLE IF EXISTS Tem;
DROP TABLE IF EXISTS Informa_Funcionarios_Estudante_Observacoes;
DROP TABLE IF EXISTS Informa_Funcionarios_Notificacoes_Estudante;
DROP TABLE IF EXISTS Observacoes;
DROP TABLE IF EXISTS Pertence;
DROP TABLE IF EXISTS Contem;
DROP TABLE IF EXISTS Lecionam;
DROP TABLE IF EXISTS Inscricao_inscrito;
DROP TABLE IF EXISTS Justificativas;
DROP TABLE IF EXISTS Disciplina;
DROP TABLE IF EXISTS Responsaveis;
DROP TABLE IF EXISTS Modulos;
DROP TABLE IF EXISTS Presenca;
DROP TABLE IF EXISTS Professores;
DROP TABLE IF EXISTS Funcionarios;
DROP TABLE IF EXISTS Usuarios;
DROP TABLE IF EXISTS Notificacoes;
DROP TABLE IF EXISTS Curso;
DROP TABLE IF EXISTS Contrato;
DROP TABLE IF EXISTS Escola;
DROP TABLE IF EXISTS Filial;
DROP TABLE IF EXISTS Estudante;
DROP TABLE IF EXISTS Chamadas;

/* Nome da tabela: Chamadas */
/* Objetivo: armazenar os possiveis estados negativos de um aluno
em uma chamada referente a presença em sala de aula (Atraso e falta). */
/* Estrutura: cada tupla possui os seguintes atributos:
'Id' do tipo INT(11) (chave primária), 
'Nome' não nulo do tipo VARCHAR(30) e 
'Alias' não nulo do tipo VARCHAR(30). */

CREATE TABLE Chamadas (
  Id int(11) PRIMARY KEY,
  Nome varchar(30) NOT NULL,
  Alias varchar(30) NOT NULL
) DEFAULT CHARSET=utf8;

/* Nome da tabela: Estudante */
/* Objetivo: armazenar os dados básicos dos estudantes de uma escola. */
/* Estrutura: cada tupla possui os seguintes atributos:
'Nome' não nulo do tipo VARCHAR(40), 
'CPF' do tipo VARCHAR(11) (chave primária) e 
'Ativo' não nulo do tipo INT(2) com valor padrão igual a '1'. */

CREATE TABLE Estudante (
    Nome VARCHAR (40) NOT NULL,
    CPF VARCHAR (11) PRIMARY KEY,
    Ativo INT (2) NOT NULL DEFAULT '1'
) DEFAULT CHARSET=utf8;

/* Nome da tabela: Escola */
/* Objetivo: armazenar os dados básicos de uma escola coberta por nosso sistema. */
/* Estrutura: cada tupla possui os seguintes atributos:
'Id' do tipo int (chave primária),
'fk_Filial_Filial_PK' do tipo INT (chave estrangeira p/ Filial), 
'Nome' não nulo do tipo VARCHAR(40), 
'Endereco' não nulo do tipo VARCHAR(40) e 
'Telefone' não nulo do tipo VARCHAR(15). */

CREATE TABLE Escola (
    Id INT PRIMARY KEY,
    fk_Filial_Filial_PK INT,
    Nome VARCHAR (40) NOT NULL,
    Endereco VARCHAR (40) NOT NULL,
    Telefone VARCHAR (15) NOT NULL
) DEFAULT CHARSET=utf8;

/* Nome da tabela: Contrato */
/* Objetivo: armazenar os contratos firmados entre nossa empresa e as escolas contratantes. */
/* Estrutura: cada tupla possui os seguintes atributos: 
'Id' do tipo INT (chave primária),
'Data_Final' não nulo do tipo DATE,
'Data_Inicial' não nulo do tipo DATE,
'fk_Escola_Id do tipo INT (chave estrangeira p/ Escola) e
'Valor' não nulo do tipo INT. */

CREATE TABLE Contrato (
    Id INT PRIMARY KEY,
    Data_Final DATE NOT NULL,
    Data_Inicial DATE NOT NULL,
    fk_Escola_Id INT,
    Valor INT NOT NULL
) DEFAULT CHARSET=utf8;

/* Nome da tabela: Funcionarios */
/* Objetivo: armazenar os funcionários das escolas contratantes. */
/* Estrutura: cada tupla possui os seguintes atributos: 
'fk_Usuarios_CPF' do tipo VARCHAR(11) (chave primária e chave estrangeira p/ Usuarios). */

CREATE TABLE Funcionarios (
    fk_Usuarios_CPF VARCHAR (11) PRIMARY KEY
) DEFAULT CHARSET=utf8;

/* Nome da tabela: Professores */
/* Objetivo: armazenar os professores das escola contratantes. */
/* Estrutura: cada tupla possui os seguintes atributos: 
'fk_Usuarios_CPF' do tipo VARCHAR(11) (chave primária e chave estrangeira p/ Usuarios). */

CREATE TABLE Professores (
    fk_Usuarios_CPF VARCHAR (11) PRIMARY KEY
) DEFAULT CHARSET=utf8;

/* Nome da tabela: Disciplina */
/* Objetivo: armazenar os dados das disciplinas oferecidas pelas escolas contratantes. */
/* Estrutura: cada tupla possui os seguintes atributos: 
'Id' do tipo INT (chave primária) e
'Nome' não nulo do tipo VARCHAR(40). */

CREATE TABLE Disciplina (
    Id INT PRIMARY KEY,
    Nome VARCHAR (40) NOT NULL
) DEFAULT CHARSET=utf8;

/* Nome da tabela: Curso */
/* Objetivo: armazenar os dados dos cursos oferecidos pelas escolas contratantes. */
/* Estrutura: cada tupla possui os seguintes atributos: 
'Id' do tipo INT (chave primária),
'Nome' não nulo do tipo VARCHAR(40) e
'fk_Escola_Id' não nulo do tipo INT (chave estrangeira p/ Escola). */

CREATE TABLE Curso (
    Id INT PRIMARY KEY,
    Nome VARCHAR (40) NOT NULL,
    fk_Escola_Id INT NOT NULL
) DEFAULT CHARSET=utf8;

/* Nome da tabela: Notificacoes */
/* Objetivo: armazenar as notificacoes que deverao ser enviadas aos responsaveis de um aluno. */
/* Estrutura: cada tupla possui os seguintes atributos: 
'Mensagem' do tipo VARCHAR(200),
'Id' do tipo INT (chave primária) e
'Data' não nulo do tipo DATETIME. */

CREATE TABLE Notificacoes (
    Mensagem VARCHAR (200),
    Id INT PRIMARY KEY,
    Data datetime NOT NULL
) DEFAULT CHARSET=utf8;

/* Nome da tabela: Justificativas */
/* Objetivo: armazenar as justificativas enviadas pelos responsaveis para explicar a ausencia ou falta de um aluno. */
/* Estrutura: cada tupla possui os seguintes atributos: 
'Texto' do tipo VARCHAR(200),
'Id' do tipo INT (chave primária) e
'fk_Presenca_Id' do tipo INT (chave estrangeira p/ Presenca). */

CREATE TABLE Justificativas (
    Texto VARCHAR (200),
    Id INT PRIMARY KEY,
    fk_Presenca_Id INT
) DEFAULT CHARSET=utf8;

/* Nome da tabela: Usuarios */
/* Objetivo: armazenar os dados dos usuarios do BD, que podem ser funcionarios ou professores das escolas contratantes. */
/* Estrutura: cada tupla possui os seguintes atributos: 
'CPF' do tipo VARCHAR(11) (chave primária),
'Nome' não nulo do tipo VARCHAR(40),
'Telefone' não nulo do tipo VARCHAR(15),
'Usuario' não nulo do tipo VARCHAR(40),
'Senha' não nulo do tipo VARCHAR(40),
'Ativo' não nulo do tipo INT(2) com valor padrão = '1' e
'fk_Escola_Id' do tipo INT (chave estrangeira p/ Escola). */

CREATE TABLE Usuarios (
    CPF VARCHAR (11) PRIMARY KEY,
    Nome VARCHAR (40) NOT NULL,
    Telefone VARCHAR (15) NOT NULL,
    Usuario VARCHAR (40) NOT NULL,
    Senha VARCHAR (40) NOT NULL,
    Ativo INT(2) NOT NULL DEFAULT '1',
    fk_Escola_Id INT
) DEFAULT CHARSET=utf8;

/* Nome da tabela: Presenca */
/* Objetivo: armazenar os relatorios de presenca diarios dos alunos de acordo com as chamadas feitas em aula. */
/* Estrutura: cada tupla possui os seguintes atributos: 
'Tipo' do tipo INT(11),
'Dia' não nulo do tipo DATE,
'Id' do tipo INT (chave primária) e
'fk_Estudante_CPF' do tipo VARCHAR(11) (chave estrangeira p/ Estudante). */

CREATE TABLE Presenca (
    Tipo INT (11),
    Dia DATE NOT NULL,
    Id INT PRIMARY KEY,
    fk_Estudante_CPF VARCHAR (11)
) DEFAULT CHARSET=utf8;

/* Nome da tabela: Observacoes */
/* Objetivo: armazenar as observacoes feitas por professores a serem informadas aos responsaveis dos estudantes,
juntamente com as recomendacoes(acordos) requeridos pelos professores para esses alunos que devem ser aceitas pelos responsaveis. */
/* Estrutura: cada tupla possui os seguintes atributos: 
'Id' do tipo INT (chave primária),
'Observacao' não nulo do tipo VARCHAR(200) e
'Acordo' não nulo do tipo VARCHAR(200). */

CREATE TABLE Observacoes (
    Id INT PRIMARY KEY,
    Observacao VARCHAR (200) NOT NULL,
    Acordo VARCHAR (200) NOT NULL
) DEFAULT CHARSET=utf8;

/* Nome da tabela: Modulos */
/* Objetivo: armazenar os modulos(funcionalidades) que compoe o contrato, de acordo com os servicos contratados pela escola. */
/* Estrutura: cada tupla possui os seguintes atributos: 
'Id' do tipo INT (chave primária),
'Nome' não nulo do tipo VARCHAR(40) e
'Descricao' do tipo VARCHAR(200). */

CREATE TABLE Modulos (
    Id INT PRIMARY KEY,
    Nome VARCHAR (40) NOT NULL,
    Descricao VARCHAR (200)
) DEFAULT CHARSET=utf8;

/* Nome da tabela: Responsaveis */
/* Objetivo: armazenar os dados básicos dos responsaveis para permitir contato posterior. */
/* Estrutura: cada tupla possui os seguintes atributos: 
'Nome' não nulo do tipo VARCHAR(40),
'CPF' do tipo VARCHAR(11) (chave primária) e
'Telefone' não nulo do tipo VARCHAR(15). */

CREATE TABLE Responsaveis (
    Nome VARCHAR (40) NOT NULL,
    CPF VARCHAR (11) PRIMARY KEY,
    Telefone VARCHAR (15) NOT NULL
) DEFAULT CHARSET=utf8;

/* Nome da tabela: Inscricao_inscrito */
/* Objetivo: armazenar a situacao final de estudantes em disciplinas nas quais eles foram inscritos. */
/* Estrutura: cada tupla possui os seguintes atributos: 
'Nota' não nulo do tipo DOUBLE,
'Situacao' não nulo do tipo VARCHAR(40),
'fk_Professores_fk_Usuarios_CPF' do tipo VARCHAR(11) (chave estrangeira p/ Professores),
'fk_Estudante_CPF' do tipo VARCHAR(11) (chave estrangeira p/ Estudante) e
'fk_Disciplina_Id do tipo INT (chave estrangeira p/ Disciplina). */

CREATE TABLE Inscricao_inscrito (
    Nota DOUBLE NOT NULL,
    Situacao VARCHAR (40) NOT NULL,
    fk_Professores_fk_Usuarios_CPF VARCHAR (11),
    fk_Estudante_CPF VARCHAR (11) ,
    fk_Disciplina_Id INT
) DEFAULT CHARSET=utf8;

/* Nome da tabela: Filial */
/* Objetivo: armazenar as filiais de cada escola contratante. */
/* Estrutura: cada tupla possui os seguintes atributos: 
'Filial_PK' do tipo INT (chave primária) e
'Filial' não nulo do tipo VARCHAR(40) (nome da filial). */

CREATE TABLE Filial (
    Filial_PK INT NOT NULL PRIMARY KEY,
    Filial VARCHAR (40) NOT NULL
) DEFAULT CHARSET=utf8;

/* Nome da tabela: Lecionam */
/* Objetivo: armazenar a relacao entre os professores e as disciplinas lecionados por cada um deles. */
/* Estrutura: cada tupla possui os seguintes atributos:
'fk_Disciplina_Id' do tipo INT (chave primária) e
'fk_Professores_fk_Usuarios_CPF' do tipo VARCHAR(11) (chave estrangeira p/ Professores). */

CREATE TABLE Lecionam (
    fk_Disciplina_Id INT,
    fk_Professores_fk_Usuarios_CPF VARCHAR (11)
) DEFAULT CHARSET=utf8;

/* Nome da tabela: Contem */
/* Objetivo: armazenar a relacao entre os cursos e as disciplinas oferecidas por cada um deles. */
/* Estrutura: cada tupla possui os seguintes atributos: 
'fk_Curso_Id' do tipo INT (chave estrangeira p/ Curso) e 
'fk_Disciplina_Id' do tipo INT (chave estrangeira p/ Disciplina). */

CREATE TABLE Contem (
    fk_Curso_Id INT,
    fk_Disciplina_Id INT
) DEFAULT CHARSET=utf8;

/* Nome da tabela: Pertence */
/* Objetivo: armazenar a relacao entre os cursos e os estudantes pertencentes a cada um deles. */
/* Estrutura: cada tupla possui os seguintes atributos: 
'fk_Curso_Id' do tipo INT (chave estrangeira p/ Curso),
'fk_Estudante_CPF' do tipo VARCHAR(11) (chave estrangeira p/ Estudante) e
'Ano' do tipo INT. */

CREATE TABLE Pertence (
    fk_Curso_Id INT,
    fk_Estudante_CPF VARCHAR (11),
    Ano INT
) DEFAULT CHARSET=utf8;

/* Nome da tabela: Informa_Funcionarios_Notificacoes_Estudante */
/* Objetivo: armazenar a relacao entre os funcionarios, notificacoes e estudantes
(um funcionario informa uma notificacao a um estudante). */
/* Estrutura: cada tupla possui os seguintes atributos:
'fk_Funcionarios_fk_Usuarios_CPF' do tipo VARCHAR(11) (chave estrangeira p/ Funcionarios),
'fk_Notificacoes' do tipo INT (chave estrangeira p/ Notificacoes) e
'fk_Estudante_CPF' do tipo VARCHAR(11) (chave estrangeira p/ Estudante). */

CREATE TABLE Informa_Funcionarios_Notificacoes_Estudante (
    fk_Funcionarios_fk_Usuarios_CPF VARCHAR (11),
    fk_Notificacoes_Id INT,
    fk_Estudante_CPF VARCHAR (11)
) DEFAULT CHARSET=utf8;

/* Nome da tabela: Informa_Funcionarios_Estudante_Observacoes */
/* Objetivo: armazenar a relacao entre os funcionarios, observacoes e estudantes
(um funcionario informa uma observacao a um estudante). */
/* Estrutura: cada tupla possui os seguintes atributos:
'fk_Funcionarios_fk_Usuarios_CPF' do tipo VARCHAR(11) (chave estrangeira p/ Funcionarios),
'fk_Estudante_CPF' do tipo VARCHAR(11) (chave estrangeira p/ Estudante) e
'fk_Observacoes_Id' do tipo INT (chave estrangeira p/ Observacoes). */

CREATE TABLE Informa_Funcionarios_Estudante_Observacoes (
    fk_Funcionarios_fk_Usuarios_CPF VARCHAR (11),
    fk_Estudante_CPF VARCHAR (11),
    fk_Observacoes_Id INT
) DEFAULT CHARSET=utf8;

/* Nome da tabela: Tem */
/* Objetivo: armazenar a relacao entre os contratos e os modulos pertencentes a cada um. */
/* Estrutura: cada tupla possui os seguintes atributos:
'fk_Contrato_Id' do tipo INT (chave estrangeira p/ Contrato) e
'fk_Modulos_Id' do tipo INT (chave estrangeira p/ Modulos). */

CREATE TABLE Tem (
    fk_Contrato_Id INT,
    fk_Modulos_Id INT
) DEFAULT CHARSET=utf8;

/* Nome da tabela: Possui */
/* Objetivo: armazenar a relacao entre os estudantes e seus responsaveis. */
/* Estrutura: cada tupla possui os seguintes atributos:
'fk_Estudante_CPF' do tipo VARCHAR(11) (chave estrangeira p/ Estudante) e
'fk_Responsaveis_CPF do tipo VARCHAR(11) (chave estrangeira p/ Responsaveis). */

CREATE TABLE Possui (
    fk_Estudante_CPF VARCHAR (11),
    fk_Responsaveis_CPF VARCHAR (11)
) DEFAULT CHARSET=utf8;

ALTER TABLE Filial
  MODIFY Filial_PK int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=0;

ALTER TABLE Escola
  MODIFY Id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=0;

ALTER TABLE Contrato
  MODIFY Id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=0;

ALTER TABLE Disciplina
  MODIFY Id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=0;

ALTER TABLE Curso
  MODIFY Id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=0;

ALTER TABLE Notificacoes
  MODIFY Id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=0;

ALTER TABLE Justificativas
  MODIFY Id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=0;

ALTER TABLE Presenca
  MODIFY Id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=0;

ALTER TABLE Observacoes
  MODIFY Id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=0;

ALTER TABLE Modulos
  MODIFY Id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=0;
  
ALTER TABLE Chamadas
  MODIFY Id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=0;

ALTER TABLE Presenca ADD CONSTRAINT FK_Presenca_3 
    FOREIGN KEY (Tipo) 
    REFERENCES Chamadas(Id) 
    ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE Escola ADD CONSTRAINT FK_Escola_2
    FOREIGN KEY (fk_Filial_Filial_PK)
    REFERENCES Filial (Filial_PK)
    ON DELETE NO ACTION;

ALTER TABLE Contrato ADD CONSTRAINT FK_Contrato_2
    FOREIGN KEY (fk_Escola_Id)
    REFERENCES Escola (Id)
    ON DELETE RESTRICT;

ALTER TABLE Funcionarios ADD CONSTRAINT FK_Funcionarios_2
    FOREIGN KEY (fk_Usuarios_CPF)
    REFERENCES Usuarios (CPF)
    ON DELETE CASCADE;

ALTER TABLE Professores ADD CONSTRAINT FK_Professores_2
    FOREIGN KEY (fk_Usuarios_CPF)
    REFERENCES Usuarios (CPF)
    ON DELETE CASCADE;

ALTER TABLE Justificativas ADD CONSTRAINT FK_Justificativas_2
    FOREIGN KEY (fk_Presenca_Id)
    REFERENCES Presenca (Id)
    ON DELETE CASCADE;

ALTER TABLE Usuarios ADD CONSTRAINT FK_Usuarios_2
    FOREIGN KEY (fk_Escola_Id)
    REFERENCES Escola (Id)
    ON DELETE RESTRICT;

ALTER TABLE Presenca ADD CONSTRAINT FK_Presenca_2
    FOREIGN KEY (fk_Estudante_CPF)
    REFERENCES Estudante (CPF)
    ON DELETE CASCADE;

ALTER TABLE Inscricao_inscrito ADD CONSTRAINT FK_Inscricao_inscrito_1
    FOREIGN KEY (fk_Professores_fk_Usuarios_CPF)
    REFERENCES Professores (fk_Usuarios_CPF)
    ON DELETE CASCADE;

ALTER TABLE Inscricao_inscrito ADD CONSTRAINT FK_Inscricao_inscrito_2
    FOREIGN KEY (fk_Estudante_CPF)
    REFERENCES Estudante (CPF)
    ON DELETE CASCADE;

ALTER TABLE Inscricao_inscrito ADD CONSTRAINT FK_Inscricao_inscrito_3
    FOREIGN KEY (fk_Disciplina_Id)
    REFERENCES Disciplina (Id)
    ON DELETE CASCADE;

ALTER TABLE Lecionam ADD CONSTRAINT FK_Lecionam_1
    FOREIGN KEY (fk_Disciplina_Id)
    REFERENCES Disciplina (Id)
    ON DELETE SET NULL;

ALTER TABLE Lecionam ADD CONSTRAINT FK_Lecionam_2
    FOREIGN KEY (fk_Professores_fk_Usuarios_CPF)
    REFERENCES Professores (fk_Usuarios_CPF)
    ON DELETE SET NULL;

ALTER TABLE Contem ADD CONSTRAINT FK_Contem_1
    FOREIGN KEY (fk_Curso_Id)
    REFERENCES Curso (Id)
    ON DELETE CASCADE;

ALTER TABLE Contem ADD CONSTRAINT FK_Contem_2
    FOREIGN KEY (fk_Disciplina_Id)
    REFERENCES Disciplina (Id)
    ON DELETE CASCADE;

ALTER TABLE Pertence ADD CONSTRAINT FK_Pertence_1
    FOREIGN KEY (fk_Curso_Id)
    REFERENCES Curso (Id)
    ON DELETE CASCADE;

ALTER TABLE Pertence ADD CONSTRAINT FK_Pertence_2
    FOREIGN KEY (fk_Estudante_CPF)
    REFERENCES Estudante (CPF)
    ON DELETE CASCADE;

ALTER TABLE Informa_Funcionarios_Notificacoes_Estudante ADD CONSTRAINT FK_Informa_Funcionarios_Notificacoes_Estudante_1
    FOREIGN KEY (fk_Funcionarios_fk_Usuarios_CPF)
    REFERENCES Funcionarios (fk_Usuarios_CPF)
    ON DELETE CASCADE;

ALTER TABLE Informa_Funcionarios_Notificacoes_Estudante ADD CONSTRAINT FK_Informa_Funcionarios_Notificacoes_Estudante_2
    FOREIGN KEY (fk_Notificacoes_Id)
    REFERENCES Notificacoes (Id)
    ON DELETE NO ACTION;

ALTER TABLE Informa_Funcionarios_Notificacoes_Estudante ADD CONSTRAINT FK_Informa_Funcionarios_Notificacoes_Estudante_3
    FOREIGN KEY (fk_Estudante_CPF)
    REFERENCES Estudante (CPF)
    ON DELETE CASCADE;

ALTER TABLE Informa_Funcionarios_Estudante_Observacoes ADD CONSTRAINT FK_Informa_Funcionarios_Estudante_Observacoes_1
    FOREIGN KEY (fk_Funcionarios_fk_Usuarios_CPF)
    REFERENCES Funcionarios (fk_Usuarios_CPF)
    ON DELETE CASCADE;

ALTER TABLE Informa_Funcionarios_Estudante_Observacoes ADD CONSTRAINT FK_Informa_Funcionarios_Estudante_Observacoes_2
    FOREIGN KEY (fk_Estudante_CPF)
    REFERENCES Estudante (CPF)
    ON DELETE CASCADE;

ALTER TABLE Informa_Funcionarios_Estudante_Observacoes ADD CONSTRAINT FK_Informa_Funcionarios_Estudante_Observacoes_3
    FOREIGN KEY (fk_Observacoes_Id)
    REFERENCES Observacoes (Id)
    ON DELETE NO ACTION;

ALTER TABLE Tem ADD CONSTRAINT FK_Tem_1
    FOREIGN KEY (fk_Contrato_Id)
    REFERENCES Contrato (Id)
    ON DELETE SET NULL;

ALTER TABLE Tem ADD CONSTRAINT FK_Tem_2
    FOREIGN KEY (fk_Modulos_Id)
    REFERENCES Modulos (Id)
    ON DELETE SET NULL;

ALTER TABLE Possui ADD CONSTRAINT FK_Possui_1
    FOREIGN KEY (fk_Estudante_CPF)
    REFERENCES Estudante (CPF)
    ON DELETE CASCADE;

ALTER TABLE Possui ADD CONSTRAINT FK_Possui_2
    FOREIGN KEY (fk_Responsaveis_CPF)
    REFERENCES Responsaveis (CPF)
    ON DELETE RESTRICT;

delimiter //
create trigger aluno_curso_unico before insert on Pertence
for each row
begin
    if (SELECT COUNT(Id) FROM Contrato) <> 0 and NEW.Ano < (select Ano from Pertence where fk_Curso_Id = NEW.fk_Curso_Id and fk_Estudante_CPF = NEW.fk_Estudante_CPF) then
        signal sqlstate '45000';
    end if;
end;//
delimiter ;

delimiter //
create trigger contrato_unico before insert on Contrato
for each row
begin
    if (SELECT COUNT(Id) FROM Contrato) <> 0 AND NEW.Data_Inicial < (select Data_Final from Contrato where fk_Escola_Id = NEW.fk_Escola_Id) then
        signal sqlstate '45000';
    end if;
end;//
delimiter ;
