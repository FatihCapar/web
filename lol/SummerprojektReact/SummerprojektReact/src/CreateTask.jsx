import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrentUser } from './UserContext'; // Importiere den useCurrentUser Hook

const CreateTask = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [dueTo, setDueTo] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { currentUser } = useCurrentUser(); // Verwende den Hook, um den aktuellen Benutzer abzurufen
  const [createdBy, setCreatedBy] = useState(currentUser ? currentUser.username : ''); // Setze den Ersteller auf den aktuellen Benutzer
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      setCreatedBy(currentUser.username);
    }
  }, [currentUser]);

  const handleSubmit = (event) => {
    event.preventDefault();

    fetch('/createTask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, description, created_by: createdBy, assigned_to: assignedTo, created_at: createdAt, due_to: dueTo })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Netzwerkantwort war nicht ok');
      }
      return response.json();
    })
    .then(data => {
      if (data.success) {
        navigate('/tasks');
      } else {
        setErrorMessage(data.message);
      }
    })
    .catch(error => {
      console.error('Fehler:', error);
      setErrorMessage('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
    });
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    const formattedDate = now.toISOString().slice(0, 16);
    return formattedDate;
  }

  return (
    <div>
      <h2>Aufgabe erstellen</h2>
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
          Ersteller:
          <input
            type="text"
            value={createdBy}
            onChange={(e) => setCreatedBy(e.target.value)}
            readOnly={currentUser ? true : false} // Setze das Feld auf readonly, wenn ein aktueller Benutzer vorhanden ist
            required
          />
        </label>
        <label>
          Zugewiesen an:
          <input
            type="text"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            required
          />
        </label>
        <label>
          Erstellungsdatum:
          <input
            type="datetime-local"
            value={createdAt}
            onChange={(e) => setCreatedAt(e.target.value)}
            min={getCurrentDateTime()}
            required
          />
        </label>
        <label>
          Fälligkeitsdatum:
          <input
            type="datetime-local"
            value={dueTo}
            onChange={(e) => setDueTo(e.target.value)}
            min={getCurrentDateTime()}
            required
          />
        </label>
        <button type="submit">Aufgabe erstellen</button>
      </form>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </div>
  );
}

export default CreateTask;
