import "react-grid-layout/css/styles.css"
import "react-resizable/css/styles.css"
import "./Plan.css"
import { useState } from 'react';
import { DatePicker, Space } from "antd";
import GridLayout, { WidthProvider } from "react-grid-layout";
import Resources from "./Resources";

const { RangePicker } = DatePicker;
const WidthGrid = WidthProvider(GridLayout);

function DraggableGrid(props) {
    const layout = props.projects.map(project => {
        return {
            i: project.id,
            name: project.name,
            x: project.x ?? 0,
            y: project.y ?? 0,
            w: project.estimate ?? 1,
            h: 1,
            minH: 1,
            maxH: 1
        }
    });

    return (
        <WidthGrid
            className="grid-container"
            layout={layout}
            cols={12}
            rowHeight={30}
            autoSize={true}
            compactType="horizontal"
        >
            {layout.map(project => <div key={project.i}>{project.name}</div>)}
        </WidthGrid>
    );
}

function Timeline() {
    const columns = 12;

    return (
        <Space className="plan-timeline" direction="vertical" size="middle">
            <RangePicker picker="month" className="date-range-picker"/>
            <table className="timeline">
                <thead>
                    <tr>
                        {[...Array(columns).keys()].map(v => <th key={v}>{v+1}</th>)}
                    </tr>
                </thead>
            </table>
        </Space>
    )
}

function Plan(props) {
    const [resources, setResources] = useState(["1", "2", "3"]);

    function addResource() {
        return setResources(resources.concat(resources.length + 1));
    }

    function removeResource() {
        const index = resources.indexOf(this);
        return setResources(resources.slice(0, index).concat(resources.slice(index + 1)));
    }

    function renameResource(e) {        
        const index = resources.indexOf(this);
        return setResources(resources.slice(0, index).concat(e.target.value, resources.slice(index + 1)));
    }

    return (
        <div className="plan-container">
            {Timeline()}
            <div>
                <Resources
                    resources={resources}
                    addResource={addResource}
                    removeResource={removeResource}
                    rename={renameResource}
                />
                <DraggableGrid
                    projects={props.projects}
                />
            </div>
        </div>
    )
}

export default Plan;