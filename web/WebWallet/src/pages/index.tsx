import React from 'react';
import { Input } from 'antd';
import { connect } from 'dva';
import Link from 'umi/link';
import styles from './index.css';

const RenderButton = (props: any) => {
  if (props.length > 0)
    return (
      <div className={styles.text}>
        <Input.Password placeholder="input password" size="large" />
      </div>
    );
  return (
    <div className={styles.button}>
      <Link to="/new">Create One</Link>
    </div>
  );
};

const Index: React.FC = ({ wallet }: any) => {
  return (
    <div className={styles.container}>
      <div className={styles.brand}>Wallet H</div>
      <RenderButton length={wallet.accounts.length} />
    </div>
  );
};

function mapStateToProps({ global }: any) {
  return { wallet: global.harmony.wallet };
}

export default connect(mapStateToProps)(Index);
