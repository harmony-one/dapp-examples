import React from 'react';
import { Form, Input, Switch, Button } from 'antd';
import router from 'umi/router';
import { FormComponentProps } from 'antd/lib/form';
import { connect } from 'dva';
import { createAction } from '../../utils';
import styles from './index.css';

interface PassFormProps extends FormComponentProps {
  confirmCreate?: Function;
  resetPrivateKey: Function;
  sendPrivateKey: Function;
  privateKey: string;
  nextRoute: string;
}

const LabelComp = (props: any): JSX.Element => {
  return <span style={{ fontSize: '1.2rem', color: '#333333' }}>{props.labelText}</span>;
};

class KeyConfirm extends React.Component<PassFormProps, any> {
  state = {
    confirmDirty: false,
    checked: false,
  };
  handleSubmit = (e: any) => {
    e.preventDefault();
    if (this.state.checked) {
      this.props.form.validateFields((err: any, values: any) => {
        if (!err) {
          this.props.sendPrivateKey({ privateKey: values.privateKey });
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
    this.props.resetPrivateKey();
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
            {getFieldDecorator('privateKey')(
              <Input.TextArea
                autosize={{ minRows: 4, maxRows: 6 }}
                style={{ fontSize: '2rem', color: '#333333' }}
              />,
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
  name: 'Mneform',
  mapPropsToFields(props: PassFormProps) {
    return {
      privateKey: Form.createFormField({
        value: props.privateKey,
      }),
    };
  },
})(KeyConfirm);

function mapStateToProps(state: any) {
  return {
    privateKey: state.create.privateKey,
  };
}

function mapDispatchToProps(dispatch: any) {
  return {
    resetPrivateKey: () => dispatch(createAction('create/resetPrivateKey')()),
    sendPrivateKey: (payload: any) => dispatch(createAction('create/sendPrivateKey')(payload)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(WrappedKey);
