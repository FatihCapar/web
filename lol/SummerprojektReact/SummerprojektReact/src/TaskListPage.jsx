import React, { useState, useEffect } from 'react';

function TaskListPage() {
  const [tasks, setTasks] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetch('/tasks')
      .then(response => response.json())
      .then(data => setTasks(data))
      .catch(error => {
        console.error('Fehler beim Abrufen der Aufgaben:', error);
        setErrorMessage('Fehler beim Abrufen der Aufgaben.');
      });
  }, []);

  return (
    <div>
      <h2>Aufgabenliste99</h2>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <h3>{task.name}</h3>
            <p>{task.description}</p>
            <p>Erstellt von: {task.created_by}</p>
            <p>Zugewiesen an: {task.assigned_to}</p>
            <p>Erstellt am: {new Date(task.created_at).toLocaleString()}</p>
            <p>Fällig bis: {new Date(task.due_to).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskListPage;
