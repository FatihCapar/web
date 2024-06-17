import React, { useState, useEffect } from 'react';

function CommentList({ taskId }) {
  const [comments, setComments] = useState([]);

  const fetchComments = () => {
    fetch(`/comments/${taskId}`)
      .then(response => response.json())
      .then(data => setComments(data))
      .catch(error => {
        console.error('Fehler beim Abrufen der Kommentare:', error);
      });
  };

  useEffect(() => {
    fetchComments();
  }, [taskId]);

  return (
    <div>
      <h2>Kommentare</h2>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>
            <p>{comment.content}</p>
            <p>Erstellt von: {comment.user}</p>
            <p>Erstellt am: {new Date(comment.created_at).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CommentList;
