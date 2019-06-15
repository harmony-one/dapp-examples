import React from 'react';
import { connect } from 'dva';
import { getAddress } from '@harmony-js/crypto';
import { createAction } from '../../utils';
import styles from './index.css';

interface DetailProps {
  location: any;
  getBalance: Function;
  balance: string;
}

class Detail extends React.Component<DetailProps> {
  state = {
    address: getAddress(this.props.location.search.replace('?', '')).bech32,
  };
  getBalance() {
    this.props.getBalance(this.state.address);
  }
  componentDidMount() {
    this.getBalance();
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.text}>{this.state.address}</div>
        <div className={styles.text}>{this.props.balance}</div>
      </div>
    );
  }
}

function mapStateToProps({ account }: any) {
  return { balance: account.balance, nonce: account.nonce };
}
function mapDispatchToProps(dispatch: any) {
  return {
    getBalance: (payload: any) => dispatch(createAction('account/getBalance')(payload)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Detail);
