import React, { useState } from 'react';

const CreateProject = ({ onProjectCreated }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    fetch('/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, description })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        onProjectCreated();
        setName('');
        setDescription('');
      } else {
        console.error('Fehler beim Erstellen des Projekts:', data.message);
      }
    })
    .catch(error => {
      console.error('Fehler beim Erstellen des Projekts:', error);
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Projekt erstellen</h2>
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
        />
      </label>
      <button type="submit">Erstellen</button>
    </form>
  );
}

export default CreateProject;
