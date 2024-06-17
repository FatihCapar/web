// src/ProjectList.jsx
import React, { useState, useEffect } from 'react';
import { useCurrentUser } from './UserContext';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const { currentUser } = useCurrentUser();

  useEffect(() => {
    if (currentUser) {
      fetch('/projects', {
        headers: {
          'Authorization': `Bearer ${currentUser.token}` // Token senden
        }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Netzwerkantwort war nicht ok');
          }
          return response.json();
        })
        .then(data => setProjects(data))
        .catch(error => {
          console.error('Fehler beim Abrufen der Projekte:', error);
        });
    }
  }, [currentUser]);

  return (
    <div>
      <h2>Projektliste</h2>
      {Array.isArray(projects) ? (
        projects.map((project) => (
          <div key={project.id} className="project-item">
            <h3>{project.name}</h3>
            <p>{project.description}</p>
            <button onClick={() => deleteProject(project.id)}>Löschen</button>
          </div>
        ))
      ) : (
        <p>Keine Projekte gefunden.</p>
      )}
    </div>
  );
}

export default ProjectList;
