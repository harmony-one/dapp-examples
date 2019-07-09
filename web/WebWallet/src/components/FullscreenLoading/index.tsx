import React from 'react';
import { Spin } from 'antd';
export default () => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 999,
        width: '100%',
        height: '100%',
        textAlign: 'center',
        background: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 0,
        margin: 0,
        opacity: 0.8,
      }}
    >
      <Spin size="large" />
    </div>
  );
};
