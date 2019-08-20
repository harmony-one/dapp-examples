import React from 'react';
import { Button, Modal, InputNumber } from 'antd';
import { isHash, Unit } from '@harmony-js/utils';
import { ContractState, AccountState, TxnState, NetworkState } from '../../components';
import { connect, createAction } from '../../utils/index';
import styles from './index.css';
import { getAddress } from '@harmony-js/crypto';

class Player extends React.Component {
  state = {
    ModalText: 'Content of the modal',
    visible: false,
    confirmLoading: false,
    txnVisible: false,
    txnHash: undefined,
    receipt: undefined,
    confirmation: undefined,
    error: undefined,
    inputValue: '0.11',
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = () => {
    this.props.deposit(this.state.inputValue);
    // this.props.getAccount({ privateKey: this.state.inputValue });
    this.setState({
      ModalText: 'The modal will be closed after two seconds',
      confirmLoading: true,
      txnVisible: false,
    });

    setTimeout(() => {
      this.setState({
        visible: false,
        confirmLoading: false,
      });
      this.props.getContractState();
    }, 2000);
  };

  handleTxn = txn => {
    this.setState(txn);
  };

  handleCancel = () => {
    this.setState({
      visible: false,
      inputValue: '',
    });
  };
  handleInput = value => {
    this.setState({ inputValue: value });
  };

  componentDidMount() {
    this.props.getPlayers();
    this.props.getAccountBalance();
  }

  displayAddress(address) {
    const dot = `...`;
    const start = address.substring(0, 8);
    const tail = address.substring(address.length - 4, address.length);
    return `${start}${dot}${tail}`;
  }

  isEnoughMoney(balance) {
    const minDeposit = '0.1';
    const gasPrice = new Unit('100').asGwei().toWei();
    const gasLimit = new Unit('210000').asWei().toWei();
    const maxCost = new Unit(gasPrice.mul(gasLimit)).asWei().toWei();
    const minDepositBN = new Unit(minDeposit)
      .asEther()
      .toWei()
      .add(maxCost);
    const balanceBN = new Unit(balance).asWei().toWei();
    return minDepositBN.lt(balanceBN);
  }

  render() {
    const {
      contractAddress,
      contractBalance,
      players,
      accountBalance,
      account,
      loading,
      url,
      netWork,
    } = this.props;

    const { visible, confirmLoading } = this.state;

    const isDepositable = this.isEnoughMoney(accountBalance);

    if (this.props.emitter) {
      this.props.emitter
        .on('transactionHash', txnHash => {
          if (isHash(txnHash)) {
            this.handleTxn({
              txnVisible: true,
              txnHash,
              receipt: undefined,
              confirmation: undefined,
            });
          }
        })
        .on('receipt', receipt => {
          this.handleTxn({ receipt });
        })
        .on('error', error => {
          this.handleTxn({ error });
        })
        .on('confirmation', confirmation => {
          this.handleTxn({ confirmation });
          this.props.getContractState();
          this.props.getPlayers();
          this.props.getAccountBalance();
        });
    }

    return (
      <div className={styles.normal}>
        <NetworkState url={url} netWork={netWork} />
        <TxnState
          accountType={'txn'}
          visible={this.state.txnVisible}
          txnHash={this.state.txnHash}
          confirmation={this.state.confirmation}
          receipt={this.state.receipt}
          onPress={() => this.handleTxn({ txnVisible: false })}
        />
        <ContractState
          contractAddress={contractAddress}
          contractBalance={contractBalance}
          players={players}
          onPress={() => {
            this.props.getContractState();
            this.props.getPlayers();
          }}
        />
        {account ? (
          <AccountState
            accountBalance={accountBalance}
            accountType="player"
            accountAddress={getAddress(account.address).checksum}
            onPress={() => {
              this.props.getAccountBalance();
            }}
          />
        ) : null}

        <div className={styles.buttonWrapper}>
          <Button
            size="large"
            type="primary"
            block
            style={{ height: '2.8em', fontSize: '1.6em' }}
            onClick={this.showModal}
            loading={loading}
            disabled={!isDepositable}
          >
            Deposit
          </Button>
        </div>
        <Modal
          title="Input Deposit Value (min:0.11 ONE)"
          visible={visible}
          onOk={this.handleOk}
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
          centered
        >
          <InputNumber
            defaultValue={this.state.inputValue}
            onChange={this.handleInput}
            style={{ width: '100%' }}
          />
        </Modal>
      </div>
    );
  }
}

function mapState(state) {
  return {
    url: state.global.url,
    netWork: state.global.netWork,
    loading: state.loading.global,
    contractAddress: state.contract.contractAddress,
    contractBalance: state.contract.contractBalance,
    players: state.contract.players,
    account: state.account.account,
    accountBalance: state.account.accountBalance,
    manager: state.account.manager,
    error: state.account.error,
    emitter: state.contract.emitter,
  };
}

function mapDispatch(dispatch) {
  return {
    getAccount: key => dispatch(createAction('account/getAccount')(key)),
    getContractState: () => dispatch(createAction('contract/getContractState')()),
    getPlayers: () => dispatch(createAction('contract/getPlayers')()),
    getAccountBalance: () => dispatch(createAction('account/getAccountBalance')()),
    deposit: payload => dispatch(createAction('contract/deposit')(payload)),
  };
}

export default connect(
  mapState,
  mapDispatch,
)(Player);
