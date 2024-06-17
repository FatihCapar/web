import React, { useState } from 'react';
import { useCurrentUser } from './UserContext';

const CreateComment = ({ taskId, onCommentAdded }) => {
  const [content, setContent] = useState('');
  const { currentUser } = useCurrentUser();

  const handleSubmit = (event) => {
    event.preventDefault();

    fetch('/comments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${currentUser.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ task_id: taskId, user_id: currentUser.id, content })
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setContent('');
          onCommentAdded();
        } else {
          console.error('Fehler beim Erstellen des Kommentars:', data.message);
        }
      })
      .catch(error => {
        console.error('Fehler beim Erstellen des Kommentars:', error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <button type="submit">Kommentar hinzufügen</button>
    </form>
  );
}

export default CreateComment;
