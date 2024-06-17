import React, { useState } from 'react';
import { useCurrentUser } from './UserContext'; // Importieren Sie den useCurrentUser Hook

const CreateComment = ({ taskId, onCommentAdded }) => {
  const [content, setContent] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { currentUser } = useCurrentUser(); // Verwenden Sie den Hook, um den aktuellen Benutzer abzurufen

  const handleSubmit = (event) => {
    event.preventDefault(); // Verhindern Sie das Standard-Formular-Absenden

    fetch('/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ task_id: taskId, user_id: currentUser.id, content }) // Verwenden Sie die ID des aktuellen Benutzers
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Netzwerkantwort war nicht ok');
      }
      return response.json();
    })
    .then(data => {
      if (data.success) {
        setContent('');
        onCommentAdded(); // Ruft die Funktion auf, um die Kommentare neu zu laden
      } else {
        setErrorMessage(data.message);
      }
    })
    .catch(error => {
      console.error('Fehler:', error);
      setErrorMessage('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
    });
  };

  return (
    <div>
      <h2>Kommentar erstellen</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Inhalt:
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </label>
        <button type="submit">Kommentar erstellen</button>
      </form>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </div>
  );
}

export default CreateComment;
