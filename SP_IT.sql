CREATE DATABASE  IF NOT EXISTS `sp_it` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `sp_it`;
-- MySQL dump 10.13  Distrib 8.0.27, for Win64 (x86_64)
--
-- Host: localhost    Database: sp_it
-- ------------------------------------------------------
-- Server version	8.0.27

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
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `categoryid` int NOT NULL AUTO_INCREMENT,
  `category` varchar(45) NOT NULL,
  `description` varchar(255) NOT NULL,
  PRIMARY KEY (`categoryid`),
  UNIQUE KEY `category_UNIQUE` (`category`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Categories of Products';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,'Laptop','Light and high performance laptops for school'),(2,'Tablet','Great for portable learning machines'),(3,'Phone','Essential devices for daily life'),(4,'Watch','Great devices worn on wrist for smart capabilities'),(5,'Computer','Big devices with a lot of power'),(6,'SSD','SSD'),(8,'GPU','graphics processing unit (great for gaming computers!)'),(10,'CPU','central processing unit'),(17,'Motherboard','Computer motherboard');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `discounts`
--

DROP TABLE IF EXISTS `discounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `discounts` (
  `discountsid` int NOT NULL AUTO_INCREMENT,
  `code` varchar(10) NOT NULL,
  `productid` int NOT NULL,
  `discountpercent` int NOT NULL,
  `starttime` datetime NOT NULL,
  `endtime` datetime NOT NULL,
  PRIMARY KEY (`discountsid`),
  UNIQUE KEY `code_UNIQUE` (`code`),
  KEY `discounts_productid_idx` (`productid`),
  CONSTRAINT `discounts_productid` FOREIGN KEY (`productid`) REFERENCES `product` (`productid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `discounts`
--

LOCK TABLES `discounts` WRITE;
/*!40000 ALTER TABLE `discounts` DISABLE KEYS */;
INSERT INTO `discounts` VALUES (13,'ABC15',1,15,'2022-03-20 00:00:00','2022-03-27 00:00:00'),(14,'BIG5',2,5,'2022-02-20 00:00:00','2022-03-20 00:00:00'),(15,'BEEG20',4,20,'2022-04-20 00:00:00','2022-04-21 00:00:00'),(16,'HUGE500',7,40,'2022-05-01 00:00:00','2022-05-03 00:00:00'),(17,'ABC10',5,45,'2023-05-05 00:00:00','2023-05-06 00:00:00'),(20,'hello5',23,5,'2023-09-22 00:00:00','2023-12-24 00:00:00'),(21,'long2%',12,2,'2023-04-10 00:00:00','2024-05-10 00:00:00'),(22,'king12',15,12,'2022-12-30 00:00:00','2023-01-30 00:00:00'),(23,'GIGA50',17,50,'2021-10-20 18:00:00','2021-10-21 18:00:00');
/*!40000 ALTER TABLE `discounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `interest`
--

DROP TABLE IF EXISTS `interest`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `interest` (
  `intid` int NOT NULL AUTO_INCREMENT,
  `userid` int NOT NULL,
  `categoryid` int NOT NULL,
  PRIMARY KEY (`intid`)
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `interest`
--

LOCK TABLES `interest` WRITE;
/*!40000 ALTER TABLE `interest` DISABLE KEYS */;
INSERT INTO `interest` VALUES (2,2,2),(3,2,3),(4,3,1),(5,3,2),(6,3,3),(7,4,1),(8,4,2),(9,4,3),(10,4,4),(11,7,2),(50,2,4),(51,2,5),(52,6,4),(53,6,5),(59,1,1),(60,1,2),(61,1,3),(63,1,8),(64,1,10);
/*!40000 ALTER TABLE `interest` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
  `productid` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `categoryid` int NOT NULL,
  `brand` varchar(45) NOT NULL,
  `price` decimal(8,2) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`productid`),
  UNIQUE KEY `name_UNIQUE` (`name`),
  KEY `categoryid_idx` (`categoryid`),
  CONSTRAINT `product_categoryid` FOREIGN KEY (`categoryid`) REFERENCES `category` (`categoryid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='All products with attributes of product';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES (1,'Aftershock Laptop BLAZE','Best Laptop',1,'Aftershock',1855.50,'2021-12-03 14:15:42'),(2,'ASUS Vivobook','Good enough for studies, light and portable',1,'ASUS',799.00,'2021-12-06 16:15:38'),(3,'IPad','High performance tablet great for productivity',2,'Apple',999.00,'2021-12-31 21:40:34'),(4,'IPhone 13','Essential for daily life, good performance',3,'Apple',699.00,'2022-01-02 20:33:22'),(5,'Apple Watch','Great smartwatch',4,'Apple',499.00,'2022-01-04 15:53:40'),(7,'Samsung EVO 1TB SSD 970','Fast writing and read speeds for gamers',6,'Samsung',149.99,'2022-01-04 16:39:25'),(9,'GTX 1660','budget GPU',8,'Nvidia',499.00,'2022-01-14 21:06:27'),(11,'ASUS AMD Motherboard','good motherboard',17,'ASUS',159.99,'2022-01-24 15:30:15'),(12,'Ryzen 3700X','8 core gaming cpu',10,'AMD',499.99,'2022-01-25 11:40:00'),(14,'Oneplus Nord','Great mid-range phone, 90hz smooth refresh rate',3,'Oneplus',499.99,'2022-01-26 14:41:31'),(15,'Kingston 500GB SSD','good budget buy',6,'Kingston',80.00,'2022-01-26 14:42:55'),(16,'Intel 12th Gen i7-12400K','High performance gaming',10,'Intel',599.00,'2022-01-26 14:44:16'),(17,'GIGABYTE Z390A Motherboard','Motherboard compatible with Intel CPUs',17,'GIGABYTE',220.00,'2022-01-26 14:45:25'),(18,'CASIO Digital Watch','Great budget watch',4,'CASIO',50.00,'2022-01-26 14:45:46'),(19,'ROLEX Watch','High fashion and style',4,'ROLEX',2999.99,'2022-01-26 14:46:06'),(20,'Xiaomi Pad Ultra','Good value for money tablet from Xiaomi',2,'Xiaomi',399.00,'2022-01-26 14:46:48'),(21,'Samsung Galaxy Pad','High performance tablet, using samsungs high quality UI and hardware',2,'Samsung',799.00,'2022-01-26 14:47:30'),(22,'Samsung S21 Ultra','Ultra high quality phone, has everything you need!',3,'Samsung',999.99,'2022-01-26 14:48:15'),(23,'Aftershock Prebuilt PC with 3070 GPU','High performance gaming PC for the hardcore gamers\nSpecs:\nRyzen 5 3600X\nRTX 3070\nB550 Motherboard',5,'Aftershock',1299.00,'2022-01-26 14:49:34'),(26,'DELL Optiplex 400','Very cheap PC for office work and light gaming',5,'DELL',499.99,'2022-01-28 20:32:12'),(28,'GTX 3080','Ultra powerful gaming GPU',8,'Nvidia',899.99,'2022-01-30 11:49:38');
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `reviewid` int NOT NULL AUTO_INCREMENT,
  `productid` int NOT NULL,
  `userid` int NOT NULL,
  `rating` varchar(45) NOT NULL,
  `review` varchar(500) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`reviewid`),
  KEY `reviews_productid_idx` (`productid`),
  KEY `reviews_userid_idx` (`userid`),
  CONSTRAINT `reviews_productid` FOREIGN KEY (`productid`) REFERENCES `product` (`productid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `reviews_userid` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (1,1,1,'5','Good Laptop, love gaming in school!','2021-12-03 14:15:48'),(2,1,2,'3','Ok lah, not too bad','2021-12-14 23:34:13'),(3,3,3,'5','extremely good, worth 100% id buy another','2022-01-02 18:13:46'),(4,2,2,'3','ok laptop, good for the price','2022-01-04 13:50:24'),(5,5,6,'4','Good watch but overpriced\n','2022-01-04 15:54:44'),(12,4,1,'3','Good product','2022-01-24 20:13:15'),(13,4,2,'3','Good product','2022-01-24 20:13:20'),(14,11,9,'4','Good motherboard, my son built new pc','2022-01-24 20:42:06'),(15,2,1,'4','Great laptop from asus','2022-01-25 16:14:43'),(16,19,1,'5','I got 10 million girlfriends when i wear this watch, 10/10','2022-01-26 15:43:33'),(17,23,3,'4','Great gaming pc, im wrecking noobs on call of duty now ','2022-01-26 15:46:44'),(18,18,3,'1','horrible watch, my friends all said i look ugly with it ','2022-01-26 15:47:04'),(19,5,3,'2','i dont use iphone so its useless','2022-01-26 15:47:35'),(20,9,3,'3','quite good, i can game hard with it ','2022-01-26 15:47:53'),(21,16,4,'5','very gud, i can now game at 500fps on my favourite games','2022-01-26 17:02:09'),(22,28,6,'5','Great GPU, my son loves gaming','2022-01-31 11:49:56'),(23,26,6,'2','horrible computer, only 10 fps on my sons favourite game minecraft','2022-01-31 11:50:34'),(24,23,6,'3','ok gaming for my son, the RGB makes my son wreck noobs better','2022-01-31 11:50:59'),(25,17,6,'4','very easy to build with this, great mobo','2022-01-31 11:51:23'),(26,19,4,'2','very overpriced watch, why need to pay $3000 just to look at the time? i can just buy a clock! very scam','2022-01-31 11:58:05'),(27,15,4,'4','very fast and goof for the money','2022-01-31 11:58:29'),(28,7,4,'3','quite overpriced, the kingston ssd is better','2022-01-31 11:58:43'),(29,22,4,'5','very huge phone good for watching my faovurite content','2022-01-31 11:58:57'),(30,14,4,'4','i love the blue colour and oneplus UI is so smooth','2022-01-31 12:00:20'),(31,4,4,'5','Iphone is like god tier ','2022-01-31 12:00:37'),(32,11,4,'3','good an dcheap','2022-01-31 12:00:47'),(33,23,1,'3','<script>alert(\"Hi\")</script>','2022-02-04 14:15:27'),(34,23,13,'3','<img src=\"www.google.com\" />','2022-02-04 14:16:19');
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `userid` int NOT NULL AUTO_INCREMENT,
  `username` varchar(45) NOT NULL,
  `email` varchar(320) NOT NULL,
  `contact` int NOT NULL,
  `password` varchar(100) NOT NULL,
  `type` varchar(30) NOT NULL,
  `profile_pic_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`userid`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Table of all users and attributes of users';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Terry Tan','terry@gmail.com',91234567,'TerryPW','Customer','https://www.abc.com/terry.jpg','2021-12-03 05:53:02'),(2,'JoydurnNew','newjayden@newmail.com',87654321,'newpassword123','Admin','newprofilepic.jpg','2021-12-03 07:01:29'),(3,'EthanGuy','ethan@email.com',54288925,'ethanpw','Customer','ethan.jpg','2021-12-14 12:21:54'),(4,'markz123','markz@gmail.com',67894897,'markz56','Admin','https://www.googleimage.com/markz.jpg','2021-12-31 15:43:48'),(6,'MrLoh','mrloh@gmail.com\n',98564765,'mrLoh123','Admin','https://www.googleimage.com/mrloh.jpg','2022-01-04 07:51:11'),(9,'Caroline','carol@gmail.com',92286603,'koh123','Customer','https://www.googleimage.com/carol.jpg','2022-01-14 12:52:18'),(11,'Amin Nik Strater','amin@amail.com',60547569,'password','Admin','http://cdn1.vectorstock.com/i/1000x1000/11/10/admin-icon-male-person-profile-avatar-with-gear-vector-25811110.jpg','2022-01-27 06:57:22'),(13,'Custer Mah','custer@cmail.com',5555555,'password','Customer','http://cdn5.vectorstock.com/i/1000x1000/18/39/shopper-icon-with-male-customer-person-profile-vector-25841839.jpg','2022-01-27 06:58:51');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'sp_it'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-02-06 11:46:24
