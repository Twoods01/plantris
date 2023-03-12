import { Card, DatePicker, Form, Input, Space, Tooltip } from "antd";
import { CloseCircleTwoTone, CheckCircleTwoTone, DiffOutlined, WarningTwoTone } from '@ant-design/icons';
import { v1 } from "uuid";
import dayjs from "dayjs";
import "./Projects.css";

function Projects(props) {
    return (
        <div className="project-container">
            <Space wrap size="middle" className="projects-container">
                {props.projects.map(project => 
                    <Project 
                        key={project.id} 
                        project={project} 
                        settings={props.settings}
                        onChange={props.updateProject} 
                        removeProject={props.removeProject}
                    />)}
            </Space>
        </div>
    );
}

function getPlannedProjectDuration(project) {
    const splitWidth = (project.splits ?? []).reduce((acc, split) => { return acc + split.w; }, 0);
    return project.w + splitWidth;
}   

function Project(props) {
    const { project, onChange, removeProject, settings } = props;
    project.dueDate = dayjs(project.dueDate);

    function splitProject() {
        const splitSize = Math.ceil(this.w / 2);
        const splits = this.splits ?? [];
        let estimate = parseInt(this.estimate);
        if (isNaN(estimate)) {
            estimate = this.w;
        }
        splits.push({
            name: this.name,
            id: v1(),
            w: estimate - splitSize
        })
        const split = {
            id: this.id,
            w: splitSize,
            splits
        };
        onChange.call(this, split);
    }

    const title = (
        <Form.Item
            name="name"
        >
            <Input className="underlined project-title"/>
        </Form.Item>
    );

    const warnings = [];
    //Not full planned
    const duration = getPlannedProjectDuration(project);
    if (project.estimate && project.w && duration !== parseInt(project.estimate)) {
        const descriptor = duration < project.estimate ? "under" : "over"
        warnings.push(`Project is ${descriptor}planned by ${Math.abs(parseInt(project.estimate) - duration)} ${settings.period}`);
    }
    //TODO: Warn if finished after due date

    let status = (
        <Tooltip title="Project fully planned">
            <CheckCircleTwoTone style={{ fontSize: "32px", paddingLeft: "5px" }} twoToneColor="#00FF00" />
        </Tooltip>
    );
    if(warnings.length !== 0) {
        status = (
            <Tooltip title={warnings.join("/n")}>
                <WarningTwoTone style={{ fontSize: "32px", paddingLeft: "5px" }} twoToneColor="#e47200" />
            </Tooltip>
            
        );
    }

    const actionBar = [
        <Tooltip title="Split Project"><DiffOutlined key="split" onClick={splitProject.bind(project)}/></Tooltip>,
        <Tooltip title="Delete Project"><CloseCircleTwoTone key="close" className="cancel-project" onClick={removeProject.bind(project)} twoToneColor="#FF0000" /></Tooltip>
    ];

    return (
        <Form 
            initialValues={project}
            onValuesChange={onChange.bind(project)}
            layout="vertical"
            size="small"
        >
            <Card 
                title={title} 
                className="project-card"
                extra={status}
                actions={actionBar}
            >
                <Form.Item
                    name="description"
                    label="Description:"
                >
                    <Input.TextArea rows={4} />
                </Form.Item>
                <Space
                >
                    <Form.Item
                        name="estimate"
                        label="Estimate:"
                        className="project-estimate"
                    >
                        <Input addonAfter={settings.period} type="number" />
                    </Form.Item>
                    <Form.Item
                        name="dueDate"
                        label="Due:"
                    >
                        <DatePicker />
                    </Form.Item>
                </Space>
            </Card>
        </Form>
    );
}

export default Projects;