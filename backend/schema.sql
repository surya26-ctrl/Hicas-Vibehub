-- --- DATABASE SCHEMA FOR VIBEHUB ---

CREATE DATABASE IF NOT EXISTS vibehub_db;
USE vibehub_db;

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'student') DEFAULT 'student',
    department VARCHAR(255),
    institution VARCHAR(255) DEFAULT 'HICAS',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. EVENTS TABLE
CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    time VARCHAR(50),
    venue VARCHAR(255),
    description TEXT,
    sub_events TEXT,
    poster_url LONGTEXT, -- Stores Base64 or URL
    coordinatorSignature LONGTEXT, -- Stores Base64
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. REGISTRATIONS TABLE
CREATE TABLE IF NOT EXISTS registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    eventId INT,
    studentName VARCHAR(255),
    email VARCHAR(255),
    institution VARCHAR(255),
    eventTitle VARCHAR(255),
    department VARCHAR(255),
    subEvents TEXT,
    date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. SIGNATURES TABLE (SYSTEM SETTINGS)
CREATE TABLE IF NOT EXISTS signatures (
    id INT AUTO_INCREMENT PRIMARY KEY,
    principal LONGTEXT -- Stores Base64
);

-- SEED DATA (OPTIONAL)
INSERT INTO users (name, email, password, role, department) 
VALUES ('Admin Account', 'admin@hicas.ac.in', 'admin123', 'admin', 'Administration')
ON DUPLICATE KEY UPDATE email=email;

INSERT INTO users (name, email, password, role, department) 
VALUES ('Demo Student', 'student@hicas.ac.in', 'student123', 'student', 'Computer Science')
ON DUPLICATE KEY UPDATE email=email;

INSERT INTO events (title, date, venue, description)
VALUES ('UNIFEST 2026', '2026-04-15', 'Main Auditorium', 'A grand inter-college technical and cultural festival.')
ON DUPLICATE KEY UPDATE title=title;
