const express = require('express');
const mysql = require('mysql');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Verbindung zur Datenbank herstellen
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

connection.connect((err) => {
    if (err) {
        console.error('Fehler beim Verbinden zur Datenbank:', err.message);
    } else {
        console.log('Erfolgreich mit der Datenbank verbunden.');
    }
});

// Middleware zum Parsen von JSON und URL-kodierten Daten
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Bereitstellen der statischen Dateien (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Route zum Erstellen der Tabelle (einmalig ausführen)
app.get('/create-table', (req, res) => {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS test1 (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL,
            title VARCHAR(255),
            completed BOOLEAN NOT NULL DEFAULT false
        )
    `;
    connection.query(createTableQuery, (error, results) => {
        if (error) {
            console.error('Fehler beim Erstellen der Tabelle:', error);
            res.status(500).send('Fehler beim Erstellen der Tabelle.');
        } else {
            console.log('Tabelle erfolgreich erstellt:', results);
            res.send('Tabelle erfolgreich erstellt.');
        }
    });
});

// Route zum Verarbeiten des Login-Formulars
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Anmeldedaten überprüfen
    const query = 'SELECT * FROM test2 WHERE username = ? AND password = ?';
    connection.query(query, [username, password], (error, results) => {
        if (error) {
            console.error('Fehler bei der Abfrage:', error);
            res.status(500).json({ message: 'Fehler bei der Abfrage.' });
        } else {
            if (results.length > 0) {
                res.json({ success: true, redirectUrl: '/dashboard.html' });
            } else {
                res.json({ success: false, message: 'Ungültiger Benutzername oder Passwort.' });
            }
        }
    });
});

app.listen(port, () => {
    console.log(`Server läuft auf http://localhost:${port}`);
});
