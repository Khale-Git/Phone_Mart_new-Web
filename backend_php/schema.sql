-- phpMyAdmin SQL Dump
-- version 5.2.1deb3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 27, 2025 at 08:28 AM
-- Server version: 8.0.43-0ubuntu0.24.04.2
-- PHP Version: 8.3.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `phone_mart`
--

-- --------------------------------------------------------

--
-- Table structure for table `articles`
--

CREATE TABLE `articles` (
  `id` int NOT NULL,
  `topic` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `citations` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `id` int NOT NULL,
  `product_id` int DEFAULT NULL,
  `product_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `product_description` text COLLATE utf8mb4_general_ci,
  `price` decimal(10,2) NOT NULL,
  `image_url` varchar(2083) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `quantity` int DEFAULT '1',
  `user_email` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `added_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cart`
--

INSERT INTO `cart` (`id`, `product_id`, `product_name`, `product_description`, `price`, `image_url`, `quantity`, `user_email`, `added_at`) VALUES
(123, 1, 'iPhone 13', 'Latest model with A15 Bionic chip', 73000.00, 'https://www.bing.com/th?id=OIP.pKgUChh3jFH-Oc9ZNzWNqgHaFA&w=190&h=185&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2', 1, 'zablon@gmail.com', '2025-04-04 14:41:40'),
(124, 3, 'Google Pixel 6', 'New phone with Google Tensor chip', 38000.00, 'https://www.bing.com/th?id=OIP.GTlg2SDK3aK8OnUfEzUIkgHaEK&w=202&h=200&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2', 1, 'zablon@gmail.com', '2025-04-04 14:41:57'),
(132, 2, 'Samsung Galaxy S21', 'Flagship model with AMOLED display', 88500.00, 'https://th.bing.com/th/id/OIP.oKCm0Bwp3C_ZEk16ADqPigHaHa?pid=ImgDet&w=178&h=178&c=7&dpr=1.5', 1, 'test@example.com', '2025-04-08 18:30:09'),
(152, 7, 'Samsung Galaxy S25 Ultra', 'Flagship device with Snapdragon 8 Elite processor, 200MP camera, and AI-powered features', 139000.00, 'https://yuvapatrkaar.com/static/c1e/client/107569/uploaded/4b6fce71dc1f51193c7af40bea07fcde.jpg', 1, 'obel@gmail.com', '2025-04-15 09:28:49'),
(153, 8, 'iPhone 16 Pro Max', 'Apple’s latest flagship with epic battery life and advanced Apple Intelligence AI features', 157000.00, 'https://th.bing.com/th/id/OIP.nNtmgcj9hUsWy4j2M1SnogHaKX?rs=1&pid=ImgDetMain', 1, 'obel@gmail.com', '2025-04-15 09:28:52'),
(182, 3, 'Google Pixel 6', 'New phone with Google Tensor chip', 38000.00, 'https://www.bing.com/th?id=OIP.GTlg2SDK3aK8OnUfEzUIkgHaEK&w=202&h=200&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2', 1, 'chrismburu@gmail.com', '2025-08-05 16:43:43'),
(199, 9, 'Google Pixel 9 Pro', 'Known for its AI-powered photography and Google Tensor G3 chip for cutting-edge performance', 105000.00, 'https://th.bing.com/th/id/OIP.QATxHyWmydwh6BDGNTmJ_AHaHa?rs=1&pid=ImgDetMain', 1, 'ernesto@gmail.com', '2025-10-29 07:20:16'),
(200, 3, 'Google Pixel 6', 'New phone with Google Tensor chip', 38000.00, 'https://www.bing.com/th?id=OIP.GTlg2SDK3aK8OnUfEzUIkgHaEK&w=202&h=200&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2', 1, 'ernesto@gmail.com', '2025-10-31 06:24:11'),
(201, 7, 'Samsung Galaxy S25 Ultra', 'Flagship device with Snapdragon 8 Elite processor, 200MP camera, and AI-powered features', 139000.00, 'https://yuvapatrkaar.com/static/c1e/client/107569/uploaded/4b6fce71dc1f51193c7af40bea07fcde.jpg', 1, 'ernesto@gmail.com', '2025-10-31 06:24:14'),
(202, 8, 'iPhone 16 Pro Max', 'Apple’s latest flagship with epic battery life and advanced Apple Intelligence AI features', 157000.00, 'https://th.bing.com/th/id/OIP.nNtmgcj9hUsWy4j2M1SnogHaKX?rs=1&pid=ImgDetMain', 2, 'ernesto@gmail.com', '2025-10-31 06:24:15'),
(203, 8, 'iPhone 16 Pro Max', 'Apple’s latest flagship with epic battery life and advanced Apple Intelligence AI features', 157000.00, 'https://th.bing.com/th/id/OIP.nNtmgcj9hUsWy4j2M1SnogHaKX?rs=1&pid=ImgDetMain', 4, 'ikiromo9@gmail.com', '2025-10-31 06:24:46'),
(233, 3, 'Google Pixel 6', 'New phone with Google Tensor chip', 38000.00, 'https://www.bing.com/th?id=OIP.GTlg2SDK3aK8OnUfEzUIkgHaEK&w=202&h=200&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2', 1, 'Admin@gmail.com', '2025-11-22 20:48:46');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int NOT NULL,
  `product_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `product_description` text COLLATE utf8mb4_general_ci NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `image_url` varchar(2083) COLLATE utf8mb4_general_ci NOT NULL,
  `payment_method` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `user_email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `order_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `quantity` int DEFAULT '1',
  `staff_id` int DEFAULT NULL COMMENT 'ID of the staff member who processed the sale (for commissions)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `product_name`, `product_description`, `price`, `image_url`, `payment_method`, `user_email`, `order_date`, `quantity`, `staff_id`) VALUES
(50, 'OnePlus 12R', '4th Generation LTPO 120 Hz ProXDR Display\r\n5500 mAh Battery + 100W SUPERVOOC\r\nAll-new Dual Cryo-velocity VC Cooling System\r\nQualcomm Snapdragon® 8 Gen 2\r\nUp to 16GB LPDDR5X RAM\r\n50MP SONY IMX890 Camera', 60000.00, 'https://th.bing.com/th/id/OIP.JFzFUASJTY5zsxkD_SV7dgHaHa?rs=1&pid=ImgDetMain', 'M-Pesa', 'ikiromo9@gmail.com', '2025-04-08 18:40:25', 1, NULL),
(51, 'OnePlus 12R', '4th Generation LTPO 120 Hz ProXDR Display\r\n5500 mAh Battery + 100W SUPERVOOC\r\nAll-new Dual Cryo-velocity VC Cooling System\r\nQualcomm Snapdragon® 8 Gen 2\r\nUp to 16GB LPDDR5X RAM\r\n50MP SONY IMX890 Camera', 60000.00, 'https://th.bing.com/th/id/OIP.JFzFUASJTY5zsxkD_SV7dgHaHa?rs=1&pid=ImgDetMain', 'PayPal', 'ikiromo9@gmail.com', '2025-04-08 18:41:53', 2, NULL),
(52, 'iPhone 13', 'Latest model with A15 Bionic chip', 73000.00, 'https://www.bing.com/th?id=OIP.pKgUChh3jFH-Oc9ZNzWNqgHaFA&w=190&h=185&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2', 'PayPal', 'ikiromo9@gmail.com', '2025-04-08 18:41:53', 1, NULL),
(53, 'Samsung Galaxy S21', 'Flagship model with AMOLED display', 88500.00, 'https://th.bing.com/th/id/OIP.oKCm0Bwp3C_ZEk16ADqPigHaHa?pid=ImgDet&w=178&h=178&c=7&dpr=1.5', 'PayPal', 'ikiromo9@gmail.com', '2025-04-08 18:41:53', 1, NULL),
(54, 'Google Pixel 6', 'New phone with Google Tensor chip', 38000.00, 'https://www.bing.com/th?id=OIP.GTlg2SDK3aK8OnUfEzUIkgHaEK&w=202&h=200&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2', 'PayPal', 'ikiromo9@gmail.com', '2025-04-08 18:41:53', 1, NULL),
(55, 'Samsung Galaxy S25 Ultra', 'Flagship device with Snapdragon 8 Elite processor, 200MP camera, and AI-powered features', 139000.00, 'https://yuvapatrkaar.com/static/c1e/client/107569/uploaded/4b6fce71dc1f51193c7af40bea07fcde.jpg', 'PayPal', 'ikiromo9@gmail.com', '2025-04-08 18:41:53', 1, NULL),
(56, 'Samsung Galaxy S25 Ultra', 'Flagship device with Snapdragon 8 Elite processor, 200MP camera, and AI-powered features', 139000.00, 'https://yuvapatrkaar.com/static/c1e/client/107569/uploaded/4b6fce71dc1f51193c7af40bea07fcde.jpg', 'Credit Card', 'ikiromo9@gmail.com', '2025-04-08 18:55:45', 1, NULL),
(57, 'Google Pixel 8 pro', 'Pixel 8 Pro, the First Smartphone with Google AI built-in\r\nThe new Google Tensor G3 chip is custom-designed with Google AI for cutting-edge photo and video features on Google ', 88000.00, 'https://www.bing.com/th?id=OIP.mMuoq3g7Z0imWBOzOE_QJgHaEK&w=314&h=200&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2', 'PayPal', 'ikiromo9@gmail.com', '2025-04-09 06:42:32', 1, NULL),
(67, 'Samsung Galaxy S21', 'Flagship model with AMOLED display', 88500.00, 'https://th.bing.com/th/id/OIP.oKCm0Bwp3C_ZEk16ADqPigHaHa?pid=ImgDet&w=178&h=178&c=7&dpr=1.5', 'M-Pesa', 'ikiromo9@gmail.com', '2025-04-25 10:01:41', 2, NULL),
(68, 'iPhone 13', 'Latest model with A15 Bionic chip', 73000.00, 'https://www.bing.com/th?id=OIP.pKgUChh3jFH-Oc9ZNzWNqgHaFA&w=190&h=185&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2', 'M-Pesa', 'chrismburu@gmail.com', '2025-04-25 10:11:20', 1, NULL),
(69, 'iPhone 13', 'Latest model with A15 Bionic chip', 73000.00, 'https://www.bing.com/th?id=OIP.pKgUChh3jFH-Oc9ZNzWNqgHaFA&w=190&h=185&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2', 'PayPal', 'chrismburu@gmail.com', '2025-04-26 08:10:53', 1, NULL),
(70, 'Samsung Galaxy S21', 'Flagship model with AMOLED display', 88500.00, 'https://th.bing.com/th/id/OIP.oKCm0Bwp3C_ZEk16ADqPigHaHa?pid=ImgDet&w=178&h=178&c=7&dpr=1.5', 'PayPal', 'ikiromo9@gmail.com', '2025-04-26 16:41:31', 2, NULL),
(71, 'Samsung Galaxy S25 Ultra', 'Flagship device with Snapdragon 8 Elite processor, 200MP camera, and AI-powered features', 139000.00, 'https://yuvapatrkaar.com/static/c1e/client/107569/uploaded/4b6fce71dc1f51193c7af40bea07fcde.jpg', 'M-Pesa', 'chrismburu@gmail.com', '2025-04-26 17:38:46', 1, NULL),
(72, 'Google Pixel 9 Pro', 'Known for its AI-powered photography and Google Tensor G3 chip for cutting-edge performance', 105000.00, 'https://th.bing.com/th/id/OIP.QATxHyWmydwh6BDGNTmJ_AHaHa?rs=1&pid=ImgDetMain', 'M-Pesa', 'chrismburu@gmail.com', '2025-04-26 17:38:46', 1, NULL),
(73, 'Google Pixel 6', 'New phone with Google Tensor chip', 38000.00, 'https://www.bing.com/th?id=OIP.GTlg2SDK3aK8OnUfEzUIkgHaEK&w=202&h=200&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2', 'M-Pesa', 'ikiromo9@gmail.com', '2025-04-26 17:49:35', 1, NULL),
(74, 'Google Pixel 8 pro', 'Pixel 8 Pro, the First Smartphone with Google AI built-in\r\nThe new Google Tensor G3 chip is custom-designed with Google AI for cutting-edge photo and video features on Google ', 88000.00, 'https://www.bing.com/th?id=OIP.mMuoq3g7Z0imWBOzOE_QJgHaEK&w=314&h=200&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2', 'M-Pesa', 'ikiromo9@gmail.com', '2025-04-26 17:49:35', 1, NULL),
(75, 'iPhone 16 Pro Max', 'Apple’s latest flagship with epic battery life and advanced Apple Intelligence AI features', 157000.00, 'https://th.bing.com/th/id/OIP.nNtmgcj9hUsWy4j2M1SnogHaKX?rs=1&pid=ImgDetMain', 'M-Pesa', 'ikiromo9@gmail.com', '2025-04-26 17:49:35', 1, NULL),
(76, 'Google Pixel 6', 'New phone with Google Tensor chip', 38000.00, 'https://www.bing.com/th?id=OIP.GTlg2SDK3aK8OnUfEzUIkgHaEK&w=202&h=200&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2', 'M-Pesa', 'ikiromo9@gmail.com', '2025-04-26 18:18:12', 1, NULL),
(77, 'iPhone 16 Pro Max', 'Apple’s latest flagship with epic battery life and advanced Apple Intelligence AI features', 157000.00, 'https://th.bing.com/th/id/OIP.nNtmgcj9hUsWy4j2M1SnogHaKX?rs=1&pid=ImgDetMain', 'M-Pesa', 'ikiromo9@gmail.com', '2025-04-26 18:18:12', 1, NULL),
(78, 'iPhone 16 Pro Max', 'Apple’s latest flagship with epic battery life and advanced Apple Intelligence AI features', 157000.00, 'https://th.bing.com/th/id/OIP.nNtmgcj9hUsWy4j2M1SnogHaKX?rs=1&pid=ImgDetMain', 'PayPal', 'ikiromo9@gmail.com', '2025-04-26 18:18:44', 1, NULL),
(79, 'Google Pixel 9 Pro', 'Known for its AI-powered photography and Google Tensor G3 chip for cutting-edge performance', 105000.00, 'https://th.bing.com/th/id/OIP.QATxHyWmydwh6BDGNTmJ_AHaHa?rs=1&pid=ImgDetMain', 'M-Pesa', 'ikiromo9@gmail.com', '2025-04-27 14:39:02', 1, NULL),
(80, 'Google Pixel 6', 'New phone with Google Tensor chip', 38000.00, 'https://www.bing.com/th?id=OIP.GTlg2SDK3aK8OnUfEzUIkgHaEK&w=202&h=200&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2', 'M-Pesa', 'chrismburu@gmail.com', '2025-06-12 15:18:36', 1, NULL),
(81, 'Google Pixel 6', 'New phone with Google Tensor chip', 38000.00, 'https://www.bing.com/th?id=OIP.GTlg2SDK3aK8OnUfEzUIkgHaEK&w=202&h=200&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2', 'Credit Card', 'chrismburu@gmail.com', '2025-08-05 16:44:00', 1, NULL),
(82, 'Google Pixel 8 pro', 'Pixel 8 Pro, the First Smartphone with Google AI built-in\r\nThe new Google Tensor G3 chip is custom-designed with Google AI for cutting-edge photo and video features on Google ', 88000.00, 'https://www.bing.com/th?id=OIP.mMuoq3g7Z0imWBOzOE_QJgHaEK&w=314&h=200&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2', 'M-Pesa', 'ernesto@gmail.com', '2025-10-26 19:01:32', 1, NULL),
(83, 'Google Pixel 6', 'New phone with Google Tensor chip', 38000.00, 'https://www.bing.com/th?id=OIP.GTlg2SDK3aK8OnUfEzUIkgHaEK&w=202&h=200&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2', 'M-Pesa', 'ernesto@gmail.com', '2025-10-26 19:01:32', 1, NULL),
(84, 'Google Pixel 6', 'New phone with Google Tensor chip', 38000.00, 'https://www.bing.com/th?id=OIP.GTlg2SDK3aK8OnUfEzUIkgHaEK&w=202&h=200&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2', 'PayPal', 'ernesto@gmail.com', '2025-10-27 05:42:19', 2, NULL),
(85, 'Samsung Galaxy S21', 'Flagship model with AMOLED display', 88500.00, 'https://th.bing.com/th/id/OIP.oKCm0Bwp3C_ZEk16ADqPigHaHa?pid=ImgDet&w=178&h=178&c=7&dpr=1.5', 'PayPal', 'ernesto@gmail.com', '2025-10-27 05:42:19', 1, NULL),
(86, 'Google Pixel 6', 'New phone with Google Tensor chip', 38000.00, 'https://www.bing.com/th?id=OIP.GTlg2SDK3aK8OnUfEzUIkgHaEK&w=202&h=200&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2', 'PayPal', 'Admin@gmail.com', '2025-10-29 07:10:11', 1, NULL),
(87, 'Google Pixel 9 Pro', 'Known for its AI-powered photography and Google Tensor G3 chip for cutting-edge performance', 105000.00, 'https://th.bing.com/th/id/OIP.QATxHyWmydwh6BDGNTmJ_AHaHa?rs=1&pid=ImgDetMain', 'M-Pesa', 'ernesto@gmail.com', '2025-10-29 07:20:52', 1, NULL),
(88, 'Google Pixel 9 Pro', 'Known for its AI-powered photography and Google Tensor G3 chip for cutting-edge performance', 105000.00, 'https://th.bing.com/th/id/OIP.QATxHyWmydwh6BDGNTmJ_AHaHa?rs=1&pid=ImgDetMain', 'PayPal', 'ernesto@gmail.com', '2025-10-31 06:24:33', 1, NULL),
(89, 'Google Pixel 6', 'New phone with Google Tensor chip', 38000.00, 'https://www.bing.com/th?id=OIP.GTlg2SDK3aK8OnUfEzUIkgHaEK&w=202&h=200&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2', 'PayPal', 'ernesto@gmail.com', '2025-10-31 06:24:33', 1, NULL),
(90, 'Samsung Galaxy S25 Ultra', 'Flagship device with Snapdragon 8 Elite processor, 200MP camera, and AI-powered features', 139000.00, 'https://yuvapatrkaar.com/static/c1e/client/107569/uploaded/4b6fce71dc1f51193c7af40bea07fcde.jpg', 'PayPal', 'ernesto@gmail.com', '2025-10-31 06:24:33', 1, NULL),
(91, 'iPhone 16 Pro Max', 'Apple’s latest flagship with epic battery life and advanced Apple Intelligence AI features', 157000.00, 'https://th.bing.com/th/id/OIP.nNtmgcj9hUsWy4j2M1SnogHaKX?rs=1&pid=ImgDetMain', 'PayPal', 'ernesto@gmail.com', '2025-10-31 06:24:33', 2, NULL),
(92, 'iPhone 16 Pro Max', 'Apple’s latest flagship with epic battery life and advanced Apple Intelligence AI features', 157000.00, 'https://th.bing.com/th/id/OIP.nNtmgcj9hUsWy4j2M1SnogHaKX?rs=1&pid=ImgDetMain', 'M-Pesa', 'ikiromo9@gmail.com', '2025-10-31 06:25:11', 4, NULL),
(93, 'iPhone 16 Pro Max', 'Apple’s latest flagship with epic battery life and advanced Apple Intelligence AI features', 157000.00, 'https://th.bing.com/th/id/OIP.nNtmgcj9hUsWy4j2M1SnogHaKX?rs=1&pid=ImgDetMain', 'PayPal', 'ikiromo9@gmail.com', '2025-10-31 06:25:21', 4, NULL),
(94, 'Nothing Phone 3a', 'Mid-range phone with unique transparent design and Snapdragon 7s Gen 3 processor', 60000.00, 'https://th.bing.com/th/id/R.fdfe3c74217c5653a0a0b4801fa6c9a9?rik=134Ghcy3Fho0fA&riu=http%3a%2f%2fwww.gsmpro.cl%2fcdn%2fshop%2farticles%2fNothing-Phone-3.jpg%3fv%3d1721072828&ehk=PoqzaVmSmUfTBCrgOSy%2bwwkfA06y%2fMJYSwPpGQc5izE%3d&risl=&pid=ImgRaw&r=0', 'PayPal', 'Admin@gmail.com', '2025-11-03 08:28:00', 1, NULL),
(95, 'Google Pixel 9 Pro (Unit S)', 'Tracked sale of specific Pixel 9 Pro unit.', 105000.00, 'https://th.bing.com/th/id/OIP.QATxHyWmydwh6BDGNTmJ_AHaHa?rs=1&pid=ImgDetMain', 'M-Pesa', 'ernesto@gmail.com', '2025-11-13 09:14:03', 1, 68),
(96, 'Google Pixel 8 pro', 'Pixel 8 Pro, the First Smartphone with Google AI built-in\r\nThe new Google Tensor G3 chip is custom-designed with Google AI for cutting-edge photo and video features on Google ', 88000.00, 'https://www.bing.com/th?id=OIP.mMuoq3g7Z0imWBOzOE_QJgHaEK&w=314&h=200&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2', 'M-Pesa', 'Admin@gmail.com', '2025-11-13 09:54:04', 3, NULL),
(97, 'Google Pixel 6', 'New phone with Google Tensor chip', 38000.00, 'https://www.bing.com/th?id=OIP.GTlg2SDK3aK8OnUfEzUIkgHaEK&w=202&h=200&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2', 'M-Pesa', 'Admin@gmail.com', '2025-11-13 09:54:04', 3, NULL),
(98, 'Nothing Phone 3a', 'Mid-range phone with unique transparent design and Snapdragon 7s Gen 3 processor', 60000.00, 'https://th.bing.com/th/id/R.fdfe3c74217c5653a0a0b4801fa6c9a9?rik=134Ghcy3Fho0fA&riu=http%3a%2f%2fwww.gsmpro.cl%2fcdn%2fshop%2farticles%2fNothing-Phone-3.jpg%3fv%3d1721072828&ehk=PoqzaVmSmUfTBCrgOSy%2bwwkfA06y%2fMJYSwPpGQc5izE%3d&risl=&pid=ImgRaw&r=0', 'M-Pesa', 'Admin@gmail.com', '2025-11-13 09:54:04', 1, NULL),
(99, 'Google Pixel 9 Pro', 'Known for its AI-powered photography and Google Tensor G3 chip for cutting-edge performance', 105000.00, 'https://th.bing.com/th/id/OIP.QATxHyWmydwh6BDGNTmJ_AHaHa?rs=1&pid=ImgDetMain', 'M-Pesa', 'Admin@gmail.com', '2025-11-13 09:54:04', 2, NULL),
(100, 'Samsung Galaxy S25 Ultra', 'Flagship device with Snapdragon 8 Elite processor, 200MP camera, and AI-powered features', 139000.00, 'https://yuvapatrkaar.com/static/c1e/client/107569/uploaded/4b6fce71dc1f51193c7af40bea07fcde.jpg', 'PayPal', 'Admin@gmail.com', '2025-11-13 09:54:31', 1, NULL),
(101, 'Google Pixel 9 Pro', 'Known for its AI-powered photography and Google Tensor G3 chip for cutting-edge performance', 105000.00, 'https://th.bing.com/th/id/OIP.QATxHyWmydwh6BDGNTmJ_AHaHa?rs=1&pid=ImgDetMain', 'M-Pesa', 'Admin@gmail.com', '2025-11-13 09:56:42', 1, NULL),
(102, 'Google Pixel 9 Pro', 'Known for its AI-powered photography and Google Tensor G3 chip for cutting-edge performance', 105000.00, 'https://th.bing.com/th/id/OIP.QATxHyWmydwh6BDGNTmJ_AHaHa?rs=1&pid=ImgDetMain', 'M-Pesa', 'Admin@gmail.com', '2025-11-13 11:14:12', 1, NULL),
(103, 'Google Pixel 9 Pro', 'Known for its AI-powered photography and Google Tensor G3 chip for cutting-edge performance', 105000.00, 'https://th.bing.com/th/id/OIP.QATxHyWmydwh6BDGNTmJ_AHaHa?rs=1&pid=ImgDetMain', 'M-Pesa', 'Admin@gmail.com', '2025-11-19 11:13:16', 2, NULL),
(104, 'Nothing Phone 3a', 'Mid-range phone with unique transparent design and Snapdragon 7s Gen 3 processor', 60000.00, 'https://th.bing.com/th/id/R.fdfe3c74217c5653a0a0b4801fa6c9a9?rik=134Ghcy3Fho0fA&riu=http%3a%2f%2fwww.gsmpro.cl%2fcdn%2fshop%2farticles%2fNothing-Phone-3.jpg%3fv%3d1721072828&ehk=PoqzaVmSmUfTBCrgOSy%2bwwkfA06y%2fMJYSwPpGQc5izE%3d&risl=&pid=ImgRaw&r=0', 'M-Pesa', 'Admin@gmail.com', '2025-11-19 11:13:16', 1, NULL),
(105, 'Google Pixel 6', 'New phone with Google Tensor chip', 38000.00, 'https://www.bing.com/th?id=OIP.GTlg2SDK3aK8OnUfEzUIkgHaEK&w=202&h=200&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2', 'M-Pesa', 'Admin@gmail.com', '2025-11-22 20:37:51', 1, NULL),
(106, 'Google Pixel 6', 'New phone with Google Tensor chip', 38000.00, 'https://www.bing.com/th?id=OIP.GTlg2SDK3aK8OnUfEzUIkgHaEK&w=202&h=200&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2', 'Credit Card', 'Admin@gmail.com', '2025-11-22 20:49:04', 1, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `price` decimal(10,2) DEFAULT NULL,
  `image_url` varchar(10000) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `description`, `price`, `image_url`) VALUES
(1, 'iPhone 13', 'Latest model with A15 Bionic chip', 73000.00, 'https://www.bing.com/th?id=OIP.pKgUChh3jFH-Oc9ZNzWNqgHaFA&w=190&h=185&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2'),
(2, 'Samsung Galaxy S21', 'Flagship model with AMOLED display', 88500.00, 'https://th.bing.com/th/id/OIP.oKCm0Bwp3C_ZEk16ADqPigHaHa?pid=ImgDet&w=178&h=178&c=7&dpr=1.5'),
(3, 'Google Pixel 6', 'New phone with Google Tensor chip', 38000.00, 'https://www.bing.com/th?id=OIP.GTlg2SDK3aK8OnUfEzUIkgHaEK&w=202&h=200&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2'),
(4, 'Google Pixel 8 pro', 'Pixel 8 Pro, the First Smartphone with Google AI built-in\r\nThe new Google Tensor G3 chip is custom-designed with Google AI for cutting-edge photo and video features on Google ', 88000.00, 'https://www.bing.com/th?id=OIP.mMuoq3g7Z0imWBOzOE_QJgHaEK&w=314&h=200&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2'),
(6, 'OnePlus 12R', '4th Generation LTPO 120 Hz ProXDR Display\r\n5500 mAh Battery + 100W SUPERVOOC\r\nAll-new Dual Cryo-velocity VC Cooling System\r\nQualcomm Snapdragon® 8 Gen 2\r\nUp to 16GB LPDDR5X RAM\r\n50MP SONY IMX890 Camera', 60000.00, 'https://th.bing.com/th/id/OIP.JFzFUASJTY5zsxkD_SV7dgHaHa?rs=1&pid=ImgDetMain'),
(7, 'Samsung Galaxy S25 Ultra', 'Flagship device with Snapdragon 8 Elite processor, 200MP camera, and AI-powered features', 139000.00, 'https://yuvapatrkaar.com/static/c1e/client/107569/uploaded/4b6fce71dc1f51193c7af40bea07fcde.jpg'),
(8, 'iPhone 16 Pro Max', 'Apple’s latest flagship with epic battery life and advanced Apple Intelligence AI features', 157000.00, 'https://th.bing.com/th/id/OIP.nNtmgcj9hUsWy4j2M1SnogHaKX?rs=1&pid=ImgDetMain'),
(9, 'Google Pixel 9 Pro', 'Known for its AI-powered photography and Google Tensor G3 chip for cutting-edge performance', 105000.00, 'https://th.bing.com/th/id/OIP.QATxHyWmydwh6BDGNTmJ_AHaHa?rs=1&pid=ImgDetMain'),
(10, 'OnePlus 13', 'Flagship Android device with 120Hz AMOLED display and Snapdragon 8 Gen 2 processor', 120000.00, 'https://th.bing.com/th/id/OIP.2oiZiEcmubqtJiF6gdqBMQHaHa?rs=1&pid=ImgDetMain'),
(11, 'Nothing Phone 3a', 'Mid-range phone with unique transparent design and Snapdragon 7s Gen 3 processor', 60000.00, 'https://th.bing.com/th/id/R.fdfe3c74217c5653a0a0b4801fa6c9a9?rik=134Ghcy3Fho0fA&riu=http%3a%2f%2fwww.gsmpro.cl%2fcdn%2fshop%2farticles%2fNothing-Phone-3.jpg%3fv%3d1721072828&ehk=PoqzaVmSmUfTBCrgOSy%2bwwkfA06y%2fMJYSwPpGQc5izE%3d&risl=&pid=ImgRaw&r=0');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `username` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `last_logged_in` timestamp NULL DEFAULT NULL,
  `last_logged_out` datetime DEFAULT NULL,
  `role` enum('customer','staff','admin') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'customer' COMMENT 'Defines user role for POS permissions and commission',
  `loyalty_points` int DEFAULT '0' COMMENT 'Customer loyalty points balance'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `created_at`, `updated_at`, `last_logged_in`, `last_logged_out`, `role`, `loyalty_points`) VALUES
(50, 'john', 'johntest@gmail.com', '$2y$10$mqIjBNnwUgU9liIHHpOufutJ9prKHJnA5Jvz83eYtb5KWO.Ir9OHm', '2025-03-06 15:52:06', '2025-03-06 15:52:06', NULL, NULL, 'customer', 0),
(54, 'Ian', 'ikiromo9@gmail.com', '$2y$10$oYcapLcd4gNTXJyz41J1s.OPEZ3j1X2wJ5K5Su3sS8anlGDV2EYV6', '2025-03-31 12:26:50', '2025-10-31 07:50:58', '2025-10-31 07:50:58', NULL, 'customer', 0),
(55, 'Bosko', 'bosko@gmail.com', '$2y$10$yUBIL0LsexFS/IApd4KBqOmog5aeg6p53CMgVy6st8xodJRPkMePe', '2025-03-31 12:30:13', '2025-03-31 12:30:13', NULL, NULL, 'customer', 0),
(56, 'christiankimani', 'chrismburu@gmail.com', '$2y$10$9IovVg0aGzrOMgxvk5f4U.1gyOsUmQYfiFRS5vHT7iTCPHYrbOy7K', '2025-03-31 13:02:12', '2025-03-31 13:02:12', NULL, NULL, 'customer', 0),
(57, 'Doe', 'doe@gmail.com', '$2y$10$kKfY7a/Pm4YHydCcWom13.sUPpQtd1i0nQ.W/QK8TCoVTx6pAaNty', '2025-04-01 09:46:25', '2025-04-01 09:46:25', NULL, NULL, 'customer', 0),
(58, 'x', 'x@y.com', '$2y$10$eWx9F09BRQRpI2MITHTNXetkIosvkzEo6KE/W2r2q9Rw8VPcGFiK.', '2025-04-02 07:57:00', '2025-04-02 07:57:00', NULL, NULL, 'customer', 0),
(59, 'sniper', 'sniper@gmail.com', '$2y$10$Hlx8M8xQ0kyorns/11fHse4mQrbYvNfHQVMYW0LOGTBDFsJW9zH3G', '2025-04-02 18:59:44', '2025-04-02 18:59:44', NULL, NULL, 'customer', 0),
(63, 'zablon', 'zablon@gmail.com', '$2y$10$ZWUERgwIS1FlRlYB0CE/vei7oy7uRPjffJGOh5Bwo49t1iexOo3Xm', '2025-04-04 14:38:07', '2025-04-04 14:38:07', NULL, NULL, 'customer', 0),
(65, 'Test', 'test@example.com', '$2y$10$sYIRVAFZEUI75GiZqb1NDugFzdDBYxr2W.75O15dK.rOJiTbqYDkm', '2025-04-08 18:28:42', '2025-04-08 18:28:42', NULL, NULL, 'customer', 0),
(66, 'ernesto', 'ernesto@gmail.com', '$2y$10$OJYlhVuPJSXEO6GSLk18WelXCeCB4Qo6a8Qg6K7vvB3RekGx4rFdO', '2025-10-26 18:06:12', '2025-11-03 21:37:02', '2025-11-03 21:37:02', NULL, 'customer', 0),
(67, 'Admin', 'Admin@gmail.com', '$2y$10$eg9JTxazSkXSBDekRynkEO1LRW25fmj6kaH055exofkCgD2K6RDGW', '2025-10-28 07:02:43', '2025-11-24 17:33:43', '2025-11-24 17:33:43', NULL, 'admin', 0),
(68, 'Henry', 'Henry@gmail.com', '$2y$10$WT1fArTkNywtM2y8TmfhHOaFD6eymxp5erjwuriAwf2JqKCms/wGO', '2025-10-30 07:16:15', '2025-11-24 17:19:17', '2025-11-24 17:19:17', NULL, 'staff', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `articles`
--
ALTER TABLE `articles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_orders_staff` (`staff_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `articles`
--
ALTER TABLE `articles`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=234;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=107;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=71;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `fk_orders_staff` FOREIGN KEY (`staff_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
