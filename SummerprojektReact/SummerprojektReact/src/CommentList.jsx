// src/CommentList.jsx
import React, { useState, useEffect } from 'react';
import { useCurrentUser } from './UserContext';

const CommentList = ({ taskId }) => {
  const [comments, setComments] = useState([]);
  const { currentUser } = useCurrentUser();

  useEffect(() => {
    if (!currentUser) return;

    const fetchComments = () => {
      fetch(`/comments/${taskId}`, {
        headers: {
          'Authorization': `Bearer ${currentUser.token}`,
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => setComments(data))
        .catch(error => {
          console.error('Fehler beim Abrufen der Kommentare:', error);
        });
    };

    fetchComments();
  }, [taskId, currentUser]);

  return (
    <div>
      {comments.map(comment => (
        <div key={comment.id}>
          <p>{comment.content}</p>
          <p>Erstellt von: {comment.user}</p>
          <p>Erstellt am: {new Date(comment.created_at).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

export default CommentList;
