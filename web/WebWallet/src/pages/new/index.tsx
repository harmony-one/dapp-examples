import React from 'react';
import { Form, Input } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { connect } from 'dva';
import router from 'umi/router';
import { createAction } from '../../utils';

import styles from './index.css';

interface PassFormProps extends FormComponentProps {
  password: string;
  rePassword: string;
  sendPassword: Function;
}

const LabelComp = (props: any): JSX.Element => {
  return <span style={{ fontSize: '1.2rem', color: '#333333' }}>{props.labelText}</span>;
};

class NewAccount extends React.Component<PassFormProps, any> {
  state = {
    confirmDirty: false,
    compared: false,
  };
  handleSubmit = (e: any) => {
    e.preventDefault();
    this.props.form.validateFields((err: any, values: any) => {
      if (!err) {
        this.props.sendPassword(values.password);
        router.push('/new/mnes');
      }
    });
  };
  validateToNextPassword = (rule: any, value: any, callback: () => void) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['re-password'], { force: true });
    }
    callback();
  };

  compareToFirstPassword = (
    rule: any,
    value: any,
    callback: { (arg0: string): void; (): void },
  ) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      this.setState({
        compared: false,
      });
      callback('Two passwords that you enter is inconsistent!');
    } else {
      this.setState({
        compared: true,
      });
      callback();
    }
  };
  handleConfirmBlur = (e: { target: { value: any } }) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={styles.container}>
        <Form wrapperCol={{ span: 24 }}>
          <Form.Item label={<LabelComp labelText="Password" />}>
            {getFieldDecorator('password', {
              rules: [
                { required: true, message: 'Please input your password!' },
                {
                  validator: this.validateToNextPassword,
                },
              ],
            })(<Input.Password size="large" style={{ height: '4rem', fontSize: '2rem' }} />)}
          </Form.Item>
          <Form.Item label={<LabelComp labelText="Re-enter Password" />}>
            {getFieldDecorator('re-password', {
              rules: [
                { required: true, message: 'Please input your password again!' },
                {
                  validator: this.compareToFirstPassword,
                },
              ],
            })(
              <Input.Password
                size="large"
                onBlur={this.handleConfirmBlur}
                style={{ height: '4rem', fontSize: '2rem' }}
              />,
            )}
          </Form.Item>
          <Form.Item wrapperCol={{ span: 24 }}>
            <div
              className={!this.state.compared ? styles.buttonDisabled : styles.button}
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

const WrappedNewAccount = Form.create<PassFormProps>({
  name: 'PasswordForm',
})(NewAccount);

function mapStateToProps(state: any) {
  return {
    wallet: state.global.harmony.wallet,
    mnes: state.new.mnes,
  };
}

function mapDispatchToProps(dispatch: any) {
  return {
    sendPassword: (payload: any) => dispatch(createAction('new/sendPassword')(payload)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(WrappedNewAccount);
