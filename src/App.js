import { useState } from 'react';
import { App, ConfigProvider, FloatButton } from 'antd';
import { DeleteOutlined, FileAddOutlined, PlusOutlined, SettingOutlined, UserAddOutlined } from '@ant-design/icons';
import './App.css';
import {v1} from "uuid";
import Projects from "./Projects";
import Plan from "./Plan";
import demo from "./demoProject.json";

const STATE = demo;

function HomePage(){
    const [projects, setProjects] = useState(STATE.projects);
    const [resources, setResources] = useState(STATE.resources);
    const [settings, setSettings] = useState(STATE.settings);

    function addProject() {
        setProjects(projects.concat({ id: v1()}));
    }

    function updateProject(changedValues) {
        const index = projects.indexOf(this);
        const project = {
            ...projects[index], 
            ...changedValues
        };

        setProjects(projects.slice(0, index).concat(project, projects.slice(index + 1)));
    }

    function removeProject() {
        const index = projects.indexOf(this);
        setProjects(projects.slice(0, index).concat(projects.slice(index + 1)));
    }

    function updateTimeRange(changedValues) {
        const startTime = changedValues.timeRange[0].format("YYYY-MM-DD");
        const endTime = changedValues.timeRange[1].format("YYYY-MM-DD");
        setSettings(Object.assign({}, settings, {
            timeRange: [
                startTime,
                endTime
            ]
        }));
    }

    function addResource() {
        const resource = {
            id: v1(),
            name: resources.length + 1
        };
        return setResources(resources.concat(resource));
    }

    function removeResource() {
        const index = resources.indexOf(this);
        return setResources(resources.slice(0, index).concat(resources.slice(index + 1)));
    }

    function renameResource(changedValues) {
        const index = resources.indexOf(this);
        const resource = {
            ...resources[index],
            ...changedValues
        };
        return setResources(resources.slice(0, index).concat(resource, resources.slice(index + 1)));
    }

    function showSettings() {
        console.log("Settings");
    }

    function clearDemo() {
        setProjects([{
            id: v1()
        }]);
        setResources([{
            id: v1(),
            name: "1"
        }]);
        settings.isDemo = false;
        setSettings(settings);
    }

    return (
        <ConfigProvider>
        <App>
            <Plan
                projects={projects}
                resources={resources}
                settings={settings}
                timeChanged={updateTimeRange}
                removeResource={removeResource}
                renameResource={renameResource}
            />
            <Projects
                projects={projects}
                settings={settings}
                updateProject={updateProject}
                removeProject={removeProject}
            />
            <FloatButton.Group
                trigger="hover"
                type="primary"
                icon={<PlusOutlined />}
            >
                    {STATE.settings.isDemo ? <FloatButton icon={<DeleteOutlined />} tooltip={<div>Clear Demo</div>} onClick={clearDemo} /> : null}
                <FloatButton icon={<SettingOutlined />} tooltip={<div>Settings</div>} onClick={showSettings} />
                <FloatButton icon={<UserAddOutlined />} tooltip={<div>Add Resource</div>} onClick={addResource} />
                <FloatButton icon={<FileAddOutlined />} tooltip={<div>Add Project</div>} onClick={addProject} />
            </FloatButton.Group>
        </App>
        </ConfigProvider>
    );
}

export default HomePage;
