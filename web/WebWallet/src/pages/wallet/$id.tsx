import React from 'react';
import { Spin, Button, Popover } from 'antd';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Unit } from '@harmony-js/utils';

import { createAction, connect, router } from '@/utils';
import styles from './index.css';
import { getAddress } from '@harmony-js/crypto';

interface IAccount {
  address: string;
  balance: string;
  nonce: number;
  loading: boolean;
  getBalance: Function;
  symbol: string;
}

const PopContent = <span>Address Copied</span>;

class Account extends React.Component<IAccount> {
  state = {
    popVisible: false,
    showBech: true,
  };
  displayAddress(rawAddress: string, showBech: boolean) {
    const address = showBech ? getAddress(rawAddress).bech32 : getAddress(rawAddress).checksum;
    const dot = `...`;
    const start = address.substring(0, 8);
    const tail = address.substring(address.length - 4, address.length);
    return `${start}${dot}${tail}`;
  }
  displayBalance(balance: string) {
    return new Unit(balance)
      .asWei()
      .toEther()
      .substring(0, 22);
  }
  toSend(from: string) {
    router.push(`/send?from=${from}`);
  }
  onCopyClick = () => {
    this.setState({
      popVisible: true,
    });
  };
  handleVisibleChange = (visible: boolean) => {
    this.setState({
      popVisible: visible,
    });
  };
  componentDidMount() {
    this.props.getBalance({ address: this.props.address });
  }

  handleAddressSwitch = () => {
    this.setState({
      showBech: !this.state.showBech,
    });
  };

  copyAddress(rawAddress: string, showBech: boolean) {
    return showBech ? getAddress(rawAddress).bech32 : getAddress(rawAddress).checksum;
  }

  render() {
    return (
      <div className={styles.container}>
        <div style={{ marginTop: '1em', marginBottom: '1em' }}>
          <Button
            icon={'wallet'}
            shape="circle"
            size="large"
            // tslint:disable-next-line: jsx-no-lambda
            onClick={() => router.push('/wallet')}
          />
        </div>
        <div
          className={styles.headerText}
          style={{
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Popover
            placement="right"
            content={PopContent}
            visible={this.state.popVisible}
            onVisibleChange={this.handleVisibleChange}
          >
            <CopyToClipboard
              text={this.copyAddress(this.props.address, this.state.showBech)}
              onCopy={this.onCopyClick}
            >
              <span>{this.displayAddress(this.props.address, this.state.showBech)}</span>
            </CopyToClipboard>
          </Popover>
          <Button icon="swap" size="large" shape="circle" onClick={this.handleAddressSwitch} />
        </div>
        <div className={styles.balanceText}>
          {this.props.loading ? <Spin /> : this.displayBalance(this.props.balance)}
          <div className={styles.TokenName}>{this.props.symbol}</div>
        </div>
        <div className={styles.buttonWrap}>
          <Button
            size="large"
            block={true}
            style={{ margin: '0.6rem', height: '4.0rem', fontSize: '1.4rem' }}
            type="primary"
            ghost={true}
          >
            Deposit
          </Button>
          <Button
            size="large"
            block={true}
            style={{ margin: '0.6rem', height: '4.0rem', fontSize: '1.4rem' }}
            type="primary"
            ghost={true}
            // tslint:disable-next-line: jsx-no-lambda
            onClick={() => this.toSend(this.props.address)}
          >
            Send
          </Button>
        </div>
      </div>
    );
  }
}

function mapState(state: any) {
  return {
    loading: state.loading.global,
    address: state.router.location.pathname.replace('/wallet/', ''),
    balance: state.account.balance,
    nonce: state.account.nonce,
    symbol: state.network.symbol,
  };
}
function mapDispatch(dispatch: any) {
  return {
    getBalance: (payload: any) => dispatch(createAction('account/getBalance')(payload)),
  };
}

export default connect(
  mapState,
  mapDispatch,
)(Account);
