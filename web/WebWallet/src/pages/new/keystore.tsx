import React from 'react';
import { Form, Input, Switch, Button } from 'antd';
import router from 'umi/router';
import { FormComponentProps } from 'antd/lib/form';
import { connect } from 'dva';
import { createAction } from '../../utils';
import styles from './index.css';

interface PassFormProps extends FormComponentProps {
  confirmCreate?: Function;
  resetKeyStore: Function;
  sendKeyStore: Function;
  keyStore: string;
  nextRoute: string;
}

const LabelComp = (props: any): JSX.Element => {
  return <span style={{ fontSize: '1.2rem', color: '#333333' }}>{props.labelText}</span>;
};

class KeyStoreConfirm extends React.Component<PassFormProps, any> {
  state = {
    confirmDirty: false,
    checked: false,
  };
  handleSubmit = (e: any) => {
    e.preventDefault();
    if (this.state.checked) {
      this.props.form.validateFields((err: any, values: any) => {
        if (!err) {
          this.props.sendKeyStore({ keyStore: values.keyStore, password: values.password });
          if (this.props.nextRoute) {
            router.push(`${this.props.nextRoute}`);
          }
        }
      });

      router.push(`${this.props.nextRoute}`);
    }
  };

  handleConfirmBlur = (e: { target: { value: any } }) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  handleRadioChange = (checked: boolean) => {
    this.setState({ checked });
  };

  componentDidMount() {
    this.props.resetKeyStore();
  }
  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <div className={styles.container}>
        <div style={{ marginBottom: '4rem', marginTop: '2rem' }}>
          <Button icon="left" shape="round" size="default" onClick={() => router.goBack()} />
        </div>
        <Form wrapperCol={{ span: 24 }}>
          <Form.Item label={<LabelComp labelText="Please don't tell anyone your private key" />}>
            {getFieldDecorator('keyStore')(
              <Input.TextArea
                autosize={{ minRows: 4, maxRows: 6 }}
                style={{ fontSize: '2rem', color: '#333333' }}
              />,
            )}
          </Form.Item>
          <Form.Item label={<LabelComp labelText="Please don't tell anyone your private key" />}>
            {getFieldDecorator('password')(
              <Input.Password style={{ fontSize: '2rem', color: '#333333' }} />,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('checkBox')(
              <div>
                <Switch style={{ fontSize: '1rem' }} onChange={this.handleRadioChange} />
                <span style={{ fontSize: '1rem', marginLeft: '0.6rem' }}>
                  I have saved my privateKey safely
                </span>
              </div>,
            )}
          </Form.Item>

          <Form.Item wrapperCol={{ span: 24 }}>
            <div
              className={!this.state.checked ? styles.buttonDisabled : styles.button}
              onClick={this.handleSubmit}
            >
              Next
            </div>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

const WrappedKey = Form.create<PassFormProps>({
  name: 'keyStoreForm',
  mapPropsToFields(props: PassFormProps) {
    return {
      keyStore: Form.createFormField({
        value: props.keyStore,
      }),
    };
  },
})(KeyStoreConfirm);

function mapStateToProps(state: any) {
  return {
    keyStore: state.create.keyStore,
  };
}

function mapDispatchToProps(dispatch: any) {
  return {
    resetKeyStore: () => dispatch(createAction('create/resetKeyStore')()),
    sendKeyStore: (payload: any) => dispatch(createAction('create/sendKeyStore')(payload)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(WrappedKey);
