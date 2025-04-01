-- Asegurarse de que la tabla users tenga las columnas necesarias
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255),
  password_hash VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user',
  provider VARCHAR(50),
  provider_id VARCHAR(255),
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índice para búsquedas por email
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Añadir columnas si no existen
DO $$
BEGIN
  -- Añadir password_hash si no existe
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name='users' AND column_name='password_hash') THEN
    ALTER TABLE users ADD COLUMN password_hash VARCHAR(255);
  END IF;
  
  -- Añadir provider si no existe
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name='users' AND column_name='provider') THEN
    ALTER TABLE users ADD COLUMN provider VARCHAR(50);
  END IF;
  
  -- Añadir provider_id si no existe
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name='users' AND column_name='provider_id') THEN
    ALTER TABLE users ADD COLUMN provider_id VARCHAR(255);
  END IF;
  
  -- Añadir email_verified si no existe
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name='users' AND column_name='email_verified') THEN
    ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT FALSE;
  END IF;
  
  -- Añadir updated_at si no existe
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name='users' AND column_name='updated_at') THEN
    ALTER TABLE users ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
  END IF;
END $$;

