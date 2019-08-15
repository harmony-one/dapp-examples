import React from 'react';
import { Form, Input, Button } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { connect } from 'dva';
import router from 'umi/router';
import { createAction } from '../../utils';
import { FullscreenLoading } from '../../components';

import styles from './index.css';

interface PassFormProps extends FormComponentProps {
  password: string;
  rePassword?: string;
  sendPassword: Function;
  nextRoute: string;
  loading: boolean;
}

const LabelComp = (props: any): JSX.Element => {
  return <span style={{ fontSize: '1.2rem', color: '#333333' }}>{props.labelText}</span>;
};

class Password extends React.Component<PassFormProps, any> {
  state = {
    confirmDirty: false,
    compared: false,
    loading: this.props.loading,
  };
  handleSubmit = (e: any) => {
    e.preventDefault();

    this.props.form.validateFields((err: any, values: any) => {
      if (!err) {
        this.setState({
          loading: true,
        });

        setTimeout(() => {
          this.props.sendPassword(values.password);
          if (this.props.nextRoute) {
            router.push(`${this.props.nextRoute}`);
          } else {
            router.push('/wallet');
          }
        }, 200);
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

  componentDidUpdate(prevProps: any) {
    if (prevProps.loading === true && this.props.loading === false) {
      this.setState({
        loading: false,
      });
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <div className={styles.container}>
        {this.state.loading ? <FullscreenLoading /> : null}
        <div style={{ marginBottom: '4rem', marginTop: '2rem' }}>
          <Button icon="left" shape="round" size="default" onClick={() => router.goBack()} />
        </div>
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
})(Password);

function mapStateToProps(state: any) {
  return {
    password: state.create.password,
    loading: state.wallet.loading,
  };
}

function mapDispatchToProps(dispatch: any) {
  return {
    sendPassword: (payload: any) => dispatch(createAction('create/sendPassword')(payload)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(WrappedNewAccount);
