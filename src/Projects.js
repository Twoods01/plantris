import { Card, FloatButton, Space } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import "./Projects.css";

function Projects() {
    const projects = [{
        name: "Project 1",
        details: "something"
    }, {
        name: "Project 2",
        details: "something"
    }]
    return (
    <div>
            <FloatButton type="primary" icon={<PlusOutlined />} tooltip={<div>Add Project</div>} onClick={() => console.log('click')} />
        <Space direction="vertical" size="middle" className="projects-container">
            {projects.map(project => <Card key={project.name} title={project.name} size="small" className="project-card">
                <p>{project.details}</p>
            </Card>)}
        </Space>
    </div>
    );
}

export default Projects;