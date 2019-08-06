import React from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Typography, Button, Radio, Dropdown } from 'antd';
import { NetWorkItem } from '../../models/network';
import { AccountCard } from '../../components';
import styles from './index.css';
import { createAction } from '@/utils';

const { Title } = Typography;

interface IWallet {
  accounts: any[];
  providerList: NetWorkItem[];
  setProvider: Function;
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
    value: 1,
  };

  onChange = (e: any) => {
    console.log('radio checked', e.target.value);
    this.setState({
      value: e.target.value,
    });
    this.props.setProvider(e.target.value);
  };
  renderAccountList() {
    return this.props.accounts.map((value, index) => {
      return <AccountCard key={value} address={value} index={index} />;
    });
  }
  addAccount() {
    return router.push('/new?step1=password');
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
            paddingTop: '2rem',
            paddingBottom: '2rem',
          }}
        >
          <Title style={{ marginTop: 'inherit', marginBottom: 'inherit' }}>H Wallet</Title>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
          >
            <Button
              icon="plus"
              shape="round"
              size="large"
              onClick={this.addAccount}
              style={{ marginRight: '1rem' }}
            >
              Add
            </Button>
            <Dropdown
              overlay={
                <div style={{ opacity: 1, background: '#ffffff' }}>
                  <Radio.Group onChange={this.onChange} value={this.state.value}>
                    {this.props.providerList.map((network: NetWorkItem) => {
                      return <RadioItem network={network} key={network.name} />;
                    })}
                  </Radio.Group>
                </div>
              }
              trigger={['click']}
            >
              <Button icon="setting" shape="round" size="large">
                select
              </Button>
            </Dropdown>
          </div>
        </div>

        <div>{this.renderAccountList()}</div>
      </div>
    );
  }
}

function mapState(state: any) {
  return {
    accounts: state.wallet.accounts,
    providerList: state.network.providerList,
  };
}

function mapDispatch(dispatch: any) {
  return {
    setProvider: (payload: NetWorkItem) => dispatch(createAction('network/setProvider')(payload)),
  };
}

export default connect(
  mapState,
  mapDispatch,
)(Wallet);
