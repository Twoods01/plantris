import { Card, DatePicker, Form, Input, Space } from "antd";
import { CloseCircleTwoTone } from '@ant-design/icons';
import dayjs from "dayjs";
import "./Projects.css";

function Projects(props) {
    return (
        <div className="project-container">
            <Space wrap size="middle" className="projects-container">
                {props.projects.map(project => <Project key={project.id} project={project} onChange={props.updateProject} removeProject={props.removeProject}/>)}
            </Space>
        </div>
    );
}

function Project(props) {
    const { project, onChange, removeProject } = props;
    project.dueDate = dayjs(project.dueDate);
    const title = (
        <Form.Item
            name="name"
        >
            <Input prefix={<CloseCircleTwoTone className="cancel-project" onClick={removeProject.bind(project)} twoToneColor="#FF0000" />} className="underlined project-title"/>
        </Form.Item>
    );

    return (
        <Form 
            initialValues={project}
            onValuesChange={onChange.bind(project)}
        >
            <Card title={title} className="project-card">
                <Form.Item
                    name="description"
                    label="Description:"
                >
                    <Input.TextArea rows={4} />
                </Form.Item>
                <Form.Item
                    name="estimate"
                    label="Estimate:"
                >
                    <Input addonAfter="weeks" />
                </Form.Item>
                <Form.Item
                    name="dueDate"
                    label="Due:"
                >
                    <DatePicker/>
                </Form.Item>
            </Card>
        </Form>
    );
}

export default Projects;