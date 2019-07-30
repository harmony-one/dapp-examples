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

export const NetworkState = ({ url, netWork }) => {
  return (
    <Card
      title="Network"
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
      <ul style={{ margin: 0, padding: 0 }}>
        <li style={styles.listItem}>
          <div>Network: </div>
          <div style={styles.listItemValue}>{netWork}</div>
        </li>
        <li style={styles.listItem}>
          <div>Url: </div>
          <div style={styles.listItemValue}>{url}</div>
        </li>
      </ul>
    </Card>
  );
};
