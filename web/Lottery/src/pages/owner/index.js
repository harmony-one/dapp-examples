import React from 'react';
import { Button, Modal, InputNumber } from 'antd';
import { isHash } from '@harmony-js/utils';
import { connect, createAction } from '../../utils/index';
import { ContractState, AccountState, TxnState } from '../../components';
import styles from './index.css';

class Owner extends React.Component {
  state = {
    visible: false,
    confirmVisible: false,
    confirmLoading: false,
    txnVisible: false,
    txnHash: undefined,
    receipt: undefined,
    confirmation: undefined,
    error: undefined,
    inputValue: '',
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };
  showConfirmaModal = () => {
    this.setState({
      confirmVisible: true,
    });
  };

  handleTxn = txn => {
    this.setState(txn);
  };

  handleOk = () => {
    this.props.deposit(this.state.inputValue);
    // this.props.getAccount({ privateKey: this.state.inputValue });
    this.setState({
      confirmLoading: true,
    });

    setTimeout(() => {
      this.setState({
        visible: false,
        confirmLoading: false,
      });
      this.props.getContractState();
    }, 2000);
  };

  handleConfirmOk = () => {
    this.props.pickWinner();
    this.setState({
      confirmConfirmLoading: true,
    });

    setTimeout(() => {
      this.setState({
        confirmVisible: false,
        confirmConfirmLoading: false,
      });
      this.props.getContractState();
    }, 2000);
  };

  handleCancel = () => {
    console.log('Clicked cancel button');
    this.setState({
      visible: false,
      inputValue: '',
    });
  };

  handleConfirmCancel = () => {
    console.log('Clicked cancel button');
    this.setState({
      confirmVisible: false,
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

  render() {
    const {
      contractAddress,
      contractBalance,
      players,
      accountBalance,
      account,
      loading,
    } = this.props;

    // const contractBalance = this.props.contractBalance;

    const { visible, confirmLoading, confirmConfirmLoading, confirmVisible } = this.state;

    if (this.props.emitter) {
      this.props.emitter
        .on('transactionHash', txnHash => {
          if (isHash(txnHash)) {
            this.handleTxn({ txnVisible: true, txnHash });
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
        <AccountState
          accountBalance={accountBalance}
          accountType="manager"
          accountAddress={account.checksumAddress}
          onPress={() => {
            this.props.getAccountBalance();
          }}
        />

        <div className={styles.buttonWrapper}>
          <Button
            size="large"
            type="primary"
            block
            style={{ height: '2.8em', fontSize: '1.6em' }}
            onClick={this.showModal}
            loading={loading}
          >
            Deposit
          </Button>
        </div>
        <div className={styles.buttonWrapper}>
          <Button
            size="large"
            type="danger"
            block
            style={{ height: '2.8em', fontSize: '1.6em' }}
            onClick={this.showConfirmaModal}
            disabled={players.length === 0 || loading}
          >
            Pick Winner
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
          <InputNumber defaultValue="0.11" onChange={this.handleInput} style={{ width: '100%' }} />
        </Modal>

        <Modal
          title="Confirm To Pick Winner"
          visible={confirmVisible}
          onOk={this.handleConfirmOk}
          confirmLoading={confirmConfirmLoading}
          onCancel={this.handleConfirmCancel}
          centered
        >
          <p>Would you like to pick winner and end this round?</p>
        </Modal>
      </div>
    );
  }
}
//0xd111e251634b0af6316f863bba605efe8c11ac211a67d5783aabc66c850f04c5

function mapState(state) {
  return {
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
    pickWinner: () => dispatch(createAction('contract/pickWinner')()),
  };
}

export default connect(
  mapState,
  mapDispatch,
)(Owner);
