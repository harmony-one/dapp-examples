import React from 'react';

import { connect } from 'dva';
import Mne from './mne';
import Password from './password';
import Key from './key';
import router from 'umi/router';

import styles from './index.css';

interface INewWallet {
  location: any;
}

class newWallet extends React.Component<INewWallet> {
  render() {
    const { location } = this.props;
    const { step1, create } = location.query;

    return (
      <div className={styles.container}>
        <div>new wallet</div>
        {step1 === 'mne' ? (
          <Mne generateOnStart={create} nextRoute={`/new/password`} />
        ) : step1 === 'key' ? (
          <Key nextRoute={`/new/password`} />
        ) : (
          <Password nextRoute={`/wallet`} />
        )}
      </div>
    );
  }
}

function mapState(state: any) {
  return {};
}

function mapDispatch() {
  return {};
}

export default connect(
  mapState,
  mapDispatch,
)(newWallet);
