import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrentUser } from './UserContext';
import CommentList from './CommentList';
import CreateComment from './CreateComment';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [openTaskId, setOpenTaskId] = useState(null);
  const { currentUser } = useCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/'); // Weiterleiten zur Login-Seite, wenn der Benutzer nicht angemeldet ist
      return;
    }

    fetch('/tasks', {
      headers: {
        'Authorization': `Bearer ${currentUser.token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => setTasks(data))
      .catch(error => {
        console.error('Fehler beim Abrufen der Aufgaben:', error);
      });
  }, [currentUser, navigate]);

  const toggleTask = (taskId, event) => {
    if (event?.target.tagName.toLowerCase() === 'textarea' || event?.target.tagName.toLowerCase() === 'button') {
      return;
    }
    setOpenTaskId(openTaskId === taskId ? null : taskId);
  };

  const deleteTask = (taskId) => {
    fetch(`/tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${currentUser.token}`,
        'Content-Type': 'application/json'
      }
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

  const handleCommentAdded = (taskId) => {
    setOpenTaskId(null);
    setTimeout(() => {
      setOpenTaskId(taskId);
    }, 0);
  };

  return (
    <div className="task-list">
      <h2>Aufgabenliste</h2>
      <p>Diese Seite zeigt eine Liste aller Aufgaben, die im System erstellt wurden. Jede Aufgabe enthält Details wie den Namen, die Beschreibung, den Ersteller, den zugewiesenen Benutzer sowie das Erstellungs- und Fälligkeitsdatum.</p>
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
              <div className="comments" onClick={(e) => e.stopPropagation()}>
                <h4>Kommentare</h4>
                <CommentList taskId={task.id} />
                <CreateComment taskId={task.id} onCommentAdded={() => handleCommentAdded(task.id)} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TaskList;
