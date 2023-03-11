import "react-grid-layout/css/styles.css"
import "react-resizable/css/styles.css"
import "./Plan.css"
import dayjs from "dayjs";
import { DatePicker, Form, Space } from "antd";
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

function Timeline(props) {
    const timeRange = props.settings.timeRange.map(dateString => dayjs(dateString));
    const form = {
        timeRange
    }
    const columns = timeRange[1].diff(timeRange[0], props.settings.period);

    const dateForm = (
        <Form
            initialValues={form}
            onValuesChange={props.timeChanged}
        >
            <Form.Item
                name="timeRange"
            >
                <RangePicker picker="month" className="date-range-picker" />
            </Form.Item>
        </Form>
    )

    return (
        <Space className="plan-timeline" direction="vertical" size="small">
            {dateForm}
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
    return (
        <div className="plan-container">
            <Timeline
                settings={props.settings}
                timeChanged={props.timeChanged}
            />
            <Resources
                resources={props.resources}
                addResource={props.addResource}
                removeResource={props.removeResource}
                rename={props.renameResource}
            />
            <DraggableGrid
                projects={props.projects}
            />
        </div>
    )
}

export default Plan;