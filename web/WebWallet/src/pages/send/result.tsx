import React from 'react';
import { Spin, Button } from 'antd';
import { Emitter } from '@harmony-js/network';
import { getAddress } from '@harmony-js/crypto';
import { TransasctionReceipt } from '@harmony-js/transaction';
import { hexToNumber, Unit, isValidAddress } from '@harmony-js/utils';
import { createAction, connect, router } from '@/utils';
import styles from './index.css';

interface ITransactionResult {
  emitter: Emitter;
  hash: undefined | string;
  receipt: undefined | TransasctionReceipt;
  confirmation: undefined | string;
  onTransactionHash: Function;
  onReceipt: Function;
  onConfirmation: Function;
  from: string;
  to: string;
  value: string;
  gasLimit: string;
  gasPrice: string;
  symbol: string;
}

const ListItem = ({ title, value }: { title: string; value: any }): JSX.Element => {
  return (
    <div>
      <h2>{title}</h2>
      <div style={{ marginTop: '1.2rem', marginBottom: '1.2rem' }}>{value}</div>
    </div>
  );
};

class TransactionResult extends React.Component<ITransactionResult> {
  componentDidUpdate() {
    this.props.emitter
      .on('transactionHash', (transactionHash: any) => {
        this.props.onTransactionHash({ transactionHash });
      })
      .on('receipt', (receipt: any) => {
        this.props.onReceipt({ receipt });
      })
      .on('confirmation', (confirmation: any) => {
        this.props.onConfirmation({ confirmation });
      });
  }
  countFee(cumulativeGasUsed: string, gasPrice: string) {
    const gasBN = new Unit(hexToNumber(cumulativeGasUsed)).asWei().toWei();
    const gasPriceBN = new Unit(gasPrice).asWei().toWei();
    return new Unit(gasBN.mul(gasPriceBN))
      .asWei()
      .toEther()
      .toString();
  }
  displayBalance(balance: string) {
    return new Unit(balance).asEther().toEther();
  }
  displayAddress(address: string) {
    const dot = `...`;
    const start = address.substring(0, 8);
    const tail = address.substring(address.length - 4, address.length);
    return `${start}${dot}${tail}`;
  }
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.pageTop}>
          <Button
            shape="circle"
            icon="wallet"
            size="large"
            // tslint:disable-next-line: jsx-no-lambda
            onClick={() => router.push('/wallet')}
          />
          <Button
            shape="circle"
            icon="close"
            size="large"
            // tslint:disable-next-line: jsx-no-lambda
            onClick={() => router.goBack()}
          />
        </div>
        <h1 style={{ marginTop: '1em' }}>Transaction Status</h1>
        <ListItem
          title="From"
          value={
            this.props.from && isValidAddress(this.props.from)
              ? getAddress(this.props.from).bech32
              : ''
          }
        />
        <ListItem
          title="To"
          value={
            this.props.to && isValidAddress(this.props.to) ? getAddress(this.props.to).bech32 : ''
          }
        />
        <ListItem
          title="Amount"
          value={`${this.displayBalance(`${this.props.value}`)} ${this.props.symbol}`}
        />
        <ListItem
          title="Hash"
          value={this.props.hash ? this.displayAddress(this.props.hash) : <Spin />}
        />
        <ListItem
          title="Fee"
          value={
            this.props.receipt ? (
              `${this.countFee(this.props.receipt.gasUsed, this.props.gasPrice)} ${
                this.props.symbol
              }`
            ) : (
              <Spin />
            )
          }
        />
        <ListItem
          title="Status"
          value={this.props.confirmation ? this.props.confirmation : <Spin />}
        />

        <Button
          size="large"
          type="primary"
          block={true}
          style={{ height: '3.8rem', fontSize: '1.6rem' }}
          // tslint:disable-next-line: jsx-no-lambda
          onClick={() => {
            router.go(-3);
          }}
        >
          Close
        </Button>
      </div>
    );
  }
}

function mapState(state: any) {
  return {
    emitter: state.send.emitter,
    hash: state.send.hash,
    receipt: state.send.receipt,
    confirmation: state.send.confirmation,
    from: state.send.from,
    to: state.send.to,
    value: state.send.value,
    gasLimit: state.send.gasLimit,
    gasPrice: state.send.gasPrice,
    symbol: state.network.symbol,
  };
}
function mapDispatch(dispatch: any) {
  return {
    onTransactionHash: (payload: any) => dispatch(createAction('send/onTransactionHash')(payload)),
    onReceipt: (payload: any) => dispatch(createAction('send/onReceipt')(payload)),
    onConfirmation: (payload: any) => dispatch(createAction('send/onConfirmation')(payload)),
  };
}

export default connect(
  mapState,
  mapDispatch,
)(TransactionResult);
