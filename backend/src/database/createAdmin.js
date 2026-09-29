const bcrypt = require("bcryptjs");
const db = require("./database");

const username = "admin";
const password = "admin123";
const firstName = "System";
const lastName = "Administrator";
const role = "admin";

const hashedPassword = bcrypt.hashSync(password, 10);

const statement = db.prepare(`
    INSERT INTO users
    (username, password, first_name, last_name, role)
    VALUES (?, ?, ?, ?, ?)
`);

statement.run(username, hashedPassword, firstName, lastName, role);

console.log("Admin user created");
