import { Input, Form } from "antd";
import { CloseCircleTwoTone } from '@ant-design/icons';

function Resources(props) {
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
}

function Resource(props) {
    const resource = props.resource;

    return (
        <Form
            onValuesChange={props.rename.bind(resource)}
            className="resource-form"
            initialValues={resource}
            layout="inline"
        >
            <Form.Item
                name="name"
            >
                <Input prefix={<CloseCircleTwoTone className="remove-resource" onClick={props.removeResource.bind(resource)} twoToneColor="#FF0000" />} className="underlined plan-resource" />
            </Form.Item>
        </Form>
    );
}

export default Resources;