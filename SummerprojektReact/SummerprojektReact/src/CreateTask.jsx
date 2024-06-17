import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrentUser } from './UserContext';

const CreateTask = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [dueTo, setDueTo] = useState('');
  const [users, setUsers] = useState([]);
  const { currentUser } = useCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/users', {
      headers: {
        'Authorization': `Bearer ${currentUser.token}`
      }
    })
    .then(response => response.json())
    .then(data => setUsers(data))
    .catch(error => console.error('Fehler beim Abrufen der Benutzer:', error));
  }, [currentUser]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const task = {
      name,
      description,
      assigned_to: assignedTo,
      created_at: createdAt,
      due_to: dueTo
    };

    fetch('/createTask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentUser.token}`
      },
      body: JSON.stringify(task)
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        navigate('/tasks');
      } else {
        console.error('Fehler beim Erstellen der Aufgabe:', data.message);
      }
    })
    .catch(error => {
      console.error('Fehler:', error);
    });
  };

  return (
    <div>
      <h2>Neue Aufgabe erstellen</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label>
          Beschreibung:
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>
        <label>
          Zugewiesen an:
          <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} required>
            <option value="">Wählen Sie einen Benutzer</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>{user.username}</option>
            ))}
          </select>
        </label>
        <label>
          Erstellungsdatum:
          <input
            type="datetime-local"
            value={createdAt}
            onChange={(e) => setCreatedAt(e.target.value)}
            required
          />
        </label>
        <label>
          Fälligkeitsdatum:
          <input
            type="datetime-local"
            value={dueTo}
            onChange={(e) => setDueTo(e.target.value)}
            required
          />
        </label>
        <button type="submit">Erstellen</button>
      </form>
    </div>
  );
};

export default CreateTask;
