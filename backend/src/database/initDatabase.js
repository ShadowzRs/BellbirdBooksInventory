const db = require("./database");

// USERS TABLE
const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'bookseller'
            CHECK (role IN ('admin', 'manager', 'bookseller'))
    )
`;

db.exec(createUsersTable);
console.log("Users table ready");

// STOCK TABLE
const createStockTable = `
    CREATE TABLE IF NOT EXISTS stock (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        type TEXT NOT NULL
            CHECK (type IN ('new', 'second-hand')),
        section TEXT NOT NULL,
        shelf_location TEXT,
        quantity INTEGER
            CHECK (quantity IS NULL OR quantity >= 0),
        condition TEXT
            CHECK (
                condition IS NULL OR
                condition IN (
                    'New',
                    'Very Good',
                    'Good',
                    'Fair',
                    'Reading Copy'
                )
            ),
        price DECIMAL(9,2) NOT NULL CHECK (price >= 0),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`;

db.exec(createStockTable);
console.log("Stock table ready");

// ORDERS TABLE
const createOrdersTable = `
    CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        phone_number TEXT NOT NULL,
        contact_preference TEXT NOT NULL
            CHECK (contact_preference IN ('call', 'text')),
        book_title TEXT NOT NULL,
        book_author TEXT,
        quantity INTEGER NOT NULL
            CHECK (quantity > 0),
        status TEXT NOT NULL
            CHECK (
                status IN (
                    'unfulfilled',
                    'collected',
                    'cancelled'
                )
            )
            DEFAULT 'unfulfilled',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`;
db.exec(createOrdersTable);
console.log("Orders table ready");
