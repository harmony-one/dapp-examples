import React from 'react';
import { Form, Input, Button, InputNumber, Radio } from 'antd';
import { FormComponentProps } from 'antd/lib/form';

import router from 'umi/router';
import { connect } from 'dva';

import styles from './index.css';
import { isValidAddress, Unit } from '@harmony-js/utils';
import { createAction } from '@/utils';

interface ITransaction extends FormComponentProps {
  location: any;
  getBalance: Function;
  getGasPrice: Function;
  balance: string;
  nonce: number;
  gasPrice: string;
  toNext: Function;
  resetAll: Function;
}
const LabelComp = (props: any): JSX.Element => {
  return <span style={{ fontSize: '1.2rem', color: '#333333' }}>{props.labelText}</span>;
};

class Transaction extends React.Component<ITransaction, any> {
  state = {
    gasPrice: '100000000',
    gasLimit: '210000',
    transactionLevel: 'normal',
  };
  validateFrom = (rule: any, value: any, callback: { (arg0: string): void; (): void }) => {
    if (value && !isValidAddress(value)) {
      callback(`Not valid Address`);
    }
    callback();
  };

  validateAmount = (rule: any, value: any, callback: { (arg0: string): void; (): void }) => {
    if ((value !== undefined && value <= 0) || !value) {
      callback(`Not valid Amount`);
    }
    callback();
  };

  changeFee(value: string) {
    let gasPrice = '100000000';

    switch (value) {
      case 'slow': {
        gasPrice = '40000000';
        break;
      }
      case 'normal': {
        gasPrice = '100000000';
        break;
      }
      case 'fast': {
        gasPrice = '200000000';
        break;
      }
    }
    this.setState({
      gasPrice,
      transactionLevel: value,
    });
  }

  handleSubmit = (e: any) => {
    e.preventDefault();
    this.props.form.validateFields((err: any, values: any) => {
      if (!err) {
        this.props.resetAll();
        this.props.toNext({
          ...values,
          ...this.state,
        });
        router.push('send/next');
      }
    });
  };

  componentDidMount() {
    this.props.getBalance({ address: this.props.location.query.from });
    this.props.getGasPrice();
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const maxBalance = Number.parseInt(new Unit(this.props.balance).asWei().toWeiString(), 10);

    return (
      <div className={styles.container}>
        <div className={styles.pageTop}>
          <Button
            shape="circle"
            icon="wallet"
            size="large"
            // tslint:disable-next-line: jsx-no-lambda
            onClick={() => router.push('/wallet')}
          />
          <Button
            shape="circle"
            icon="close"
            size="large"
            // tslint:disable-next-line: jsx-no-lambda
            onClick={() => router.goBack()}
          />
        </div>
        <h1 style={{ marginTop: '1em' }}>Transaction</h1>
        <Form wrapperCol={{ span: 24 }}>
          <Form.Item label={<LabelComp labelText="From" />}>
            {getFieldDecorator('from', {
              rules: [
                { required: true, message: 'Please input sender address!' },
                {
                  validator: this.validateFrom,
                },
              ],
            })(
              <Input
                size="large"
                style={{ height: '2.8rem', fontSize: '1.2rem' }}
                allowClear={false}
              />,
            )}
          </Form.Item>
          <Form.Item label={<LabelComp labelText="To" />}>
            {getFieldDecorator('to', {
              rules: [
                { required: true, message: 'Please input receiver address!' },
                {
                  validator: this.validateFrom,
                },
              ],
            })(
              <Input
                size="large"
                style={{ height: '2.8rem', fontSize: '1.2rem' }}
                allowClear={true}
              />,
            )}
          </Form.Item>
          <Form.Item label={<LabelComp labelText="Amount" />}>
            {getFieldDecorator('amount', {
              rules: [
                { required: true, message: 'Please input amount!' },
                {
                  validator: this.validateAmount,
                },
              ],
            })(
              <InputNumber
                min={0}
                max={maxBalance}
                // step={0.1}
                size="large"
                style={{ width: '100%', fontSize: '1.2rem' }}
              />,
            )}
          </Form.Item>
          <Form.Item label={<LabelComp labelText="Transaction Fee" />}>
            <Radio.Group
              defaultValue="normal"
              size="large"
              // tslint:disable-next-line: jsx-no-lambda
              onChange={e => {
                this.changeFee(e.target.value);
              }}
              style={{ marginTop: '1em' }}
            >
              <Radio.Button value="slow">Slow</Radio.Button>
              <Radio.Button value="normal">Normal</Radio.Button>
              <Radio.Button value="fast">Fast</Radio.Button>
            </Radio.Group>
          </Form.Item>
          {/* <div>{`gasPrice: ${this.state.gasPrice}`}</div>
          <div>{`gasLimit: ${this.state.gasLimit}`}</div> */}
          <Form.Item wrapperCol={{ span: 24 }}>
            <Button
              size="large"
              type="primary"
              block={true}
              style={{ height: '3.8rem', fontSize: '1.6rem' }}
              // className={}
              onClick={this.handleSubmit}
            >
              Send
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

const WrappedTransaction = Form.create<ITransaction>({
  name: 'TransactionForm',
  mapPropsToFields(props: ITransaction) {
    return {
      from: Form.createFormField({
        value: props.location.query.from,
      }),
      amount: Form.createFormField({
        value: 0,
      }),
    };
  },
})(Transaction);

function mapState(state: any) {
  return {
    balance: state.account.balance,
    nonce: state.account.nonce,
    gasPrice: state.account.gasPrice,
  };
}
function mapDispatch(dispatch: any) {
  return {
    getBalance: (payload: any) => dispatch(createAction('accounts/getBalance')(payload)),
    getGasPrice: () => dispatch(createAction('account/getGasPrice')()),
    // makeTxn: (payload: any) => dispatch(createAction('send/makeTxn')(payload)),
    toNext: (payload: any) => dispatch(createAction('send/toNext')(payload)),
    resetAll: () => dispatch(createAction('send/resetAll')()),
  };
}

export default connect(
  mapState,
  mapDispatch,
)(WrappedTransaction);
