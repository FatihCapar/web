import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import TaskList from './TaskList';
import CreateTaskPage from './CreateTaskPage'; // Verwenden Sie die CreateTaskPage-Komponente
import ProjectPage from './ProjectPage'; // Fügen Sie die ProjectPage-Komponente hinzu
import CategoryPage from './CategoryPage'; // Fügen Sie die CategoryPage-Komponente hinzu
import { UserProvider } from './UserContext'; // Importieren Sie den UserProvider
import Layout from './Layout';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider> {/* UserProvider hinzufügen */}
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="tasks" element={<TaskList />} />
            <Route path="create-task" element={<CreateTaskPage />} /> {/* Verwenden Sie CreateTaskPage */}
            <Route path="projects" element={<ProjectPage />} /> {/* Fügen Sie die ProjectPage-Route hinzu */}
            <Route path="categories" element={<CategoryPage />} /> {/* Fügen Sie die CategoryPage-Route hinzu */}
          </Route>
        </Routes>
      </Router>
    </UserProvider>
  </React.StrictMode>,
);
