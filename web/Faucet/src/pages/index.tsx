import React from 'react';

import { Typography, Button, Input, Icon, Modal, Steps, Descriptions, Spin } from 'antd';

import { createAction, connect } from '@/utils';
import styles from './index.css';
import { Contract } from '@harmony-js/contract';
import { Emitter } from '@harmony-js/network';
import { Unit, isValidAddress, hexToNumber } from '@harmony-js/utils';

const { Title } = Typography;
const { Step } = Steps;
interface IndexPageIF {
  contractAddress: string;
  netWork: string;
  getContractState: Function;
  requestFreeMoney: Function;
  contract: Contract;
  contractBalance: string;
  emitter: Emitter;
  cleanEmitter: Function;
}

interface IndexPageState {
  donate: boolean;
  treat: boolean;
  toAddress: string;
  privateKey: string;
  amount: string;
  transactionHash?: any;
  error?: any;
  receipt?: any;
  confirmation?: any;
  modalVisible: boolean;
}

class IndexPage extends React.Component<IndexPageIF> {
  state: IndexPageState = {
    donate: false,
    treat: false,
    toAddress: '',
    privateKey: '',
    amount: '',
    transactionHash: undefined,
    error: undefined,
    receipt: undefined,
    confirmation: undefined,
    modalVisible: false,
  };
  componentDidMount() {
    this.props.getContractState();
  }
  showTreat = () => {
    this.setState({ donate: false, treat: true, toAddress: '' });
  };
  hideTreat = () => {
    this.setState({ donate: false, treat: false, toAddress: '' });
  };

  getMoney = () => {
    this.showModal();
    this.props.requestFreeMoney({ address: this.state.toAddress });
  };

  showModal = () => {
    this.setState({ modalVisible: true });
  };
  hideModal = () => {
    this.setState({ modalVisible: false });
    this.props.cleanEmitter();
  };

  showDonate = () => {
    alert('this feature is not open yet');
    // this.setState({ donate: true, treat: false });
  };
  hideDonate = () => {
    this.setState({ donate: false, treat: false });
  };
  onChangeFundME = (e: any) => {
    this.setState({ toAddress: e.target.value });
  };
  onChangePrivateKey = (e: any) => {
    this.setState({ privateKey: e.target.value });
  };
  onChangeAmount = (e: any) => {
    this.setState({ amount: e.target.value });
  };

  render() {
    if (this.props.emitter) {
      this.props.emitter
        .on('transactionHash', (transactionHash: string) => {
          this.setState({ transactionHash });
        })
        .on('receipt', (receipt: any) => {
          this.setState({ receipt });
        })
        .on('confirmation', (confirmation: any) => {
          this.setState({ confirmation });
        })
        .on('error', (error: any) => {
          this.setState({ error });
        });
    }
    const validAddress: boolean = isValidAddress(this.state.toAddress);
    const currentBalance =
      this.props.contractBalance && this.props.contractBalance !== ''
        ? new Unit(this.props.contractBalance).asWei().toEther()
        : '0';
    return (
      <div className={styles.normal}>
        <Title level={4}>Contract Address</Title>
        <Title level={3}>{this.props.contractAddress}</Title>
        <Title level={2}>Network: {this.props.netWork}</Title>
        <Title level={1}>Current Fund: {currentBalance} ONE</Title>
        {this.state.treat === true ? (
          <div>
            <div style={{ marginTop: 64 }}>
              <Input
                style={{ width: 640, height: 60 }}
                placeholder="input your ONE address"
                onChange={this.onChangeFundME}
              />
            </div>
            <div
              // tslint:disable-next-line: jsx-no-multiline-js
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 64,
              }}
            >
              <Button
                size="large"
                type="ghost"
                style={{ width: 192, height: 64 }}
                onClick={this.hideTreat}
              >
                Cancel
              </Button>
              <Button
                size="large"
                type="primary"
                style={{ width: 192, marginLeft: 32, height: 64 }}
                disabled={!validAddress}
                onClick={this.getMoney}
              >
                Get 1 ONE
              </Button>
            </div>
          </div>
        ) : null}
        {this.state.donate === true ? (
          <div>
            <div style={{ marginTop: 64 }}>
              <Input
                style={{ width: 640, height: 60 }}
                placeholder="input your Private Key"
                onChange={this.onChangePrivateKey}
              />
              <Input
                style={{ width: 640, height: 60, marginTop: 16 }}
                placeholder="input donate amount"
                onChange={this.onChangeAmount}
              />
            </div>
            <div
              // tslint:disable-next-line: jsx-no-multiline-js
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 64,
              }}
            >
              <Button
                size="large"
                type="ghost"
                style={{ width: 192, height: 64 }}
                onClick={this.hideDonate}
              >
                Cancel
              </Button>
              <Button
                size="large"
                type="primary"
                style={{ width: 192, marginLeft: 32, height: 64 }}
              >
                Donate With
                <span>
                  <Icon type="heart" style={{ marginLeft: 8 }} />
                </span>
              </Button>
            </div>
          </div>
        ) : null}
        {this.state.treat === false && this.state.donate === false ? (
          <div
            // tslint:disable-next-line: jsx-no-multiline-js
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 64,
            }}
          >
            <Button
              size="large"
              type="ghost"
              style={{ width: 192, height: 64 }}
              onClick={this.showTreat}
            >
              Treat
            </Button>
            <Button
              size="large"
              type="primary"
              style={{ width: 192, marginLeft: 32, height: 64 }}
              onClick={this.showDonate}
            >
              Donate
            </Button>
          </div>
        ) : null}
        <Modal
          title="Pending Deployment"
          style={{ marginBottom: '2em' }}
          visible={this.state.modalVisible}
          onCancel={this.hideModal}
          onOk={this.hideModal}
        >
          <Steps
            direction="vertical"
            status={this.state.error || undefined}
            current={
              this.state.transactionHash === undefined &&
              this.state.confirmation === undefined &&
              this.state.receipt === undefined
                ? 0
                : this.state.transactionHash !== undefined &&
                  this.state.confirmation === undefined &&
                  this.state.receipt === undefined
                ? 1
                : this.state.transactionHash !== undefined &&
                  this.state.confirmation !== undefined &&
                  this.state.receipt === undefined
                ? 2
                : this.state.transactionHash !== undefined &&
                  this.state.confirmation !== undefined &&
                  this.state.receipt !== undefined
                ? 3
                : 0
            }
          >
            <Step title="Transaction Hash" description={this.state.transactionHash} />
            <Step
              title="Confirmation"
              description={
                this.state.confirmation ? this.state.confirmation : <Spin size="large" />
              }
            />
            <Step
              title="Receipt"
              description={
                <div>
                  <Descriptions.Item label="Contract Address">
                    {this.state.receipt !== undefined ? this.state.receipt.contractAddress : null}
                  </Descriptions.Item>
                  <Descriptions.Item label="Gas Used">
                    {this.state.receipt !== undefined
                      ? `${new Unit(hexToNumber(this.state.receipt.gasUsed))
                          .asWei()
                          .toEther()} Ether`
                      : null}
                  </Descriptions.Item>
                </div>
              }
            />
          </Steps>
        </Modal>
      </div>
    );
  }
}
function mapState(state: any) {
  return {
    contractAddress: state.global.contractAddress,
    netWork: state.global.netWork,
    contract: state.contract.contract,
    contractBalance: state.contract.contractBalance,
    emitter: state.contract.emitter,
  };
}

function mapDispatch(dispatch: any) {
  return {
    intializeNetwork: () => dispatch(createAction('global/intializeNetwork')()),
    getContractState: () => dispatch(createAction('contract/getContractState')()),
    cleanEmitter: () => dispatch(createAction('contract/cleanEmitter')()),
    requestFreeMoney: (payload: any) =>
      dispatch(createAction('contract/requestFreeMoney')(payload)),
  };
}

export default connect(
  mapState,
  mapDispatch,
)(IndexPage);
