-- Drop existing tables if they exist
DROP TABLE IF EXISTS admin_logs;
DROP TABLE IF EXISTS user_dashboard;
DROP TABLE IF EXISTS admin_dashboard;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS admin;

-- Create Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(15) DEFAULT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Admin table
CREATE TABLE admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Orders table
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    pickup_state VARCHAR(255) NOT NULL,
    pickup_city VARCHAR(255) NOT NULL,
    pickup_address TEXT NOT NULL,
    delivery_state VARCHAR(255) NOT NULL,
    delivery_city VARCHAR(255) NOT NULL,
    delivery_address TEXT NOT NULL,
    pickup_date DATE NOT NULL, -- Field for pickup date
    arriving_date DATE NOT NULL, -- Field for arriving date
    packing_type ENUM('Home', 'Apartment', 'Office', 'Vehicle') NOT NULL, -- Added field for packing type
    items TEXT,
    additional_notes TEXT,
    insurance ENUM('Yes', 'No') DEFAULT 'No',
    status ENUM('Pending', 'In Progress', 'Completed', 'Cancelled') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create Admin Logs table
CREATE TABLE admin_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id INT NOT NULL,
    action TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES admin(id) ON DELETE CASCADE
);

-- Create User Dashboard table
CREATE TABLE user_dashboard (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    widget_data JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create Admin Dashboard table
CREATE TABLE admin_dashboard (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id INT NOT NULL,
    widget_data JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES admin(id) ON DELETE CASCADE
);
