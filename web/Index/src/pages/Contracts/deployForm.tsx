import React from 'react';
import { Form, Input, Button, InputNumber, Radio, Select, Statistic, Divider, Spin } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { connect } from 'dva';

import { getAddressFromPrivateKey } from '@harmony-js/crypto';
import { isValidAddress, Unit, isPrivateKey } from '@harmony-js/utils';

import { ConnectProps, ConnectState, Dispatch } from '@/models/connect';
import styles from './index.less';
import { createAction } from '@/utils/createAction';

const { Option } = Select;

const DisplayBalance = ({ balance = '0', loading }: { balance: string; loading: boolean }) => (
  <div>
    <Statistic
      title="Account Balance (Ether)"
      formatter={() => {
        if (loading) {
          return <Spin />;
        }
        return (
          <span style={{ fontSize: '1.2em', fontWeight: 'bold', color: '#333333' }}>{balance}</span>
        );
      }}
    />
  </div>
);

const BalanceWrapper = connect((state: any) => ({
  loading: state.loading.global,
  balance: state.contract.accountBalance,
}))(DisplayBalance);

interface ITransaction extends FormComponentProps {
  // balance: string;
  // emitter: Emitter;
  onSubmit: Function;
  location: any;
  getBalance: Function;
  setupDeploy: Function;
}
const LabelComp = (props: any): JSX.Element => (
  <span style={{ color: '#333333' }}>{props.labelText}</span>
);

class Transaction extends React.Component<ITransaction, any> {
  state = {
    account: undefined,
    gasPrice: '100000000',
    gasLimit: '840000',
    transactionLevel: 'normal',
  };

  validateFrom = (rule: any, value: any, callback: { (arg0: string): void; (): void }) => {
    if (value && !isPrivateKey(value)) {
      callback('Not valid PrivateKey');
    }
    const network = this.props.form.getFieldValue('network');
    const account = getAddressFromPrivateKey(value);
    this.setState({
      account,
    });
    this.props.getBalance({
      network,
      accountAddress: account,
    });
    callback();
  };

  validateAmount = (rule: any, value: any, callback: { (arg0: string): void; (): void }) => {
    if ((value !== undefined && value < 0) || value === undefined) {
      callback('Not valid Amount');
    }
    callback();
  };

  validateAccount = (rule: any, value: any, callback: { (arg0: string): void; (): void }) => {
    if ((value !== undefined && value < 0) || !value) {
      callback('Not valid Account');
    }
    this.props.getBalance({
      network: value,
      accountAddress: this.state.account,
    });
    callback();
  };

  changeFee = (value: string) => {
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
  };

  handleSubmit = (e: any) => {
    e.preventDefault();
    this.props.form.validateFields((err: any, values: any) => {
      if (!err) {
        this.props.setupDeploy({ ...values, ...this.state });
        this.props.onSubmit();
        // this.props.resetAll();
        // this.props.toNext({
        //   ...values,
        //   ...this.state,
        // });
        // router.push('send/next');
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <div className={styles.container}>
        <Form wrapperCol={{ span: 24 }}>
          <Form.Item label={<LabelComp labelText="Private Key" />}>
            {getFieldDecorator('from', {
              rules: [
                { required: true, message: 'Please input privateKey to deploy!' },
                {
                  validator: this.validateFrom,
                },
              ],
            })(<Input size="large" allowClear={false} />)}
          </Form.Item>
          <Form.Item label={<LabelComp labelText="Network" />}>
            {getFieldDecorator('network', {
              rules: [
                { required: true, message: 'Please select network!' },
                { validator: this.validateAccount },
              ],
            })(
              <Select>
                <Option value="LocalHarmony">Harmony(Local TestNet)</Option>
                <Option value="BetaNetHarmony">Harmony(BetaNet)</Option>
                <Option value="EthRopsten">Ropsten(ETH TestNet)</Option>
                <Option value="EthGanache">Ganache(ETH Local TestNet)</Option>
              </Select>,
            )}
          </Form.Item>
          <BalanceWrapper />
          <Divider />
          <Form.Item label={<LabelComp labelText="Amount in Ether" />}>
            {getFieldDecorator('amount', {
              rules: [
                { required: false, message: 'Please input amount!' },
                {
                  validator: this.validateAmount,
                },
              ],
            })(<InputNumber min={0} style={{ width: '100%' }} />)}
          </Form.Item>
          <Form.Item label={<LabelComp labelText="Transaction Fee" />}>
            <Radio.Group
              defaultValue="normal"
              // size="large"
              // tslint:disable-next-line: jsx-no-lambda
              onChange={e => {
                this.changeFee(e.target.value);
              }}
              style={{ marginTop: '.6em' }}
            >
              <Radio.Button value="slow">Slow</Radio.Button>
              <Radio.Button value="normal">Normal</Radio.Button>
              <Radio.Button value="fast">Fast</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item wrapperCol={{ span: 24 }}>
            <Button
              size="large"
              type="primary"
              block
              // style={{ height: '3.8rem', fontSize: '1.6rem' }}
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
      amount: Form.createFormField({
        value: 0,
      }),
      network: Form.createFormField({
        value: 'LocalHarmony',
      }),
    };
  },
})(Transaction);

function mapState(state: ConnectState) {
  return {};
}
function mapDispatch(dispatch: Dispatch) {
  return {
    getBalance: (payload: any) => dispatch(createAction('contract/fetchAccountBalance')(payload)),
    setupDeploy: (payload: any) => dispatch(createAction('contract/setupDeploy')(payload)),
  };
}

export default connect(
  mapState,
  mapDispatch,
)(WrappedTransaction);
