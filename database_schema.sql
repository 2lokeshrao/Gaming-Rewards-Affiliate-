-- Database Schema for bonuspromocode.in
-- Run this to migrate from data.json to MySQL

CREATE TABLE `global_config` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `heroHeadline` VARCHAR(255),
  `heroSubheading` VARCHAR(255),
  `topBannerTemplate` VARCHAR(255),
  `enableSubPartnerProgram` BOOLEAN DEFAULT FALSE,
  `subPartnerHeadline` VARCHAR(255),
  `telegramUrl` VARCHAR(255),
  `instagramUrl` VARCHAR(255),
  `tiktokUrl` VARCHAR(255),
  `whatsappGroupUrl` VARCHAR(255),
  `youtubeUrl` VARCHAR(255),
  `hideAdminLink` BOOLEAN DEFAULT FALSE,
  `secretKeyTrigger` VARCHAR(50),
  `copyrightText` VARCHAR(255),
  `footerDisclaimerText` TEXT,
  `sidebarAdHtml` TEXT,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE `gaming_platforms` (
  `id` VARCHAR(50) PRIMARY KEY,
  `slug` VARCHAR(100) UNIQUE NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `logoUrl` VARCHAR(255) NOT NULL,
  `rating` DECIMAL(3,1) DEFAULT 0.0,
  `starRating` INT DEFAULT 5,
  `bonusText` VARCHAR(255),
  `promoCode` VARCHAR(50),
  `rawAffiliateUrl` VARCHAR(255),
  `masterPartnerUrl` VARCHAR(255),
  `claimUrl` VARCHAR(255),
  `reviewContent` TEXT,
  `isFeatured` BOOLEAN DEFAULT FALSE,
  `featuredRank` INT DEFAULT NULL,
  `isActive` BOOLEAN DEFAULT TRUE,
  `clicksCount` INT DEFAULT 0,
  `copiesCount` INT DEFAULT 0,
  `category` VARCHAR(50),
  `bonusTitle` VARCHAR(255),
  `minDeposit` VARCHAR(50),
  `metaTitle` VARCHAR(255),
  `metaDescription` TEXT,
  `metaKeywords` TEXT,
  `averageUserRating` DECIMAL(3,1) DEFAULT 0.0,
  `totalReviewsCount` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE `platform_badges` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `platform_id` VARCHAR(50) NOT NULL,
  `badge_name` VARCHAR(50) NOT NULL,
  FOREIGN KEY (`platform_id`) REFERENCES `gaming_platforms`(`id`) ON DELETE CASCADE
);

CREATE TABLE `custom_coupons` (
  `id` VARCHAR(50) PRIMARY KEY,
  `brandName` VARCHAR(100) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `code` VARCHAR(50) NOT NULL,
  `description` TEXT,
  `targetUrl` VARCHAR(255) NOT NULL,
  `category` VARCHAR(50),
  `badgeText` VARCHAR(50),
  `isActive` BOOLEAN DEFAULT TRUE,
  `expiresAt` DATETIME,
  `metaTitle` VARCHAR(255),
  `metaDescription` TEXT,
  `metaKeywords` TEXT,
  `clicksCount` INT DEFAULT 0,
  `copiesCount` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `sub_partner_applications` (
  `id` VARCHAR(50) PRIMARY KEY,
  `fullName` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `whatsapp` VARCHAR(50) NOT NULL,
  `platformId` VARCHAR(50),
  `platformName` VARCHAR(100),
  `trafficSource` VARCHAR(255),
  `estimatedMonthlyPlayers` VARCHAR(50),
  `status` ENUM('pending', 'approved', 'contacted') DEFAULT 'pending',
  `appliedAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`platformId`) REFERENCES `gaming_platforms`(`id`) ON DELETE SET NULL
);

CREATE TABLE `platform_feedbacks` (
  `id` VARCHAR(50) PRIMARY KEY,
  `platformId` VARCHAR(50) NOT NULL,
  `platformName` VARCHAR(100),
  `userName` VARCHAR(100) NOT NULL,
  `userEmail` VARCHAR(100),
  `rating` INT NOT NULL,
  `comment` TEXT,
  `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `isApproved` BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (`platformId`) REFERENCES `gaming_platforms`(`id`) ON DELETE CASCADE
);

CREATE TABLE `track_logs` (
  `id` VARCHAR(50) PRIMARY KEY,
  `platformId` VARCHAR(50),
  `platformName` VARCHAR(100),
  `eventType` ENUM('visit', 'click', 'copy') NOT NULL,
  `timestamp` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `country` VARCHAR(100),
  `ip` VARCHAR(50),
  `userAgent` TEXT,
  FOREIGN KEY (`platformId`) REFERENCES `gaming_platforms`(`id`) ON DELETE SET NULL
);

CREATE TABLE `custom_pages` (
  `id` VARCHAR(50) PRIMARY KEY,
  `slug` VARCHAR(100) UNIQUE NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `content` TEXT,
  `isActive` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE `ai_articles` (
  `id` VARCHAR(50) PRIMARY KEY,
  `slug` VARCHAR(100) UNIQUE NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `content` TEXT,
  `category` VARCHAR(50),
  `platformId` VARCHAR(50),
  `platformName` VARCHAR(100),
  `metaTitle` VARCHAR(255),
  `metaDescription` TEXT,
  `coverImage` VARCHAR(255),
  `publishedAt` DATETIME,
  `author` VARCHAR(100),
  `views` INT DEFAULT 0,
  `status` ENUM('draft', 'published') DEFAULT 'draft',
  FOREIGN KEY (`platformId`) REFERENCES `gaming_platforms`(`id`) ON DELETE SET NULL
);

CREATE TABLE `ai_article_tags` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `article_id` VARCHAR(50) NOT NULL,
  `tag_name` VARCHAR(50) NOT NULL,
  FOREIGN KEY (`article_id`) REFERENCES `ai_articles`(`id`) ON DELETE CASCADE
);

CREATE TABLE `partner_panel_configs` (
  `platformId` VARCHAR(50) PRIMARY KEY,
  `platformName` VARCHAR(100),
  `apiKey` VARCHAR(255),
  `partnerApiUrl` VARCHAR(255),
  `affiliateId` VARCHAR(100),
  `postbackKey` VARCHAR(100),
  `syncEnabled` BOOLEAN DEFAULT FALSE,
  `lastSyncedAt` DATETIME,
  `totalRegistrations` INT DEFAULT 0,
  `ftdCount` INT DEFAULT 0,
  `totalDepositsAmount` DECIMAL(12,2) DEFAULT 0.00,
  `netGamingRevenue` DECIMAL(12,2) DEFAULT 0.00,
  `commissionEarned` DECIMAL(12,2) DEFAULT 0.00,
  `revSharePercent` DECIMAL(5,2),
  FOREIGN KEY (`platformId`) REFERENCES `gaming_platforms`(`id`) ON DELETE CASCADE
);
