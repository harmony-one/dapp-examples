import React from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

import { ConnectProps, ConnectState, Dispatch } from '@/models/connect';

import { createAction } from '@/utils/createAction';

interface WelcomeProps extends ConnectProps {}

const Welcome: React.FC<WelcomeProps> = () => (
  <PageHeaderWrapper>
    <p style={{ textAlign: 'center' }}>
      Want to add more pages? Please refer to{' '}
      <a href="https://pro.ant.design/docs/block-cn" target="_blank" rel="noopener noreferrer">
        use block
      </a>
      。
    </p>
  </PageHeaderWrapper>
);

const mapState = ({ contract }: ConnectState) => ({
  contractSols: contract.contractSols,
});

const mapDispatch = (dispatch: Dispatch) => ({
  fetchContracts: () => dispatch(createAction('contract/fetchContracts')()),
});

export default connect(
  mapState,
  mapDispatch,
)(Welcome);
