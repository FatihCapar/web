import React, { createContext, useContext, useState } from 'react';

// Erstellen Sie das Context-Objekt
const UserContext = createContext();

// UserProvider-Komponente, um den aktuellen Benutzer global bereitzustellen
export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  console.log('Aktueller Benutzer:', currentUser);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom Hook, um den aktuellen Benutzer einfach abzurufen
export const useCurrentUser = () => useContext(UserContext);
