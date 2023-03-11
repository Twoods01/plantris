import { useState } from 'react';
import { App, ConfigProvider } from 'antd';
import './App.css';
import {v1} from "uuid";
import Projects from "./Projects";
import Plan from "./Plan";

function HomePage(){
    const [projects, setProjects] = useState([]);
    function addProject() {
        setProjects(projects.concat({ id: v1()}));
    }

    function updateProject(changedValues) {
        const index = projects.indexOf(this);
        const project = projects[index];
        Object.assign(project, changedValues);
        setProjects(projects.slice(0, index).concat(project, projects.slice(index + 1)));
    }

    function removeProject() {
        const index = projects.indexOf(this);
        setProjects(projects.slice(0, index).concat(projects.slice(index + 1)));
    }

  return (
    <ConfigProvider>
      <App>
        <Plan
          projects={projects}
        />
        <Projects
          projects={projects}
          addProject={addProject}
          updateProject={updateProject}
          removeProject={removeProject}
        />
      </App>
    </ConfigProvider>
  )
}

export default HomePage;
