CREATE DATABASE IF NOT EXISTS devtter;

USE devtter;

DROP TABLE IF EXISTS messages;

DROP TABLE IF EXISTS users;

CREATE TABLE
    users (
        id VARCHAR(10) PRIMARY KEY,
        userName VARCHAR(10) NOT NULL UNIQUE,
        name VARCHAR(50) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        avatar VARCHAR(255) DEFAULT NULL,
        is_online BOOLEAN DEFAULT TRUE,
        last_logout TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_userName (userName)
    );

CREATE TABLE
    messages (
        id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN (UUID (), true)),
        sender VARCHAR(10) NOT NULL REFERENCES users (id) ON DELETE CASCADE,
        receiver VARCHAR(10) NOT NULL REFERENCES users (id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        code JSON DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        -- 🔥 conversación normalizada (A-B siempre igual)
        conversation_id VARCHAR(21) GENERATED ALWAYS AS (
            CONCAT (
                LEAST (sender, receiver),
                '-',
                GREATEST (sender, receiver)
            )
        ) STORED,
        -- ⚡ índices clave
        INDEX idx_sender (sender),
        INDEX idx_receiver (receiver),
        INDEX idx_conversation (conversation_id),
        INDEX idx_created (created_at)
    );