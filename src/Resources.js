import { Input, Form, Space } from "antd";
import { CloseCircleTwoTone } from '@ant-design/icons';
import { memo } from "react";
import isEqual from "lodash.isequal";

function shouldSkipRender(oldProps, newProps) {
    return isEqual(oldProps.resources, newProps.resources);
}

const Resources = memo(function Resources(props) {
    return (
        <div className="plan-resources">
            {props.resources.map(resource =>
                <Resource
                    key={resource.id}
                    resource={resource}
                    removeResource={props.removeResource}
                    rename={props.rename}
                />)
            }
        </div>
    )
}, shouldSkipRender)

function Resource(props) {
    const resource = props.resource;

    return (
        <Form
            onValuesChange={props.rename.bind(resource)}
            className="resource-form"
            initialValues={resource}
            wrapperCol={{ offset: 2 }}
            size="small"
            layout="inline"
        >
            <Space>
                <CloseCircleTwoTone className="remove-resource" onClick={props.removeResource.bind(resource)} twoToneColor="#FF0000" />
                <Form.Item
                    name="name"
                >
                    <Input className="underlined plan-resource" />
                </Form.Item>
            </Space>
        </Form>
    );
}



export default Resources;