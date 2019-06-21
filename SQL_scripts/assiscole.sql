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

    Script de Inserção
*/

DELETE FROM Possui;
DELETE FROM Tem;
DELETE FROM Informa_Funcionarios_Estudante_Observacoes;
DELETE FROM Informa_Funcionarios_Notificacoes_Estudante;
DELETE FROM Observacoes;
DELETE FROM Pertence;
DELETE FROM Contem;
DELETE FROM Lecionam;
DELETE FROM Inscricao_inscrito;
DELETE FROM Justificativas;
DELETE FROM Disciplina;
DELETE FROM Responsaveis;
DELETE FROM Modulos;
DELETE FROM Presenca;
DELETE FROM Professores;
DELETE FROM Funcionarios;
DELETE FROM Usuarios;
DELETE FROM Notificacoes;
DELETE FROM Curso;
DELETE FROM Contrato;
DELETE FROM Escola;
DELETE FROM Filial;
DELETE FROM Estudante;
DELETE FROM Chamadas;

ALTER TABLE Escola AUTO_INCREMENT=0;
ALTER TABLE Contrato AUTO_INCREMENT=0;
ALTER TABLE Disciplina AUTO_INCREMENT=0;
ALTER TABLE Curso AUTO_INCREMENT=0;
ALTER TABLE Notificacoes AUTO_INCREMENT=0;
ALTER TABLE Justificativas  AUTO_INCREMENT=0;
ALTER TABLE Presenca AUTO_INCREMENT=0;
ALTER TABLE Observacoes AUTO_INCREMENT=0;
ALTER TABLE Modulos AUTO_INCREMENT=0;
ALTER TABLE Chamadas AUTO_INCREMENT=0;

/* Nome da tabela: Chamadas */
/* Estrutura:
'Id' do tipo INT(11) (chave primária),
'Nome' não nulo do tipo VARCHAR(30) e
'Alias' não nulo do tipo VARCHAR(30). */

INSERT INTO Chamadas (Id, Nome, Alias) VALUES
(1, 'Ausencia', 'Aus'),
(2, 'Retardo', 'Ret');

/* Nome da tabela: Estudante */
/* Estrutura:
'Nome' não nulo do tipo VARCHAR(40),
'CPF' do tipo VARCHAR(11) (chave primária) e
'Ativo' não nulo do tipo INT(2) com valor padrão igual a '1'.
  1 = ativo
  0 = inativo
*/

INSERT INTO Estudante (Nome, CPF, Ativo) VALUES
('JIMENEZ RODRIGUEZ', '12345670110', 1),
('ALVAREZ  ORTEGA', '12345670210', 1),
('JIMENEZ SEPULVEDA', '12345670410', 1),
('DASDASDASDQWE PEPITO', '12345670510', 1),
('PEREZ PEREZ', '12345670610', 1),
('LANCHEROS YAYA', '12345670710', 1),
('CELY ALTUZARRA', '12345670810', 1),
('GORDILLO ESPINOSA', '12345670910', 1),
('SIQUEIRA RIBEIRO', '12345671110', 1),
('SIQUEIRA RIBEIRO', '12345671210', 1),
('JIMENEZ SEPULVEDA', '12345671310', 1),
('NIÑO RODRIGUEZ', '12345671410', 1),
('ROMERO MELO', '12345671510', 1),
('TORRES TORRES', '12345671610', 1),
('SEPULVEDA AGUDELO', '12345671710', 1),
('ANDRADE RODRIGUEZ', '12345671810', 1),
('CIFUENTES PARRA', '12345671910', 1),
('LEAL ALVAREZ', '12345672010', 1),
('TAMAYO GARZON', '12345672110', 1),
('CHAPARRO NARVÁEZ', '12345672210', 1),
('PEREZ AVENDAÑO', '12345672310', 1),
('SANCHEZ JAVIER', '12345672410', 1),
('RUIZ NICOLAS', '12345672510', 1),
('PAEZ RAMIREZ', '12345672610', 1),
('ORTIZ MIGUEL', '12345672710', 1),
('MANTILLA JUAN', '12345672810', 1),
('JEREZ MARIA', '12345672910', 1),
('BORBON SOFIA', '12345673010', 1),
('GALINDO AURA', '12345673110', 1),
('GÓMEZ JIMÉNEZ', '12345673210', 1),
('GIRON CARLOS', '12345673310', 1),
('SARRIA ANA', '12345673410', 1),
('CERON CESAR', '12345673510', 1),
('PERAFAN MARIA', '12345673610', 1),
('OME GALLO', '12345673710', 1),
('BEDOYA SANTIAGO', '12345673810', 1),
('GIL BERMEO', '12345673910', 1),
('GUTIERREZ YENITH', '12345674010', 1),
('HERRERA ADOLFO', '12345674110', 1),
('SUAREZ JOSHUA', '12345674210', 1),
('ECHEVERRY CARLOS', '12345674310', 1),
('SUAREZ HERNAN', '12345674410', 1),
('AVILA DIEGO', '12345674510', 1),
('ESTUPIÑAN DAIRA', '12345674610', 1),
('BORDA JAVIER', '12345674710', 1),
('RODRIGUEZ OMAR', '12345674810', 1),
('ROMERO SARA', '12345674910', 1),
('CORTES MARIA', '12345675010', 1),
('PARRADO QUEVEDO', '12345675110', 1),
('JIMENEZ DANIEL', '12345675210', 1),
('RIAÑO ANDRES', '12345675710', 1),
('LASSO RIVERA', '12345675810', 1),
('GOMEZ ROMAN', '12345675910', 1),
('CRUZ TANIA', '12345676010', 1),
('RIAÑO CARUSSO', '12345676110', 1),
('GUERRA LUCIA', '12345676210', 1),
('RAMIREZ ADRIANA', '12345676310', 1),
('VAENZUELA JANETH', '12345676410', 1),
('ALBARRACIN VALERY', '12345676510', 1),
('PEREZ PEPITO', '12345676610', 1),
('JIMÉNEZ SANDRA', '12345676710', 1),
('GOMEZ CRUZ', '12345676810', 1),
('JIMENEZ EDINSON', '12345676910', 1),
('GARAVITO JULIO', '12345677010', 1),
('FILOSOFO HECTOR', '12345677110', 1),
('ZAMBRANO NESTOR', '12345677210', 1),
('SEPULVEDA LILIANA', '12345677810', 1),
('ARIAS ACERO', '12345677910', 1),
('ARIAS ACERO', '12345678010', 1),
('PEDRAZA CASTILLO', '12345678110', 1),
('JIMENEZ DANIEL', '12345678210', 1),
('ESCARRIA APOLINAR', '12345678310', 1),
('JIMENEZ RODRIGUEZ', '12345678410', 1),
('JIMENEZ SEPULVEDA', '12345678510', 1),
('JIMENEZ DANIEL', '12345678810', 1),
('CASTIBLANCO VALENTINA', '12345679110', 1),
('REYES JUAN', '12345679210', 1),
('PADILLA DAVID', '12345679310', 1),
('JIMÉNEZ SEPULVEDA', '12345679410', 1),
('GRANADOS ISABELLA', '12345679510', 1),
('ESCANDON MARROQUIN', '12345679610', 1),
('ALARCON MAURICIO', '12345679710', 1),
('DIAZ PIZA', '12345679810', 1),
('GALAN SEBASTIAN', '12345679910', 0);

/* Nome da tabela: Filial */
/* Estrutura:
'Filial_PK' do tipo INT (chave primária) e
'Filial' não nulo do tipo VARCHAR(40) (nome da filial). */

INSERT INTO Filial (Filial_PK, Filial) VALUES
(1, 'Novo Leblon'),
(2, 'Leblon'),
(3, 'Alfabarra');

/* Nome da tabela: Escola */
/* Estrutura:
'Id' do tipo int (chave primária),
'fk_Filial_Filial_PK' do tipo INT (chave estrangeira p/ Filial),
'Nome' não nulo do tipo VARCHAR(40),
'Endereco' não nulo do tipo VARCHAR(40) e
'Telefone' não nulo do tipo VARCHAR(15). */

INSERT INTO Escola (Id, fk_Filial_Filial_PK, Nome, Endereco, Telefone) VALUES
(1, 3, 'PH', 'endereço 1', '12345601'),
(2, 1, 'Santo Agostinho', 'endereço 2', '12345602');

/* Nome da tabela: Contrato */
/* Estrutura:
'Id' do tipo INT (chave primária),
'Data_Final' não nulo do tipo DATE,
'Data_Inicial' não nulo do tipo DATE,
'fk_Escola_Id do tipo INT (chave estrangeira p/ Escola) e
'Valor' não nulo do tipo INT. */

INSERT INTO Contrato (Id,fk_Escola_Id, Valor, Data_Inicial, Data_Final) VALUES
(1, 1, 1001, STR_TO_DATE('2019-01-01','%Y-%m-%d'), STR_TO_DATE('2019-12-31','%Y-%m-%d')),
(2, 2, 1002, STR_TO_DATE('2018-11-24','%Y-%m-%d'), STR_TO_DATE('2019-11-29','%Y-%m-%d'));

/* Nome da tabela: Curso */
/* Estrutura:
'Id' do tipo INT (chave primária),
'Nome' não nulo do tipo VARCHAR(40) e
'fk_Escola_Id' não nulo do tipo INT (chave estrangeira p/ Escola). */

INSERT INTO Curso (Id, Nome, fk_Escola_Id) VALUES
(1, '101', 1),
(2, '201', 1),
(3, '1010', 2),
(4, '301', 1),
(5, '401', 1),
(6, '302', 1),
(7, '1101', 2),
(8, '901', 1),
(9, '1001', 2);

/* Nome da tabela: Notificacoes */
/* Estrutura:
'Mensagem' do tipo VARCHAR(200),
'Id' do tipo INT (chave primária) e
'Data' não nulo do tipo DATETIME. */

INSERT INTO Notificacoes (Id, Mensagem, Data) VALUES
(1, 'este es el primer mensaje de prueba', STR_TO_DATE('2017-07-12 21:53:11','%Y-%m-%d %H:%i:%s')),
(2, 'Este es el segundo mensaje de prueba', STR_TO_DATE('2017-07-12 21:53:59','%Y-%m-%d %H:%i:%s')),
(3, 'este es el cuarto mensaje de prueba', STR_TO_DATE('2017-07-12 21:56:26','%Y-%m-%d %H:%i:%s')),
(4, 'este es el cuarto mensaje de prueba', STR_TO_DATE('2017-07-12 21:56:26','%Y-%m-%d %H:%i:%s')),
(5, 'se informa que mañana no hay clase por falta de agua', STR_TO_DATE('2017-08-17 11:55:26','%Y-%m-%d %H:%i:%s')),
(6, 'Revisa en portería. Desde ayer te endulzaron el día y no te han informado.', STR_TO_DATE('2017-09-23 12:38:04','%Y-%m-%d %H:%i:%s')),
(7, 'Revisa en portería. Desde ayer 22/09/17  te endulzaron el día y no te han informado.', STR_TO_DATE('2017-09-23 12:42:27','%Y-%m-%d %H:%i:%s')),
(8, 'Confirmado cita con padre de familia', STR_TO_DATE('2018-01-18 13:48:12','%Y-%m-%d %H:%i:%s')),
(9, 'feliz cumpleaños', STR_TO_DATE('2018-02-06 10:32:42','%Y-%m-%d %H:%i:%s')),
(10, 'este es un mensaje de prueba', STR_TO_DATE('2018-02-06 17:52:52','%Y-%m-%d %H:%i:%s')),
(11, 'señor padre de familia favor acercarse al colegio. su hijo esta enfermo', STR_TO_DATE('2018-02-20 16:28:42','%Y-%m-%d %H:%i:%s')),
(12, 'señor padre de familia favor se acerca al colegio. Su niña esta enferma. Con Coordinador de convivencia', STR_TO_DATE('2018-04-26 11:07:27','%Y-%m-%d %H:%i:%s')),
(13, 'Señor padre de familia favor acercarse al colegio. Su hijo esta enfermo', STR_TO_DATE('2018-04-26 12:05:38','%Y-%m-%d %H:%i:%s')),
(14, 'Señor padre de familia favor acercarse al colegio, su niña se enfermo', STR_TO_DATE('2018-05-07 15:43:14','%Y-%m-%d %H:%i:%s')),
(17, 'Se informa que el estudiante se ausento a las 10am. Favor comunicarse con convivencia', STR_TO_DATE('2018-05-09 15:00:58','%Y-%m-%d %H:%i:%s')),
(18, 'senor padre de familia favor comunicarse con el colegio. su hijo lo requiere', STR_TO_DATE('2018-05-10 08:04:50','%Y-%m-%d %H:%i:%s')),
(19, 'SEÑOR PADRE DE FAMILIA FAVOR ACERCARSE AL COLEGIO SU HIJO SE ENFERMO', STR_TO_DATE('2018-05-30 15:17:29','%Y-%m-%d %H:%i:%s')),
(20, 'señor padre de familia favor acercarse al colegio', STR_TO_DATE('2018-07-05 13:14:43','%Y-%m-%d %H:%i:%s')),
(21, 'favor presentar al colegio su nina se enfermo', STR_TO_DATE('2018-07-09 09:34:16','%Y-%m-%d %H:%i:%s')),
(22, 'Su hijo esta enfermo y debe presentarse urgentemente al colegio', STR_TO_DATE('2018-07-09 12:38:51','%Y-%m-%d %H:%i:%s')),
(23, 'notificacionGruposnotificacionGruposnotificacionGruposnotificacionGrupos', STR_TO_DATE('2018-07-27 02:15:04','%Y-%m-%d %H:%i:%s')),
(24, 'Senor padre de familia favor acercarse al colegio. Su hijo se enfermo', STR_TO_DATE('2018-08-01 11:11:58','%Y-%m-%d %H:%i:%s')),
(25, 'SU HIJA ES BRILLANTE', STR_TO_DATE('2018-08-09 13:56:22','%Y-%m-%d %H:%i:%s')),
(28, 'señor padre de familia favor acercarse al colegio su hijo se enfermo', STR_TO_DATE('2018-08-14 11:25:48','%Y-%m-%d %H:%i:%s')),
(29, 'SEÑOR PADRE DE FAMILIA SU HIJO ESTA ENFERMO POR FAVOR RECOGERLO', STR_TO_DATE('2018-08-16 09:31:38','%Y-%m-%d %H:%i:%s')),
(30, 'señor padre de familia favor acercarse al colegio. Su hijo se enfermo', STR_TO_DATE('2018-08-16 11:58:21','%Y-%m-%d %H:%i:%s')),
(37, 'Felicidades.', STR_TO_DATE('2018-08-28 11:36:13','%Y-%m-%d %H:%i:%s')),
(38, 'El miercoles 13 de septiembre no hay actividad académica', STR_TO_DATE('2018-09-06 10:55:19','%Y-%m-%d %H:%i:%s')),
(39, 'señor padre de familia favor acercarse su hija se enfermo', STR_TO_DATE('2018-09-11 12:05:31','%Y-%m-%d %H:%i:%s')),
(40, 'Señor padre de familia favor acercarse. su hija se enfermo', STR_TO_DATE('2018-09-26 12:21:21','%Y-%m-%d %H:%i:%s')),
(41, 'señor padre de familia acerquese a coordinacion urgentemente', STR_TO_DATE('2018-09-26 12:52:01','%Y-%m-%d %H:%i:%s')),
(42, 'se cita acudiente para el proximo lunes 15 de octubre 10:00 am\nCoordinación Gimnasio Obregon', STR_TO_DATE('2018-10-04 11:03:34','%Y-%m-%d %H:%i:%s')),
(43, 'mensaje de prueba de operador enviado a las 16:51', STR_TO_DATE('2018-10-11 16:51:20','%Y-%m-%d %H:%i:%s')),
(44, 'mensaje de prueba a las 2.31', STR_TO_DATE('2018-10-12 14:31:44','%Y-%m-%d %H:%i:%s')),
(45, 'Podemos apoyarte para que el uso de la plataforma en su colegio sea un exito? Al ingresar a SIPAF por favor oprima al tiempo Ctrl F5 y actualiza. Ing Luisfer.', STR_TO_DATE('2018-10-29 17:52:15','%Y-%m-%d %H:%i:%s')),
(46, 'señor padre de familia favor acercarse al colegio urgente. su hijo se enfermo', STR_TO_DATE('2018-11-13 13:15:56','%Y-%m-%d %H:%i:%s')),
(47, 'son muy cansones', STR_TO_DATE('2018-11-19 14:00:52','%Y-%m-%d %H:%i:%s')),
(48, 'señor padre de familia acercarse al colegio juan lozano se encuentra enfermo urgente eps', STR_TO_DATE('2019-02-13 09:36:05','%Y-%m-%d %H:%i:%s')),
(49, 'estamos testiando el mensaje', STR_TO_DATE('2019-03-20 11:40:48','%Y-%m-%d %H:%i:%s')),
(50, 'mensaje de prueba 2 con flash', STR_TO_DATE('2019-03-20 11:42:21','%Y-%m-%d %H:%i:%s')),
(51, 'este es un mensaje de test', STR_TO_DATE('2019-05-09 10:02:32','%Y-%m-%d %H:%i:%s')),
(52, 'Sr Coord se instalo la herramienta de auxilio de trasporte seccion reportes. Favor actualizar con F5 antes de enviar mensajes. En la espera de sus comentarios', STR_TO_DATE('2019-05-09 12:20:39','%Y-%m-%d %H:%i:%s')),
(53, 'señor padre de familia su hija se enfermo. favor acercarse urgente', STR_TO_DATE('2019-05-21 19:49:07','%Y-%m-%d %H:%i:%s')),
(54, 'señor padre su hijo se enfermo', STR_TO_DATE('2019-05-23 15:35:40','%Y-%m-%d %H:%i:%s')),
(55, 'señor padre de familia su hijo se enfermo. favor acercarse', STR_TO_DATE('2019-05-28 11:03:19','%Y-%m-%d %H:%i:%s')),
(56, 'SENOR PADRE DE FAMILIA FAVOR ACERCARSE AL COLEGIO', STR_TO_DATE('2019-06-04 11:49:17','%Y-%m-%d %H:%i:%s'));

/* Nome da tabela: Usuarios */
/* Estrutura:
'CPF' do tipo VARCHAR(11) (chave primária),
'Nome' não nulo do tipo VARCHAR(40),
'Telefone' não nulo do tipo VARCHAR(15),
'Usuario' não nulo do tipo VARCHAR(40),
'Senha' não nulo do tipo VARCHAR(40),
'Ativo' não nulo do tipo INT(2) com valor padrão = '1' e
'fk_Escola_Id' do tipo INT (chave estrangeira p/ Escola). */

INSERT INTO Usuarios (CPF, Usuario, Senha, Ativo, fk_Escola_Id, Nome, Telefone) VALUES
('12345678911', '1', '1', 1, 1, 'DanielAdmin', 11234501),
('22345678910', '2', '2', 1, 1, 'DemoColegio', 11234502),
('32345678910', '3', '3', 1, 1, 'LuisFernando', 11234503),
('42345678910', '4', '4', 1, 2, 'YennyGuerrero', 11234504),
('52345678910', '5', '5', 1, 2, 'DianaMarcelaBalcazar', 11234505),
('62345678910', '6', '6', 1, 2, 'DemoLozano', 11234506),
('72345678910', '7', '7', 1, 2, 'YanethCastillo', 11234507),
('12345678910', '10', '10', 1, 2, 'DemoToscana', 11234510);

/* Nome da tabela: Funcionarios */
/* Estrutura:
'fk_Usuarios_CPF' do tipo VARCHAR(11) (chave primária e chave estrangeira p/ Usuarios). */

INSERT INTO Funcionarios (fk_Usuarios_CPF) VALUES
('12345678911'),
('22345678910'),
('12345678910');

/* Nome da tabela: Professores */
/* Estrutura: cada tupla possui os seguintes atributos:
'fk_Usuarios_CPF' do tipo VARCHAR(11) (chave primária e chave estrangeira p/ Usuarios). */

INSERT INTO Professores (fk_Usuarios_CPF) VALUES
('32345678910'),
('42345678910'),
('52345678910'),
('62345678910'),
('72345678910');

/* Nome da tabela: Presenca */
/* Estrutura:
'Tipo' do tipo INT(11),
'Dia' não nulo do tipo DATE,
'Id' do tipo INT (chave primária) e
'fk_Estudante_CPF' do tipo VARCHAR(11) (chave estrangeira p/ Estudante). */

INSERT INTO Presenca (Id, fk_Estudante_CPF, Tipo, Dia) VALUES
(1, '12345670410', 1, STR_TO_DATE('2018-07-09','%Y-%m-%d')),
(2, '12345670610', 2, STR_TO_DATE('2018-01-14','%Y-%m-%d')),
(3, '12345670710', 2, STR_TO_DATE('2018-01-14','%Y-%m-%d')),
(4, '12345670810', 1, STR_TO_DATE('2018-01-14','%Y-%m-%d')),
(5, '12345670910', 2, STR_TO_DATE('2018-01-14','%Y-%m-%d')),
(6, '12345671710', 1, STR_TO_DATE('2018-01-14','%Y-%m-%d')),
(7, '12345671810', 2, STR_TO_DATE('2018-01-14','%Y-%m-%d')),
(10, '12345670410', 2, STR_TO_DATE('2018-01-14','%Y-%m-%d')),
(11, '12345671910', 2, STR_TO_DATE('2018-01-14','%Y-%m-%d')),
(12, '12345671810', 1, STR_TO_DATE('2018-01-14','%Y-%m-%d'));

/* Nome da tabela: Modulos */
/* Estrutura:
'Id' do tipo INT (chave primária),
'Nome' não nulo do tipo VARCHAR(40) e
'Descricao' do tipo VARCHAR(200). */

INSERT INTO Modulos (Id, Nome, Descricao) VALUES
(1, 'Modulo 1', 'Minha descrição do modulo 1'),
(2, 'Modulo 2', 'Minha descrição do modulo 2'),
(3, 'Modulo 3', 'Minha descrição do modulo 3'),
(4, 'Modulo 4', 'Minha descrição do modulo 4');

/* Nome da tabela: Responsaveis */
/* Estrutura:
'Nome' não nulo do tipo VARCHAR(40),
'CPF' do tipo VARCHAR(11) (chave primária) e
'Telefone' não nulo do tipo VARCHAR(15). */

INSERT INTO Responsaveis (CPF, Nome, Telefone) VALUES
('22345671943', 'Daniel Fernadno', '30065131'),
('22345673943', 'pepito papa', '51317012'),
('22345674943', 'jose anibal', '64210963'),
('22345675943', 'jose vicente', '30021102'),
('22345676943', 'Esperanza Ramos', '31087524'),
('22345677943', 'LUIS FERNANDO', '23408181'),
('22345678943', 'jonas siqueira', '31923408'),
('22345671043', 'daniel jimenez', '31923408'),
('22345671143', 'juan esteban', '31923408'),
('22345671243', 'daniel eduardo', '31923408'),
('22345671343', 'Alejandro Torres', '31923408'),
('22345671443', 'Jimenez Rodriguez', '65131703'),
('22345671543', 'Rene Jonatan', '73002063'),
('22345671743', 'Sierra Gonzalez', '68962056'),
('22345671843', 'Ivon Maritza', '12340615'),
('22345679143', 'Oscar Leonid', '16627123'),
('22345672043', 'Yaneth Patricia', '328710'),
('22345672143', 'Miryam Lucy', '3102444'),
('22345672243', 'Javier Sanchez', '31323642'),
('22345672343', 'Julio Ciro Ruiz', '3174000'),
('22345672443', 'angela paez', '32129217'),
('22345672543', 'Joselin Ortiz', '31183164'),
('22345672643', 'Judith Gomez', '30063846'),
('22345672743', 'Maria paula Jerez', '3213660'),
('22345672843', 'William Borbon', '31331319'),
('22345672943', 'marleny cstro', '30056006'),
('22345673043', 'Johana Jimenez', '32041533'),
('22345673143', 'Rocio Cuellar', '31056908'),
('22345673243', 'Lucia Esmeral', '31330039'),
('22345673343', 'julio cesar ceron', '3163981'),
('22345673443', 'Sandra Perico', '31864356'),
('22345673543', 'Sandra Gynery Gallo', '3125547'),
('22345673643', 'Francia Pava', '31551042'),
('22345673743', 'Luis Fernando Gil Torres', '14588123'),
('22345673843', 'Luz Marid Villabona', '3108759'),
('22345679343', 'Martha Ruiz', '31737336'),
('22345674043', 'itala Rodriguez', '31025683'),
('22345674143', 'martha perez', '31028576'),
('22345674243', 'Henry Suarez', '31742124'),
('22345674343', 'Rene Avila', '31320651'),
('22345674443', 'MARTHA ELENA FAJARDO', '3118793'),
('22345674543', 'JAVIER BORDA', '31120969'),
('22345674643', 'Olga Pirajan', '31520509'),
('22345674743', 'Francisco Romero', '32083374'),
('12345674843', 'Alejandro Cortes', '31081546'),
('22345679443', 'Henry Patrado', '31320936'),
('12345675043', 'Luis Fernando Jimenez', '3006517'),
('12345675543', 'Mauricio Robayo', '30174494'),
('12345675643', 'CLAUDIA RIVERA', '31258691'),
('12345675743', 'Roman gomez', '31235014'),
('12345675843', 'ERIKA CUIDA', '30021304'),
('12345675934', 'Oscar quintana', '31332119'),
('12345676043', 'MARIA I. PARRA', '3193184'),
('12345676143', 'Manuel Ramirez', '31622161'),
('12345676243', 'Janeth Valenzuela', '31753842'),
('12345676343', 'Yenny Sanchez', '31075706'),
('12345676443', 'Edna Chavez', '31032719'),
('12345676543', 'Sandra Jiménez', '31428774'),
('12345676643', 'GRACIELA WILCHES', '31955474'),
('12345676743', 'Edinson Jimenez', '31033877'),
('12345676843', 'PEDRO GARAVITO', '31159718'),
('12345676943', 'NESTOR ZAMBRANO', '31252187'),
('12345677043', 'DIANA MANOSALVA', '31181650'),
('12345677143', 'LUIS FERN JIMENEZ', '3192341'),
('12345677243', 'LUIS JIMENEZ', '30065131'),
('12345677543', 'DANIEL IMENEZ', '30065131'),
('12345677743', 'SANDRA PATRICIA ACERO', '32131520'),
('12345677943', 'MISAEL PEDRAZA ALVARADO', '3114544'),
('12345678143', 'APOLINAR ESCARRIA', '31020114'),
('12345678243', 'LUIS FERNANDO JIMENEZ', '30065130'),
('12345678643', 'LUIS JIMENEZ', '31923408'),
('12345678843', 'YASBLEIDIN CORTES GUCHUBO', '31923408'),
('12345678943', 'JHOHANA GARZON', '31030046'),
('12345679043', 'MARIO REYES', '31747050'),
('12345679143', 'RICARDO PADILLA', '31126482'),
('12345679243', 'LUIS JIMENEZ', '30065131'),
('12345679343', 'DAVID GRANADOS', '31061808'),
('12345679443', 'ZORAIDA MARROQUIN', '32121495'),
('12345679543', 'ELSA GUERRERO', '31586937'),
('12345679643', 'ALEXANDRA PIZA', '30056170'),
('12345679743', 'JHON ALEJO', '31839825');

/* Nome da tabela: Disciplina */
/* Estrutura:
'Id' do tipo INT (chave primária) e
'Nome' não nulo do tipo VARCHAR(40). */

INSERT INTO Disciplina (Id, Nome) VALUES
(1, 'Matemática'),
(2, 'História'),
(3, 'Geografia'),
(4, 'Biologia'),
(5, 'Química'),
(6, 'Física'),
(7, 'Português'),
(8, 'Inglês'),
(9, 'Informática');

/* Nome da tabela: Justificativas */
/* Estrutura:
'Texto' do tipo VARCHAR(200),
'Id' do tipo INT (chave primária) e
'fk_Presenca_Id' do tipo INT (chave estrangeira p/ Presenca). */

INSERT INTO Justificativas (Texto, Id, fk_Presenca_Id) VALUES
('Perdeu o onibus', 1, 1),
('Acidente de carro', 2, 4),
('Transito', 3, 6),
('Pais se responsabilizaram', 4, 12);

/* Nome da tabela: Inscricao_inscrito */
/* Estrutura:
'Nota' não nulo do tipo DOUBLE,
'Situacao' não nulo do tipo VARCHAR(40),
'fk_Professores_fk_Usuarios_CPF' do tipo VARCHAR(11) (chave estrangeira p/ Professores),
'fk_Estudante_CPF' do tipo VARCHAR(11) (chave estrangeira p/ Estudante) e
'fk_Disciplina_Id do tipo INT (chave estrangeira p/ Disciplina). */

INSERT INTO Inscricao_inscrito (Nota, Situacao, fk_Professores_fk_Usuarios_CPF, fk_Estudante_CPF, fk_Disciplina_Id) VALUES
(5.5, 'Reprovado', '52345678910', '12345670210', 3),
(6.5, 'Reprovado', '52345678910', '12345670210', 4),
(6, 'Reprovado', '52345678910', '12345670210', 5),
(7, 'Aprovado', '52345678910', '12345670210', 1),
(8.5, 'Aprovado', '52345678910', '12345670210', 2),
(8.5, 'Aprovado', '52345678910', '12345677010', 3),
(6.5, 'Reprovado', '52345678910', '12345677010', 4),
(10, 'Aprovado', '52345678910', '12345677010', 5),
(8, 'Aprovado', '52345678910', '12345677010', 1),
(8.5, 'Aprovado', '52345678910', '12345677010', 2),
(10, 'Aprovado', '52345678910', '12345672310', 3),
(9, 'Aprovado', '52345678910', '12345672310', 4),
(10, 'Aprovado', '52345678910', '12345672310', 5),
(9.5, 'Aprovado', '52345678910', '12345672310', 1),
(9.5, 'Aprovado', '52345678910', '12345672310', 2);

/* Nome da tabela: Lecionam */
/* Estrutura:
'fk_Disciplina_Id' do tipo INT (chave primária) e
'fk_Professores_fk_Usuarios_CPF' do tipo VARCHAR(11) (chave estrangeira p/ Professores). */

INSERT INTO Lecionam (fk_Disciplina_Id, fk_Professores_fk_Usuarios_CPF) VALUES
(1, '52345678910'),
(2, '52345678910'),
(3, '52345678910'),
(4, '52345678910'),
(5, '52345678910'),
(6, '62345678910'),
(7, '42345678910'),
(8, '32345678910'),
(9, '72345678910');

/* Nome da tabela: Contem */
/* Estrutura:
'fk_Curso_Id' do tipo INT (chave estrangeira p/ Curso) e
'fk_Disciplina_Id' do tipo INT (chave estrangeira p/ Disciplina). */

INSERT INTO Contem (fk_Curso_Id, fk_Disciplina_Id) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(1, 5),
(1, 6),
(1, 7),
(1, 8),
(1, 9),
(2, 1),
(2, 2),
(2, 3),
(2, 4),
(2, 5),
(2, 6),
(2, 7),
(2, 8),
(2, 9),
(3, 1),
(3, 2),
(3, 3),
(3, 4),
(3, 5),
(3, 6),
(3, 7),
(3, 8),
(3, 9),
(4, 1),
(4, 2),
(4, 3),
(4, 4),
(4, 5),
(4, 6),
(4, 7),
(4, 8),
(4, 9),
(5, 1),
(5, 2),
(5, 3),
(5, 4),
(5, 5),
(5, 6),
(5, 7),
(5, 8),
(5, 9),
(6, 1),
(6, 2),
(6, 3),
(6, 4),
(6, 5),
(6, 6),
(6, 7),
(6, 8),
(6, 9),
(7, 1),
(7, 2),
(7, 3),
(7, 4),
(7, 5),
(7, 6),
(7, 7),
(7, 8),
(7, 9),
(8, 1),
(8, 2),
(8, 3),
(8, 4),
(8, 5),
(8, 6),
(8, 7),
(8, 8),
(8, 9),
(9, 1),
(9, 2),
(9, 3),
(9, 4),
(9, 5),
(9, 6),
(9, 7),
(9, 8),
(9, 9);

/* Nome da tabela: Pertence */
/* Estrutura:
'fk_Curso_Id' do tipo INT (chave estrangeira p/ Curso),
'fk_Estudante_CPF' do tipo VARCHAR(11) (chave estrangeira p/ Estudante) e
'Ano' do tipo INT. */

INSERT INTO Pertence (fk_Curso_Id, fk_Estudante_CPF, Ano) VALUES
(1, '12345670210', 2019),
(1, '12345670410', 2019),
(1, '12345670610', 2019),
(2, '12345670710', 2019),
(2, '12345670810', 2019),
(3, '12345670910', 2019),
(3, '12345671710', 2019),
(4, '12345671810', 2019),
(4, '12345674510', 2019),
(5, '12345672910', 2019),
(5, '12345671910', 2019),
(6, '12345673410', 2019),
(6, '12345678110', 2019),
(7, '12345678210', 2019),
(7, '12345678310', 2019),
(8, '12345678410', 2019),
(8, '12345678510', 2019),
(9, '12345678810', 2019),
(9, '12345679110', 2019),
(2, '12345679210', 2019),
(3, '12345679310', 2019),
(4, '12345679410', 2019),
(5, '12345679510', 2019),
(6, '12345679610', 2019),
(7, '12345679710', 2019),
(8, '12345679810', 2019),
(9, '12345679910', 2019);

/* Nome da tabela: Observacoes */
/* Estrutura:
'Id' do tipo INT (chave primária),
'Observacao' não nulo do tipo VARCHAR(200) e
'Acordo' não nulo do tipo VARCHAR(200). */

INSERT INTO Observacoes (Id, Observacao, Acordo) VALUES
(1, 'O seu filho se envolveu em uma briga', 'Frequentar sessões com o psicologo da escola'),
(2, 'O seu filho atrapalhou o andamento da aula gritando com a professora', 'Próxima ocorrência, os pais da criança serão obrigados a comparecer a coordenação da escola');

/* Nome da tabela: Informa_Funcionarios_Notificacoes_Estudante */
/* Estrutura:
'fk_Funcionarios_fk_Usuarios_CPF' do tipo VARCHAR(11) (chave estrangeira p/ Funcionarios),
'fk_Notificacoes' do tipo INT (chave estrangeira p/ Notificacoes) e
'fk_Estudante_CPF' do tipo VARCHAR(11) (chave estrangeira p/ Estudante). */

INSERT INTO Informa_Funcionarios_Notificacoes_Estudante (fk_Funcionarios_fk_Usuarios_CPF, fk_Notificacoes_Id, fk_Estudante_CPF) VALUES
('12345678911', 1, '12345670210'),
('22345678910', 2, '12345670410'),
('12345678910', 3, '12345670610'),
('12345678911', 4, '12345670710'),
('22345678910', 5, '12345670810'),
('12345678910', 6, '12345670910'),
('12345678911', 7, '12345671710'),
('22345678910', 8, '12345671810'),
('12345678910', 9, '12345670410'),
('12345678911', 10, '12345671810'),
('22345678910', 11, '12345671910'),
('12345678910', 12, '12345679310');

/* Nome da tabela: Informa_Funcionarios_Estudante_Observacoes */
/* Estrutura:
'fk_Funcionarios_fk_Usuarios_CPF' do tipo VARCHAR(11) (chave estrangeira p/ Funcionarios),
'fk_Estudante_CPF' do tipo VARCHAR(11) (chave estrangeira p/ Estudante) e
'fk_Observacoes_Id' do tipo INT (chave estrangeira p/ Observacoes). */

INSERT INTO Informa_Funcionarios_Estudante_Observacoes (fk_Funcionarios_fk_Usuarios_CPF, fk_Estudante_CPF, fk_Observacoes_Id) VALUES
('22345678910', '12345670710', 1),
('12345678910', '12345671810', 2);

/* Nome da tabela: Tem */
/* Estrutura:
'fk_Contrato_Id' do tipo INT (chave estrangeira p/ Contrato) e
'fk_Modulos_Id' do tipo INT (chave estrangeira p/ Modulos). */

INSERT INTO Tem (fk_Contrato_Id, fk_Modulos_Id) VALUES
(1, 1),
(1, 2),
(2, 3),
(2, 4);

/* Nome da tabela: Possui */
/* Estrutura:
'fk_Estudante_CPF' do tipo VARCHAR(11) (chave estrangeira p/ Estudante) e
'fk_Responsaveis_CPF do tipo VARCHAR(11) (chave estrangeira p/ Responsaveis). */

INSERT INTO Possui (fk_Estudante_CPF, fk_Responsaveis_CPF) VALUES
('12345670210', '22345671943'),
('12345670410', '22345673943'),
('12345670610', '22345674943'),
('12345670710', '22345675943'),
('12345670810', '22345676943'),
('12345670910', '22345677943'),
('12345671710', '22345678943'),
('12345671810', '22345671043'),
('12345670410', '22345671143'),
('12345671810', '22345671243'),
('12345671910', '22345671343'),
('12345679310', '22345671443');

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

GRANT SELECT ON estudantes TO professor;
GRANT UPDATE ON estudantes TO professor;
GRANT INSERT ON estudantes TO professor;

GRANT SELECT ON listaPresenca TO professor;
GRANT UPDATE ON listaPresenca TO professor;
GRANT INSERT ON listaPresenca TO professor;

GRANT SELECT ON estudantes TO funcionario;
GRANT UPDATE ON estudantes TO funcionario;
GRANT INSERT ON estudantes TO funcionario;

GRANT SELECT ON responsaveisEstudantes TO funcionario;
GRANT UPDATE ON responsaveisEstudantes TO funcionario;
GRANT INSERT ON responsaveisEstudantes TO funcionario;

GRANT SELECT ON notificacoes2 TO funcionario;
GRANT UPDATE ON notificacoes2 TO funcionario;
GRANT INSERT ON notificacoes2 TO funcionario;

CREATE USER IF NOT EXISTS 'Admin'@'%' IDENTIFIED WITH mysql_native_password;
SET PASSWORD FOR 'Admin'@'%' = PASSWORD('admin');
GRANT ALL PRIVILEGES ON *.* TO 'Admin'@'%';
GRANT ALL PRIVILEGES ON `assiscole`.* TO 'Admin'@'%';

CREATE USER IF NOT EXISTS 'Matheus'@'%' IDENTIFIED WITH mysql_native_password;
SET PASSWORD FOR 'Matheus'@'%' = PASSWORD('matheus');
GRANT SELECT, INSERT, UPDATE ON *.* TO 'Matheus'@'%';
GRANT ALL PRIVILEGES ON `assiscole`.* TO 'Matheus'@'%';

CREATE USER IF NOT EXISTS 'Daniel'@'%' IDENTIFIED WITH mysql_native_password;
SET PASSWORD FOR 'Daniel'@'%' = PASSWORD('colombia');
GRANT SELECT, INSERT, UPDATE, DELETE, FILE ON *.* TO 'Daniel'@'%';
GRANT ALL PRIVILEGES ON `assiscole`.* TO 'Daniel'@'%';

CREATE USER IF NOT EXISTS 'funcionario_01'@'%' IDENTIFIED WITH mysql_native_password;
SET PASSWORD FOR 'funcionario_01'@'%' = PASSWORD('12345');
GRANT USAGE ON *.* TO 'funcionario_01'@'%';
GRANT funcionario TO 'funcionario_01'@'%';

CREATE USER IF NOT EXISTS 'professor_01'@'%' IDENTIFIED WITH mysql_native_password;
SET PASSWORD FOR 'professor_01'@'%' = PASSWORD('12345');
GRANT USAGE ON *.* TO 'professor_01'@'%';
GRANT professor TO 'professor_01'@'%';

/* ALUNOS:                                  DRE:
    1) Matheus Cunha Simões                     117091021
    2) Rodrigo Carvalho de Figueiredo           117053497
    3) Daniel Fernando Jimenez Sepúlveda        117028769
    4) Tomás Bizet de Barros                    116183736
    5) Caio Silva de Freitas                    117032792
    6) Miguel Angelo Santos Bicudo              116033119

    Disciplina: Banco de dados 1
    Turma: 2019.1

    Trabalho Prático 1

    Script de Seleção
*/

-- Escolhe os cursos de uma escola
SELECT c.Id,c.Nome FROM Curso as c left JOIN Pertence as pe ON (c.Id = pe.fk_Curso_Id and pe.Ano = '2019') inner join Escola e on c.fk_Escola_Id = e.Id where e.Id = 1 GROUP BY c.Id ORDER by Id;

-- Escolhe os estudantes de um curso com seus responsaveis, o ultimo dia da chamada e o tipo da chamada
-- Função Group by
SELECT e.CPF as IdEstudante,e.Nome as NomeEstudante,r.*, max(pr.Dia) as Dia, pr.Tipo from Estudante as e left join Possui as po on e.CPF = po.fk_Estudante_CPF left join Responsaveis as r on r.CPF = po.fk_Responsaveis_CPF inner join Pertence as pe on pe.fk_Estudante_CPF = e.CPF and pe.Ano = '2019' left join Presenca as pr on e.CPF = pr.fk_Estudante_CPF where pe.fk_Curso_Id = '1' and e.Ativo = 1 GROUP by e.CPF, e.Nome, pr.Tipo, r.Nome, r.CPF ORDER BY e.Nome asc;

-- Procura um estudante pelo nome e tras seu curso e seu responsavel
SELECT e.CPF as IdEstudiante, e.Nome as NomeEstudante, c.Nome as Curso, co.* FROM Estudante as e inner join Pertence as epc on (epc.fk_Estudante_CPF = e.CPF and epc.Ano = 2019) inner join Curso as c on c.Id = epc.fk_Curso_Id left join Possui as ce on e.CPF = ce.fk_Estudante_CPF left join Responsaveis as co on co.CPF = ce.fk_Responsaveis_CPF WHERE e.Nome LIKE '%sepulveda%' and e.Ativo = 1 group by e.CPF, c.Nome, co.Nome, co.CPF ORDER by e.Nome asc, co.CPF;

-- Traz as observações, notificações e chamadas do aluno procurado pelo RG
-- Função UNION
SELECT "Falla" as Tipo, ae.Tipo as TipoFalla, ae.Dia, ju.Texto, ae.Id as IdFalla from Presenca as ae left join Justificativas as ju on ae.Id = ju.fk_Presenca_Id where ae.fk_Estudante_CPF = '12345670410' Union SELECT "Notificacao", n.Mensagem, n.Data, n.Id, "" from Informa_Funcionarios_Notificacoes_Estudante as ne inner join Notificacoes as n on ne.fk_Notificacoes_Id = n.Id where ne.fk_Estudante_CPF = '12345670410' Union SELECT "Observacion", o.Observacao, "", "", "" from Informa_Funcionarios_Estudante_Observacoes as oe inner join Observacoes as o on oe.fk_Observacoes_Id = o.Id where oe.fk_Estudante_CPF = '12345670410' order by Tipo, Dia desc;

-- Traz os cursos onde existem estudantes com seus repsonsaveis
-- Função EXISTS
SELECT c.Id,c.Nome,COUNT(pe.fk_Curso_Id) AS Estudiantes FROM Curso as c left JOIN Pertence as pe ON (c.Id = pe.fk_Curso_Id and pe.Ano = '2019') left join Possui as po on pe.fk_Estudante_CPF = po.fk_Estudante_CPF left join Responsaveis as r on r.CPF = po.fk_Responsaveis_CPF where EXISTS (SELECT fk_Estudante_CPF FROM Pertence as p WHERE c.Id = p.fk_Curso_Id) GROUP BY c.Id ORDER by Id;

-- Traz todos os estudantes dos cursos especificos
-- Função IN
SELECT e.CPF as IdEstudiante,e.Nome as Estudante,c.* from Estudante as e inner join Possui as ce on e.CPF = ce.fk_Estudante_CPF inner join Responsaveis as c on c.CPF = ce.fk_Responsaveis_CPF inner join Pertence as epc on (e.CPF = epc.fk_Estudante_CPF and epc.Ano = 2019) where epc.fk_Curso_Id in (1,2,6) and e.Ativo = 1 Group by e.CPF, c.Nome, c.CPF ORDER BY Estudante asc, c.CPF;

-- Traz as disciplinas de um professor
SELECT d.Id, d.Nome From Disciplina as d inner join Lecionam as l on d.Id = l.fk_Disciplina_Id inner join Professores as p on p.fk_Usuarios_CPF = l.fk_Professores_fk_Usuarios_CPF where p.fk_Usuarios_CPF = '52345678910';

-- Traz os estudantes numa disciplina
SELECT e.Nome, e.CPF, ii.Nota From Disciplina as d inner join Inscricao_inscrito as ii on d.Id = ii.fk_Disciplina_Id inner join Estudante as e on ii.fk_Estudante_CPF = e.CPF where d.Id = '1';

-- Função que tras todos os alunos que tiveram falta pelas duas razões, pela falta e pelo retraso
-- Função division with Having
SELECT count(*) as Quantidade,e.CPF as IdEstudante, e.Nome as NomeEstudante from Estudante as e inner join (select p1.fk_Estudante_CPF from Presenca as p1 inner join Chamadas as c on p1.Tipo = c.Id GROUP by p1.fk_Estudante_CPF, c.Id) as p2 on e.CPF = p2.fk_Estudante_CPF inner join Pertence as p on e.CPF = p.fk_Estudante_CPF where p.fk_Curso_Id = '1' GROUP by e.CPF HAVING COUNT(*) = (select COUNT(*) from Chamadas);

-- Função que traz o usuario consultado pela senha o o usuario
SELECT s.Usuario, s.Ativo, s.Nome, s.CPF, p.fk_Usuarios_CPF as Professor, f.fk_Usuarios_CPF as Funcionario FROM Usuarios as s left join Funcionarios as f on s.CPF = f.fk_Usuarios_CPF left join Professores as p on s.CPF = p.fk_Usuarios_CPF WHERE s.Usuario = '1' and s.Senha = '1' Limit 1;

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
    if exists ( select * from Estudante where cpf = cpf_estudante and Ativo = 0 )
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
				Disciplina D
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
				Disciplina D
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
					Inscricao_inscrito I
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
			Professores as P,
			Usuarios as U,
			Inscricao_inscrito as I
		WHERE P.fk_Usuarios_CPF = I.fk_Professores_fk_Usuarios_CPF AND P.fk_Usuarios_CPF = U.cpf
			AND U.Ativo = 1
		GROUP BY U.CPF, U.Nome
	) as T
    ;

END $$
DELIMITER ;


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
SELECT * FROM Justificativas AS J, Presenca AS P, Estudante AS E
WHERE P.id = J.fk_presenca_id and E.cpf = P.fk_estudante_cpf
	and E.cpf = '12345671110';

CALL alunos_com_desempenho_para_receber_bolsa();

CALL alunos_aprovados_reprovados_por_disciplina( );

-- testando atualizar_situacao, passando o id da disciplina de matemática
-- primeiro limpo os valores para depois chamar a procedure que irá repopular com os valores corretos
SET @id_matematica = (SELECT Id FROM Disciplina WHERE Nome = 'Matemática' LIMIT 1);
SELECT @id_matematica;
UPDATE Inscricao_inscrito SET Situacao = '' WHERE fk_Disciplina_Id = @id_matematica;
SELECT * FROM Inscricao_inscrito WHERE fk_Disciplina_Id = @id_matematica;

CALL atualizar_situacao( @id_matematica );

SELECT * FROM Inscricao_inscrito WHERE fk_Disciplina_Id = @id_matematica;


-- professores e taxas de aprovação dos alunos
CALL alunos_aprovados_por_professor( );

-- query para achar um estudante que esteja em algum curso
select * from Estudante, Pertence ec, Contem cd, Disciplina d
where fk_estudante_cpf = cpf and ec.fk_Curso_Id = cd.fk_Curso_Id and cd.fk_Disciplina_Id = d.id
	and ativo = 1;

select * from Professores;

CALL increver_aluno_na_disciplina_do_curso(
	'12345670810',
    'Biologia',
    2019,
    '42345678910',
    @ok,
    @msg
);

-- repetindo a operação com os mesmos parâmetros irá retornar erro
CALL increver_aluno_na_disciplina_do_curso(
	'12345670810',
    'Biologia',
    2019,
    '42345678910',
    @ok,
    @msg
);

-- repetindo a operação com outra disciplina deve funcionar
CALL increver_aluno_na_disciplina_do_curso(
	'12345670810',
    'Matemática',
    2019,
    '42345678910',
    @ok,
    @msg
);

select * from Estudante, Pertence ec, Contem cd, Disciplina d
where fk_estudante_cpf = cpf and ec.fk_Curso_Id = cd.fk_Curso_Id and cd.fk_Disciplina_Id = d.id
	and ativo = 0;
CALL increver_aluno_na_disciplina_do_curso(
	'12345679910',
    'Geografia',
    2019,
    '42345678910',
    @ok,
    @msg
);
