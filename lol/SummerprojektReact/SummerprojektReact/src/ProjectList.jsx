import React, { useState, useEffect } from 'react';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch('/projects')
      .then(response => response.json())
      .then(data => setProjects(data))
      .catch(error => {
        console.error('Fehler beim Abrufen der Projekte:', error);
      });
  }, []);

  const deleteProject = (projectId) => {
    fetch(`/projects/${projectId}`, {
      method: 'DELETE'
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setProjects(projects.filter(project => project.id !== projectId));
        } else {
          console.error('Fehler beim Löschen des Projekts:', data.message);
        }
      })
      .catch(error => {
        console.error('Fehler beim Löschen des Projekts:', error);
      });
  };

  return (
    <div>
      <h2>Projektliste</h2>
      {projects.map((project) => (
        <div key={project.id} className="project-item">
          <h3>{project.name}</h3>
          <p>{project.description}</p>
          <button onClick={() => deleteProject(project.id)}>Löschen</button>
        </div>
      ))}
    </div>
  );
}

export default ProjectList;
