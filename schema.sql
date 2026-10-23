-- Quiz Builder MySQL 8 Schema

CREATE DATABASE IF NOT EXISTS `quiz_builder` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `quiz_builder`;

-- 1. Users Table
DROP TABLE IF EXISTS `attempt_answers`;
DROP TABLE IF EXISTS `attempts`;
DROP TABLE IF EXISTS `questions`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(150) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `role` VARCHAR(20) NOT NULL DEFAULT 'ROLE_USER',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Categories Table
CREATE TABLE `categories` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(100) NOT NULL,
    `description` TEXT,
    `difficulty` VARCHAR(20) NOT NULL DEFAULT 'Medium',
    `timer_minutes` INT NOT NULL DEFAULT 10
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Questions Table
CREATE TABLE `questions` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `category_id` BIGINT NOT NULL,
    `text` TEXT NOT NULL,
    `option_a` VARCHAR(255) NOT NULL,
    `option_b` VARCHAR(255) NOT NULL,
    `option_c` VARCHAR(255) NOT NULL,
    `option_d` VARCHAR(255) NOT NULL,
    `correct_option` CHAR(1) NOT NULL,
    `explanation` TEXT NOT NULL,
    CONSTRAINT `fk_question_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Attempts Table
CREATE TABLE `attempts` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL,
    `category_id` BIGINT NOT NULL,
    `attempt_number` INT NOT NULL,
    `score` INT NOT NULL DEFAULT 0,
    `total` INT NOT NULL DEFAULT 0,
    `started_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `submitted_at` TIMESTAMP NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'IN_PROGRESS',
    CONSTRAINT `fk_attempt_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_attempt_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Attempt Answers Table
CREATE TABLE `attempt_answers` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `attempt_id` BIGINT NOT NULL,
    `question_id` BIGINT NOT NULL,
    `selected_option` CHAR(1) NULL,
    `is_correct` BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT `fk_answer_attempt` FOREIGN KEY (`attempt_id`) REFERENCES `attempts` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_answer_question` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Helpful Indexes
CREATE INDEX `idx_user_email` ON `users` (`email`);
CREATE INDEX `idx_attempt_user_category` ON `attempts` (`user_id`, `category_id`);
CREATE INDEX `idx_questions_category` ON `questions` (`category_id`);
