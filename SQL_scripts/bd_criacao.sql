/* ALUNOS:                                  DRE:
    1) Matheus Cunha Simões                     117091021
    2) Rodrigo Carvalho de Figueiredo           117053497
    3) Daniel Fernando Jimenez Sepúlveda        117028769
    4) Tomás Bizet de Barros                    116183736                              
    5) Caio Silva de Freitas                    117032792
    6) Miguel                                   

    Disciplina: Banco de dados 1
    Turma: 2019.1

    Trabalho Prático 1

    Script de Criação
*/

DROP TABLE IF EXISTS Estudante;

CREATE TABLE Estudante (
    Nome VARCHAR (40) NOT NULL,
    RG VARCHAR (9) PRIMARY KEY,
    Ativo INT (2) NOT NULL DEFAULT '1'
);

DROP TABLE IF EXISTS Escola;

CREATE TABLE Escola (
    fk_Filial_Filial_PK INT,
    Nome VARCHAR (40) NOT NULL,
    Id INT PRIMARY KEY,
    Endereço VARCHAR (40) NOT NULL,
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
    fk_Usuários_RG VARCHAR (9) PRIMARY KEY
);

DROP TABLE IF EXISTS Professores;

CREATE TABLE Professores (
    fk_Usuários_RG VARCHAR (9) PRIMARY KEY
);

DROP TABLE IF EXISTS Disciplina;

CREATE TABLE Disciplina (
    Id INT PRIMARY KEY,
    Nome VARCHAR (40) NOT NULL
);

DROP TABLE IF EXISTS Curso;

CREATE TABLE Curso (
    Id INT PRIMARY KEY,
    Nome VARCHAR (40) NOT NULL
);

DROP TABLE IF EXISTS Notificações;

CREATE TABLE Notificações (
    Mensagem VARCHAR (200),
    Id INT PRIMARY KEY,
    Data datetime NOT NULL
);

DROP TABLE IF EXISTS Justificativas;

CREATE TABLE Justificativas (
    Texto VARCHAR (200),
    Id INT PRIMARY KEY,
    fk_Presença_Id INT
);

DROP TABLE IF EXISTS Usuários;

CREATE TABLE Usuários (
    RG VARCHAR (9) PRIMARY KEY,
    Nome VARCHAR (40) NOT NULL,
    Telefone VARCHAR (15) NOT NULL,
    Usuário VARCHAR (40) NOT NULL,
    Senha VARCHAR (40) NOT NULL,
    Ativo INT(2) NOT NULL DEFAULT '1',    
    fk_Escola_Id INT
);

DROP TABLE IF EXISTS Presença;

CREATE TABLE Presença (
    Tipo VARCHAR (40),
    Dia DATE NOT NULL,
    Id INT PRIMARY KEY,
    fk_Estudante_RG VARCHAR (9)
);

DROP TABLE IF EXISTS Observações;

CREATE TABLE Observações (
    Id INT PRIMARY KEY,
    Observação VARCHAR (200) NOT NULL,
    Acordo VARCHAR (200) NOT NULL
);

DROP TABLE IF EXISTS Módulos;

CREATE TABLE Módulos (
    Id INT PRIMARY KEY,
    Nome VARCHAR (40) NOT NULL,
    Descrição VARCHAR (200)
);

DROP TABLE IF EXISTS Responsáveis;

CREATE TABLE Responsáveis (
    Nome VARCHAR (40) NOT NULL,
    RG VARCHAR (9) PRIMARY KEY,
    Telefone VARCHAR (15) NOT NULL
);

DROP TABLE IF EXISTS Inscrição_inscrito;

CREATE TABLE Inscrição_inscrito (
    Nota DOUBLE NOT NULL,
    Situação VARCHAR (40) NOT NULL,
    fk_Professores_fk_Usuários_RG VARCHAR (9),
    fk_Estudante_RG VARCHAR (9) ,
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
    fk_Professores_fk_Usuários_RG VARCHAR (9)
);

DROP TABLE IF EXISTS Contém;

CREATE TABLE Contém (
    fk_Curso_Id INT,
    fk_Disciplina_Id INT
);

DROP TABLE IF EXISTS Pertence;

CREATE TABLE Pertence (
    fk_Curso_Id INT,
    fk_Estudante_RG VARCHAR (9), 
    Ano INT
);

DROP TABLE IF EXISTS Informa_Funcionarios_Notificações_Estudante;

CREATE TABLE Informa_Funcionarios_Notificações_Estudante (
    fk_Funcionarios_fk_Usuários_RG VARCHAR (9),
    fk_Notificações_Id INT,
    fk_Estudante_RG VARCHAR (9)
);

DROP TABLE IF EXISTS Informa_Funcionarios_Estudante_Observações;

CREATE TABLE Informa_Funcionarios_Estudante_Observações (
    fk_Funcionarios_fk_Usuários_RG VARCHAR (9),
    fk_Estudante_RG VARCHAR (9),
    fk_Observações_Id INT
);

DROP TABLE IF EXISTS Tem;

CREATE TABLE Tem (
    fk_Contrato_Id INT,
    fk_Módulos_Id INT
);

DROP TABLE IF EXISTS Possui;

CREATE TABLE Possui (
    fk_Estudante_RG VARCHAR (9),
    fk_Responsáveis_RG VARCHAR (9)
);


ALTER TABLE `Escola`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=0;
  
ALTER TABLE `Contrato`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=0;
  
ALTER TABLE `Disciplina`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=0;
  
ALTER TABLE `Curso`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=0;
  
ALTER TABLE `Notificações`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=0;
  
ALTER TABLE `Justificativas`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=0;
  
ALTER TABLE `Presença`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=0;
  
ALTER TABLE `Observações`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=0;
  
ALTER TABLE `Módulos`
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
    FOREIGN KEY (fk_Usuários_RG)
    REFERENCES Usuários (RG)
    ON DELETE CASCADE;
 
ALTER TABLE Professores ADD CONSTRAINT FK_Professores_2
    FOREIGN KEY (fk_Usuários_RG)
    REFERENCES Usuários (RG)
    ON DELETE CASCADE;
 
ALTER TABLE Justificativas ADD CONSTRAINT FK_Justificativas_2
    FOREIGN KEY (fk_Presença_Id)
    REFERENCES Presença (Id)
    ON DELETE CASCADE;
 
ALTER TABLE Usuários ADD CONSTRAINT FK_Usuários_2
    FOREIGN KEY (fk_Escola_Id)
    REFERENCES Escola (Id)
    ON DELETE RESTRICT;
 
ALTER TABLE Presença ADD CONSTRAINT FK_Presença_2
    FOREIGN KEY (fk_Estudante_RG)
    REFERENCES Estudante (RG)
    ON DELETE RESTRICT;
 
ALTER TABLE Inscrição_inscrito ADD CONSTRAINT FK_Inscrição_inscrito_1
    FOREIGN KEY (fk_Professores_fk_Usuários_RG)
    REFERENCES Professores (fk_Usuários_RG)
    ON DELETE CASCADE;
 
ALTER TABLE Inscrição_inscrito ADD CONSTRAINT FK_Inscrição_inscrito_2
    FOREIGN KEY (fk_Estudante_RG)
    REFERENCES Estudante (RG);
 
ALTER TABLE Inscrição_inscrito ADD CONSTRAINT FK_Inscrição_inscrito_3
    FOREIGN KEY (fk_Disciplina_Id)
    REFERENCES Disciplina (Id);
 
ALTER TABLE Lecionam ADD CONSTRAINT FK_Lecionam_1
    FOREIGN KEY (fk_Disciplina_Id)
    REFERENCES Disciplina (Id)
    ON DELETE SET NULL;
 
ALTER TABLE Lecionam ADD CONSTRAINT FK_Lecionam_2
    FOREIGN KEY (fk_Professores_fk_Usuários_RG)
    REFERENCES Professores (fk_Usuários_RG)
    ON DELETE SET NULL;
 
ALTER TABLE Contém ADD CONSTRAINT FK_Contém_1
    FOREIGN KEY (fk_Curso_Id)
    REFERENCES Curso (Id)
    ON DELETE RESTRICT;
 
ALTER TABLE Contém ADD CONSTRAINT FK_Contém_2
    FOREIGN KEY (fk_Disciplina_Id)
    REFERENCES Disciplina (Id)
    ON DELETE RESTRICT;
 
ALTER TABLE Pertence ADD CONSTRAINT FK_Pertence_1
    FOREIGN KEY (fk_Curso_Id)
    REFERENCES Curso (Id)
    ON DELETE RESTRICT;
 
ALTER TABLE Pertence ADD CONSTRAINT FK_Pertence_2
    FOREIGN KEY (fk_Estudante_RG)
    REFERENCES Estudante (RG)
    ON DELETE RESTRICT;
 
ALTER TABLE Informa_Funcionarios_Notificações_Estudante ADD CONSTRAINT FK_Informa_Funcionarios_Notificações_Estudante_1
    FOREIGN KEY (fk_Funcionarios_fk_Usuários_RG)
    REFERENCES Funcionarios (fk_Usuários_RG)
    ON DELETE RESTRICT;
 
ALTER TABLE Informa_Funcionarios_Notificações_Estudante ADD CONSTRAINT FK_Informa_Funcionarios_Notificações_Estudante_2
    FOREIGN KEY (fk_Notificações_Id)
    REFERENCES Notificações (Id)
    ON DELETE NO ACTION;
 
ALTER TABLE Informa_Funcionarios_Notificações_Estudante ADD CONSTRAINT FK_Informa_Funcionarios_Notificações_Estudante_3
    FOREIGN KEY (fk_Estudante_RG)
    REFERENCES Estudante (RG)
    ON DELETE NO ACTION;
 
ALTER TABLE Informa_Funcionarios_Estudante_Observações ADD CONSTRAINT FK_Informa_Funcionarios_Estudante_Observações_1
    FOREIGN KEY (fk_Funcionarios_fk_Usuários_RG)
    REFERENCES Funcionarios (fk_Usuários_RG)
    ON DELETE RESTRICT;
 
ALTER TABLE Informa_Funcionarios_Estudante_Observações ADD CONSTRAINT FK_Informa_Funcionarios_Estudante_Observações_2
    FOREIGN KEY (fk_Estudante_RG)
    REFERENCES Estudante (RG)
    ON DELETE NO ACTION;
 
ALTER TABLE Informa_Funcionarios_Estudante_Observações ADD CONSTRAINT FK_Informa_Funcionarios_Estudante_Observações_3
    FOREIGN KEY (fk_Observações_Id)
    REFERENCES Observações (Id)
    ON DELETE NO ACTION;
 
ALTER TABLE Tem ADD CONSTRAINT FK_Tem_1
    FOREIGN KEY (fk_Contrato_Id)
    REFERENCES Contrato (Id)
    ON DELETE SET NULL;
 
ALTER TABLE Tem ADD CONSTRAINT FK_Tem_2
    FOREIGN KEY (fk_Módulos_Id)
    REFERENCES Módulos (Id)
    ON DELETE SET NULL;
 
ALTER TABLE Possui ADD CONSTRAINT FK_Possui_1
    FOREIGN KEY (fk_Estudante_RG)
    REFERENCES Estudante (RG)
    ON DELETE RESTRICT;
 
ALTER TABLE Possui ADD CONSTRAINT FK_Possui_2
    FOREIGN KEY (fk_Responsáveis_RG)
    REFERENCES Responsáveis (RG)
    ON DELETE RESTRICT;
