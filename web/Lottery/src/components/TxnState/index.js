import { Unit, hexToNumber } from '@harmony-js/utils';
import { Card, Spin } from 'antd';

const styles = {
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 0,
    fontSize: '1.2em',
  },
  listItemValue: {
    color: '#3399ff',
  },
};

function displayAddress(address) {
  const dot = `...`;
  const start = address.substring(0, 8);
  const tail = address.substring(address.length - 4, address.length);
  return `${start}${dot}${tail}`;
}

function countFee(cumulativeGasUsed) {
  const gasBN = new Unit(hexToNumber(cumulativeGasUsed)).asWei().toWei();
  const gasPriceBN = new Unit('100').asGwei().toWei();
  return new Unit(gasBN.mul(gasPriceBN))
    .asWei()
    .toEther()
    .toString();
}

const Hide = ({ onPress }) => {
  return (
    <div style={{ color: '#dddddd', fontSize: '1.2em', textDecoration: 'none' }} onClick={onPress}>
      Hide
    </div>
  );
};

const TxnState = ({ visible, txnHash, confirmation, receipt, onPress }) => {
  if (visible) {
    return (
      <Card
        title="Transaction"
        style={{
          borderRadius: '1em',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          // alignItems: 'flex-start',
          margin: '1em',
          width: '100%',
        }}
        headStyle={{
          fontSize: '1.6em',
          textAlign: 'left',
        }}
        bodyStyle={{
          width: '100%',
          padding: '1.6em',
        }}
        extra={<Hide onPress={onPress} />}
      >
        <ul style={{ margin: 0, padding: 0 }}>
          <li style={styles.listItem}>
            <div>Hash: </div>
            <div style={styles.listItemValue}>
              <a href={`https://ropsten.etherscan.io/tx/${txnHash}`}>{displayAddress(txnHash)}</a>
            </div>
          </li>
          <li style={styles.listItem}>
            <div>Status: </div>
            <div style={styles.listItemValue}>
              {confirmation !== undefined ? confirmation : <Spin />}
            </div>
          </li>
          <li style={styles.listItem}>
            <div>Fee: </div>
            <div style={styles.listItemValue}>
              {confirmation !== undefined ? `${countFee(receipt.cumulativeGasUsed)} ONE` : <Spin />}
            </div>
          </li>
        </ul>
      </Card>
    );
  } else {
    return null;
  }
};

export { TxnState };
