import React, { useState } from 'react';

const CreateCategory = ({ onCategoryCreated }) => {
  const [name, setName] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    fetch('/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        onCategoryCreated();
        setName('');
      } else {
        console.error('Fehler beim Erstellen der Kategorie:', data.message);
      }
    })
    .catch(error => {
      console.error('Fehler beim Erstellen der Kategorie:', error);
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Kategorie erstellen</h2>
      <label>
        Name:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>
      <button type="submit">Erstellen</button>
    </form>
  );
}

export default CreateCategory;
