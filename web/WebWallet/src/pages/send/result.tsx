import React from 'react';
import { Spin } from 'antd';
import { Emitter } from '@harmony-js/network';
import { createAction, connect, router } from '@/utils';

interface ITransactionResult {
  emitter: Emitter;
  onTransactionHash: Function;
  onReceipt: Function;
}

class TransactionResult extends React.Component<ITransactionResult> {
  componentDidUpdate() {
    this.props.emitter
      .on('transactionHash', (transactionHash: any) => {
        console.log(transactionHash);
        this.props.onTransactionHash({ transactionHash });
      })
      .on('receipt', (receipt: any) => {
        console.log(receipt);
        this.props.onReceipt({ receipt });
      });
  }
  render() {
    return (
      <div>
        <div>result</div>
      </div>
    );
  }
}

function mapState(state: any) {
  console.log(state.send);
  return {
    emitter: state.send.emitter,
  };
}
function mapDispatch(dispatch: any) {
  return {
    onTransactionHash: (payload: any) => dispatch(createAction('send/onTransactionHash')(payload)),
    onReceipt: (payload: any) => dispatch(createAction('send/onReceipt')(payload)),
  };
}

export default connect(
  mapState,
  mapDispatch,
)(TransactionResult);
