const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config();

// Verbindung zur Datenbank herstellen
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// SQL-Befehl zum Erstellen der Tabelle
const createTableQuery = `
    CREATE TABLE IF NOT EXISTS test1 (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        completed BOOLEAN NOT NULL DEFAULT false
    )
`;

// Tabelle erstellen
connection.query(createTableQuery, (error, results) => {
    if (error) {
        console.error('Fehler beim Erstellen der Tabelle:', error);
    } else {
        console.log('Tabelle erfolgreich erstellt:', results);
    }
    
    // Verbindung zur Datenbank schließen
    connection.end((err) => {
        if (err) {
            console.error('Fehler beim Schließen der Datenbankverbindung:', err.message);
        } else {
            console.log('Datenbankverbindung erfolgreich geschlossen.');
        }
    });
});
