import { Card, DatePicker, Form, Input, Space, Table, Tooltip } from "antd";
import { CloseCircleTwoTone, CheckCircleTwoTone, DiffOutlined, LockOutlined, UnlockOutlined, WarningTwoTone } from '@ant-design/icons';
import { v1 } from "uuid";
import findIndex from "lodash.findindex";
import dayjs from "dayjs";
import { getProjectStartDate, getProjectEndDate, getPlanningIssues } from "./utils";
import "./Projects.css";

function Projects(props) {
    return (
        <div className="project-container">
            <Space wrap size="middle" className="projects-container">
                {props.projects.map(project => 
                    <Project 
                        key={project.id} 
                        project={project}
                        resources={props.resources}
                        settings={props.settings}
                        onChange={props.updateProject} 
                        removeProject={props.removeProject}
                    />)}
            </Space>
        </div>
    );
}

function Project(props) {
    const { project, onChange, removeProject, resources, settings } = props;
    if(project.dueDate) {
        project.dueDate = dayjs(project.dueDate);
    }

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
            w: this.w - splitSize
        })
        const split = {
            id: this.id,
            w: splitSize,
            splits
        };
        onChange.call(this, split);
    }

    function mergeSplit() {
        const splitIndex = findIndex((project.splits ?? []), {id: this.id});

        const changes = {
            w: project.w + project.splits[splitIndex].w,
            splits: project.splits.slice(0, splitIndex).concat(project.splits.slice(splitIndex + 1))
        };
        onChange.call(project, changes);
    }

    function lockProject() {
        onChange.call(this, {
            id: this.id,
            static: !this.static
        });
    }

    const title = (
        <Form.Item
            name="name"
        >
            <Input className="underlined project-title"/>
        </Form.Item>
    );

    const warnings = getPlanningIssues(project, settings, resources);

    let status = (
        <Tooltip title="Project fully planned">
            <CheckCircleTwoTone style={{ fontSize: "32px", paddingLeft: "5px" }} twoToneColor="#3aeb34" />
        </Tooltip>
    );

    if(warnings.length !== 0) {
        const warningTitle = (
            <>
                {warnings.map(w => {
                    return (
                        <div key={w}>
                            {w}
                            <br/>
                        </div>
                    );
                })}
            </>
        );
        status = (
            <Tooltip title={warningTitle}>
                <WarningTwoTone style={{ fontSize: "32px", paddingLeft: "5px" }} twoToneColor="#e47200" />
            </Tooltip>
        );
    }

    const lock = project.static ? <UnlockOutlined key="unlock" onClick={lockProject.bind(project)} /> : <LockOutlined key="lock" onClick={lockProject.bind(project)} />;
    const lockText = project.static ? "Unlock" : "Lock";

    const actionBar = [
        <Tooltip title="Split Project"><DiffOutlined key="split" onClick={splitProject.bind(project)}/></Tooltip>,
        <Tooltip title={lockText + " Project"}>{lock}</Tooltip>,
        <Tooltip title="Delete Project"><CloseCircleTwoTone key="close" className="cancel-project" onClick={removeProject.bind(project)} twoToneColor="#FF0000" /></Tooltip>
    ];

    const data = [{
        key: `${project.id}`,
        plan: `${getProjectStartDate(project, settings)} - ${getProjectEndDate(project, settings)}`
    }];
    (project.splits ?? []).forEach(split => {
        data.push({
            id: split.id,
            key: `${split.id}`,
            plan: `${getProjectStartDate(split, settings)} - ${getProjectEndDate(split, settings)}`
        });
    })
    const columns = [{
        title: 'Planned',
        dataIndex: 'plan',
        key: 'plan',
        render: (plan, project, i) => {
            return (
                <div>
                    {plan} 
                    {i > 0 ? <CloseCircleTwoTone key="close" className="merge-split" onClick={mergeSplit.bind(project)} twoToneColor="#FF0000" /> : null}
                </div>
            )
        }
    }];
    const timeline = (
        <Table
            bordered
            size="small"
            columns={columns}
            dataSource={data}
            pagination={false}
        />
    );

    return (
        <Form 
            initialValues={project}
            onValuesChange={onChange.bind(project)}
            layout="vertical"
            size="small"
        >
            <Card 
                title={title} 
                className={`project-card ${project.static ? "locked" : ""}`}
                extra={status}
                actions={actionBar}
            >
                <Form.Item
                    name="description"
                    label="Description:"
                >
                    <Input.TextArea rows={4} />
                </Form.Item>
                <Space>
                    <Form.Item
                        name="estimate"
                        label="Estimate:"
                        className="project-estimate"
                    >
                        <Input addonAfter={settings.period} type="number" min={1} />
                    </Form.Item>
                    <Form.Item
                        name="dueDate"
                        label="Due:"
                    >
                        <DatePicker />
                    </Form.Item>
                </Space>
                {timeline}
            </Card>
        </Form>
    );
}

export default Projects;