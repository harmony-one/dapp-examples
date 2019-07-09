import React from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Typography, Affix, Button } from 'antd';
import { AccountCard } from '../../components';
import styles from './index.css';

const { Title } = Typography;

interface IWallet {
  accounts: any[];
}

class Wallet extends React.Component<IWallet> {
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
          <Button icon="plus" shape="round" size="large" onClick={this.addAccount}>
            Add
          </Button>
        </div>

        <div>{this.renderAccountList()}</div>
      </div>
    );
  }
}

function mapState(state: any) {
  return {
    accounts: state.wallet.accounts,
  };
}

function mapDispatch(dispatch: any) {
  return {};
}

export default connect(
  mapState,
  mapDispatch,
)(Wallet);
