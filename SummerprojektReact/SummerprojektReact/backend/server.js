import express from 'express';
import mysql from 'mysql';
import dotenv from 'dotenv';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';

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

const generateToken = (user) => {
  const payload = {
    id: user.id,
    username: user.username
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};


const checkAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Nicht autorisiert' });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Ungültiger Token' });
    }
    req.user = user;
    next();
  });
};

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT id, username FROM user WHERE username = ? AND password = ?';
  connection.query(query, [username, password], (error, results) => {
    if (error) {
      console.error('Fehler bei der Abfrage:', error);
      res.status(500).json({ message: 'Fehler bei der Abfrage.' });
    } else {
      if (results.length > 0) {
        const user = results[0];
        const token = generateToken(user);
        res.json({ success: true, user, token, redirectUrl: '/dashboard' });
      } else {
        res.json({ success: false, message: 'Ungültiger Benutzername oder Passwort.' });
      }
    }
  });
});


app.post('/createTask', checkAuth, (req, res) => {
  const { name, description, assigned_to, created_at, due_to } = req.body;
  const created_by = req.user.id;

  console.log('Request Body:', req.body);

  if (!assigned_to || !created_by) {
    return res.status(400).json({ success: false, message: 'assigned_to and created_by cannot be null' });
  }

  const taskQuery = `
    INSERT INTO task (name, description, created_by, assigned_to, created_at, due_to)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  connection.query(taskQuery, [name, description, created_by, assigned_to, created_at, due_to], (taskError, taskResults) => {
    if (taskError) {
      console.error('Fehler bei der Aufgabenabfrage:', taskError);
      res.status(500).json({ message: 'Fehler bei der Aufgabenabfrage.' });
    } else {
      res.json({ success: true, message: 'Aufgabe erfolgreich erstellt.' });
    }
  });
});

app.get('/tasks', checkAuth, (req, res) => {
  const query = `
    SELECT task.id, task.name, task.description, 
        user_created.username AS created_by, 
        user_assigned.username AS assigned_to, 
        DATE_FORMAT(task.created_at, '%m.%d.%Y %H:%i') AS created_at, 
        DATE_FORMAT(task.due_to, '%m.%d.%Y %H:%i') AS due_to 
    FROM task 
    LEFT JOIN user AS user_created ON task.created_by = user_created.id 
    LEFT JOIN user AS user_assigned ON task.assigned_to = user_assigned.id
  `;

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Fehler bei der Abfrage der Aufgaben:', error);
      res.status(500).json({ message: 'Fehler bei der Abfrage der Aufgaben.' });
    } else {
      res.json(results);
    }
  });
});

app.post('/comments', checkAuth, (req, res) => {
  const { task_id, content } = req.body;
  const user_id = req.user.id;
  const createdAt = new Date().toISOString();

  const query = 'INSERT INTO comment (task_id, user_id, content, created_at) VALUES (?, ?, ?, ?)';
  connection.query(query, [task_id, user_id, content, createdAt], (error, results) => {
    if (error) {
      console.error('Fehler beim Erstellen des Kommentars:', error);
      res.status(500).json({ success: false, message: 'Fehler beim Erstellen des Kommentars.' });
    } else {
      res.json({ success: true, message: 'Kommentar erfolgreich erstellt.' });
    }
  });
});

app.get('/comments/:taskId', checkAuth, (req, res) => {
  const taskId = req.params.taskId;
  const query = `
    SELECT c.id, c.content, c.created_at, u.username as user
    FROM comment c
    JOIN user u ON c.user_id = u.id
    WHERE c.task_id = ?
  `;
  connection.query(query, [taskId], (error, results) => {
    if (error) {
      console.error('Fehler bei der Abfrage der Kommentare:', error);
      res.status(500).json({ message: 'Fehler bei der Abfrage der Kommentare.' });
    } else {
      res.json(results);
    }
  });
});

app.delete('/tasks/:id', checkAuth, (req, res, next) => {
  const taskId = req.params.id;

  const deleteTaskQuery = 'DELETE FROM task WHERE id = ?';

  connection.query(deleteTaskQuery, [taskId], (error, results) => {
    if (error) {
      return next(error);
    } else if (results.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Aufgabe nicht gefunden' });
    } else {
      res.json({ success: true, message: 'Aufgabe erfolgreich gelöscht' });
    }
  });
});

app.delete('/tasks', checkAuth, (req, res, next) => {
  const deleteCommentsQuery = 'DELETE FROM comment';
  const deleteTasksQuery = 'DELETE FROM task';

  connection.query(deleteCommentsQuery, (commentError, commentResults) => {
    if (commentError) {
      return next(commentError);
    } else {
      connection.query(deleteTasksQuery, (taskError, taskResults) => {
        if (taskError) {
          return next(taskError);
        } else {
          res.json({ success: true, message: 'Alle Aufgaben und Kommentare erfolgreich gelöscht' });
        }
      });
    }
  });
});


app.get('/users', checkAuth, (req, res) => {
  const query = 'SELECT id, username FROM user';

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Fehler beim Abrufen der Benutzer:', error);
      res.status(500).json({ message: 'Fehler beim Abrufen der Benutzer.' });
    } else {
      res.json(results);
    }
  });
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '../dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});
