import React from 'react';
import ProjectList from './ProjectList';
import CreateProject from './CreateProject';

const ProjectPage = () => {
  return (
    <div>
      <h1>Projekte</h1>
      <CreateProject onProjectCreated={() => {}} />
      <ProjectList />
    </div>
  );
}

export default ProjectPage;
