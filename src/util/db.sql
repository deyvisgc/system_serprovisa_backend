-- MySQL dump 10.13  Distrib 8.0.30, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: serprovisa_db
-- ------------------------------------------------------
-- Server version	8.0.30

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `family`
--

DROP TABLE IF EXISTS `family`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `family` (
  `id_fam` int NOT NULL AUTO_INCREMENT,
  `cod_fam` char(5) DEFAULT NULL,
  `des_fam` varchar(45) DEFAULT NULL,
  `status_fam` char(1) DEFAULT NULL,
  PRIMARY KEY (`id_fam`),
  UNIQUE KEY `idfamily_UNIQUE` (`id_fam`),
  UNIQUE KEY `cod_UNIQUE` (`cod_fam`),
  UNIQUE KEY `des_fam_UNIQUE` (`des_fam`)
) ENGINE=InnoDB AUTO_INCREMENT=128 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `family`
--

LOCK TABLES `family` WRITE;
/*!40000 ALTER TABLE `family` DISABLE KEYS */;
INSERT INTO `family` VALUES (95,'FGV','GRAFICA VEHICULAR','1'),(96,'FES','ESTRUCTURAS','1'),(105,'FGR','GRAFICA','1'),(116,'Fpl','PLANTA','0'),(118,'FSE','SERVICIOS','0'),(120,'FLD','LINEA DIGITAL','0'),(121,'FLD1','LINEA DIGITAL1','0'),(122,'FLD2','LINEA DIGITAL2','0'),(123,'FLD3','LINEA DIGITAL3','0'),(124,'FLD4','LINEA DIGITAL4','0'),(125,'FAM','AMBIENTACION','1'),(126,'FDI','DISPLAY','1'),(127,'FDS','DISCA','1');
/*!40000 ALTER TABLE `family` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `group_produc`
--

DROP TABLE IF EXISTS `group_produc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `group_produc` (
  `id_grou` int NOT NULL AUTO_INCREMENT,
  `cod_gru` varchar(5) DEFAULT NULL,
  `des_gru` varchar(50) DEFAULT NULL,
  `status_gru` char(1) DEFAULT NULL,
  `linea_id_line` int NOT NULL,
  `fec_regis` date NOT NULL,
  `fam_id_familia` int NOT NULL,
  `cod_gru_final` varchar(50) DEFAULT NULL,
  `total_product` int DEFAULT '0',
  PRIMARY KEY (`id_grou`),
  UNIQUE KEY `idgrupo_UNIQUE` (`id_grou`),
  UNIQUE KEY `cod_gru_UNIQUE` (`cod_gru`),
  UNIQUE KEY `des_gru_UNIQUE` (`des_gru`),
  KEY `fk_grupo_Linea1_idx` (`linea_id_line`),
  KEY `fam_id_familia_idx` (`fam_id_familia`),
  CONSTRAINT `fam_id_familia` FOREIGN KEY (`fam_id_familia`) REFERENCES `family` (`id_fam`),
  CONSTRAINT `fk_grupo_Linea1` FOREIGN KEY (`linea_id_line`) REFERENCES `linea` (`id_line`)
) ENGINE=InnoDB AUTO_INCREMENT=167 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `group_produc`
--

LOCK TABLES `group_produc` WRITE;
/*!40000 ALTER TABLE `group_produc` DISABLE KEYS */;
INSERT INTO `group_produc` VALUES (165,'GBR','BRILLANTE','1',39,'2023-12-10',125,'AMB-VIN-BRI',3),(166,'GFT','FILM TRASLUCIDO','1',43,'2023-12-11',125,'AMB-BAC-FIL',0);
/*!40000 ALTER TABLE `group_produc` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `linea`
--

DROP TABLE IF EXISTS `linea`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `linea` (
  `id_line` int NOT NULL AUTO_INCREMENT,
  `cod_line` char(5) NOT NULL,
  `des_line` varchar(50) NOT NULL,
  `status_line` char(1) DEFAULT NULL,
  `family_id_fam` int NOT NULL,
  PRIMARY KEY (`id_line`),
  UNIQUE KEY `idLinea_UNIQUE` (`id_line`),
  UNIQUE KEY `cod_lin_UNIQUE` (`cod_line`),
  UNIQUE KEY `des_line_UNIQUE` (`des_line`),
  KEY `fk_Linea_family1_idx` (`family_id_fam`),
  CONSTRAINT `fk_Linea_family1` FOREIGN KEY (`family_id_fam`) REFERENCES `family` (`id_fam`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `linea`
--

LOCK TABLES `linea` WRITE;
/*!40000 ALTER TABLE `linea` DISABLE KEYS */;
INSERT INTO `linea` VALUES (30,'LFS','F','0',125),(31,'CD','DDD','0',125),(32,'SD','SS','0',125),(33,'FS','D','0',120),(35,'F2','DS','0',125),(37,'F4','SDS','0',126),(38,'LBA','BANNER','1',125),(39,'LVI','VINIL','1',125),(40,'LPA','PARANTE','1',126),(41,'LR0','ROLL SCREAM','1',126),(43,'LBC','BACKLIGHT','1',125);
/*!40000 ALTER TABLE `linea` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id_prod` int NOT NULL AUTO_INCREMENT,
  `cod_product` varchar(50) NOT NULL,
  `name_product` longtext NOT NULL,
  `des_product` longtext,
  `status_product` char(1) DEFAULT NULL,
  `group_id_group` int NOT NULL,
  `user_id_user` int NOT NULL,
  `fech_regis` date NOT NULL,
  PRIMARY KEY (`id_prod`),
  UNIQUE KEY `cod_produ_UNIQUE` (`cod_product`),
  KEY `fk_products_grupo1_idx` (`group_id_group`),
  KEY `fk_products_user1_idx` (`user_id_user`),
  CONSTRAINT `fk_products_grupo1` FOREIGN KEY (`group_id_group`) REFERENCES `group_produc` (`id_grou`),
  CONSTRAINT `fk_products_user1` FOREIGN KEY (`user_id_user`) REFERENCES `user` (`id_user`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (10,'AMB-VIN-BRI-001','VINIL BRILLANTE ','1.10 X 1.10','1',165,52,'2023-12-10'),(11,'AMB-VIN-BRI-002','VINIL BRILLANTE ','1.10 X 1.11','1',165,52,'2023-12-10'),(12,'AMB-VIN-BRI-003','VINIL BRILLANTE','1.10 X 1.12','1',165,52,'2023-12-10');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role` (
  `id_role` int NOT NULL AUTO_INCREMENT,
  `ro_name` varchar(45) DEFAULT NULL,
  `ro_status` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id_role`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` VALUES (1,'Super Admin','1'),(2,'Comercial','1'),(3,'Gerente OP','1');
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id_user` int NOT NULL AUTO_INCREMENT,
  `us_username` varchar(45) NOT NULL,
  `us_password` text NOT NULL,
  `us_avatar` varchar(45) DEFAULT NULL,
  `us_full_name` varchar(70) DEFAULT NULL,
  `role_idrole` int NOT NULL,
  `us_fec_regis` date DEFAULT NULL,
  PRIMARY KEY (`id_user`),
  UNIQUE KEY `iduser_UNIQUE` (`id_user`),
  UNIQUE KEY `username_UNIQUE` (`us_username`),
  KEY `fk_user_role_idx` (`role_idrole`),
  CONSTRAINT `fk_user_role` FOREIGN KEY (`role_idrole`) REFERENCES `role` (`id_role`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'deyvisgc@gmail.com','$2b$10$uXtN..KcNsBDOW7ntP68ruOI.LeVcKztvXfWRQRZ84iWj6HXnNX/K',NULL,'Deyvis Garcia Cercado',1,'2023-12-07'),(23,'ronald@gmail.com','$2b$10$/GugcVj9BR.JMBur/mEA1uLIw5z3BqIu/RvuwMfoJvoFrHPNGENwu',NULL,'Ronald',1,'2023-12-08'),(24,'lesly@gmail.com','$2b$10$n.lwpWjvpgEGKSI85Jd01eXutyWGMM9ms7PtzJ9Lyt5iClwxVT/BG',NULL,'lesly',1,'2023-12-08'),(25,'deyvisgcsdsas@gmail.com','$2b$10$6z47LHKk67QncpdIS6byH.DbJM6D2oRqFfhvvrrxb8DkjNBXFoR/C',NULL,'Ronald',3,'2023-12-08'),(26,'deyvisgcsd@gmail.com','$10$6z47LHKk67QncpdIS6byH.DbJM6D2oRqFfhvvrrxb8DkjNBXFoR/C',NULL,'Ronald',3,'2023-12-08'),(27,'deyvisgd@gmail.com','$10$6z47LHKk67QncpdIS6byH.DbJM6D2oRqFfhvvrrxb8DkjNBXFoR/C',NULL,'sdsd',3,'2023-12-08'),(28,'deyvisgdsasa@gmail.com','$10$6z47LHKk67QncpdIS6byH.DbJM6D2oRqFfhvvrrxb8DkjNBXFoR/C',NULL,'sdsd',3,'2023-12-08'),(29,'sss@gmail.com','$10$6z47LHKk67QncpdIS6byH.DbJM6D2oRqFfhvvrrxb8DkjNBXFoR/C',NULL,'sdsd',3,'2023-12-08'),(30,'sssddd@gmail.com','$10$6z47LHKk67QncpdIS6byH.DbJM6D2oRqFfhvvrrxb8DkjNBXFoR/C',NULL,'sdsd',3,'2023-12-08'),(31,'sssdddss@gmail.com','$10$6z47LHKk67QncpdIS6byH.DbJM6D2oRqFfhvvrrxb8DkjNBXFoR/C',NULL,'sdsd',3,'2023-12-08'),(32,'dffs@gmail.com','$10$6z47LHKk67QncpdIS6byH.DbJM6D2oRqFfhvvrrxb8DkjNBXFoR/C',NULL,'sdsd',3,'2023-12-08'),(48,'rocio2@gmail.com','$10$6z47LHKk67QncpdIS6byH.DbJM6D2oRqFfhvvrrxb8DkjNBXFoR/C',NULL,'rocio',3,'2023-12-08'),(49,'rocio1@gmail.com','$10$6z47LHKk67QncpdIS6byH.DbJM6D2oRqFfhvvrrxb8DkjNBXFoR/C',NULL,'rocio',1,'2023-12-08'),(51,'leslyrociogc@gmail.com','$2b$10$U.fQYFkeT4HCv/sSri5PU.vEp9iqoSlmiI10cG7zRvWx.On7WKlI.',NULL,'Lesly Rocio LLanos Ponce',2,'2023-12-09'),(52,'salvatore@gmail.com','$2b$10$N0rAGujY37X7KjePAZvXuOMG6E1T3YfC0h.aQ5q2PQk1ROVCQzu2S',NULL,'Salvatore Torres Barzola',1,'2023-12-10');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-12-11  1:34:34
