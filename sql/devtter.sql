CREATE DATABASE
    IF NOT EXISTS devtter;

USE devtter;

CREATE TABLE
    IF NOT EXISTS messages (
        id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
        sender BINARY(16) NOT NULL,
        reciever BINARY(16) NOT NULL,
        content VARCHAR(255) NOT NULL,
        code JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );