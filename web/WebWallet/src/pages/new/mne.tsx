import React from 'react';
import { Form, Input, Switch, Button } from 'antd';
import router from 'umi/router';
import { FormComponentProps } from 'antd/lib/form';
import { connect } from 'dva';
import { createAction } from '../../utils';
import styles from './index.css';

interface PassFormProps extends FormComponentProps {
  confirmCreate?: Function;
  generateMnemonic: Function;
  resetMnes: Function;
  sendMnemonic: Function;
  generateOnStart: string;
  mnes: string;
  nextRoute: string;
}

const LabelComp = (props: any): JSX.Element => {
  return <span style={{ fontSize: '1.2rem', color: '#333333' }}>{props.labelText}</span>;
};

class MneConfirm extends React.Component<PassFormProps, any> {
  state = {
    confirmDirty: false,
    checked: false,
  };
  handleSubmit = (e: any) => {
    e.preventDefault();
    if (this.state.checked) {
      if (this.props.generateOnStart === 'false') {
        this.props.form.validateFields((err: any, values: any) => {
          if (!err) {
            this.props.sendMnemonic({ mnes: values.mnes });
            if (this.props.nextRoute) {
              router.push(`${this.props.nextRoute}`);
            }
          }
        });
      }

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
    if (this.props.generateOnStart === 'true') {
      this.props.generateMnemonic();
    } else {
      this.props.resetMnes();
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <div className={styles.container}>
        <div style={{ marginBottom: '4rem', marginTop: '2rem' }}>
          <Button icon="left" shape="round" size="default" onClick={() => router.goBack()} />
        </div>
        <Form wrapperCol={{ span: 24 }}>
          <Form.Item label={<LabelComp labelText="Please save these words to safe place" />}>
            {getFieldDecorator('mnes')(
              <Input.TextArea
                autosize={{ minRows: 4, maxRows: 6 }}
                style={{ fontSize: '2rem', color: '#333333' }}
                disabled={this.props.generateOnStart === 'true'}
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
    mnes: state.create.mnes,
  };
}

function mapDispatchToProps(dispatch: any) {
  return {
    generateMnemonic: () => dispatch(createAction('create/generateMnemonic')()),
    resetMnes: () => dispatch(createAction('create/resetMnes')()),
    sendMnemonic: (payload: any) => dispatch(createAction('create/sendMnemonic')(payload)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(WrappedMneForm);
