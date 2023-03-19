import { Form, Modal, Switch } from 'antd';

function Settings(props) {
    function updateSettings(formName, { values }) {

        props.updateSettings(Object.assign(props.settings, values));
        props.close();
    }

    function closeSettings() {
        props.close();
    }

    const [form] = Form.useForm();

    return (
        <Modal title="Settings" okText="Confirm" open={props.isOpen} onOk={() => form.submit()} onCancel={closeSettings}>
            <Form.Provider
                onFormFinish={updateSettings}
            >
                <Form
                    form={form}
                    initialValues={props.settings}
                    layout="horizontal"
                    size="small"
                >
                    <Form.Item
                        name="constrainProjectByEstimate"
                        label="Projects constrained by Estimate:"
                        valuePropName="checked"
                    >
                        <Switch />
                    </Form.Item>

                    <Form.Item
                        name="shouldSave"
                        label="Save Project Changes Locally:"
                        valuePropName="checked"
                    >
                        <Switch />
                    </Form.Item>
                </Form>
            </Form.Provider>
        </Modal>
    );
}

export default Settings;