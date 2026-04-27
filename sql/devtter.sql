CREATE DATABASE IF NOT EXISTS devtter;

USE devtter;

CREATE TABLE
    IF NOT EXISTS messages (
        id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN (UUID (), true)),
        sender VARCHAR(10) NOT NULL,
        receiver VARCHAR(10) NOT NULL,
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