import React from 'react';
import { Button, Modal, Input } from 'antd';
import { ContractState, NetworkState } from '../components';
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
    this.props.getAccount();
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

  componentDidMount() {
    this.props.intializeNetwork();
  }

  render() {
    const { contractAddress, players, contractBalance, loading, url, netWork } = this.props;

    // const contractBalance = this.props.contractBalance;

    const { visible, confirmLoading } = this.state;

    return (
      <div className={styles.normal}>
        <NetworkState url={url} netWork={netWork} />
        <ContractState
          contractAddress={contractAddress}
          contractBalance={contractBalance}
          players={players}
          onPress={() => {
            this.props.getContractState();
            // this.props.getPlayers();
          }}
        />
        <div className={styles.buttonWrapper}>
          <Button
            size="large"
            type="primary"
            block
            style={{ height: '2.8em', fontSize: '1.6em' }}
            onClick={this.handleOk}
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
    url: state.global.url,
    netWork: state.global.netWork,
    loading: state.loading.global,
    contractAddress: state.global.contractAddress,
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
    intializeNetwork: () => dispatch(createAction('global/intializeNetwork')()),
  };
}

export default connect(
  mapState,
  mapDispatch,
)(Index);
