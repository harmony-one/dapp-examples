import React from 'react';
import { createAction, connect } from '@/utils';
import styles from './index.css';

const BasicLayout: React.FC = props => {
  return (
    <div className={styles.normal}>
      <h1 className={styles.title}>Welcome to Faucet!</h1>
      {props.children}
    </div>
  );
};

export default BasicLayout;
