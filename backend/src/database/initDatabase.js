const db = require("./database");
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
