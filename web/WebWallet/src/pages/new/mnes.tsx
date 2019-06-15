import React from 'react';
import { Form, Input, Switch, Spin } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { connect } from 'dva';
import { createAction } from '../../utils';

import styles from './index.css';

interface PassFormProps extends FormComponentProps {
  confirmCreate: Function;
  mnes: string;
  accounts: string[];
  loading: any;
}

const LabelComp = (props: any): JSX.Element => {
  return <span style={{ fontSize: '1.2rem', color: '#333333' }}>{props.labelText}</span>;
};

const FullScreenLoading = (props: { delay: number }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        textAlign: 'center',
        background: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 0,
        margin: 0,
        opacity: 0.8,
      }}
    >
      <Spin size="large" delay={props.delay} />
    </div>
  );
};

class MneConfirm extends React.Component<PassFormProps, any> {
  state = {
    confirmDirty: false,
    checked: false,
    loading: this.props.loading,
  };
  handleSubmit = (e: any) => {
    e.preventDefault();
    if (this.state.checked) {
      this.setState({
        loading: true,
      });
      setTimeout(() => {
        this.props.confirmCreate();
      }, 100);
    }
  };

  handleConfirmBlur = (e: { target: { value: any } }) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  handleRadioChange = (checked: boolean) => {
    this.setState({ checked });
  };

  static getDerivedStateFromProps(props: { loading: any }, state: { loading: any }) {
    if (props.loading === false && state.loading === true) {
      return {
        ...state,
        loading: true,
      };
    }
    return {
      ...state,
      loading: false,
    };
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={styles.container}>
        <Form wrapperCol={{ span: 24 }}>
          <Form.Item label={<LabelComp labelText="Please save these words to safe place" />}>
            {getFieldDecorator('mnes')(
              <Input.TextArea
                autosize={{ minRows: 4, maxRows: 6 }}
                style={{ fontSize: '2rem', color: '#333333' }}
                disabled={true}
              />,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('checkBox')(
              <div>
                <Switch style={{ fontSize: '1rem' }} onChange={this.handleRadioChange} />
                <span style={{ fontSize: '1rem', marginLeft: '0.6rem' }}>
                  I have saved my mnes safely
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
        {this.state.loading ? <FullScreenLoading delay={0} /> : null}
      </div>
    );
  }
}

const WrappedMneForm = Form.create<PassFormProps>({
  name: 'Mneform',
  mapPropsToFields(props: PassFormProps) {
    return {
      mnes: Form.createFormField({
        value: props.mnes,
      }),
    };
  },
})(MneConfirm);

function mapStateToProps(state: any) {
  return {
    loading: state.loading.global,
    accounts: state.global.harmony.wallet.accounts,
    mnes: state.new.mnes,
  };
}

function mapDispatchToProps(dispatch: any) {
  return {
    confirmCreate: () => dispatch(createAction('new/confirmCreate')()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(WrappedMneForm);
