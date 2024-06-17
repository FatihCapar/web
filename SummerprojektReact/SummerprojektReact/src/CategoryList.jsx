import React, { useState, useEffect } from 'react';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch('/categories')
      .then(response => response.json())
      .then(data => setCategories(data))
      .catch(error => {
        console.error('Fehler beim Abrufen der Kategorien:', error);
      });
  }, []);

  const deleteCategory = (categoryId) => {
    fetch(`/categories/${categoryId}`, {
      method: 'DELETE'
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setCategories(categories.filter(category => category.id !== categoryId));
        } else {
          console.error('Fehler beim Löschen der Kategorie:', data.message);
        }
      })
      .catch(error => {
        console.error('Fehler beim Löschen der Kategorie:', error);
      });
  };

  return (
    <div>
      <h2>Kategorieliste</h2>
      {categories.map((category) => (
        <div key={category.id} className="category-item">
          <h3>{category.name}</h3>
          <button onClick={() => deleteCategory(category.id)}>Löschen</button>
        </div>
      ))}
    </div>
  );
}

export default CategoryList;
