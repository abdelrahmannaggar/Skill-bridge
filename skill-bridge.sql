-- phpMyAdmin SQL Dump
-- version 4.7.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 25, 2025 at 06:26 PM
-- Server version: 10.1.26-MariaDB
-- PHP Version: 7.1.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `skill-bridge`
--

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `id` int(11) NOT NULL,
  `title` varchar(150) NOT NULL,
  `description` text,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`id`, `title`, `description`, `created_by`, `created_at`) VALUES
(1, 'Complete Web Development Bootcamp', 'Learn HTML, CSS, JavaScript, and modern frameworks', 1, '2025-05-16 11:30:44'),
(2, 'Data Science Fundamentals', 'Master Python, pandas, and data visualization', 2, '2025-05-16 11:30:44'),
(3, 'Digital Marketing Masterclass', 'Comprehensive guide to modern marketing strategies', 3, '2025-05-16 11:30:44'),
(4, 'UI/UX Design Principles', 'Learn design thinking and user experience', 4, '2025-05-16 11:30:44'),
(5, 'Mobile App Development', 'Build iOS and Android apps with React Native', 5, '2025-05-16 11:30:44');

-- --------------------------------------------------------

--
-- Table structure for table `course_enrollments`
--

CREATE TABLE `course_enrollments` (
  `user_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `enrolled_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `course_enrollments`
--

INSERT INTO `course_enrollments` (`user_id`, `course_id`, `enrolled_at`) VALUES
(1, 1, '2025-05-16 11:30:44'),
(2, 2, '2025-05-16 11:30:44'),
(3, 3, '2025-05-16 11:30:44'),
(4, 4, '2025-05-16 11:30:44'),
(5, 5, '2025-05-16 11:30:44');

-- --------------------------------------------------------

--
-- Table structure for table `enrollments`
--

CREATE TABLE `enrollments` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `tutorial_id` int(11) NOT NULL,
  `enrolled_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `enrollments`
--

INSERT INTO `enrollments` (`id`, `user_id`, `tutorial_id`, `enrolled_at`) VALUES
(1, 1, 11, '2025-05-22 13:59:14'),
(2, 1, 12, '2025-05-22 13:59:14'),
(3, 1, 13, '2025-05-22 13:59:14'),
(4, 2, 11, '2025-05-22 13:59:14'),
(5, 2, 14, '2025-05-22 13:59:14'),
(6, 3, 12, '2025-05-22 13:59:14'),
(7, 3, 15, '2025-05-22 13:59:14'),
(8, 4, 13, '2025-05-22 13:59:14'),
(9, 4, 14, '2025-05-22 13:59:14'),
(10, 5, 11, '2025-05-22 13:59:14'),
(11, 5, 15, '2025-05-22 13:59:14'),
(27, 9, 11, '2024-03-05 08:45:00'),
(28, 10, 13, '2024-02-05 11:15:00'),
(29, 10, 17, '2024-02-25 14:00:00'),
(30, 10, 16, '2024-03-10 07:45:00'),
(31, 1, 18, '2024-02-10 12:30:00'),
(32, 2, 15, '2024-02-15 09:15:00'),
(33, 3, 17, '2024-02-20 13:45:00'),
(34, 4, 17, '2024-02-25 08:00:00'),
(35, 5, 17, '2024-03-01 11:30:00'),
(36, 6, 13, '2024-03-05 14:15:00'),
(37, 7, 13, '2024-03-10 07:30:00'),
(38, 8, 17, '2024-03-15 12:45:00'),
(39, 9, 17, '2024-03-20 09:00:00'),
(40, 10, 18, '2024-03-25 13:30:00');

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `title` varchar(150) NOT NULL,
  `description` text,
  `event_date` datetime DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `time` TIME DEFAULT NULL,
  `capacity` INT DEFAULT NULL,
  `category` VARCHAR(100) DEFAULT NULL,
  `organizer` VARCHAR(255) DEFAULT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `title`, `description`, `event_date`, `location`, `created_by`, `created_at`, `time`, `capacity`, `category`, `organizer`, `updated_at`) VALUES
(1, 'Web Development Workshop', 'Hands-on workshop for beginners', '2024-04-15 10:00:00', 'Online', 1, '2025-05-16 11:30:44', '10:00:00', 50, 'Technology', 'Skill Bridge Team', '2025-05-16 11:30:44'),
(2, 'Data Science Meetup', 'Networking and knowledge sharing', '2024-04-20 18:00:00', 'Tech Hub, Cairo', 2, '2025-05-16 11:30:44', '18:00:00', 30, 'Data Science', 'Data Science Community', '2025-05-16 11:30:44'),
(3, 'Digital Marketing Conference', 'Annual marketing trends and strategies', '2024-05-01 09:00:00', 'Convention Center', 3, '2025-05-16 11:30:44', '09:00:00', 100, 'Marketing', 'Digital Marketing Association', '2025-05-16 11:30:44'),
(4, 'UI/UX Design Sprint', '5-day intensive design workshop', '2024-04-25 09:00:00', 'Design Studio', 4, '2025-05-16 11:30:44', '09:00:00', 25, 'Design', 'UI/UX Designers Guild', '2025-05-16 11:30:44'),
(5, 'Tech Career Fair', 'Connect with top tech companies', '2024-05-10 10:00:00', 'Exhibition Center', 5, '2025-05-16 11:30:44', '10:00:00', 200, 'Career', 'Tech Recruiters Association', '2025-05-16 11:30:44');

-- --------------------------------------------------------

--
-- Table structure for table `feedback`
--

CREATE TABLE `feedback` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `feedback`
--

INSERT INTO `feedback` (`id`, `user_id`, `message`, `created_at`) VALUES
(1, 1, 'The web development course was excellent! Very comprehensive and well-structured.', '2025-05-16 11:30:44'),
(2, 2, 'Great platform for learning new skills. The instructors are very knowledgeable.', '2025-05-16 11:30:44'),
(3, 3, 'The community is very supportive and helpful. Love the interactive sessions!', '2025-05-16 11:30:44'),
(4, 4, 'The mobile development course helped me land my first job in tech!', '2025-05-16 11:30:44'),
(5, 5, 'Good content but could use more practical exercises.', '2025-05-16 11:30:44');

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `sender_id` int(11) DEFAULT NULL,
  `receiver_id` int(11) DEFAULT NULL,
  `content` text NOT NULL,
  `sent_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `sender_id`, `receiver_id`, `content`, `sent_at`) VALUES
(1, 1, 2, 'Hi Jane, I have a question about the data science course.', '2025-05-16 11:30:44'),
(2, 2, 1, 'Sure John, what would you like to know?', '2025-05-16 11:30:44'),
(3, 3, 4, 'Sarah, can we discuss the UI design project?', '2025-05-16 11:30:44'),
(4, 4, 3, 'Of course Mark, I\'m available tomorrow.', '2025-05-16 11:30:44'),
(5, 5, 1, 'John, thanks for the great workshop!', '2025-05-16 11:30:44');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `message`, `is_read`, `created_at`) VALUES
(1, 1, 'New course enrollment: Web Development Bootcamp', 0, '2025-05-16 11:30:44'),
(2, 2, 'Your feedback has been received', 1, '2025-05-16 11:30:44'),
(3, 3, 'Upcoming event: Digital Marketing Conference', 0, '2025-05-16 11:30:44'),
(4, 4, 'New message from Mark Wilson', 0, '2025-05-16 11:30:44'),
(5, 5, 'Course completion: Mobile App Development', 1, '2025-05-16 11:30:44');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `method` varchar(50) DEFAULT NULL,
  `status` varchar(20) DEFAULT 'completed'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `user_id`, `amount`, `payment_date`, `method`, `status`) VALUES
(1, 1, '99.99', '2025-05-16 14:30:44', 'credit_card', 'completed'),
(2, 2, '149.99', '2025-05-16 14:30:44', 'paypal', 'completed'),
(3, 3, '79.99', '2025-05-16 14:30:44', 'credit_card', 'completed'),
(4, 4, '129.99', '2025-05-16 14:30:44', 'paypal', 'completed'),
(5, 5, '199.99', '2025-05-16 14:30:44', 'credit_card', 'completed');

-- --------------------------------------------------------

--
-- Table structure for table `skills`
--

CREATE TABLE `skills` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `skills`
--

INSERT INTO `skills` (`id`, `name`, `description`) VALUES
(1, 'Web Development', 'Learn to build modern websites and web applications'),
(2, 'Data Science', 'Master data analysis, visualization, and machine learning'),
(3, 'Digital Marketing', 'Learn SEO, social media marketing, and content strategy'),
(4, 'UI/UX Design', 'Create beautiful and user-friendly interfaces'),
(5, 'Mobile Development', 'Build iOS and Android applications'),
(6, 'Cloud Computing', 'Master AWS, Azure, and cloud architecture'),
(7, 'Cybersecurity', 'Learn to protect systems and networks'),
(8, 'Project Management', 'Manage projects effectively using modern methodologies'),
(9, 'Video Editing', 'Edit and produce professional videos'),
(10, 'Blockchain', 'Develop and analyze blockchain applications'),
(11, 'Cooking', 'Master culinary skills and recipes'),
(12, 'Public Relations', 'Manage public image and communications'),
(13, 'Game Development', 'Design and build video games'),
(14, 'Machine Learning', 'Build intelligent systems and models'),
(15, 'Foreign Languages', 'Learn and teach new languages'),
(16, 'Music Production', 'Create and produce music tracks'),
(17, 'Entrepreneurship', 'Start and grow businesses'),
(18, 'Personal Finance', 'Manage money and investments');

-- --------------------------------------------------------

--
-- Table structure for table `subscriptions`
--

CREATE TABLE `subscriptions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `plan` varchar(50) NOT NULL,
  `start_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `end_date` datetime DEFAULT NULL,
  `status` varchar(20) DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `subscriptions`
--

INSERT INTO `subscriptions` (`id`, `user_id`, `plan`, `start_date`, `end_date`, `status`) VALUES
(1, 1, 'premium', '2024-01-01 00:00:00', '2024-12-31 23:59:59', 'active'),
(2, 2, 'basic', '2024-01-01 00:00:00', '2024-06-30 23:59:59', 'active'),
(3, 3, 'premium', '2024-01-01 00:00:00', '2024-12-31 23:59:59', 'active'),
(4, 4, 'basic', '2024-01-01 00:00:00', '2024-06-30 23:59:59', 'active'),
(5, 5, 'premium', '2024-01-01 00:00:00', '2024-12-31 23:59:59', 'active');

-- --------------------------------------------------------

--
-- Table structure for table `swap_requests`
--

CREATE TABLE `swap_requests` (
  `id` int(11) NOT NULL,
  `sender_id` int(11) DEFAULT NULL,
  `receiver_id` int(11) DEFAULT NULL,
  `status` varchar(20) DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tutorials`
--

CREATE TABLE `tutorials` (
  `id` int(11) NOT NULL,
  `title` varchar(150) NOT NULL,
  `instructor` varchar(100) NOT NULL,
  `level` varchar(50) NOT NULL,
  `category` varchar(100) NOT NULL,
  `description` text,
  `duration` varchar(50) DEFAULT NULL,
  `rating` decimal(3,2) DEFAULT NULL,
  `students` int(11) DEFAULT '0',
  `image` varchar(255) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int(11) DEFAULT NULL,
  `learning_objectives` JSON DEFAULT NULL,
  `requirements` JSON DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tutorials`
--

INSERT INTO `tutorials` (`id`, `title`, `instructor`, `level`, `category`, `description`, `duration`, `rating`, `students`, `image`, `price`, `created_at`, `created_by`, `learning_objectives`, `requirements`) VALUES
(11, 'Python Programming for Beginners', 'John Smith', 'Beginner', 'Programming', 'Learn Python from scratch with hands-on projects and real-world examples.', '8 weeks', '4.50', 1200, 'Images/online tutorials/js.png', '49.99', '2025-05-21 16:24:19', 1, NULL, NULL),
(12, 'Web Development Bootcamp', 'Sarah Johnson', 'Intermediate', 'Web Development', 'Master HTML, CSS, and JavaScript to build modern web applications.', '12 weeks', '4.80', 2500, 'Images/online tutorials/web design.png', '79.99', '2025-05-21 16:24:19', 1, '["Build responsive websites using HTML5 and CSS3", "Develop interactive web applications with JavaScript", "Understand front-end frameworks like React", "Work with backend technologies and APIs"]', '["Basic computer literacy", "Internet access", "A code editor (VS Code recommended)"]'),
(13, 'Data Science Fundamentals', 'Michael Brown', 'Advanced', 'Data Science', 'Learn data analysis, machine learning, and statistical methods.', '16 weeks', '4.70', 1800, 'Images/online tutorials/gettyimages-1014422502-612x612.jpg', '99.99', '2025-05-21 16:24:19', 1, NULL, NULL),
(14, 'UI/UX Design Masterclass', 'Emily Davis', 'Intermediate', 'Design', 'Create beautiful and user-friendly interfaces with modern design principles.', '10 weeks', '4.60', 1500, 'Images/online tutorials/ui and ux.png', '69.99', '2025-05-21 16:24:19', 1, NULL, NULL),
(15, 'Mobile App Development', 'David Wilson', 'Advanced', 'Mobile Development', 'Build iOS and Android apps using React Native and best practices.', '14 weeks', '4.90', 2000, 'Images/online tutorials/mobile app development.jpg', '89.99', '2025-05-21 16:24:19', 1, NULL, NULL),
(16, 'Digital Marketing Strategy', 'Lisa Anderson', 'Beginner', 'Marketing', 'Learn SEO, social media marketing, and content strategy.', '6 weeks', '4.40', 900, 'Images/online tutorials/gettyimages-1150968776-612x612.jpg', '39.99', '2025-05-21 16:24:19', 1, NULL, NULL),
(17, 'Machine Learning Essentials', 'Robert Taylor', 'Advanced', 'AI/ML', 'Deep dive into machine learning algorithms and neural networks.', '20 weeks', '4.80', 1600, 'Images/online tutorials/gettyimages-1153429431-612x612.jpg', '129.99', '2025-05-21 16:24:19', 1, NULL, NULL),
(18, 'Cloud Computing with AWS', 'Jennifer Lee', 'Intermediate', 'Cloud Computing', 'Master AWS services and cloud architecture.', '12 weeks', '4.70', 1400, 'Images/online tutorials/gettyimages-1153429431-612x612.jpg', '79.99', '2025-05-21 16:24:19', 1, NULL, NULL),
(19, 'Cybersecurity Fundamentals', 'Thomas White', 'Intermediate', 'Security', 'Learn essential security concepts and best practices.', '10 weeks', '4.60', 1100, 'Images/online tutorials/gettyimages-1396895543-612x612.jpg', '69.99', '2025-05-21 16:24:19', 1, NULL, NULL),
(20, 'DevOps Engineering', 'Rachel Green', 'Advanced', 'DevOps', 'Master CI/CD, containerization, and infrastructure as code.', '16 weeks', '4.80', 1300, 'Images/online tutorials/gettyimages-1406633343-612x612.jpg', '99.99', '2025-05-21 16:24:19', 1, NULL, NULL),
(21, 'Python Programming for Beginners', 'John Smith', 'Beginner', 'Programming', 'Learn Python from scratch with hands-on projects and real-world examples.', '8 weeks', '4.50', 1200, 'Images/online tutorials/js.png', '49.99', '2025-05-22 13:56:12', 1, NULL, NULL),
(22, 'Web Development Bootcamp', 'Sarah Johnson', 'Intermediate', 'Web Development', 'Master HTML, CSS, and JavaScript to build modern web applications.', '12 weeks', '4.80', 2500, 'Images/online tutorials/web design.png', '79.99', '2025-05-22 13:56:12', 1, NULL, NULL),
(23, 'Data Science Fundamentals', 'Michael Brown', 'Advanced', 'Data Science', 'Learn data analysis, machine learning, and statistical methods.', '16 weeks', '4.70', 1800, 'Images/online tutorials/gettyimages-1014422502-612x612.jpg', '99.99', '2025-05-22 13:56:12', 1, NULL, NULL),
(24, 'UI/UX Design Masterclass', 'Emily Davis', 'Intermediate', 'Design', 'Create beautiful and user-friendly interfaces with modern design principles.', '10 weeks', '4.60', 1500, 'Images/online tutorials/ui and ux.png', '69.99', '2025-05-22 13:56:12', 1, NULL, NULL),
(25, 'Mobile App Development', 'David Wilson', 'Advanced', 'Mobile Development', 'Build iOS and Android apps using React Native and best practices.', '14 weeks', '4.90', 2000, 'Images/online tutorials/mobile app development.jpg', '89.99', '2025-05-22 13:56:12', 1, NULL, NULL),
(26, 'Digital Marketing Strategy', 'Lisa Anderson', 'Beginner', 'Marketing', 'Learn SEO, social media marketing, and content strategy.', '6 weeks', '4.40', 900, 'Images/online tutorials/gettyimages-1150968776-612x612.jpg', '39.99', '2025-05-22 13:56:12', 1, NULL, NULL),
(27, 'Machine Learning Essentials', 'Robert Taylor', 'Advanced', 'AI/ML', 'Deep dive into machine learning algorithms and neural networks.', '20 weeks', '4.80', 1600, 'Images/online tutorials/gettyimages-1153429431-612x612.jpg', '129.99', '2025-05-22 13:56:12', 1, NULL, NULL),
(28, 'Cloud Computing with AWS', 'Jennifer Lee', 'Intermediate', 'Cloud Computing', 'Master AWS services and cloud architecture.', '12 weeks', '4.70', 1400, 'Images/online tutorials/gettyimages-1153429431-612x612.jpg', '79.99', '2025-05-22 13:56:12', 1, NULL, NULL),
(29, 'Cybersecurity Fundamentals', 'Thomas White', 'Intermediate', 'Security', 'Learn essential security concepts and best practices.', '10 weeks', '4.60', 1100, 'Images/online tutorials/gettyimages-1396895543-612x612.jpg', '69.99', '2025-05-22 13:56:12', 1, NULL, NULL),
(30, 'DevOps Engineering', 'Rachel Green', 'Advanced', 'DevOps', 'Master CI/CD, containerization, and infrastructure as code.', '16 weeks', '4.80', 1300, 'Images/online tutorials/gettyimages-1406633343-612x612.jpg', '99.99', '2025-05-22 13:56:12', 1, NULL, NULL),
(31, 'JavaScript Essentials', 'Jane Smith', 'Beginner', 'Programming', 'A complete guide to JavaScript basics and best practices.', '6 weeks', '4.30', 800, 'Images/online tutorials/js.png', '39.99', '2025-05-22 13:56:52', 2, NULL, NULL),
(32, 'Advanced Data Visualization', 'Jane Smith', 'Advanced', 'Data Science', 'Learn to visualize data using modern tools and libraries.', '8 weeks', '4.70', 950, 'Images/online tutorials/gettyimages-1014422502-612x612.jpg', '59.99', '2025-05-22 13:56:52', 2, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `modules`
--

CREATE TABLE `modules` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tutorial_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `video_url` varchar(255) DEFAULT NULL,
  `module_order` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `tutorial_id` (`tutorial_id`),
  CONSTRAINT `modules_ibfk_1` FOREIGN KEY (`tutorial_id`) REFERENCES `tutorials` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `modules`
--

INSERT INTO `modules` (`id`, `tutorial_id`, `title`, `description`, `video_url`, `module_order`, `created_at`) VALUES
(1, 11, 'Introduction to Python', 'Learn the basics of Python programming language', 'https://example.com/videos/python-intro.mp4', 1, '2025-05-22 13:56:52'),
(2, 11, 'Python Variables and Data Types', 'Understanding variables and different data types in Python', 'https://example.com/videos/python-variables.mp4', 2, '2025-05-22 13:56:52'),
(3, 11, 'Control Flow in Python', 'Learn about if statements, loops, and control structures', 'https://example.com/videos/python-control-flow.mp4', 3, '2025-05-22 13:56:52'),
(4, 12, 'HTML Fundamentals', 'Introduction to HTML structure and elements', 'https://example.com/videos/html-basics.mp4', 1, '2025-05-22 13:56:52'),
(5, 12, 'CSS Styling', 'Learn how to style your web pages with CSS', 'https://example.com/videos/css-styling.mp4', 2, '2025-05-22 13:56:52'),
(6, 12, 'JavaScript Basics', 'Introduction to JavaScript programming', 'https://example.com/videos/js-basics.mp4', 3, '2025-05-22 13:56:52'),
(7, 13, 'Introduction to Data Science', 'Overview of data science concepts and tools', 'https://example.com/videos/data-science-intro.mp4', 1, '2025-05-22 13:56:52'),
(8, 13, 'Data Analysis with Python', 'Learn data analysis using Python libraries', 'https://example.com/videos/python-data-analysis.mp4', 2, '2025-05-22 13:56:52'),
(9, 13, 'Data Visualization', 'Create effective data visualizations', 'https://example.com/videos/data-visualization.mp4', 3, '2025-05-22 13:56:52');

-- --------------------------------------------------------

--
-- Table structure for table `module_resources`
--

CREATE TABLE `module_resources` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `module_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `type` varchar(50) NOT NULL,
  `url` varchar(255) NOT NULL,
  `resource_order` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `module_id` (`module_id`),
  CONSTRAINT `module_resources_ibfk_1` FOREIGN KEY (`module_id`) REFERENCES `modules` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `module_resources`
--

INSERT INTO `module_resources` (`id`, `module_id`, `title`, `type`, `url`, `resource_order`, `created_at`) VALUES
(1, 1, 'Python Installation Guide', 'pdf', 'https://example.com/resources/python-install.pdf', 1, '2025-05-22 13:56:52'),
(2, 1, 'Python Cheat Sheet', 'pdf', 'https://example.com/resources/python-cheatsheet.pdf', 2, '2025-05-22 13:56:52'),
(3, 2, 'Data Types Exercise', 'doc', 'https://example.com/resources/data-types-exercise.docx', 1, '2025-05-22 13:56:52'),
(4, 4, 'HTML Reference Guide', 'pdf', 'https://example.com/resources/html-reference.pdf', 1, '2025-05-22 13:56:52'),
(5, 5, 'CSS Properties List', 'pdf', 'https://example.com/resources/css-properties.pdf', 1, '2025-05-22 13:56:52'),
(6, 6, 'JavaScript Examples', 'zip', 'https://example.com/resources/js-examples.zip', 1, '2025-05-22 13:56:52'),
(7, 7, 'Data Science Tools Overview', 'pdf', 'https://example.com/resources/data-science-tools.pdf', 1, '2025-05-22 13:56:52'),
(8, 8, 'Python Data Analysis Code', 'zip', 'https://example.com/resources/python-analysis-code.zip', 1, '2025-05-22 13:56:52'),
(9, 9, 'Visualization Templates', 'zip', 'https://example.com/resources/visualization-templates.zip', 1, '2025-05-22 13:56:52');

-- --------------------------------------------------------

--
-- Table structure for table `module_progress`
--

CREATE TABLE `module_progress` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `module_id` int(11) NOT NULL,
  `progress_percentage` int(11) DEFAULT 0,
  `completed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_module` (`user_id`,`module_id`),
  KEY `module_id` (`module_id`),
  CONSTRAINT `module_progress_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `module_progress_ibfk_2` FOREIGN KEY (`module_id`) REFERENCES `modules` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `module_progress`
--

INSERT INTO `module_progress` (`id`, `user_id`, `module_id`, `progress_percentage`, `completed_at`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 100, '2025-05-22 14:00:00', '2025-05-22 13:56:52', '2025-05-22 14:00:00'),
(2, 1, 2, 75, NULL, '2025-05-22 13:56:52', '2025-05-22 13:56:52'),
(3, 1, 3, 0, NULL, '2025-05-22 13:56:52', '2025-05-22 13:56:52'),
(4, 2, 4, 100, '2025-05-22 14:30:00', '2025-05-22 13:56:52', '2025-05-22 14:30:00'),
(5, 2, 5, 100, '2025-05-22 15:00:00', '2025-05-22 13:56:52', '2025-05-22 15:00:00'),
(6, 2, 6, 50, NULL, '2025-05-22 13:56:52', '2025-05-22 13:56:52'),
(7, 3, 7, 100, '2025-05-22 16:00:00', '2025-05-22 13:56:52', '2025-05-22 16:00:00'),
(8, 3, 8, 25, NULL, '2025-05-22 13:56:52', '2025-05-22 13:56:52'),
(9, 3, 9, 0, NULL, '2025-05-22 13:56:52', '2025-05-22 13:56:52');

-- --------------------------------------------------------

--
-- Table structure for table `tutorial_requests`
--

CREATE TABLE `tutorial_requests` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `skill_id` int(11) DEFAULT NULL,
  `description` text,
  `status` varchar(20) DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tutorial_requests`
--

INSERT INTO `tutorial_requests` (`id`, `user_id`, `skill_id`, `description`, `status`, `created_at`) VALUES
(1, 1, 1, 'Need help with React.js implementation', 'pending', '2025-05-16 11:30:44'),
(2, 2, 2, 'Looking for guidance on machine learning algorithms', 'pending', '2025-05-16 11:30:44'),
(3, 3, 3, 'SEO optimization techniques', 'pending', '2025-05-16 11:30:44'),
(4, 4, 4, 'Design system implementation', 'pending', '2025-05-16 11:30:44'),
(5, 5, 5, 'Flutter app development', 'pending', '2025-05-16 11:30:44');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `phone` varchar(30) NOT NULL,
  `location` varchar(100) NOT NULL,
  `occupation` varchar(100) DEFAULT NULL,
  `resume` varchar(255) NOT NULL,
  `bio` text,
  `avatar` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `skills` JSON DEFAULT NULL COMMENT 'Stores user skills as JSON array with level and experience',
  `average_rating` DECIMAL(3,2) DEFAULT 0.00,
  `total_reviews` INT DEFAULT 0,
  `last_activity` TIMESTAMP NULL DEFAULT NULL,
  `activity_log` JSON DEFAULT NULL COMMENT 'Stores recent user activities as JSON array',
  `certifications` JSON DEFAULT NULL COMMENT 'Stores user certifications as JSON array',
  `years_experience` INT DEFAULT 0,
  `verified_skills` JSON DEFAULT NULL COMMENT 'Stores verified skills as JSON array'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `full_name`, `phone`, `location`, `occupation`, `resume`, `bio`, `avatar`, `created_at`, `skills`, `average_rating`, `total_reviews`, `last_activity`, `activity_log`, `certifications`, `years_experience`, `verified_skills`) VALUES
(1, 'testuser', 'testuser@example.com', '$2b$10$fFAXBGSsJFA3.oOXRY4Wv.tFuQKFeMHzoXX9TrWp0isZHw6kdTm/6', '', '', '', '', NULL, NULL, '2025-05-14 22:59:14', NULL, 0.00, 0, NULL, NULL, NULL, 0, NULL),
(2, 'john_doe', 'john@example.com', '$2b$10$YourHashedPasswordHere', '', '', '', '', 'Experienced web developer and instructor', 'avatars/john.jpg', '2025-05-16 11:30:44', NULL, 0.00, 0, NULL, NULL, NULL, 0, NULL),
(3, 'jane_smith', 'jane@example.com', '$2b$10$YourHashedPasswordHere', '', '', '', '', 'Data science expert and educator', 'avatars/jane.jpg', '2025-05-16 11:30:44', NULL, 0.00, 0, NULL, NULL, NULL, 0, NULL),
(4, 'mark_wilson', 'mark@example.com', '$2b$10$YourHashedPasswordHere', '', '', '', '', 'Digital marketing specialist', 'avatars/mark.jpg', '2025-05-16 11:30:44', NULL, 0.00, 0, NULL, NULL, NULL, 0, NULL),
(5, 'sarah_jones', 'sarah@example.com', '$2b$10$YourHashedPasswordHere', '', '', '', '', 'UI/UX designer and creative director', 'avatars/sarah.jpg', '2025-05-16 11:30:44', NULL, 0.00, 0, NULL, NULL, NULL, 0, NULL),
(6, 'alex_brown', 'alex@example.com', '$2b$10$YourHashedPasswordHere', '', '', '', '', 'Mobile app developer and tech enthusiast', 'avatars/alex.jpg', '2025-05-16 11:30:44', NULL, 0.00, 0, NULL, NULL, NULL, 0, NULL),
(7, 'abdelrahman Elnagar', 'abdlrahman2003@outlook.com', '$2b$10$AckrINV0a5eVBS/oTAzTMusrxSwGoq6CpV8oSKO1ZEyNP6wbOcaH2', 'Abdelrahman Ahmed Mohamed El Naggar', '01152748014', 'Cairo,Egypt', '', 'I\'m a passionate web developer with a strong focus on creating clean, responsive, and user-friendly websites. Skilled in HTML, CSS, JavaScript, and modern frameworks like React and Tailwind CSS, I turn ideas into functional and engaging digital experiences. Always eager to learn and stay updated with the latest trends in web development.', NULL, '2025-05-16 11:47:39', NULL, 0.00, 0, NULL, NULL, NULL, 0, NULL),
(8, 'Mariam Mohamed Abdallah', 'mariammohamed22@gmail.com', '$2b$10$JGU1kuxe3yEwiT6W0ZtdyeuDDwr7bFS1h.xMERitgzehPQePsdySa', 'Mariam Mohamed Abdallah', '012354678912', 'cairo,Egypt', 'CV.pdf', 'Bis Student', 'break time.png', '2025-05-19 11:02:52', NULL, 0.00, 0, NULL, NULL, NULL, 0, NULL),
(31, 'oliver_martin', 'oliver@example.com', '$2b$10$YourHashedPasswordHere', '', '', '', '', 'Full-stack developer and mentor', 'images/avatars/avatar17.jpg', '2025-05-19 14:04:07', NULL, 0.00, 0, NULL, NULL, NULL, 0, NULL),
(32, 'sophia_clark', 'sophia@example.com', '$2b$10$YourHashedPasswordHere', '', '', '', '', 'AI researcher and data scientist', 'images/avatars/avatar18.jpg', '2025-05-19 14:04:07', NULL, 0.00, 0, NULL, NULL, NULL, 0, NULL),
(33, 'liam_turner', 'liam@example.com', '$2b$10$YourHashedPasswordHere', '', '', '', '', 'Marketing strategist and SEO expert', 'images/avatars/avatar19.jpg', '2025-05-19 14:04:07', NULL, 0.00, 0, NULL, NULL, NULL, 0, NULL),
(34, 'mia_evans', 'mia@example.com', '$2b$10$YourHashedPasswordHere', '', '', '', '', 'UX/UI designer and illustrator', 'images/avatars/avatar20.jpg', '2025-05-19 14:04:07', NULL, 0.00, 0, NULL, NULL, NULL, 0, NULL),
(35, 'noah_hall', 'noah@example.com', '$2b$10$YourHashedPasswordHere', '', '', '', '', 'Mobile developer and cloud architect', 'images/avatars/avatar21.jpg', '2025-05-19 14:04:07', NULL, 0.00, 0, NULL, NULL, NULL, 0, NULL),
(36, 'ava_wright', 'ava@example.com', '$2b$10$YourHashedPasswordHere', '', '', '', '', 'Project manager and public speaker', 'images/avatars/avatar22.jpg', '2025-05-19 14:04:07', NULL, 0.00, 0, NULL, NULL, NULL, 0, NULL),
(43, 'ethan_baker', 'ethan@example.com', '$2b$10$YourHashedPasswordHere', '', '', '', '', 'Video editor and filmmaker', 'images/avatars/avatar17.jpg', '2025-05-19 14:14:07', NULL, 0.00, 0, NULL, NULL, NULL, 0, NULL),
(44, 'zoe_murphy', 'zoe@example.com', '$2b$10$YourHashedPasswordHere', '', '', '', '', 'Blockchain developer and crypto enthusiast', 'images/avatars/avatar18.jpg', '2025-05-19 14:14:07', NULL, 0.00, 0, NULL, NULL, NULL, 0, NULL),
(45, 'lucas_ross', 'lucas@example.com', '$2b$10$YourHashedPasswordHere', '', '', '', '', 'Chef and cooking instructor', 'images/avatars/avatar19.jpg', '2025-05-19 14:14:07', NULL, 0.00, 0, NULL, NULL, NULL, 0, NULL),
(46, 'lily_cooper', 'lily@example.com', '$2b$10$YourHashedPasswordHere', '', '', '', '', 'PR specialist and event planner', 'images/avatars/avatar20.jpg', '2025-05-19 14:14:07', NULL, 0.00, 0, NULL, NULL, NULL, 0, NULL),
(47, 'mason_reed', 'mason@example.com', '$2b$10$YourHashedPasswordHere', '', '', '', '', 'Game developer and designer', 'images/avatars/avatar21.jpg', '2025-05-19 14:14:07', NULL, 0.00, 0, NULL, NULL, NULL, 0, NULL),
(48, 'chloe_bailey', 'chloe@example.com', '$2b$10$YourHashedPasswordHere', '', '', '', '', 'Machine learning engineer', 'images/avatars/avatar22.jpg', '2025-05-19 14:14:07', NULL, 0.00, 0, NULL, NULL, NULL, 0, NULL),
(49, 'logan_hughes', 'logan@example.com', '$2b$10$YourHashedPasswordHere', '', '', '', '', 'Language tutor and translator', 'images/avatars/avatar23.jpg', '2025-05-19 14:14:07', NULL, 0.00, 0, NULL, NULL, NULL, 0, NULL),
(50, 'harper_ward', 'harper@example.com', '$2b$10$YourHashedPasswordHere', '', '', '', '', 'Music producer and DJ', 'images/avatars/avatar24.jpg', '2025-05-19 14:14:07', NULL, 0.00, 0, NULL, NULL, NULL, 0, NULL),
(51, 'aiden_brooks', 'aiden@example.com', '$2b$10$YourHashedPasswordHere', '', '', '', '', 'Entrepreneur and business coach', 'images/avatars/avatar25.jpg', '2025-05-19 14:14:07', NULL, 0.00, 0, NULL, NULL, NULL, 0, NULL),
(52, 'ella_foster', 'ella@example.com', '$2b$10$YourHashedPasswordHere', '', '', '', '', 'Personal finance advisor', 'images/avatars/avatar26.jpg', '2025-05-19 14:14:07', NULL, 0.00, 0, NULL, NULL, NULL, 0, NULL),
(53, 'Ali Maher', 'alimaher23@yahoo.com', '$2b$10$3BLbJpD2nQ7n4PM1WGXKteXLpCalSn2.Xmg4WRnraclvWY7a9k5F2', 'Ali Maher', '011123345859', 'cairo,Egypt', 'CV.pdf', 'Mobile app developer, Flutter', 'HR.jpg', '2025-05-23 09:00:59', NULL, 0.00, 0, NULL, NULL, NULL, 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_reviews`
--

CREATE TABLE `user_reviews` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `reviewer_id` int(11) NOT NULL,
  `rating` int(11) NOT NULL CHECK (rating >= 1 AND rating <= 5),
  `review_text` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `reviewer_id` (`reviewer_id`),
  CONSTRAINT `user_reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_reviews_ibfk_2` FOREIGN KEY (`reviewer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user_reviews`
--

INSERT INTO `user_reviews` (`user_id`, `reviewer_id`, `rating`, `review_text`) VALUES
(1, 2, 5, 'Excellent teaching methodology and very patient with explanations.'),
(1, 3, 4, 'Great technical knowledge and practical examples.'),
(1, 4, 5, 'Very organized and structured approach to teaching.'),
(1, 5, 4, 'Clear communication and excellent problem-solving skills.'),
(2, 1, 5, 'Outstanding web development expertise and mentoring skills.'),
(2, 3, 4, 'Great at explaining complex concepts in simple terms.'),
(2, 4, 5, 'Very knowledgeable in modern web technologies.'),
(2, 5, 4, 'Excellent debugging and problem-solving abilities.'),
(3, 1, 5, 'Exceptional data science knowledge and teaching methods.'),
(3, 2, 4, 'Great at breaking down complex algorithms.'),
(3, 4, 5, 'Very practical approach to data analysis.'),
(3, 5, 4, 'Excellent communication of technical concepts.'),
(4, 1, 5, 'Outstanding marketing strategies and industry insights.'),
(4, 2, 4, 'Great understanding of digital marketing trends.'),
(4, 3, 5, 'Very effective teaching methods for marketing concepts.'),
(4, 5, 4, 'Excellent practical examples and case studies.'),
(5, 1, 5, 'Exceptional UI/UX design skills and creative approach.'),
(5, 2, 4, 'Great attention to detail in design work.'),
(5, 3, 5, 'Very innovative design solutions.'),
(5, 4, 4, 'Excellent teaching of design principles.'),
(6, 1, 5, 'Outstanding mobile development expertise.'),
(6, 2, 4, 'Great at explaining mobile app architecture.'),
(6, 3, 5, 'Very knowledgeable in both iOS and Android development.'),
(6, 4, 4, 'Excellent debugging and optimization skills.'),
(7, 1, 5, 'Exceptional photography skills and teaching methods.'),
(7, 2, 4, 'Great at explaining technical aspects of photography.'),
(7, 3, 5, 'Very creative approach to composition.'),
(7, 4, 4, 'Excellent feedback on student work.'),
(8, 1, 5, 'Outstanding music production knowledge.'),
(8, 2, 4, 'Great at teaching music theory and production.'),
(8, 3, 5, 'Very patient and thorough in explanations.'),
(8, 4, 4, 'Excellent practical demonstrations.'),
(9, 1, 5, 'Exceptional business coaching skills.'),
(9, 2, 4, 'Great insights into entrepreneurship.'),
(9, 3, 5, 'Very practical business advice.'),
(9, 4, 4, 'Excellent mentoring approach.'),
(10, 1, 5, 'Outstanding financial expertise.'),
(10, 2, 4, 'Great at explaining complex financial concepts.'),
(10, 3, 5, 'Very knowledgeable in investment strategies.'),
(10, 4, 4, 'Excellent teaching of financial principles.'),
(11, 1, 5, 'Exceptional language teaching methods.'),
(11, 2, 4, 'Great at teaching grammar.'),
(11, 3, 5, 'Very effective methods.'),
(11, 4, 4, 'Excellent cultural context.'),
(12, 1, 5, 'Outstanding game development skills.'),
(12, 2, 4, 'Great at teaching game design principles.'),
(12, 3, 5, 'Very knowledgeable in game engines.'),
(12, 4, 4, 'Excellent project management skills.'),
(13, 1, 5, 'Exceptional graphic design expertise.'),
(13, 2, 4, 'Great at teaching design software.'),
(13, 3, 5, 'Very creative design solutions.'),
(13, 4, 4, 'Excellent portfolio development guidance.'),
(14, 1, 5, 'Outstanding cybersecurity knowledge.'),
(14, 2, 4, 'Great at teaching security concepts.'),
(14, 3, 5, 'Very practical security implementations.'),
(14, 4, 4, 'Excellent hands-on exercises.'),
(15, 1, 5, 'Exceptional content writing skills.'),
(15, 2, 4, 'Great at teaching writing techniques.'),
(15, 3, 5, 'Very helpful editing feedback.'),
(15, 4, 4, 'Excellent SEO knowledge.'),
(16, 1, 5, 'Outstanding DevOps expertise.'),
(16, 2, 4, 'Great at teaching CI/CD pipelines.'),
(16, 3, 5, 'Very knowledgeable in cloud platforms.'),
(16, 4, 4, 'Excellent automation skills.'),
(17, 1, 5, 'Exceptional public speaking skills.'),
(17, 2, 4, 'Great at teaching presentation techniques.'),
(17, 3, 5, 'Very effective communication methods.'),
(17, 4, 4, 'Excellent confidence building.'),
(18, 1, 5, 'Outstanding blockchain development skills.'),
(18, 2, 4, 'Great at teaching smart contracts.'),
(18, 3, 5, 'Very knowledgeable in DeFi.'),
(18, 4, 4, 'Excellent security practices.'),
(19, 1, 5, 'Exceptional video editing expertise.'),
(19, 2, 4, 'Great at teaching editing software.'),
(19, 3, 5, 'Very creative editing techniques.'),
(19, 4, 4, 'Excellent storytelling skills.'),
(20, 1, 5, 'Outstanding 3D modeling skills.'),
(20, 2, 4, 'Great at teaching 3D software.'),
(20, 3, 5, 'Very detailed modeling techniques.'),
(20, 4, 4, 'Excellent animation knowledge.'),
(21, 1, 5, 'Exceptional social media marketing skills.'),
(21, 2, 4, 'Great at teaching platform strategies.'),
(21, 3, 5, 'Very effective campaign planning.'),
(21, 4, 4, 'Excellent analytics understanding.'),
(22, 1, 5, 'Outstanding database administration expertise.'),
(22, 2, 4, 'Great at teaching database optimization.'),
(22, 3, 5, 'Very knowledgeable in SQL and NoSQL.'),
(22, 4, 4, 'Excellent performance tuning skills.'),
(23, 1, 5, 'Exceptional project management skills.'),
(23, 2, 4, 'Great at teaching PM methodologies.'),
(23, 3, 5, 'Very effective team leadership.'),
(23, 4, 4, 'Excellent risk management.'),
(24, 1, 5, 'Outstanding network security expertise.'),
(24, 2, 4, 'Great at teaching security protocols.'),
(24, 3, 5, 'Very knowledgeable in network defense.'),
(24, 4, 4, 'Excellent practical exercises.'),
(25, 1, 5, 'Exceptional UX research skills.'),
(25, 2, 4, 'Great at teaching research methods.'),
(25, 3, 5, 'Very thorough user testing.'),
(25, 4, 4, 'Excellent data analysis.'),
(26, 1, 5, 'Outstanding machine learning expertise.'),
(26, 2, 4, 'Great at teaching ML algorithms.'),
(26, 3, 5, 'Very knowledgeable in AI.'),
(26, 4, 4, 'Excellent model training.'),
(27, 1, 5, 'Exceptional language teaching skills.'),
(27, 2, 4, 'Great at teaching grammar.'),
(27, 3, 5, 'Very effective methods.'),
(27, 4, 4, 'Excellent cultural context.'),
(28, 1, 5, 'Outstanding music production expertise.'),
(28, 2, 4, 'Great at teaching production.'),
(28, 3, 5, 'Very knowledgeable in DAWs.'),
(28, 4, 4, 'Excellent mixing skills.'),
(29, 1, 5, 'Exceptional business coaching skills.'),
(29, 2, 4, 'Great at teaching strategy.'),
(29, 3, 5, 'Very effective mentoring.'),
(29, 4, 4, 'Excellent market analysis.'),
(30, 1, 5, 'Outstanding financial advice expertise.'),
(30, 2, 4, 'Great at teaching investment.'),
(30, 3, 5, 'Very knowledgeable in finance.'),
(30, 4, 4, 'Excellent risk management.'),
(31, 1, 5, 'Excellent mobile development skills and great teaching approach.'),
(31, 2, 4, 'Very knowledgeable in Flutter development.'),
(31, 3, 5, 'Great at explaining complex mobile concepts.'),
(31, 4, 4, 'Excellent debugging and problem-solving skills.'),
(32, 1, 5, 'Exceptional software testing expertise and methodology.'),
(32, 2, 4, 'Great at teaching test automation frameworks.'),
(32, 3, 5, 'Very thorough in test case design.'),
(32, 4, 4, 'Excellent quality assurance practices.'),
(33, 1, 5, 'Outstanding product management skills.'),
(33, 2, 4, 'Great at teaching product development lifecycle.'),
(33, 3, 5, 'Very effective market analysis techniques.'),
(33, 4, 4, 'Excellent user research methods.'),
(34, 1, 5, 'Exceptional API development expertise.'),
(34, 2, 4, 'Great at teaching RESTful API design.'),
(34, 3, 5, 'Very knowledgeable in API security.'),
(34, 4, 4, 'Excellent documentation practices.'),
(35, 1, 5, 'Outstanding content strategy skills.'),
(35, 2, 4, 'Great at teaching content planning.'),
(35, 3, 5, 'Very effective content creation techniques.'),
(35, 4, 4, 'Excellent audience targeting strategies.'),
(36, 1, 5, 'Exceptional mobile UI/UX expertise.'),
(36, 2, 4, 'Great at teaching mobile design patterns.'),
(36, 3, 5, 'Very knowledgeable in user experience.'),
(36, 4, 4, 'Excellent prototyping skills.'),
(37, 1, 5, 'Outstanding email marketing skills.'),
(37, 2, 4, 'Great at teaching email campaign strategies.'),
(37, 3, 5, 'Very effective automation techniques.'),
(37, 4, 4, 'Excellent copywriting abilities.'),
(38, 1, 5, 'Exceptional frontend development expertise.'),
(38, 2, 4, 'Great at teaching modern JavaScript frameworks.'),
(38, 3, 5, 'Very knowledgeable in responsive design.'),
(38, 4, 4, 'Excellent performance optimization.'),
(39, 1, 5, 'Outstanding SEO optimization skills.'),
(39, 2, 4, 'Great at teaching keyword research.'),
(39, 3, 5, 'Very effective on-page optimization.'),
(39, 4, 4, 'Excellent analytics implementation.'),
(40, 1, 5, 'Exceptional backend development expertise.'),
(40, 2, 4, 'Great at teaching server-side programming.'),
(40, 3, 5, 'Very knowledgeable in database design.'),
(40, 4, 4, 'Excellent API integration skills.'),
(41, 1, 5, 'Outstanding social media management skills.'),
(41, 2, 4, 'Great at teaching platform strategies.'),
(41, 3, 5, 'Very effective content planning.'),
(41, 4, 4, 'Excellent community engagement.'),
(42, 1, 5, 'Exceptional game design expertise.'),
(42, 2, 4, 'Great at teaching game mechanics.'),
(42, 3, 5, 'Very knowledgeable in game theory.'),
(42, 4, 4, 'Excellent level design skills.'),
(43, 1, 5, 'Outstanding video production skills.'),
(43, 2, 4, 'Great at teaching video editing.'),
(43, 3, 5, 'Very creative storytelling techniques.'),
(43, 4, 4, 'Excellent post-production skills.'),
(44, 1, 5, 'Exceptional blockchain development expertise.'),
(44, 2, 4, 'Great at teaching smart contracts.'),
(44, 3, 5, 'Very knowledgeable in DeFi protocols.'),
(44, 4, 4, 'Excellent security practices.'),
(45, 1, 5, 'Outstanding cooking instruction skills.'),
(45, 2, 4, 'Great at teaching cooking techniques.'),
(45, 3, 5, 'Very creative recipe development.'),
(45, 4, 4, 'Excellent presentation skills.'),
(46, 1, 5, 'Exceptional public relations expertise.'),
(46, 2, 4, 'Great at teaching PR strategies.'),
(46, 3, 5, 'Very effective media relations.'),
(46, 4, 4, 'Excellent crisis management.'),
(47, 1, 5, 'Outstanding game development skills.'),
(47, 2, 4, 'Great at teaching game engines.'),
(47, 3, 5, 'Very knowledgeable in Unity/Unreal.'),
(47, 4, 4, 'Excellent programming techniques.'),
(48, 1, 5, 'Exceptional machine learning expertise.'),
(48, 2, 4, 'Great at teaching ML algorithms.'),
(48, 3, 5, 'Very knowledgeable in AI concepts.'),
(48, 4, 4, 'Excellent model training methods.'),
(49, 1, 5, 'Outstanding language teaching skills.'),
(49, 2, 4, 'Great at teaching grammar.'),
(49, 3, 5, 'Very effective teaching methods.'),
(49, 4, 4, 'Excellent cultural context.'),
(50, 1, 5, 'Exceptional music production expertise.'),
(50, 2, 4, 'Great at teaching production techniques.'),
(50, 3, 5, 'Very knowledgeable in DAWs.'),
(50, 4, 4, 'Excellent mixing skills.'),
(51, 1, 5, 'Outstanding business coaching skills.'),
(51, 2, 4, 'Great at teaching entrepreneurship.'),
(51, 3, 5, 'Very effective mentoring approach.'),
(51, 4, 4, 'Excellent market analysis.'),
(52, 1, 5, 'Exceptional financial advice expertise.'),
(52, 2, 4, 'Great at teaching investment strategies.'),
(52, 3, 5, 'Very knowledgeable in financial planning.'),
(52, 4, 4, 'Excellent risk management.'),
(53, 1, 5, 'Excellent Flutter development skills and teaching approach.'),
(53, 2, 4, 'Great at explaining mobile app architecture.'),
(53, 3, 5, 'Very knowledgeable in cross-platform development.'),
(53, 4, 4, 'Excellent debugging and optimization skills.'),
(53, 1, 5, 'Excellent Flutter developer with great attention to detail. The mobile apps he creates are both beautiful and functional.'),
(53, 2, 5, 'Very knowledgeable in mobile development. His teaching style is clear and he provides practical examples.'),
(53, 3, 4, 'Great communication skills and always willing to help. His Flutter tutorials are top-notch.'),
(53, 4, 5, 'One of the best mobile developers I have worked with. His code is clean and well-documented.'),
(53, 5, 4, 'Very professional and skilled in Flutter development. Highly recommended for mobile app projects.');

-- --------------------------------------------------------

--
-- Table structure for table `user_skills`
--

CREATE TABLE `user_skills` (
  `user_id` int(11) NOT NULL,
  `skill_id` int(11) NOT NULL,
  `level` varchar(50) DEFAULT NULL,
  `years_experience` int(11) DEFAULT NULL,
  `certification` varchar(255) DEFAULT NULL,
  `verified` boolean DEFAULT FALSE,
  `last_updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`,`skill_id`),
  KEY `skill_id` (`skill_id`),
  CONSTRAINT `user_skills_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_skills_ibfk_2` FOREIGN KEY (`skill_id`) REFERENCES `skills` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user_skills`
--

INSERT INTO `user_skills` (`user_id`, `skill_id`, `level`, `years_experience`, `certification`, `verified`, `last_updated`) VALUES
(1, 1, 'Expert', 5, 'AWS Certified Developer', TRUE, '2025-05-22 13:56:52'),
(1, 5, 'Advanced', 3, 'React Native Certification', TRUE, '2025-05-22 13:56:52'),
(2, 2, 'Expert', 4, 'Data Science Professional Certificate', TRUE, '2025-05-22 13:56:52'),
(3, 3, 'Advanced', 2, 'Digital Marketing Certification', FALSE, '2025-05-22 13:56:52'),
(4, 4, 'Expert', 6, 'UI/UX Design Professional', TRUE, '2025-05-22 13:56:52'),
(5, 5, 'Advanced', 3, 'Mobile App Development Certificate', TRUE, '2025-05-22 13:56:52'),
(7, 1, 'Expert', 3, 'React Developer Certification', TRUE, '2025-05-23 09:00:59'),
(7, 4, 'Advanced', 2, 'Frontend Development Professional', TRUE, '2025-05-23 09:00:59'),
(7, 5, 'Advanced', 2, 'Mobile Web Development', TRUE, '2025-05-23 09:00:59'),
(7, 6, 'Intermediate', 1, 'Cloud Development Associate', FALSE, '2025-05-23 09:00:59'),
(7, 8, 'Intermediate', 1, 'Project Management Fundamentals', FALSE, '2025-05-23 09:00:59');

-- --------------------------------------------------------

--
-- Table structure for table `user_activity`
--

CREATE TABLE `user_activity` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `activity_type` enum('login', 'tutorial_view', 'skill_add', 'review_given', 'review_received', 'message_sent', 'message_received', 'tutorial_completed') NOT NULL,
  `activity_details` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `user_activity_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user_activity`
--

INSERT INTO `user_activity` (`user_id`, `activity_type`, `activity_details`) VALUES
(1, 'login', 'User logged in from Chrome browser'),
(1, 'tutorial_view', 'Viewed Web Development Bootcamp tutorial'),
(2, 'skill_add', 'Added Data Science skill'),
(3, 'review_given', 'Gave review to user_id 4'),
(4, 'tutorial_completed', 'Completed UI/UX Design Masterclass'),
(5, 'message_sent', 'Sent message to user_id 1');

INSERT INTO `user_activity` (`id`, `user_id`, `activity_type`, `activity_details`, `created_at`) VALUES
(6, 7, 'login', 'User logged in from Chrome browser', '2025-05-23 09:00:59'),
(7, 7, 'tutorial_view', 'Viewed Web Development Bootcamp tutorial', '2025-05-23 09:15:30'),
(8, 7, 'skill_add', 'Added Web Development skill', '2025-05-23 09:30:45'),
(9, 7, 'review_received', 'Received review from user_id 1', '2025-05-23 10:00:00'),
(10, 7, 'tutorial_completed', 'Completed React Fundamentals module', '2025-05-23 11:30:00'),
(11, 7, 'message_sent', 'Sent message to user_id 2 about web development', '2025-05-23 12:15:00'),
(12, 7, 'review_given', 'Gave review to user_id 3', '2025-05-23 13:00:00'),
(13, 7, 'tutorial_view', 'Viewed UI/UX Design Masterclass', '2025-05-23 14:30:00'),
(14, 7, 'skill_add', 'Added UI/UX Design skill', '2025-05-23 15:00:00'),
(15, 7, 'tutorial_completed', 'Completed Mobile Development course', '2025-05-23 16:45:00');

-- --------------------------------------------------------

--
-- Table structure for table `user_certifications`
--

CREATE TABLE `user_certifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `issuing_organization` varchar(255) NOT NULL,
  `issue_date` date NOT NULL,
  `expiry_date` date DEFAULT NULL,
  `credential_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `user_certifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user_certifications`
--

INSERT INTO `user_certifications` (`user_id`, `name`, `issuing_organization`, `issue_date`, `expiry_date`, `credential_url`) VALUES
(1, 'AWS Certified Developer', 'Amazon Web Services', '2024-01-15', '2027-01-15', 'https://aws.amazon.com/certification/'),
(2, 'Data Science Professional', 'IBM', '2024-02-20', NULL, 'https://www.ibm.com/certification/'),
(3, 'Digital Marketing Certification', 'Google', '2024-03-10', '2026-03-10', 'https://skillshop.withgoogle.com/'),
(4, 'UI/UX Design Professional', 'Adobe', '2024-01-05', NULL, 'https://www.adobe.com/certification/'),
(5, 'Mobile App Development', 'Apple', '2024-02-15', '2027-02-15', 'https://developer.apple.com/certification/'),
(7, 'React Developer Professional', 'Meta', '2024-01-15', '2027-01-15', 'https://www.meta.com/certification/react'),
(7, 'Frontend Development Professional', 'Google', '2024-02-20', '2026-02-20', 'https://developers.google.com/certification'),
(7, 'Web Development Bootcamp', 'Udemy', '2024-03-10', NULL, 'https://www.udemy.com/certification'),
(7, 'Tailwind CSS Master', 'Tailwind Labs', '2024-04-05', '2026-04-05', 'https://tailwindcss.com/certification'),
(7, 'JavaScript Advanced Concepts', 'MDN Web Docs', '2024-05-01', NULL, 'https://developer.mozilla.org/certification');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `course_enrollments`
--
ALTER TABLE `course_enrollments`
  ADD PRIMARY KEY (`user_id`,`course_id`),
  ADD KEY `course_id` (`course_id`);

--
-- Indexes for table `enrollments`
--
ALTER TABLE `enrollments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_enrollment` (`user_id`,`tutorial_id`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `feedback`
--
ALTER TABLE `feedback`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sender_id` (`sender_id`),
  ADD KEY `receiver_id` (`receiver_id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `skills`
--
ALTER TABLE `skills`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `subscriptions`
--
ALTER TABLE `subscriptions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `swap_requests`
--
ALTER TABLE `swap_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sender_id` (`sender_id`),
  ADD KEY `receiver_id` (`receiver_id`);

--
-- Indexes for table `tutorials`
--
ALTER TABLE `tutorials`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `tutorial_requests`
--
ALTER TABLE `tutorial_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `skill_id` (`skill_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `user_skills`
--
ALTER TABLE `user_skills`
  ADD PRIMARY KEY (`user_id`,`skill_id`),
  ADD KEY `skill_id` (`skill_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `enrollments`
--
ALTER TABLE `enrollments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;
--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `feedback`
--
ALTER TABLE `feedback`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `skills`
--
ALTER TABLE `skills`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;
--
-- AUTO_INCREMENT for table `subscriptions`
--
ALTER TABLE `subscriptions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `swap_requests`
--
ALTER TABLE `swap_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `tutorials`
--
ALTER TABLE `tutorials`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;
--
-- AUTO_INCREMENT for table `tutorial_requests`
--
ALTER TABLE `tutorial_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `courses`
--
ALTER TABLE `courses`
  ADD CONSTRAINT `courses_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `course_enrollments`
--
ALTER TABLE `course_enrollments`
  ADD CONSTRAINT `course_enrollments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `course_enrollments_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `events_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `feedback`
--
ALTER TABLE `feedback`
  ADD CONSTRAINT `feedback_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `subscriptions`
--
ALTER TABLE `subscriptions`
  ADD CONSTRAINT `subscriptions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `swap_requests`
--
ALTER TABLE `swap_requests`
  ADD CONSTRAINT `swap_requests_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `swap_requests_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tutorials`
--
ALTER TABLE `tutorials`
  ADD CONSTRAINT `tutorials_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `tutorial_requests`
--
ALTER TABLE `tutorial_requests`
  ADD CONSTRAINT `tutorial_requests_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tutorial_requests_ibfk_2` FOREIGN KEY (`skill_id`) REFERENCES `skills` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `user_skills`
--
ALTER TABLE `user_skills`
  ADD CONSTRAINT `user_skills_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_skills_ibfk_2` FOREIGN KEY (`skill_id`) REFERENCES `skills` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- Update tutorial images with correct paths
UPDATE `tutorials` SET `image` = 'Images/online tutorials/js.png' WHERE `title` LIKE '%Python Programming%';
UPDATE `tutorials` SET `image` = 'Images/online tutorials/web design.png' WHERE `title` LIKE '%Web Development%';
UPDATE `tutorials` SET `image` = 'Images/online tutorials/gettyimages-1014422502-612x612.jpg' WHERE `title` LIKE '%Data Science%';
UPDATE `tutorials` SET `image` = 'Images/online tutorials/ui and ux.png' WHERE `title` LIKE '%UI/UX Design%';
UPDATE `tutorials` SET `image` = 'Images/online tutorials/mobile app development.jpg' WHERE `title` LIKE '%Mobile App Development%';
UPDATE `tutorials` SET `image` = 'Images/online tutorials/gettyimages-1126452727-612x612.jpg' WHERE `title` LIKE '%Digital Marketing%';
UPDATE `tutorials` SET `image` = 'Images/online tutorials/gettyimages-1150968776-612x612.jpg' WHERE `title` LIKE '%Machine Learning%';
UPDATE `tutorials` SET `image` = 'Images/online tutorials/gettyimages-1153429431-612x612.jpg' WHERE `title` LIKE '%Cloud Computing%';
UPDATE `tutorials` SET `image` = 'Images/online tutorials/gettyimages-1396895543-612x612.jpg' WHERE `title` LIKE '%Cybersecurity%';
UPDATE `tutorials` SET `image` = 'Images/online tutorials/gettyimages-1406633343-612x612.jpg' WHERE `title` LIKE '%DevOps%';
UPDATE `tutorials` SET `image` = 'Images/online tutorials/gettyimages-1415237216-612x612.jpg' WHERE `title` LIKE '%Game Development%';
UPDATE `tutorials` SET `image` = 'Images/online tutorials/gettyimages-2148162976-612x612.jpg' WHERE `title` LIKE '%Blockchain%';
UPDATE `tutorials` SET `image` = 'Images/online tutorials/js.png' WHERE `title` LIKE '%JavaScript%';
UPDATE `tutorials` SET `image` = 'Images/online tutorials/gettyimages-1014422502-612x612.jpg' WHERE `title` LIKE '%Data Visualization%';

INSERT INTO `user_reviews` (`user_id`, `reviewer_id`, `rating`, `review_text`) VALUES
(7, 1, 5, 'Exceptional web development skills! His React components are well-structured and his Tailwind CSS implementations are beautiful.'),
(7, 2, 5, 'Great mentor for frontend development. Explains complex concepts in a clear and understandable way.'),
(7, 3, 4, 'Very knowledgeable in modern web technologies. His code is clean and follows best practices.'),
(7, 4, 5, 'Excellent problem-solving skills and attention to detail. Creates responsive and user-friendly websites.'),
(7, 5, 4, 'Great communication skills and always willing to help others learn. His teaching style is very effective.');

INSERT INTO `user_skills` (`user_id`, `skill_id`, `level`, `years_experience`) VALUES
(7, 1, 'Expert', 3),
(7, 4, 'Advanced', 2),
(7, 5, 'Advanced', 2),
(7, 6, 'Intermediate', 1),
(7, 8, 'Intermediate', 1);

-- Table structure for table `contact_messages`
CREATE TABLE IF NOT EXISTS `contact_messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `subject` varchar(150) NOT NULL,
  `message` text NOT NULL,
  `submitted_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Create event_registrations table if it doesn't exist
CREATE TABLE IF NOT EXISTS `event_registrations` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `event_id` INT NOT NULL,
  `registration_date` DATETIME NOT NULL,
  `status` ENUM('registered', 'cancelled') DEFAULT 'registered',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE,
  UNIQUE KEY `unique_registration` (`user_id`, `event_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Add some sample registrations
INSERT INTO `event_registrations` (`user_id`, `event_id`, `registration_date`, `status`) VALUES
(1, 1, '2024-03-15 10:00:00', 'registered'),
(2, 1, '2024-03-16 11:30:00', 'registered'),
(3, 2, '2024-03-17 09:15:00', 'registered'),
(4, 3, '2024-03-18 14:20:00', 'registered'),
(5, 4, '2024-03-19 16:45:00', 'registered');

-- ... rest of the existing code ...

-- Instructor Profiles Table
CREATE TABLE IF NOT EXISTS `instructor_profiles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `specialization` VARCHAR(255) NOT NULL,
  `teaching_approach` TEXT,
  `class_size_preference` ENUM('one-on-one', 'small-group', 'large-group', 'any') DEFAULT 'any',
  `preferred_teaching_hours` JSON COMMENT 'Stores preferred teaching hours as JSON array',
  `teaching_platforms` JSON COMMENT 'Stores supported teaching platforms (Zoom, Google Meet, etc.)',
  `teaching_materials` JSON COMMENT 'Stores types of teaching materials provided',
  `student_levels` JSON COMMENT 'Stores preferred student levels (beginner, intermediate, advanced)',
  `academic_qualifications` JSON COMMENT 'Stores academic qualifications with details',
  `professional_experience` JSON COMMENT 'Stores professional experience details',
  `teaching_certifications` JSON COMMENT 'Stores teaching-related certifications',
  `languages_fluent_in` JSON COMMENT 'Stores languages the instructor is fluent in',
  `teaching_style` TEXT COMMENT 'Description of teaching methodology and approach',
  `success_stories` JSON COMMENT 'Stores student success stories and testimonials',
  `portfolio_url` VARCHAR(255),
  `linkedin_url` VARCHAR(255),
  `github_url` VARCHAR(255),
  `personal_website` VARCHAR(255),
  `is_available_for_consultation` BOOLEAN DEFAULT TRUE,
  `consultation_fee` DECIMAL(10,2),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `unique_instructor_profile` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Add indexes for better performance
CREATE INDEX idx_instructor_specialization ON instructor_profiles(specialization);
CREATE INDEX idx_instructor_availability ON instructor_profiles(is_available_for_consultation);

-- Insert sample instructor profiles
INSERT INTO instructor_profiles (
    user_id,
    specialization,
    teaching_approach,
    class_size_preference,
    preferred_teaching_hours,
    teaching_platforms,
    teaching_materials,
    student_levels,
    academic_qualifications,
    professional_experience,
    teaching_certifications,
    languages_fluent_in,
    teaching_style,
    success_stories,
    portfolio_url,
    linkedin_url,
    github_url,
    is_available_for_consultation,
    consultation_fee
) VALUES
(1, 'Web Development', 'Hands-on practical approach with real-world projects', 'small-group',
'["Monday: 9:00-17:00", "Wednesday: 9:00-17:00", "Friday: 9:00-17:00"]',
'["Zoom", "Google Meet", "Microsoft Teams"]',
'["Video Lectures", "Code Examples", "Project Templates", "Practice Exercises"]',
'["Beginner", "Intermediate", "Advanced"]',
'[{"degree": "BSc Computer Science", "institution": "Tech University", "year": 2018}]',
'[{"role": "Senior Web Developer", "company": "Tech Corp", "duration": "3 years"}]',
'[{"name": "Web Development Professional", "issuer": "Meta", "year": 2022}]',
'["English", "Arabic"]',
'Interactive and project-based learning with emphasis on practical skills',
'[{"student": "John Doe", "achievement": "Landed first web development job"}]',
'https://portfolio.example.com/john',
'https://linkedin.com/in/john-doe',
'https://github.com/johndoe',
TRUE,
75.00),
(2, 'Data Science', 'Theory combined with practical applications', 'one-on-one',
'["Tuesday: 10:00-18:00", "Thursday: 10:00-18:00"]',
'["Zoom", "Google Meet"]',
'["Video Lectures", "Data Sets", "Jupyter Notebooks", "Case Studies"]',
'["Intermediate", "Advanced"]',
'[{"degree": "MSc Data Science", "institution": "Data University", "year": 2020}]',
'[{"role": "Data Scientist", "company": "Data Corp", "duration": "2 years"}]',
'[{"name": "Data Science Professional", "issuer": "IBM", "year": 2021}]',
'["English", "French"]',
'Focus on real-world data problems and industry applications',
'[{"student": "Jane Smith", "achievement": "Published research paper"}]',
'https://portfolio.example.com/jane',
'https://linkedin.com/in/jane-smith',
'https://github.com/janesmith',
TRUE,
85.00);

-- Instructor Users Table
CREATE TABLE IF NOT EXISTS `instructor_users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `instructor_type` ENUM('full-time', 'part-time', 'freelance') NOT NULL,
  `years_of_experience` INT NOT NULL,
  `expertise_level` ENUM('beginner', 'intermediate', 'expert') NOT NULL,
  `specialization` VARCHAR(255) NOT NULL,
  `hourly_rate` DECIMAL(10,2) NOT NULL,
  `total_students` INT DEFAULT 0,
  `total_courses` INT DEFAULT 0,
  `average_rating` DECIMAL(3,2) DEFAULT 0.00,
  `total_reviews` INT DEFAULT 0,
  `is_verified` BOOLEAN DEFAULT FALSE,
  `verification_date` DATETIME,
  `verification_documents` TEXT,
  `teaching_certificates` TEXT,
  `available_hours` TEXT,
  `preferred_teaching_method` ENUM('online', 'offline', 'both') DEFAULT 'online',
  `preferred_teaching_platform` VARCHAR(255),
  `bio` TEXT,
  `achievements` TEXT,
  `social_links` TEXT,
  `is_active` BOOLEAN DEFAULT TRUE,
  `last_active` TIMESTAMP NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY `unique_instructor_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Insert sample instructor users
INSERT INTO instructor_users (
    user_id, instructor_type, years_of_experience, expertise_level, specialization, hourly_rate, total_students, total_courses, average_rating, total_reviews, is_verified, verification_date, verification_documents, teaching_certificates, available_hours, preferred_teaching_method, preferred_teaching_platform, bio, achievements, social_links, is_active
) VALUES
(1, 'full-time', 5, 'expert', 'Web Development', 50.00, 100, 5, 4.8, 45, TRUE, '2024-01-15 10:00:00',
'[{"url": "https://example.com/docs/certificate1.pdf"}]',
'[{"name": "Web Development Professional", "issuer": "Meta", "year": 2022}]',
'[{"day": "Monday", "hours": "9:00-17:00"}]',
'online', 'Zoom',
'Experienced web developer with a passion for teaching.',
'[{"title": "Best Instructor 2023", "issuer": "Tech Academy"}]',
'{"linkedin": "https://linkedin.com/in/john-doe"}',
TRUE),
(2, 'part-time', 3, 'expert', 'Data Science', 45.00, 75, 3, 4.7, 30, TRUE, '2024-01-20 14:30:00',
'[{"url": "https://example.com/docs/certificate2.pdf"}]',
'[{"name": "Data Science Professional", "issuer": "IBM", "year": 2021}]',
'[{"day": "Tuesday", "hours": "10:00-18:00"}]',
'online', 'Google Meet',
'Data science expert with industry experience.',
'[{"title": "Outstanding Teacher Award", "issuer": "Data Science Institute"}]',
'{"linkedin": "https://linkedin.com/in/jane-smith"}',
TRUE);
