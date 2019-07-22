import { Button } from 'antd';
import { router } from '../utils';
import styles from './index.css';

function BasicLayout(props) {
  return (
    <div className={styles.normal}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1.6em 2em',
          width: '28em',
        }}
      >
        <div style={{ fontSize: '2.8em', color: '#ffffff' }}>GambleIt!</div>
        <Button
          icon="home"
          size="large"
          shape="circle"
          onClick={() => {
            router.push('/');
          }}
        ></Button>
      </div>
      {props.children}
    </div>
  );
}

export default BasicLayout;
