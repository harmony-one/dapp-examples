import { Unit } from '@harmony-js/utils';
import { Card } from 'antd';

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

const Refresh = ({ onPress }) => {
  return (
    <div style={{ color: '#dddddd', fontSize: '1.2em', textDecoration: 'none' }} onClick={onPress}>
      Refresh
    </div>
  );
};

const AccountState = ({ accountBalance, accountType, accountAddress, onPress }) => {
  const displayBalance = new Unit(accountBalance).asWei().toEther();

  return (
    <Card
      title="Account"
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
      extra={<Refresh onPress={onPress} />}
    >
      <ul style={{ margin: 0, padding: 0 }}>
        <li style={styles.listItem}>
          <div>Account Address: </div>
          <div style={styles.listItemValue}>{displayAddress(accountAddress)}</div>
        </li>
        <li style={styles.listItem}>
          <div>Account Type: </div>
          <div style={styles.listItemValue}>{accountType}</div>
        </li>
        <li style={styles.listItem}>
          <div>Balance: </div>
          <div style={styles.listItemValue}>{`${displayBalance} ONE`}</div>
        </li>
      </ul>
    </Card>
  );
};

export { AccountState };
