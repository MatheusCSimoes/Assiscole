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

    Script de Criação
*/

DROP TABLE IF EXISTS Estudante;

CREATE TABLE Estudante (
    Nome VARCHAR (40) NOT NULL,
    CPF VARCHAR (11) PRIMARY KEY,
    Ativo INT (2) NOT NULL DEFAULT '1'
);

DROP TABLE IF EXISTS Escola;

CREATE TABLE Escola (
    fk_Filial_Filial_PK INT,
    Nome VARCHAR (40) NOT NULL,
    Id INT PRIMARY KEY,
    Endereco VARCHAR (40) NOT NULL,
    Telefone VARCHAR (15) NOT NULL
);

DROP TABLE IF EXISTS Contrato;

CREATE TABLE Contrato (
    Id INT PRIMARY KEY,
    Data_Final DATE NOT NULL,
    Data_Inicial DATE NOT NULL,
    fk_Escola_Id INT,
    Valor INT NOT NULL
);

DROP TABLE IF EXISTS Funcionarios;

CREATE TABLE Funcionarios (
    fk_Usuarios_CPF VARCHAR (11) PRIMARY KEY
);

DROP TABLE IF EXISTS Professores;

CREATE TABLE Professores (
    fk_Usuarios_CPF VARCHAR (11) PRIMARY KEY
);

DROP TABLE IF EXISTS Disciplina;

CREATE TABLE Disciplina (
    Id INT PRIMARY KEY,
    Nome VARCHAR (40) NOT NULL
);

DROP TABLE IF EXISTS Curso;

CREATE TABLE Curso (
    Id INT PRIMARY KEY,
    Nome VARCHAR (40) NOT NULL,
    fk_Escola_Id INT NOT NULL
);

DROP TABLE IF EXISTS Notificacoes;

CREATE TABLE Notificacoes (
    Mensagem VARCHAR (200),
    Id INT PRIMARY KEY,
    Data datetime NOT NULL
);

DROP TABLE IF EXISTS Justificativas;

CREATE TABLE Justificativas (
    Texto VARCHAR (200),
    Id INT PRIMARY KEY,
    fk_Presenca_Id INT
);

DROP TABLE IF EXISTS Usuarios;

CREATE TABLE Usuarios (
    CPF VARCHAR (11) PRIMARY KEY,
    Nome VARCHAR (40) NOT NULL,
    Telefone VARCHAR (15) NOT NULL,
    Usuario VARCHAR (40) NOT NULL,
    Senha VARCHAR (40) NOT NULL,
    Ativo INT(2) NOT NULL DEFAULT '1',    
    fk_Escola_Id INT
);

DROP TABLE IF EXISTS Presenca;

CREATE TABLE Presenca (
    Tipo VARCHAR (40),
    Dia DATE NOT NULL,
    Id INT PRIMARY KEY,
    fk_Estudante_CPF VARCHAR (11)
);

DROP TABLE IF EXISTS Observacoes;

CREATE TABLE Observacoes (
    Id INT PRIMARY KEY,
    Observacao VARCHAR (200) NOT NULL,
    Acordo VARCHAR (200) NOT NULL
);

DROP TABLE IF EXISTS Modulos;

CREATE TABLE Modulos (
    Id INT PRIMARY KEY,
    Nome VARCHAR (40) NOT NULL,
    Descricao VARCHAR (200)
);

DROP TABLE IF EXISTS Responsaveis;

CREATE TABLE Responsaveis (
    Nome VARCHAR (40) NOT NULL,
    CPF VARCHAR (11) PRIMARY KEY,
    Telefone VARCHAR (15) NOT NULL
);

DROP TABLE IF EXISTS Inscricao_inscrito;

CREATE TABLE Inscricao_inscrito (
    Nota DOUBLE NOT NULL,
    Situacao VARCHAR (40) NOT NULL,
    fk_Professores_fk_Usuarios_CPF VARCHAR (11),
    fk_Estudante_CPF VARCHAR (11) ,
    fk_Disciplina_Id INT
);

DROP TABLE IF EXISTS Filial;

CREATE TABLE Filial (
    Filial_PK INT NOT NULL PRIMARY KEY,
    Filial Varchar (40) NOT NULL
);

DROP TABLE IF EXISTS Lecionam;

CREATE TABLE Lecionam (
    fk_Disciplina_Id INT,
    fk_Professores_fk_Usuarios_CPF VARCHAR (11)
);

DROP TABLE IF EXISTS Contem;

CREATE TABLE Contem (
    fk_Curso_Id INT,
    fk_Disciplina_Id INT
);

DROP TABLE IF EXISTS Pertence;

CREATE TABLE Pertence (
    fk_Curso_Id INT,
    fk_Estudante_CPF VARCHAR (11), 
    Ano INT
);

DROP TABLE IF EXISTS Informa_Funcionarios_Notificacoes_Estudante;

CREATE TABLE Informa_Funcionarios_Notificacoes_Estudante (
    fk_Funcionarios_fk_Usuarios_CPF VARCHAR (11),
    fk_Notificacoes_Id INT,
    fk_Estudante_CPF VARCHAR (11)
);

DROP TABLE IF EXISTS Informa_Funcionarios_Estudante_Observacoes;

CREATE TABLE Informa_Funcionarios_Estudante_Observacoes (
    fk_Funcionarios_fk_Usuarios_CPF VARCHAR (11),
    fk_Estudante_CPF VARCHAR (11),
    fk_Observacoes_Id INT
);

DROP TABLE IF EXISTS Tem;

CREATE TABLE Tem (
    fk_Contrato_Id INT,
    fk_Modulos_Id INT
);

DROP TABLE IF EXISTS Possui;

CREATE TABLE Possui (
    fk_Estudante_CPF VARCHAR (11),
    fk_Responsaveis_CPF VARCHAR (11)
);


ALTER TABLE `Escola`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=0;
  
ALTER TABLE `Contrato`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=0;
  
ALTER TABLE `Disciplina`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=0;
  
ALTER TABLE `Curso`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=0;
  
ALTER TABLE `Notificacoes`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=0;
  
ALTER TABLE `Justificativas`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=0;
  
ALTER TABLE `Presenca`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=0;
  
ALTER TABLE `Observacoes`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=0;
  
ALTER TABLE `Modulos`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=0;
  
 
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
    ON DELETE RESTRICT;
 
ALTER TABLE Inscricao_inscrito ADD CONSTRAINT FK_Inscricao_inscrito_1
    FOREIGN KEY (fk_Professores_fk_Usuarios_CPF)
    REFERENCES Professores (fk_Usuarios_CPF)
    ON DELETE CASCADE;
 
ALTER TABLE Inscricao_inscrito ADD CONSTRAINT FK_Inscricao_inscrito_2
    FOREIGN KEY (fk_Estudante_CPF)
    REFERENCES Estudante (CPF);
 
ALTER TABLE Inscricao_inscrito ADD CONSTRAINT FK_Inscricao_inscrito_3
    FOREIGN KEY (fk_Disciplina_Id)
    REFERENCES Disciplina (Id);
 
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
    ON DELETE RESTRICT;
 
ALTER TABLE Contem ADD CONSTRAINT FK_Contem_2
    FOREIGN KEY (fk_Disciplina_Id)
    REFERENCES Disciplina (Id)
    ON DELETE RESTRICT;
 
ALTER TABLE Pertence ADD CONSTRAINT FK_Pertence_1
    FOREIGN KEY (fk_Curso_Id)
    REFERENCES Curso (Id)
    ON DELETE RESTRICT;
 
ALTER TABLE Pertence ADD CONSTRAINT FK_Pertence_2
    FOREIGN KEY (fk_Estudante_CPF)
    REFERENCES Estudante (CPF)
    ON DELETE RESTRICT;
 
ALTER TABLE Informa_Funcionarios_Notificacoes_Estudante ADD CONSTRAINT FK_Informa_Funcionarios_Notificacoes_Estudante_1
    FOREIGN KEY (fk_Funcionarios_fk_Usuarios_CPF)
    REFERENCES Funcionarios (fk_Usuarios_CPF)
    ON DELETE RESTRICT;
 
ALTER TABLE Informa_Funcionarios_Notificacoes_Estudante ADD CONSTRAINT FK_Informa_Funcionarios_Notificacoes_Estudante_2
    FOREIGN KEY (fk_Notificacoes_Id)
    REFERENCES Notificacoes (Id)
    ON DELETE NO ACTION;
 
ALTER TABLE Informa_Funcionarios_Notificacoes_Estudante ADD CONSTRAINT FK_Informa_Funcionarios_Notificacoes_Estudante_3
    FOREIGN KEY (fk_Estudante_CPF)
    REFERENCES Estudante (CPF)
    ON DELETE NO ACTION;
 
ALTER TABLE Informa_Funcionarios_Estudante_Observacoes ADD CONSTRAINT FK_Informa_Funcionarios_Estudante_Observacoes_1
    FOREIGN KEY (fk_Funcionarios_fk_Usuarios_CPF)
    REFERENCES Funcionarios (fk_Usuarios_CPF)
    ON DELETE RESTRICT;
 
ALTER TABLE Informa_Funcionarios_Estudante_Observacoes ADD CONSTRAINT FK_Informa_Funcionarios_Estudante_Observacoes_2
    FOREIGN KEY (fk_Estudante_CPF)
    REFERENCES Estudante (CPF)
    ON DELETE NO ACTION;
 
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
    ON DELETE RESTRICT;
 
ALTER TABLE Possui ADD CONSTRAINT FK_Possui_2
    FOREIGN KEY (fk_Responsaveis_CPF)
    REFERENCES Responsaveis (CPF)
    ON DELETE RESTRICT;

delimiter //
create trigger aluno_curso_unico after insert on Pertence
for each row
begin
    if NEW.Ano < (select Ano from Pertence where fk_Curso_Id = NEW.fk_Curso_Id and fk_Estudante_CPF = NEW.fk_Estudante_CPF) then
        delete from Pertence where fk_Estudante_CPF = NEW.fk_Estudante_CPF and fk_Curso_Id = NEW.fk_Curso_Id and Ano = NEW.Ano;
    end if;
end;//
delimiter ;

delimiter //
create trigger contrato_unico after insert on Contrato
for each row 
begin
    if NEW.Data_Inicial < (select Data_Final from Contrato where fk_Escola_Id = NEW.fk_Escola_Id) then
        delete from Contrato where Id = NEW.Id;
    end if;
end;//
delimiter ;
