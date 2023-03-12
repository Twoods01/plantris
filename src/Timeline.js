import { DatePicker, Form, Space } from "antd";
import { memo } from "react";
import { getPlanTimeRange, getNumberOfColumns } from "./utils";

const { RangePicker } = DatePicker;

function shouldSkipRender(oldProps, newProps) {
    const startTimeSame = oldProps.settings.timeRange[0] === newProps.settings.timeRange[0];
    const endTimeSame = oldProps.settings.timeRange[1] === newProps.settings.timeRange[1];
    return startTimeSame && endTimeSame;
}

const Timeline = memo(function Timeline(props) {
    const timeRange = getPlanTimeRange(props.settings);
    const form = {
        timeRange
    }
    const columns = getNumberOfColumns(props.settings);

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