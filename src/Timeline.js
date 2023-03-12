import { DatePicker, Form, Space } from "antd";
import dayjs from "dayjs";
import { memo } from "react";

const { RangePicker } = DatePicker;

function shouldSkipRender(oldProps, newProps) {
    const startTimeSame = oldProps.settings.timeRange[0] === newProps.settings.timeRange[0];
    const endTimeSame = oldProps.settings.timeRange[1] === newProps.settings.timeRange[1];
    return startTimeSame && endTimeSame;
}

const Timeline = memo(function Timeline(props) {
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
                        {[...Array(columns).keys()].map(v => <th key={v}>{v + 1}</th>)}
                    </tr>
                </thead>
            </table>
        </Space>
    )
}, shouldSkipRender)


export default Timeline;