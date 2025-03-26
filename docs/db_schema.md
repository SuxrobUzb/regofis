# Схема базы данных

## Таблица: users
- id (SERIAL PRIMARY KEY)
- username (VARCHAR(50) UNIQUE NOT NULL)
- password (VARCHAR(255) NOT NULL)
- role (VARCHAR(20) NOT NULL) -- 'admin' или 'user'

## Таблица: tariffs
- id (SERIAL PRIMARY KEY)
- name (VARCHAR(50) NOT NULL)
- features (JSONB) -- Например: {"kiosk": true, "tv": false, "operator": 1}
- price (DECIMAL(10,2) NOT NULL)

## Таблица: licenses
- id (SERIAL PRIMARY KEY)
- key (VARCHAR(32) UNIQUE NOT NULL)
- user_id (INTEGER REFERENCES users(id))
- tariff_id (INTEGER REFERENCES tariffs(id))
- expires_at (TIMESTAMP NOT NULL)
- max_workstations (INTEGER NOT NULL)

## Таблица: tickets
- id (SERIAL PRIMARY KEY)
- number (INTEGER NOT NULL)
- created_at (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
- status (VARCHAR(20) DEFAULT 'waiting') -- 'waiting', 'called', 'completed'
- operator_id (INTEGER REFERENCES users(id))