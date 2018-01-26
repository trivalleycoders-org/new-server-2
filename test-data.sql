-- phpMyAdmin SQL Dump
-- version 4.7.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Dec 07, 2017 at 09:09 AM
-- Server version: 5.6.35
-- PHP Version: 7.1.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `rotary_club`
--

-- --------------------------------------------------------

--
-- Table structure for table `exclusions`
--

DROP TABLE IF EXISTS `exclusions`;
CREATE TABLE `exclusions` (
  `exclusion_id` int(11) NOT NULL,
  `member_id` int(11) DEFAULT NULL,
  `role_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `exclusions`
--

INSERT INTO `exclusions` (`exclusion_id`, `member_id`, `role_id`) VALUES
(1, 5, 4),
(2, 5, 3),
(3, 3, 2);

-- --------------------------------------------------------

--
-- Table structure for table `history`
--

DROP TABLE IF EXISTS `history`;
CREATE TABLE `history` (
  `history_id` int(11) NOT NULL,
  `date` date DEFAULT NULL,
  `member_id` int(11) DEFAULT NULL,
  `role_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `history`
--

INSERT INTO `history` (`history_id`, `date`, `member_id`, `role_id`) VALUES
(3, '2017-08-30', 3, 3),
(5, '2017-08-31', 5, 5),
(6, '2017-08-31', 6, 6),
(7, '2017-09-07', 7, 1),
(8, '2017-09-07', 8, 2),
(9, '2017-09-07', 1, 3),
(10, '2017-09-07', 2, 4),
(11, '2017-09-07', 3, 5),
(13, '2017-09-14', 5, 1),
(14, '2017-09-14', 6, 2),
(15, '2017-09-14', 7, 3),
(16, '2017-09-14', 8, 4),
(17, '2017-09-14', 1, 5),
(18, '2017-09-14', 2, 6),
(19, '2017-09-21', 3, 1),
(21, '2017-09-21', 5, 3),
(22, '2017-09-21', 6, 4),
(23, '2017-09-21', 7, 5),
(24, NULL, 8, 6),
(25, '2017-09-28', 1, 1),
(26, '2017-09-28', 2, 2),
(27, '2017-09-28', 3, 3),
(29, '2017-09-28', 5, 5),
(30, '2017-09-28', 6, 6),
(31, '2017-10-05', 7, 1),
(32, '2017-10-05', 8, 2),
(33, '2017-10-05', 1, 3),
(34, '2017-10-05', 2, 4),
(35, '2017-10-05', 3, 5),
(37, '2017-10-12', 5, 1),
(38, NULL, 6, 2),
(39, NULL, 7, 3),
(40, NULL, 8, 4),
(41, NULL, 1, 5),
(42, NULL, 2, 6),
(43, '2016-08-31', 1, 3);

-- --------------------------------------------------------

--
-- Table structure for table `members`
--

DROP TABLE IF EXISTS `members`;
CREATE TABLE `members` (
  `member_id` int(11) NOT NULL,
  `first_name` varchar(45) DEFAULT NULL,
  `last_name` varchar(45) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  `exempt` tinyint(4) DEFAULT NULL,
  `comment` varchar(1024) DEFAULT NULL,
  `phone_number` varchar(45) DEFAULT NULL,
  `active` tinyint(3) UNSIGNED NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `members`
--

INSERT INTO `members` (`member_id`, `first_name`, `last_name`, `email`, `exempt`, `comment`, `phone_number`, `active`) VALUES
(1, 'Michael', 'Costanza', 'email01@email.com', 0, '', '222-222-2221', 1),
(2, 'Karl', 'Ecker', 'email02@email.com', 0, '', '222-222-2222', 1),
(3, 'Laura', 'Silvey', 'email03@email.com', 0, '', '222-222-2223', 1),
(4, 'Kevin', 'Smith', 'email04@email.com', 0, '', '222-222-2224', 1),
(5, 'Jim', 'Lin', 'email05@email.com', 0, '', '222-222-2225', 1),
(6, 'Daniel', 'Thalhuber', 'email06@email.com', 0, '', '222-222-2226', 1),
(7, 'Sam', 'Othergai', 'email07@email.com', 0, NULL, '222-222-2227', 1),
(8, 'Ann', 'Otheruser', 'email08@email.com', 0, NULL, '222-222-2228', 1);

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `role_id` int(11) NOT NULL,
  `role_name` varchar(255) NOT NULL,
  `served` tinyint(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`role_id`, `role_name`, `served`) VALUES
(1, 'role01', NULL),
(2, 'role02', NULL),
(3, 'role03', NULL),
(4, 'role04', NULL),
(5, 'role05', NULL),
(6, 'role06', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `exclusions`
--
ALTER TABLE `exclusions`
  ADD PRIMARY KEY (`exclusion_id`),
  ADD KEY `member_id_idx` (`member_id`),
  ADD KEY `exclusion_role_id_idx` (`role_id`);

--
-- Indexes for table `history`
--
ALTER TABLE `history`
  ADD PRIMARY KEY (`history_id`),
  ADD KEY `member_id_idx` (`member_id`),
  ADD KEY `role_id_idx` (`role_id`),
  ADD KEY `date` (`date`) USING BTREE;

--
-- Indexes for table `members`
--
ALTER TABLE `members`
  ADD PRIMARY KEY (`member_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`role_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `exclusions`
--
ALTER TABLE `exclusions`
  MODIFY `exclusion_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `history`
--
ALTER TABLE `history`
  MODIFY `history_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;
--
-- AUTO_INCREMENT for table `members`
--
ALTER TABLE `members`
  MODIFY `member_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `role_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `exclusions`
--
ALTER TABLE `exclusions`
  ADD CONSTRAINT `exclusion_member_id` FOREIGN KEY (`member_id`) REFERENCES `members` (`member_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `exclusion_role_id` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `history`
--
ALTER TABLE `history`
  ADD CONSTRAINT `history_member_id` FOREIGN KEY (`member_id`) REFERENCES `members` (`member_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `history_role_id` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`) ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
