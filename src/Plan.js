import "react-grid-layout/css/styles.css"
import "react-resizable/css/styles.css"
import "./Plan.css"
import { Button, DatePicker, Input, Tooltip, Space } from "antd";
import { CloseCircleTwoTone, PlusOutlined } from '@ant-design/icons';
import GridLayout, { WidthProvider } from "react-grid-layout";

const { RangePicker } = DatePicker;
const WidthGrid = WidthProvider(GridLayout);

function DraggableGrid() {
    const layout = [
        { i: "a", x: 0, y: 0, w: 1, h: 1, minH: 1, maxH: 1},
        { i: "b", x: 1, y: 1, w: 3, h: 1, minH: 1, maxH: 1},
        { i: "c", x: 4, y: 2, w: 2, h: 1, minH: 1, maxH: 1}
    ];
    return (
        <WidthGrid
            className="grid-container"
            layout={layout}
            cols={12}
            rowHeight={30}
            autoSize={true}
            compactType="horizontal"
        >
            {layout.map(project => <div key={project.i}>{project.i} - {project.w}</div>)}
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

function Resources() {
    const resources = ["A", "B", "C"]
    return (
        <div className="plan-resources">
            {resources.map(resource => 
                <div className="plan-resource" key={resource}>
                    <Input prefix={<CloseCircleTwoTone twoToneColor="#FF0000"/>} bordered={false} value={resource} />
                </div>)
            }
            <Tooltip placement="left" title="Add Resource">
                <Button className="add-resource-button" tooltip={<div></div>} type="primary" shape="circle" icon={<PlusOutlined />} />
            </Tooltip>
        </div>
    )
}

function Plan() {
    return (
        <div className="plan-container">
            {Timeline()}
            <div>
                {Resources()}
                {DraggableGrid()}
            </div>
        </div>
    )
}

export default Plan;