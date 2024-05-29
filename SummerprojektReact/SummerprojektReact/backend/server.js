import express from 'express';
import mysql from 'mysql';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

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

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT * FROM test1 WHERE username = ? AND password = ?';
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


