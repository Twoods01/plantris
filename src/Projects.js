import { Card, DatePicker, FloatButton, Form, Input, Space } from "antd";
import { CloseCircleTwoTone, PlusOutlined } from '@ant-design/icons';
import "./Projects.css";

function Projects(props) {
    return (
        <div className="project-container">
            <FloatButton type="primary" icon={<PlusOutlined />} tooltip={<div>Add Project</div>} onClick={props.addProject} />
            <Space wrap size="middle" className="projects-container">
                {props.projects.map(project => <Project project={project} onChange={props.updateProject} removeProject={props.removeProject}/>)}
            </Space>
        </div>
    );
}

function Project(props) {
    const { project, onChange, removeProject } = props;
    const [form] = Form.useForm();
    const title = (
        <Form.Item
            name="name"
        >
            <Input prefix={<CloseCircleTwoTone onClick={removeProject.bind(project)} twoToneColor="#FF0000" />} />
        </Form.Item>
    );

    form.setFieldsValue(project);

    return (
        <Form 
            key={project.id}
            form={form}
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