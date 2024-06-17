import React, { useState, useEffect } from 'react';
import CommentList from './CommentList';
import CreateComment from './CreateComment';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [openTaskId, setOpenTaskId] = useState(null);

  useEffect(() => {
    fetch('/tasks')
      .then(response => response.json())
      .then(data => setTasks(data))
      .catch(error => {
        console.error('Fehler beim Abrufen der Aufgaben:', error);
      });
  }, []);

  const toggleTask = (taskId, event) => {
    // Verhindere das Schließen der Aufgabe, wenn auf ein Eingabefeld geklickt wird
    if (event.target.tagName.toLowerCase() === 'input' || event.target.tagName.toLowerCase() === 'button') {
      return;
    }
    setOpenTaskId(openTaskId === taskId ? null : taskId);
  };

  const deleteTask = (taskId) => {
    fetch(`/tasks/${taskId}`, {
      method: 'DELETE'
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setTasks(tasks.filter(task => task.id !== taskId));
        } else {
          console.error('Fehler beim Löschen der Aufgabe:', data.message);
        }
      })
      .catch(error => {
        console.error('Fehler beim Löschen der Aufgabe:', error);
      });
  };

  return (
    <div className="task-list">
      <h1>Aufgabenliste</h1>
      <div className="task-grid">
        {tasks.map(task => (
          <div 
            key={task.id} 
            className={`task-item ${openTaskId === task.id ? 'open' : ''}`} 
            onClick={(event) => toggleTask(task.id, event)}
          >
            <h3>{task.name}</h3>
            <p>{task.description}</p>
            <p>Erstellt von: {task.created_by}</p>
            <p>Zugewiesen an: {task.assigned_to}</p>
            <p>Erstellt am: {new Date(task.created_at).toLocaleString()}</p>
            <p>Fällig am: {new Date(task.due_to).toLocaleString()}</p>
            <button onClick={() => deleteTask(task.id)}>Löschen</button>
            {openTaskId === task.id && (
              <div className="comments">
                <h4>Kommentare</h4>
                <CommentList taskId={task.id} />
                <CreateComment taskId={task.id} onCommentAdded={() => document.location.reload()} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TaskList;
