import React from 'react';
import CategoryList from './CategoryList';
import CreateCategory from './CreateCategory';

const CategoryPage = () => {
  return (
    <div>
      <h1>Kategorien</h1>
      <CreateCategory onCategoryCreated={() => {}} />
      <CategoryList />
    </div>
  );
}

export default CategoryPage;
