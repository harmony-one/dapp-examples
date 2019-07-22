import React from 'react';
import { Button, Modal, Input } from 'antd';
import { ContractState } from '../components';
import { connect, createAction } from '../utils/index';
import styles from './index.css';

class Index extends React.Component {
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
        inputValue: '',
      });
      this.props.getContractState();
    }, 500);
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

  displayAddress(address) {
    const dot = `...`;
    const start = address.substring(0, 8);
    const tail = address.substring(address.length - 4, address.length);
    return `${start}${dot}${tail}`;
  }

  render() {
    const { contractAddress, players, contractBalance, loading } = this.props;

    // const contractBalance = this.props.contractBalance;

    const { visible, confirmLoading } = this.state;

    return (
      <div className={styles.normal}>
        <ContractState
          contractAddress={contractAddress}
          contractBalance={contractBalance}
          players={players}
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
            Login
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
    loading: state.loading.global,
    contractAddress: state.contract.contractAddress,
    contractBalance: state.contract.contractBalance,
    players: state.contract.players,
    account: state.account.account,
    manager: state.account.manager,
    isOwner: state.account.isOwner,
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
)(Index);

// { acc0:
//   { prv:
//      '0xd111e251634b0af6316f863bba605efe8c11ac211a67d5783aabc66c850f04c5',
//     add: '0x6Fb24508e631Ef45f07B44794e637359b98017EB' },
//  acc1:
//   { prv:
//      '0x7a1ef7c273aa1ea4ed2a018ba3e491cc345fdca0df6cdce85924f66673ba140a',
//     add: '0xF2A08313FC79A01AdbC5E700B063ed83Ed07B446' },
//  acc2:
//   { prv:
//      '0x2f7b2d779f2e8fd23ae20f1c067c326b8ed3f3abef25ec11361b4bd9435c7ba0',
//     add: '0x86A44E7C76232837d40098312116686fcD247770' },
//  acc3:
//   { prv:
//      '0xee66dbc7a059da6f820a98019fe4a41326408c28567c2c74c40390156f91cd8a',
//     add: '0x729682e010EC853B4d583C7110e24CA752A2C74b' },
//  acc4:
//   { prv:
//      '0xe3771a833026c3f0548b6aec760e92d509d82138f2332e280966c0a7b2abf2ea',
//     add: '0xc0e63B5633eBf51dFab7c5f227c1eC28fa645966' },
//  acc5:
//   { prv:
//      '0xf65a128135fbfe9f4d1bbd905368cfa593ba1a026e81c64b6b212b234ace6ab0',
//     add: '0x3F7d6925984D169378336BBD638C78106e8D14aA' } }
