import { Unit } from '@harmony-js/utils';
import { Card } from 'antd';
import styles from './index.css';

function displayAddress(address) {
  const dot = `...`;
  const start = address.substring(0, 8);
  const tail = address.substring(address.length - 4, address.length);
  return `${start}${dot}${tail}`;
}

const ContractState = ({ contractAddress, players, contractBalance }) => {
  const displayContractBalance = new Unit(contractBalance).asWei().toEther();
  return (
    <Card
      title="Contract"
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
    >
      <ul style={{ margin: 0, padding: 0, width: '100%' }}>
        <li
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <div style={{ fontSize: '1.2em' }}>Game Address :</div>
          <div>
            <a
              href={`https://ropsten.etherscan.io/address/${contractAddress}`}
              className={styles.link}
            >
              {displayAddress(contractAddress)}
            </a>
          </div>
        </li>
        <li
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <div style={{ fontSize: '1.2em' }}>Players In game :</div>
          <div style={{ fontSize: '1.2em', color: '#3399ff' }}>{players.length}</div>
        </li>
        <li
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <div style={{ fontSize: '1.2em' }}>Current Game Balance :</div>
          <div
            style={{ fontSize: '1.2em', color: '#3399ff' }}
          >{`${displayContractBalance} ONE`}</div>
        </li>
      </ul>
    </Card>
  );
};

export { ContractState };
