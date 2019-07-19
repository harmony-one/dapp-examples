import React from 'react';
import { Button, Modal, Input } from 'antd';
import { connect, createAction } from '../../utils/index';
import styles from './index.css';

class Owner extends React.Component {
  state = {
    ModalText: 'Content of the modal',
    visible: false,
    confirmLoading: false,
    inputValue: '',
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = () => {
    this.props.getAccount({ privateKey: this.state.inputValue });
    this.setState({
      ModalText: 'The modal will be closed after two seconds',
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

  handleCancel = () => {
    console.log('Clicked cancel button');
    this.setState({
      visible: false,
      inputValue: '',
    });
  };
  handleInput = e => {
    this.setState({ inputValue: e.target.value });
  };

  componentDidMount() {
    this.props.getPlayers();
  }

  displayAddress(address) {
    const dot = `...`;
    const start = address.substring(0, 8);
    const tail = address.substring(address.length - 4, address.length);
    return `${start}${dot}${tail}`;
  }

  render() {
    const contractAddress = this.props.contractAddress;
    const players = this.props.players;

    // const contractBalance = this.props.contractBalance;

    const { visible, confirmLoading } = this.state;

    return (
      <div className={styles.normal}>
        <ul style={{ margin: 0, padding: 0, width: '100%' }}>
          <li
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <div style={{ fontSize: '1.2em', color: '#ffffff' }}>Game Address :</div>
            <div>
              <a
                href={`https://ropsten.etherscan.io/address/${contractAddress}`}
                className={styles.link}
              >
                {this.displayAddress(contractAddress)}
              </a>
            </div>
          </li>
          <li
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <div style={{ fontSize: '1.2em', color: '#ffffff' }}>Players In game :</div>
            <div style={{ fontSize: '1.2em', color: '#ffffff' }}>{this.props.players.length}</div>
          </li>
        </ul>
        <div className={styles.title}>You are the owner</div>
        <div className={styles.buttonWrapper}>
          <Button
            size="large"
            type="primary"
            block
            style={{ height: '2.8em', fontSize: '1.6em' }}
            onClick={this.showModal}
          >
            Deposit
          </Button>
        </div>
        <div className={styles.buttonWrapper}>
          <Button
            size="large"
            type="danger"
            block
            style={{ height: '2.8em', fontSize: '1.6em', marginTop: '1.2em' }}
            onClick={this.showModal}
            disabled={players.length === 0}
          >
            Pick Winner
          </Button>
        </div>
        <Modal
          title="Input PrivateKey"
          visible={visible}
          onOk={this.handleOk}
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
          centered
        >
          <Input onChange={this.handleInput} allowClear />
        </Modal>
      </div>
    );
  }
}
//0xd111e251634b0af6316f863bba605efe8c11ac211a67d5783aabc66c850f04c5

function mapState(state) {
  return {
    contractAddress: state.contract.contractAddress,
    contractBalance: state.contract.contractBalance,
    players: state.contract.players,
    account: state.account.account,
    manager: state.account.manager,
    error: state.account.error,
  };
}

function mapDispatch(dispatch) {
  return {
    getAccount: key => dispatch(createAction('account/getAccount')(key)),
    getContractState: () => dispatch(createAction('contract/getContractState')()),
    getPlayers: () => dispatch(createAction('contract/getPlayers')()),
  };
}

export default connect(
  mapState,
  mapDispatch,
)(Owner);
