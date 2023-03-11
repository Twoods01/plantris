import { Button, Input, Tooltip } from "antd";
import { CloseCircleTwoTone, PlusOutlined } from '@ant-design/icons';

function Resources(props) {
    return (
        <div className="plan-resources">
            {props.resources.map(resource =>
                <div className="plan-resource" key={resource}>
                    <Input prefix={<CloseCircleTwoTone onClick={props.removeResource.bind(resource)} twoToneColor="#FF0000" />} bordered={false} value={resource} onChange={props.rename.bind(resource)} />
                </div>)
            }
            <Tooltip placement="left" title="Add Resource">
                <Button onClick={props.addResource} className="add-resource-button" tooltip={<div></div>} type="primary" shape="circle" icon={<PlusOutlined />} />
            </Tooltip>
        </div>
    )
}

export default Resources;