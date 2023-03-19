import { useState } from 'react';
import { App, ConfigProvider, FloatButton, message, Modal } from 'antd';
import { DeleteOutlined, FileAddOutlined, PlusOutlined, ExportOutlined, SettingOutlined, UserAddOutlined } from '@ant-design/icons';
import Cookie from 'js-cookie'
import './App.css';
import {v1} from "uuid";
import compress from "lz-string";
import Projects from "./Projects";
import Settings from "./Settings";
import Plan from "./Plan";
import demo from "./demoProject.json";

const ONE_YEAR = 365;
const COOKIE_STATE = "state";

function HomePage(){
    let STATE;
    if (window.location.hash) {
        STATE = JSON.parse(compress.decompressFromBase64(window.location.hash.slice(1)));
        // When loading from link don't save by default 
        // TODO show warning to user about this behavior
        STATE.settings.shouldSave = false;
        window.location.hash = "";
    } else if (Cookie.get(COOKIE_STATE)) {
        STATE = JSON.parse(compress.decompressFromBase64(Cookie.get(COOKIE_STATE)));
    } else {
        STATE = demo;
    }

    const [projects, setProjects] = useState(STATE.projects);
    const [resources, setResources] = useState(STATE.resources);
    const [settings, setSettings] = useState(STATE.settings);
    const [messageApi, contextHolder] = message.useMessage();
    const [areSettingsOpen, setSettingsOpen] = useState(false);

    function addProject() {
        setProjects(projects.concat({ id: v1() }));
    }

    function updateProject(changedValues) {
        const index = projects.indexOf(this);
        const project = {
            ...projects[index], 
            ...changedValues
        };

        setProjects(projects.slice(0, index).concat(project, projects.slice(index + 1)));
    }

    function updateProjects(changedValues) {
        setProjects(projects.map(project => {
            const projectUpdates = changedValues.find(values => values.id === project.id);
            return {
                ...project,
                ...projectUpdates
            }
        }));
    }

    function removeProject() {
        const index = projects.indexOf(this);
        setProjects(projects.slice(0, index).concat(projects.slice(index + 1)));
    }

    function updateTimeRange(changedValues) {
        const startTime = changedValues.timeRange[0].format("YYYY-MM-DD");
        const endTime = changedValues.timeRange[1].endOf(settings.timePickerMode).format("YYYY-MM-DD");
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

    function getSerializedState() {
        const state = {
            projects,
            resources,
            settings
        };

        return compress.compressToBase64(JSON.stringify(state));
    }

    function generateExport() {        
        const url = `${window.location.origin}/#${getSerializedState()}`;
        navigator.clipboard.writeText(url);
        messageApi.open({
            type: 'success',
            content: 'Link Copied to Clipboard',
        });
    }

    function clearPlan() {
        setProjects([{
            id: v1()
        }]);
        setResources([{
            id: v1(),
            name: "1"
        }]);
        settings.shouldSave = true;
        setSettings(settings);
    }

    if(settings.shouldSave) {
        const serialState = getSerializedState();
        Cookie.set("state", serialState, {
            expires: ONE_YEAR
        });
    }

    return (
        <ConfigProvider>
        <App>
            {contextHolder}
            <Settings
                isOpen={areSettingsOpen}
                close={() => setSettingsOpen(false)}
                updateSettings={setSettings}
                settings={settings}
            />
            <Plan
                projects={projects}
                resources={resources}
                settings={settings}
                updateProjects={updateProjects}
                timeChanged={updateTimeRange}
                removeResource={removeResource}
                renameResource={renameResource}
            />
            <Projects
                projects={projects}
                resources={resources}
                settings={settings}
                updateProject={updateProject}
                removeProject={removeProject}
            />
            <FloatButton.Group
                trigger="hover"
                type="primary"
                icon={<PlusOutlined />}
            >
                <FloatButton icon={<DeleteOutlined />} tooltip={<div>Clear Plan</div>} onClick={clearPlan} />
                <FloatButton icon={<SettingOutlined />} tooltip={<div>Settings</div>} onClick={() => setSettingsOpen(true)} />
                <FloatButton icon={<ExportOutlined />} tooltip={<div>Share</div>} onClick={generateExport} />
                <FloatButton icon={<UserAddOutlined />} tooltip={<div>Add Resource</div>} onClick={addResource} />
                <FloatButton icon={<FileAddOutlined />} tooltip={<div>Add Project</div>} onClick={addProject} />
            </FloatButton.Group>
        </App>
        </ConfigProvider>
    );
}

export default HomePage;
