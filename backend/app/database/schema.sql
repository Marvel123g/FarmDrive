CREATE TABLE IF NOT EXISTS farmer (
    id TEXT PRIMARY KEY NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    farm_state TEXT NOT NULL,
    farm_city TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS driver (
    id TEXT PRIMARY KEY NOT NULL,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    is_verified INTEGER DEFAULT 0 NOT NULL,
    profile_picture_url TEXT,
    vehicle_type TEXT,
    license_plate TEXT UNIQUE,
    bank_name TEXT,
    account_number TEXT,
    account_name TEXT,
    is_available INTEGER DEFAULT 0,
    rating REAL DEFAULT 0.0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS farmer_sessions (
    id TEXT PRIMARY KEY,
    farmer_id TEXT REFERENCES farmer(id),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL
);


CREATE TABLE IF NOT EXISTS driver_sessions (
    id TEXT PRIMARY KEY,
    driver_id TEXT REFERENCES driver(id),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL
);


CREATE TABLE IF NOT EXISTS driver_pos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    driver_id TEXT UNIQUE NOT NULL,
    lat REAL,
    lng REAL,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (driver_id) REFERENCES driver (id)
);


CREATE TABLE IF NOT EXISTS farmer_pos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    farmer_id TEXT UNIQUE NOT NULL,
    lat REAL,
    lng REAL,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farmer_id) REFERENCES farmer (id)
);


CREATE TABLE IF NOT EXISTS farm_produce (
    id TEXT PRIMARY KEY NOT NULL,
    farmer_id TEXT NOT NULL,
    crop_name TEXT NOT NULL,
    pickup_location TEXT NOT NULL,
    destination TEXT NOT NULL,
    quantity TEXT NOT NULL,
    details TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farmer_id) REFERENCES farmer (id)
);

CREATE TABLE IF NOT EXISTS produce_price (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    produce_id TEXT NOT NULL,
    driver_id TEXT NOT NULL,
    price REAL NOT NULL,
    accepted INTEGER DEFAULT 0,
    driver_distance REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    accepted_at DATETIME,
    FOREIGN KEY (produce_id) REFERENCES farm_produce (id),
    FOREIGN KEY (driver_id) REFERENCES driver (id)
);


CREATE TABLE IF NOT EXISTS deliveries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    produce_id TEXT NOT NULL,
    driver_id TEXT NOT NULL,
    farmer_id TEXT NOT NULL,
    accepted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT "ACCEPTED", --MATCHED, IN TRANSIT, DELIVERED
    price INTEGER NOT NULL,
    delivered_at DATETIME,
    FOREIGN KEY (produce_id) REFERENCES farm_produce (id),
    FOREIGN KEY (driver_id) REFERENCES driver (id),
    FOREIGN KEY (farmer_id) REFERENCES farmer (id)
);