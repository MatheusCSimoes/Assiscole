-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jun 14, 2019 at 11:49 PM
-- Server version: 10.1.36-MariaDB
-- PHP Version: 5.6.38

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `assiscole`
--

-- --------------------------------------------------------

--
-- Table structure for table `Contrato`
--

CREATE TABLE `Contrato` (
  `Id` int(11) NOT NULL,
  `Data_Final` date NOT NULL,
  `Data_Inicial` date NOT NULL,
  `fk_Escola_Id` int(11) DEFAULT NULL,
  `Valor` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `Contém`
--

CREATE TABLE `Contém` (
  `fk_Curso_Id` int(11) DEFAULT NULL,
  `fk_Disciplina_Id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `Curso`
--

CREATE TABLE `Curso` (
  `Id` int(11) NOT NULL,
  `Nome` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Curso`
--

INSERT INTO `Curso` (`Id`, `Nome`) VALUES
(1, 'Primeiro'),
(2, 'Segundo');

-- --------------------------------------------------------

--
-- Table structure for table `Disciplina`
--

CREATE TABLE `Disciplina` (
  `Id` int(11) NOT NULL,
  `Nome` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `Escola`
--

CREATE TABLE `Escola` (
  `fk_Filial_Filial_PK` int(11) DEFAULT NULL,
  `Nome` varchar(40) NOT NULL,
  `Id` int(11) NOT NULL,
  `Endereço` varchar(40) NOT NULL,
  `Telefone` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Escola`
--

INSERT INTO `Escola` (`fk_Filial_Filial_PK`, `Nome`, `Id`, `Endereço`, `Telefone`) VALUES
(1, 'Demo', 1, 'endereço 1', '12345601,'),
(1, 'Juan Lozano Lozano', 2, 'endereço 2', '12345602,');

-- --------------------------------------------------------

--
-- Table structure for table `Estudante`
--

CREATE TABLE `Estudante` (
  `Nome` varchar(40) NOT NULL,
  `RG` varchar(11) NOT NULL,
  `Ativo` int(2) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Estudante`
--

INSERT INTO `Estudante` (`Nome`, `RG`, `Ativo`) VALUES
('2DANIEL JIMENEZ', '08254888182', 1),
('2DANIEL JIMENEZ TQWT', '08254888183', 1);

-- --------------------------------------------------------

--
-- Table structure for table `Filial`
--

CREATE TABLE `Filial` (
  `Filial_PK` int(11) NOT NULL,
  `Filial` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Filial`
--

INSERT INTO `Filial` (`Filial_PK`, `Filial`) VALUES
(1, 'Sede A'),
(2, 'Sede B');

-- --------------------------------------------------------

--
-- Table structure for table `Funcionarios`
--

CREATE TABLE `Funcionarios` (
  `fk_Usuários_RG` varchar(9) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Funcionarios`
--

INSERT INTO `Funcionarios` (`fk_Usuários_RG`) VALUES
('1'),
('2'),
('3'),
('4'),
('5'),
('6');

-- --------------------------------------------------------

--
-- Table structure for table `Informa_Funcionarios_Estudante_Observações`
--

CREATE TABLE `Informa_Funcionarios_Estudante_Observações` (
  `fk_Funcionarios_fk_Usuários_RG` varchar(9) DEFAULT NULL,
  `fk_Estudante_RG` varchar(9) DEFAULT NULL,
  `fk_Observações_Id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `Informa_Funcionarios_Notificações_Estudante`
--

CREATE TABLE `Informa_Funcionarios_Notificações_Estudante` (
  `fk_Funcionarios_fk_Usuários_RG` varchar(11) DEFAULT NULL,
  `fk_Notificações_Id` int(11) DEFAULT NULL,
  `fk_Estudante_RG` varchar(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Informa_Funcionarios_Notificações_Estudante`
--

INSERT INTO `Informa_Funcionarios_Notificações_Estudante` (`fk_Funcionarios_fk_Usuários_RG`, `fk_Notificações_Id`, `fk_Estudante_RG`) VALUES
('1', 9, '08254888182'),
('1', 11, '08254888182');

-- --------------------------------------------------------

--
-- Table structure for table `Inscrição_inscrito`
--

CREATE TABLE `Inscrição_inscrito` (
  `Nota` double NOT NULL,
  `Situação` varchar(40) NOT NULL,
  `fk_Professores_fk_Usuários_RG` varchar(9) DEFAULT NULL,
  `fk_Estudante_RG` varchar(9) DEFAULT NULL,
  `fk_Disciplina_Id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `Justificativas`
--

CREATE TABLE `Justificativas` (
  `Texto` varchar(200) DEFAULT NULL,
  `Id` int(11) NOT NULL,
  `fk_Presença_Id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `Lecionam`
--

CREATE TABLE `Lecionam` (
  `fk_Disciplina_Id` int(11) DEFAULT NULL,
  `fk_Professores_fk_Usuários_RG` varchar(9) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `Módulos`
--

CREATE TABLE `Módulos` (
  `Id` int(11) NOT NULL,
  `Nome` varchar(40) NOT NULL,
  `Descrição` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `Notificacoes`
--

CREATE TABLE `Notificacoes` (
  `Mensagem` varchar(200) DEFAULT NULL,
  `Id` int(11) NOT NULL,
  `Data` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Notificacoes`
--

INSERT INTO `Notificacoes` (`Mensagem`, `Id`, `Data`) VALUES
('asdasdasdasdasdasd', 4, '2019-06-14 17:28:03'),
('asdasdasdasdasdasd', 5, '2019-06-14 17:28:03'),
('asdasdasdasdasdasd', 6, '2019-06-14 17:28:03'),
('asdasdasdasdasdasd', 7, '2019-06-14 17:28:03'),
('asdasdasdasdasdasd', 8, '2019-06-14 17:28:03'),
('asdasdasdasdasdasd', 9, '2019-06-14 17:28:03'),
('asdasdasdasdasdasd', 10, '2019-06-14 17:28:03'),
('asdasdasdasdasdasd', 11, '2019-06-14 17:28:03');

-- --------------------------------------------------------

--
-- Table structure for table `Observacoes`
--

CREATE TABLE `Observacoes` (
  `Id` int(11) NOT NULL,
  `Observacao` varchar(200) NOT NULL,
  `Acordo` varchar(200) NOT NULL,
  `Data` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `Pertence`
--

CREATE TABLE `Pertence` (
  `fk_Curso_Id` int(11) DEFAULT NULL,
  `fk_Estudante_RG` varchar(11) DEFAULT NULL,
  `Ano` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Pertence`
--

INSERT INTO `Pertence` (`fk_Curso_Id`, `fk_Estudante_RG`, `Ano`) VALUES
(1, '08254888182', 2019),
(1, '08254888183', 2019),
(1, '08254888183', 2019);

-- --------------------------------------------------------

--
-- Table structure for table `Possui`
--

CREATE TABLE `Possui` (
  `fk_Estudante_RG` varchar(11) DEFAULT NULL,
  `fk_Responsaveis_RG` varchar(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Possui`
--

INSERT INTO `Possui` (`fk_Estudante_RG`, `fk_Responsaveis_RG`) VALUES
('08254888183', '12345678905'),
('08254888182', '12345678905');

-- --------------------------------------------------------

--
-- Table structure for table `Presenca`
--

CREATE TABLE `Presenca` (
  `Tipo` varchar(40) DEFAULT NULL,
  `Dia` date NOT NULL,
  `Id` int(11) NOT NULL,
  `fk_Estudante_RG` varchar(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Presenca`
--

INSERT INTO `Presenca` (`Tipo`, `Dia`, `Id`, `fk_Estudante_RG`) VALUES
('1', '2019-06-14', 9, '08254888182'),
('2', '2019-06-14', 10, '08254888183'),
('2', '2019-06-14', 15, '08254888182'),
('1', '2019-06-14', 16, '08254888183');

-- --------------------------------------------------------

--
-- Table structure for table `Professores`
--

CREATE TABLE `Professores` (
  `fk_Usuários_RG` varchar(9) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `Responsaveis`
--

CREATE TABLE `Responsaveis` (
  `Nome` varchar(40) NOT NULL,
  `RG` varchar(11) NOT NULL,
  `Telefone` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Responsaveis`
--

INSERT INTO `Responsaveis` (`Nome`, `RG`, `Telefone`) VALUES
('BRENO', '12345678905', '21123393212');

-- --------------------------------------------------------

--
-- Table structure for table `Tem`
--

CREATE TABLE `Tem` (
  `fk_Contrato_Id` int(11) DEFAULT NULL,
  `fk_Módulos_Id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `Usuarios`
--

CREATE TABLE `Usuarios` (
  `RG` varchar(9) NOT NULL,
  `Nome` varchar(40) NOT NULL,
  `Telefone` varchar(15) NOT NULL,
  `Usuario` varchar(40) NOT NULL,
  `Senha` varchar(40) NOT NULL,
  `Ativo` int(2) NOT NULL DEFAULT '1',
  `fk_Escola_Id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Usuarios`
--

INSERT INTO `Usuarios` (`RG`, `Nome`, `Telefone`, `Usuario`, `Senha`, `Ativo`, `fk_Escola_Id`) VALUES
('1', 'Daniel', '11234501', '1', '1', 1, 1),
('2', 'DemoColegio', '11234502', '2', '2', 1, 1),
('3', 'Matheus', '11234503', '3', '3', 1, 1),
('4', 'Rodrigo', '11234504', '4', '4', 1, 2),
('5', 'Diana', '11234505', '5', '5', 1, 2),
('6', 'DemoLozano', '11234506', '6', '6', 1, 2);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Contrato`
--
ALTER TABLE `Contrato`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `FK_Contrato_2` (`fk_Escola_Id`);

--
-- Indexes for table `Contém`
--
ALTER TABLE `Contém`
  ADD KEY `FK_Contém_1` (`fk_Curso_Id`),
  ADD KEY `FK_Contém_2` (`fk_Disciplina_Id`);

--
-- Indexes for table `Curso`
--
ALTER TABLE `Curso`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `Disciplina`
--
ALTER TABLE `Disciplina`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `Escola`
--
ALTER TABLE `Escola`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `FK_Escola_2` (`fk_Filial_Filial_PK`);

--
-- Indexes for table `Estudante`
--
ALTER TABLE `Estudante`
  ADD PRIMARY KEY (`RG`);

--
-- Indexes for table `Filial`
--
ALTER TABLE `Filial`
  ADD PRIMARY KEY (`Filial_PK`);

--
-- Indexes for table `Funcionarios`
--
ALTER TABLE `Funcionarios`
  ADD PRIMARY KEY (`fk_Usuários_RG`);

--
-- Indexes for table `Informa_Funcionarios_Estudante_Observações`
--
ALTER TABLE `Informa_Funcionarios_Estudante_Observações`
  ADD KEY `FK_Informa_Funcionarios_Estudante_Observações_1` (`fk_Funcionarios_fk_Usuários_RG`),
  ADD KEY `FK_Informa_Funcionarios_Estudante_Observações_2` (`fk_Estudante_RG`),
  ADD KEY `FK_Informa_Funcionarios_Estudante_Observações_3` (`fk_Observações_Id`);

--
-- Indexes for table `Informa_Funcionarios_Notificações_Estudante`
--
ALTER TABLE `Informa_Funcionarios_Notificações_Estudante`
  ADD KEY `FK_Informa_Funcionarios_Notificações_Estudante_1` (`fk_Funcionarios_fk_Usuários_RG`),
  ADD KEY `FK_Informa_Funcionarios_Notificações_Estudante_2` (`fk_Notificações_Id`),
  ADD KEY `FK_Informa_Funcionarios_Notificações_Estudante_3` (`fk_Estudante_RG`);

--
-- Indexes for table `Inscrição_inscrito`
--
ALTER TABLE `Inscrição_inscrito`
  ADD KEY `FK_Inscrição_inscrito_1` (`fk_Professores_fk_Usuários_RG`),
  ADD KEY `FK_Inscrição_inscrito_2` (`fk_Estudante_RG`),
  ADD KEY `FK_Inscrição_inscrito_3` (`fk_Disciplina_Id`);

--
-- Indexes for table `Justificativas`
--
ALTER TABLE `Justificativas`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `FK_Justificativas_2` (`fk_Presença_Id`);

--
-- Indexes for table `Lecionam`
--
ALTER TABLE `Lecionam`
  ADD KEY `FK_Lecionam_1` (`fk_Disciplina_Id`),
  ADD KEY `FK_Lecionam_2` (`fk_Professores_fk_Usuários_RG`);

--
-- Indexes for table `Módulos`
--
ALTER TABLE `Módulos`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `Notificacoes`
--
ALTER TABLE `Notificacoes`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `Observacoes`
--
ALTER TABLE `Observacoes`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `Pertence`
--
ALTER TABLE `Pertence`
  ADD KEY `FK_Pertence_2` (`fk_Estudante_RG`) USING BTREE,
  ADD KEY `FK_Pertence_1` (`fk_Curso_Id`);

--
-- Indexes for table `Possui`
--
ALTER TABLE `Possui`
  ADD KEY `FK_Possui_1` (`fk_Estudante_RG`),
  ADD KEY `FK_Possui_2` (`fk_Responsaveis_RG`);

--
-- Indexes for table `Presenca`
--
ALTER TABLE `Presenca`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `FK_Presença_2` (`fk_Estudante_RG`);

--
-- Indexes for table `Professores`
--
ALTER TABLE `Professores`
  ADD PRIMARY KEY (`fk_Usuários_RG`);

--
-- Indexes for table `Responsaveis`
--
ALTER TABLE `Responsaveis`
  ADD PRIMARY KEY (`RG`);

--
-- Indexes for table `Tem`
--
ALTER TABLE `Tem`
  ADD KEY `FK_Tem_1` (`fk_Contrato_Id`),
  ADD KEY `FK_Tem_2` (`fk_Módulos_Id`);

--
-- Indexes for table `Usuarios`
--
ALTER TABLE `Usuarios`
  ADD PRIMARY KEY (`RG`),
  ADD KEY `FK_Usuários_2` (`fk_Escola_Id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Contrato`
--
ALTER TABLE `Contrato`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Curso`
--
ALTER TABLE `Curso`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `Disciplina`
--
ALTER TABLE `Disciplina`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Escola`
--
ALTER TABLE `Escola`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `Justificativas`
--
ALTER TABLE `Justificativas`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Módulos`
--
ALTER TABLE `Módulos`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Notificacoes`
--
ALTER TABLE `Notificacoes`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `Observacoes`
--
ALTER TABLE `Observacoes`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Presenca`
--
ALTER TABLE `Presenca`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Contrato`
--
ALTER TABLE `Contrato`
  ADD CONSTRAINT `FK_Contrato_2` FOREIGN KEY (`fk_Escola_Id`) REFERENCES `Escola` (`Id`);

--
-- Constraints for table `Contém`
--
ALTER TABLE `Contém`
  ADD CONSTRAINT `FK_Contém_1` FOREIGN KEY (`fk_Curso_Id`) REFERENCES `Curso` (`Id`),
  ADD CONSTRAINT `FK_Contém_2` FOREIGN KEY (`fk_Disciplina_Id`) REFERENCES `Disciplina` (`Id`);

--
-- Constraints for table `Escola`
--
ALTER TABLE `Escola`
  ADD CONSTRAINT `FK_Escola_2` FOREIGN KEY (`fk_Filial_Filial_PK`) REFERENCES `Filial` (`Filial_PK`) ON DELETE NO ACTION;

--
-- Constraints for table `Funcionarios`
--
ALTER TABLE `Funcionarios`
  ADD CONSTRAINT `FK_Funcionarios_2` FOREIGN KEY (`fk_Usuários_RG`) REFERENCES `Usuarios` (`RG`) ON DELETE CASCADE;

--
-- Constraints for table `Informa_Funcionarios_Estudante_Observações`
--
ALTER TABLE `Informa_Funcionarios_Estudante_Observações`
  ADD CONSTRAINT `FK_Informa_Funcionarios_Estudante_Observações_1` FOREIGN KEY (`fk_Funcionarios_fk_Usuários_RG`) REFERENCES `Funcionarios` (`fk_Usuários_RG`),
  ADD CONSTRAINT `FK_Informa_Funcionarios_Estudante_Observações_2` FOREIGN KEY (`fk_Estudante_RG`) REFERENCES `Estudante` (`RG`) ON DELETE NO ACTION,
  ADD CONSTRAINT `FK_Informa_Funcionarios_Estudante_Observações_3` FOREIGN KEY (`fk_Observações_Id`) REFERENCES `Observacoes` (`Id`) ON DELETE NO ACTION;

--
-- Constraints for table `Informa_Funcionarios_Notificações_Estudante`
--
ALTER TABLE `Informa_Funcionarios_Notificações_Estudante`
  ADD CONSTRAINT `FK_Informa_Funcionarios_Notificações_Estudante_1` FOREIGN KEY (`fk_Funcionarios_fk_Usuários_RG`) REFERENCES `Funcionarios` (`fk_Usuários_RG`),
  ADD CONSTRAINT `FK_Informa_Funcionarios_Notificações_Estudante_2` FOREIGN KEY (`fk_Notificações_Id`) REFERENCES `Notificacoes` (`Id`) ON DELETE NO ACTION,
  ADD CONSTRAINT `FK_Informa_Funcionarios_Notificações_Estudante_3` FOREIGN KEY (`fk_Estudante_RG`) REFERENCES `Estudante` (`RG`) ON DELETE NO ACTION;

--
-- Constraints for table `Inscrição_inscrito`
--
ALTER TABLE `Inscrição_inscrito`
  ADD CONSTRAINT `FK_Inscrição_inscrito_1` FOREIGN KEY (`fk_Professores_fk_Usuários_RG`) REFERENCES `Professores` (`fk_Usuários_RG`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_Inscrição_inscrito_2` FOREIGN KEY (`fk_Estudante_RG`) REFERENCES `Estudante` (`RG`),
  ADD CONSTRAINT `FK_Inscrição_inscrito_3` FOREIGN KEY (`fk_Disciplina_Id`) REFERENCES `Disciplina` (`Id`);

--
-- Constraints for table `Justificativas`
--
ALTER TABLE `Justificativas`
  ADD CONSTRAINT `FK_Justificativas_2` FOREIGN KEY (`fk_Presença_Id`) REFERENCES `Presenca` (`Id`) ON DELETE CASCADE;

--
-- Constraints for table `Lecionam`
--
ALTER TABLE `Lecionam`
  ADD CONSTRAINT `FK_Lecionam_1` FOREIGN KEY (`fk_Disciplina_Id`) REFERENCES `Disciplina` (`Id`) ON DELETE SET NULL,
  ADD CONSTRAINT `FK_Lecionam_2` FOREIGN KEY (`fk_Professores_fk_Usuários_RG`) REFERENCES `Professores` (`fk_Usuários_RG`) ON DELETE SET NULL;

--
-- Constraints for table `Pertence`
--
ALTER TABLE `Pertence`
  ADD CONSTRAINT `FK_Pertence_1` FOREIGN KEY (`fk_Curso_Id`) REFERENCES `Curso` (`Id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_Pertence_2` FOREIGN KEY (`fk_Estudante_RG`) REFERENCES `Estudante` (`RG`) ON DELETE CASCADE;

--
-- Constraints for table `Possui`
--
ALTER TABLE `Possui`
  ADD CONSTRAINT `FK_Possui_1` FOREIGN KEY (`fk_Estudante_RG`) REFERENCES `Estudante` (`RG`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_Possui_2` FOREIGN KEY (`fk_Responsaveis_RG`) REFERENCES `Responsaveis` (`RG`) ON DELETE CASCADE;

--
-- Constraints for table `Presenca`
--
ALTER TABLE `Presenca`
  ADD CONSTRAINT `FK_Presença_2` FOREIGN KEY (`fk_Estudante_RG`) REFERENCES `Estudante` (`RG`);

--
-- Constraints for table `Professores`
--
ALTER TABLE `Professores`
  ADD CONSTRAINT `FK_Professores_2` FOREIGN KEY (`fk_Usuários_RG`) REFERENCES `Usuarios` (`RG`) ON DELETE CASCADE;

--
-- Constraints for table `Tem`
--
ALTER TABLE `Tem`
  ADD CONSTRAINT `FK_Tem_1` FOREIGN KEY (`fk_Contrato_Id`) REFERENCES `Contrato` (`Id`) ON DELETE SET NULL,
  ADD CONSTRAINT `FK_Tem_2` FOREIGN KEY (`fk_Módulos_Id`) REFERENCES `Módulos` (`Id`) ON DELETE SET NULL;

--
-- Constraints for table `Usuarios`
--
ALTER TABLE `Usuarios`
  ADD CONSTRAINT `FK_Usuários_2` FOREIGN KEY (`fk_Escola_Id`) REFERENCES `Escola` (`Id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
