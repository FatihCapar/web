import React from 'react';
import { useNavigate } from 'react-router-dom';
import CreateTask from './CreateTask';
import './Dashboard.css'; // Importieren der CSS-Datei

const Dashboard = () => {
  const navigate = useNavigate();

  const handleViewTasks = () => {
    navigate('/tasks');
  };

  const deleteAllTasks = () => {
    fetch('/tasks', {
      method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Alle Aufgaben und Kommentare wurden erfolgreich gelöscht.');
        navigate('/tasks'); // Aktualisieren Sie die Seite, um die Änderungen anzuzeigen
      } else {
        alert('Fehler beim Löschen der Aufgaben: ' + data.message);
      }
    })
    .catch(error => {
      console.error('Fehler beim Löschen der Aufgaben:', error);
    });
  };

  return (
    <div>
      <h1>Willkommen auf dem Dashboard</h1>
      <p>Hier können Sie Aufgaben erstellen und anzeigen.</p>
      <CreateTask />
      <button onClick={handleViewTasks}>Aufgaben anzeigen</button>
      <button 
        onClick={deleteAllTasks} 
        className="delete-button" // Verwendung der CSS-Klasse
      >
        Alle Aufgaben löschen
      </button>
    </div>
  );
}

export default Dashboard;
