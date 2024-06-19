// src/Layout.jsx
import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import './Layout.css';

const Layout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="layout">
      <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        <button className="toggle-btn" onClick={handleToggle}>
          {isCollapsed ? '>' : '<'}
        </button>
        {!isCollapsed && <h2>Dashboard</h2>}
        <Link to="/dashboard">
          <button>Dashboard</button>
        </Link>
        <Link to="/create-task">
          <button>Aufgabe erstellen</button>
        </Link>
        <Link to="/tasks">
          <button>Aufgaben anzeigen</button>
        </Link>
      </div>
      <div className={`content ${isCollapsed ? 'collapsed' : ''}`}>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
