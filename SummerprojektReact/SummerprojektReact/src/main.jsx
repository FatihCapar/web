import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import TaskList from './TaskList';
import CreateTaskPage from './CreateTaskPage';
import { UserProvider } from './UserContext';
import Layout from './Layout';
import PrivateRoute from './PrivateRoute';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route element={<PrivateRoute />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="tasks" element={<TaskList />} />
              <Route path="create-task" element={<CreateTaskPage />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </UserProvider>
  </React.StrictMode>
);
