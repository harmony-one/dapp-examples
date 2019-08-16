import React from 'react';
import { Button } from 'antd';
import { getAddress } from '@harmony-js/crypto';
import styles from './index.css';
import { createAction, connect, router } from '@/utils';

interface ITransactionNext {
  from: string;
  to: string;
  gasLimit: string;
  gasPrice: string;
  value: string;
  makeTxn: Function;
  loading: boolean;
}

class TransactionNext extends React.Component<ITransactionNext> {
  state = {
    loading: false,
  };
  handleSubmit = () => {
    this.setState({ loading: true }, () => {
      this.props.makeTxn({
        from: this.props.from,
        to: this.props.to,
        amount: this.props.value,
        gasLimit: this.props.gasLimit,
        gasPrice: this.props.gasPrice,
      });
      router.push('/send/result');
    });
  };

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.pageTop}>
          <h1>Transaction</h1>
          <Button shape="circle" icon="close" onClick={() => router.go(-2)} />
        </div>
        <div>
          <h2>From</h2>
          <div style={{ marginTop: '1.2rem', marginBottom: '1.2rem' }}>
            {getAddress(this.props.from).bech32}
          </div>
        </div>
        <div>
          <h2>To</h2>
          <div style={{ marginTop: '1.2rem', marginBottom: '1.2rem' }}>
            {getAddress(this.props.to).bech32}
          </div>
        </div>
        <div>
          <h2>Amount</h2>
          <div style={{ marginTop: '1.2rem', marginBottom: '1.2rem' }}>{this.props.value}</div>
        </div>
        <div>
          <h2>Gas Limit</h2>
          <div style={{ marginTop: '1.2rem', marginBottom: '1.2rem' }}>{this.props.gasLimit}</div>
        </div>
        <div>
          <h2>Gas Price</h2>
          <div style={{ marginTop: '1.2rem', marginBottom: '1.2rem' }}>{this.props.gasPrice}</div>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Button
            size="large"
            type="danger"
            block={true}
            style={{ height: '3.8rem', fontSize: '1.6rem', marginRight: '1em' }}
            onClick={() => router.go(-1)}
          >
            Back
          </Button>
          <Button
            size="large"
            type="primary"
            block={true}
            style={{ height: '3.8rem', fontSize: '1.6rem', marginLeft: '1em' }}
            onClick={this.handleSubmit}
          >
            Send
          </Button>
        </div>
      </div>
    );
  }
}

function mapState(state: any) {
  return { ...state.send, loading: state.loading.models.send };
}
function mapDispatch(dispatch: any) {
  return {
    makeTxn: (payload: any) => dispatch(createAction('send/makeTxn')(payload)),
  };
}

export default connect(
  mapState,
  mapDispatch,
)(TransactionNext);
