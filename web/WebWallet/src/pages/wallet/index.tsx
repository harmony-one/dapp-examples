import React from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Typography, Button, Radio, Dropdown, Menu } from 'antd';
import { NetWorkItem } from '../../models/network';
import { AccountCard } from '../../components';
import styles from './index.css';
import { createAction } from '@/utils';

const { Title } = Typography;

interface IWallet {
  accounts: any[];
  providerList: NetWorkItem[];
  setProvider: Function;
  loadImported: Function;
  importedAccounts: any[];
  removeAccount: Function;
  selected: string;
}

const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
};

const RadioItem = ({ network }: { network: NetWorkItem }) => {
  return (
    <Radio style={radioStyle} value={network}>
      {network.name}
    </Radio>
  );
};

class Wallet extends React.Component<IWallet> {
  state = {
    value: this.props.providerList.find(val => val.name === this.props.selected),
  };

  onChange = (e: any) => {
    this.setState({
      value: e.target.value,
    });
    this.props.setProvider(e.target.value);
  };
  renderAccountList() {
    return this.props.accounts.map((value, index) => {
      const imported = this.props.importedAccounts.findIndex(val => value === val);
      return (
        <AccountCard
          key={value}
          address={value}
          imported={imported !== -1}
          index={index}
          remove={this.props.removeAccount}
        />
      );
    });
  }
  addAccount() {
    return router.push('/new?step1=password');
  }
  importPrivateKey() {
    return router.push('/new?step1=key');
  }
  componentDidUpdate() {
    this.props.loadImported();
  }

  render() {
    return (
      <div className={styles.container}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '1rem',
            paddingBottom: '1rem',
          }}
        >
          <Dropdown
            overlay={
              <div
                style={{
                  opacity: 1,
                  background: '#ffffff',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                }}
              >
                <Button onClick={this.addAccount}>Add 1 More</Button>
                <Button onClick={this.importPrivateKey}>Import Private Key</Button>
                <Button onClick={() => {}} disabled={true}>
                  Import KeyStore
                </Button>
              </div>
            }
            trigger={['click']}
          >
            <Button
              icon="plus"
              shape="round"
              size="default"
              // onClick={this.addAccount}
            />
          </Dropdown>
          <Title style={{ marginTop: 'inherit', marginBottom: 'inherit' }}>H Wallet</Title>
          <Dropdown
            overlay={
              <div style={{ opacity: 1, background: '#ffffff' }}>
                <Radio.Group
                  onChange={this.onChange}
                  value={this.state.value}
                  // defaultValue={networkSeq === -1 ? this.state.value : networkSeq}
                >
                  {this.props.providerList.map((network: NetWorkItem) => {
                    return <RadioItem network={network} key={network.name} />;
                  })}
                </Radio.Group>
              </div>
            }
            trigger={['click']}
          >
            <Button icon="cloud" shape="round" size="default" />
          </Dropdown>
        </div>

        <div style={{ marginTop: '2rem' }}>{this.renderAccountList()}</div>
      </div>
    );
  }
}

function mapState(state: any) {
  return {
    accounts: state.wallet.accounts,
    providerList: state.network.providerList,
    importedAccounts: state.wallet.importedAccounts,
    selected: state.network.selected,
  };
}

function mapDispatch(dispatch: any) {
  return {
    setProvider: (payload: NetWorkItem) => dispatch(createAction('network/setProvider')(payload)),
    loadImported: () => dispatch(createAction('wallet/loadImported')()),
    removeAccount: (payload: any) => dispatch(createAction('wallet/removeAccount')(payload)),
  };
}

export default connect(
  mapState,
  mapDispatch,
)(Wallet);
