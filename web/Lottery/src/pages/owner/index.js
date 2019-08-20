import React from 'react';
import { Button, Modal, InputNumber } from 'antd';
import { isHash, Unit } from '@harmony-js/utils';
import { getAddress } from '@harmony-js/crypto';
import { connect, createAction } from '../../utils/index';
import { ContractState, AccountState, TxnState, NetworkState } from '../../components';
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
    inputValue: '0.11',
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
      txnVisible: false,
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
    this.setState({
      visible: false,
      inputValue: '',
    });
  };

  handleConfirmCancel = () => {
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
      netWork,
      url,
    } = this.props;

    // const contractBalance = this.props.contractBalance;
    const isDepositable = this.isEnoughMoney(accountBalance);

    const { visible, confirmLoading, confirmConfirmLoading, confirmVisible } = this.state;

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
            accountType="manager"
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
          <InputNumber
            defaultValue={this.state.inputValue}
            onChange={this.handleInput}
            style={{ width: '100%' }}
          />
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
    pickWinner: () => dispatch(createAction('contract/pickWinner')()),
  };
}

export default connect(
  mapState,
  mapDispatch,
)(Owner);
