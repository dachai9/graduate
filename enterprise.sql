/*
Navicat MySQL Data Transfer

Source Server         : root
Source Server Version : 80016
Source Host           : localhost:3306
Source Database       : enterprise

Target Server Type    : MYSQL
Target Server Version : 80016
File Encoding         : 65001

Date: 2022-04-19 03:08:34
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for allstaff
-- ----------------------------
DROP TABLE IF EXISTS `allstaff`;
CREATE TABLE `allstaff` (
  `staffId` int(11) NOT NULL,
  `staffName` varchar(45) NOT NULL,
  `psw` varchar(45) NOT NULL DEFAULT '123',
  `isBoss` tinyint(4) DEFAULT '1',
  `department` varchar(45) DEFAULT NULL,
  `isRead` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`staffId`),
  UNIQUE KEY `staffId_UNIQUE` (`staffId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of allstaff
-- ----------------------------
INSERT INTO `allstaff` VALUES ('1001', '王一', '1001', '1', 'service', '[50]');
INSERT INTO `allstaff` VALUES ('1002', '李二', '1002', '0', 'service', null);
INSERT INTO `allstaff` VALUES ('1003', '刘三', '1003', '0', 'service', null);

-- ----------------------------
-- Table structure for departments
-- ----------------------------
DROP TABLE IF EXISTS `departments`;
CREATE TABLE `departments` (
  `departId` int(11) NOT NULL AUTO_INCREMENT,
  `departName` varchar(45) DEFAULT NULL,
  `weekly` int(11) DEFAULT NULL,
  `monthly` int(11) DEFAULT NULL,
  `seasonal` int(11) DEFAULT NULL,
  `yearly` int(11) DEFAULT NULL,
  PRIMARY KEY (`departId`),
  UNIQUE KEY `departId_UNIQUE` (`departId`),
  UNIQUE KEY `departName_UNIQUE` (`departName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of departments
-- ----------------------------
INSERT INTO `departments` VALUES ('1', 'RDCenter', null, null, null, null);
INSERT INTO `departments` VALUES ('2', 'service', '70', '71', '72', null);

-- ----------------------------
-- Table structure for reports
-- ----------------------------
DROP TABLE IF EXISTS `reports`;
CREATE TABLE `reports` (
  `reportId` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(45) DEFAULT NULL,
  `content` varchar(500) DEFAULT NULL,
  `rangeType` varchar(45) DEFAULT NULL,
  `submitTime` varchar(100) DEFAULT NULL,
  `saveTime` varchar(100) DEFAULT NULL,
  `author` varchar(45) DEFAULT NULL,
  `tempId` int(11) DEFAULT NULL,
  `shortCut` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`reportId`),
  UNIQUE KEY `reportId_UNIQUE` (`reportId`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of reports
-- ----------------------------
INSERT INTO `reports` VALUES ('46', '采购组第一周周报', '{\"s\":[\"纸笔，有线键盘，有线鼠标\"],\"t\":[\"2022-04-16 21:54:57\"],\"j\":[true]}', 'weekly', '2022-04-18 04:09:29', '', '王一', '70', '采购物资：纸笔，有线键盘，有线鼠标     采购时间：2022-04-16 21:54:57     是否已采购完成：true     ');
INSERT INTO `reports` VALUES ('47', '采购2组第一周周报', '{\"s\":[\"一次性纸杯，随手小风扇\"],\"t\":[\"2022-04-15 22:09:54\"],\"j\":[true]}', 'weekly', null, '2022-04-16 22:10:46', '李二', '70', '采购物资：一次性纸杯，随手小风扇     采购时间：2022-04-15 22:09:54     是否已采购完成：true     ');
INSERT INTO `reports` VALUES ('50', '采购3组第一周周报', '{\"s\":[\"电脑屏幕，电脑充电器\"],\"t\":[\"2022-04-16 22:19:08\"],\"j\":[true]}', 'weekly', '2022-04-19 03:04:09', '', '刘三', '70', '采购物资：电脑屏幕，电脑充电器     采购时间：2022-04-16 22:19:08     是否已采购完成：true     ');
INSERT INTO `reports` VALUES ('52', '采购第一次月报', '{\"s\":[\"12\"],\"m\":[\"纸巾\"]}', 'monthly', null, '2022-04-17 03:10:30', '王一', '71', '报销金额：12     报销物件：纸巾     ');

-- ----------------------------
-- Table structure for templates
-- ----------------------------
DROP TABLE IF EXISTS `templates`;
CREATE TABLE `templates` (
  `tempId` int(11) NOT NULL AUTO_INCREMENT,
  `temp` varchar(500) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `saveTime` varchar(255) DEFAULT NULL,
  `submitTime` varchar(255) DEFAULT NULL,
  `author` varchar(255) DEFAULT NULL,
  `updateTime` varchar(255) DEFAULT NULL,
  `submitList` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`tempId`),
  UNIQUE KEY `tempId_UNIQUE` (`tempId`) /*!80000 INVISIBLE */
) ENGINE=InnoDB AUTO_INCREMENT=77 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of templates
-- ----------------------------
INSERT INTO `templates` VALUES ('70', '{\"range\":\"weekly\",\"size\":\"default\",\"s\":[\"true&@#0&@#采购物资\"],\"t\":[\"true&@#1&@#采购时间\"],\"j\":[\"true&@#2&@#是否已采购完成\"]}', '测试', null, '2022-04-16 21:54:49', '王一', '[{\"day\":\"Tuesday\",\"time\":\"00:10:00\"}]', '[\"王一\",\"刘三\"]');
INSERT INTO `templates` VALUES ('71', '{\"range\":\"monthly\",\"size\":\"default\",\"s\":[\"true&@#0&@#报销金额\"],\"m\":[\"true&@#1&@#报销物件\"]}', '采购组第一季度月报', null, '2022-04-16 22:33:40', '王一', '[{\"day\":\"19\",\"time\":\"00:10:00\"}]', null);
INSERT INTO `templates` VALUES ('72', '{\"range\":\"seasonal\",\"size\":\"default\",\"s\":[\"true&@#0&@#采购报销金额\",\"true&@#2&@#采购人员\"],\"m\":[\"true&@#1&@#采购物资及具体数量\"]}', '采购组季度', null, '2022-04-17 02:59:15', '王一', '[{\"day\":\"01.01\",\"time\":\"00:10:00\"},{\"day\":\"04.19\",\"time\":\"00:10:00\"},{\"day\":\"08.01\",\"time\":\"00:10:00\"},{\"day\":\"12.01\",\"time\":\"00:10:00\"}]', null);
INSERT INTO `templates` VALUES ('73', '{\"range\":\"weekly\",\"size\":\"default\",\"s\":[\"true&@#0&@#项目编号\"],\"m\":[\"true&@#1&@#项目详情\"]}', '开发周报1', '2022-04-17 22:59:18', null, '王一', null, null);
INSERT INTO `templates` VALUES ('74', '{\"range\":\"yearly\",\"size\":\"default\",\"s\":[\"true&@#0&@#项目编号\",\"true&@#1&@#项目名称\"],\"m\":[\"false&@#2&@#项目详情\"]}', '开发年报', '2022-04-17 23:00:08', null, '王一', '[{\"day\":\"01.01\",\"time\":\"00:10:00\"}]', null);
INSERT INTO `templates` VALUES ('75', '{\"range\":\"yearly\",\"size\":\"default\",\"s\":[\"true&@#0&@#项目编号\",\"true&@#1&@#项目名称\"],\"m\":[\"false&@#2&@#项目详情\"]}', '开发年报1', '2022-04-17 23:01:57', null, '王一', '[{\"day\":\"01.01\",\"time\":\"00:10:00\"}]', null);
INSERT INTO `templates` VALUES ('76', '{\"range\":\"seasonal\",\"size\":\"default\",\"s\":[\"true&@#0&@#至今完成的项目编号\"],\"m\":[\"false&@#1&@#项目简介\"]}', '开发团队季报1', '2022-04-17 23:12:53', null, '王一', '[{\"day\":\"01.01\",\"time\":\"00:10:00\"},{\"day\":\"04.18\",\"time\":\"00:10:00\"},{\"day\":\"08.01\",\"time\":\"00:10:00\"},{\"day\":\"12.01\",\"time\":\"00:10:00\"}]', null);

-- ----------------------------
-- Procedure structure for update_test
-- ----------------------------
DROP PROCEDURE IF EXISTS `update_test`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `update_test`()
UPDATE templates set submitList = '[]' where tempId = 74
;;
DELIMITER ;
