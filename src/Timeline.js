import { Col, DatePicker, Form, Row, Space, Statistic, Tooltip } from "antd";
import { getPlannedProjectDuration, getPlanTimeRange, getNumberOfColumns, getTimeAtGridPosition } from "./utils";

const { RangePicker } = DatePicker;

const Timeline = function Timeline(props) {
    const timeRange = getPlanTimeRange(props.settings);
    const form = {
        timeRange
    }
    const columns = getNumberOfColumns(props.settings);
    // a bit hacky but we need different margins based on the number of columns to line everything up
    // because columns with 2 digits take up a little more space
    let margin = 10;
    if(columns > 18) {
        margin = -.75 * columns;
    };
    const style = {
        marginLeft: `${margin}px`
    };

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
    );

    const availableTime = columns * props.resources.length;
    const consumedTime = props.projects.reduce((acc, project) => {
        return acc + getPlannedProjectDuration(project);
    }, 0);
    const consumedStyle = {}
    if (consumedTime > availableTime) {
        consumedStyle.color = "#e47200"
    }

    const globalStats = (
        <Space size="middle">
            <Statistic title="Available" value={availableTime} suffix={props.settings.period} />
            <Statistic title="Consumed" valueStyle={consumedStyle} value={consumedTime} suffix={props.settings.period} />
        </Space>
    );

    return (
        <div className="plan-timeline">
            <Row>
                <Col span={18}>
                    {dateForm}
                </Col>
                <Col span={6}>
                    {globalStats}
                </Col>
            </Row>
            
            <table style={style} className="timeline">
                <thead>
                    <tr>
                        {[...Array(columns).keys()].map(v => {
                            return (
                                <th key={v}>
                                    <Tooltip title={getTimeAtGridPosition(v, props.settings).endOf(props.settings.period).format("YYYY-MM-DD")}>
                                        {v + 1}
                                    </Tooltip>
                                </th>
                            );
                        })}
                    </tr>
                </thead>
            </table>
        </div>
        // </Space>
    )
}


export default Timeline;