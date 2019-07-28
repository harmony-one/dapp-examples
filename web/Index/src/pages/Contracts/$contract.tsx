import React, { useEffect, useState } from 'react';

import { connect } from 'dva';

import {
  PageHeader,
  Tag,
  Tabs,
  Button,
  Statistic,
  Modal,
  Row,
  Col,
  Table,
  Divider,
  Card,
  Layout,
} from 'antd';

import { ConnectProps, ConnectState, Dispatch } from '@/models/connect';
import { ContractSol } from '@/models/contract';
import { createAction } from '@/utils/createAction';
import styles from './index.less';

import DeployFormWrapper from './deployForm';

const { TabPane } = Tabs;
const { Content } = Layout;

interface ContractsProps extends ConnectProps {
  contractSols: ContractSol[];
  selectedContract: ContractSol;
  fetchContracts: Function;
  resetNetwork: Function;
}

const Description = ({
  term,
  children,
  span = 12,
}: {
  term: string;
  children: any;
  span?: number;
}) => (
  <Col span={span}>
    <div className={styles.description}>
      <div className={styles.term}>{term}</div>
      <div className={styles.detail}>{children}</div>
    </div>
  </Col>
);

const columns = (
  showCode: (code: string, name: string) => void,
  goToDeploy: (contract: any) => void,
) => [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text: string) => <a href="javascript:;">{text}</a>,
  },
  {
    title: 'Path',
    dataIndex: 'path',
    key: 'path',
  },

  {
    title: 'Action',
    key: 'action',
    render: (text: any, record: ContractSol) => (
      <span>
        <a
          href="javascript:;"
          onClick={e => {
            goToDeploy(record);
          }}
        >
          Deploy {record.name}
        </a>
        <Divider type="vertical" />
        <a
          href="javascript:;"
          onClick={e => {
            showCode(record.code, record.name);
          }}
        >
          Show Code
        </a>
      </span>
    ),
  },
];

const Contract: React.FC<ContractsProps> = ({
  contractSols,
  fetchContracts,
  selectedContract,
  resetNetwork,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  // useEffect(() => {
  //   fetchContracts();
  // }, []);

  console.log({ selectedContract, modalVisible });
  return (
    <div>
      <PageHeader
        onBack={() => window.history.back()}
        title={selectedContract ? selectedContract.name : 'Unkown'}
        subTitle="For Demo Only"
        tags={<Tag color="red">Warning</Tag>}
        extra={[
          <Button key="2" disabled>
            Edit
          </Button>,
          <Button
            key="1"
            type="primary"
            onClick={() => {
              resetNetwork();
              setModalVisible(true);
            }}
          >
            Deploy
          </Button>,
        ]}
      >
        <div className="wrap">
          <div className="content padding">
            <Row>
              <Description term="Author">Unkown</Description>
              <Description term="Save path">
                <a>{selectedContract ? selectedContract.path : 'Unkown'}</a>
              </Description>
              <Description term="Creation Time">Unkown</Description>
              <Description term="Update Time">Unkown</Description>
              <Description term="Description" span={24}>
                Unkown
              </Description>
            </Row>
          </div>
        </div>
      </PageHeader>
      <Layout>
        <Content style={{ margin: '16px 0px' }}>
          <Card>
            <Tabs
              defaultActiveKey="1"
              onChange={e => {
                console.log(e);
              }}
            >
              <TabPane tab="Deploy History" key="1">
                <Table
                  columns={columns(
                    (code, name) => {
                      console.log({ code, name });
                    },
                    () => {
                      console.log('123');
                    },
                  )}
                />
              </TabPane>
            </Tabs>
          </Card>
        </Content>
      </Layout>
      <Modal visible={modalVisible} onCancel={() => setModalVisible(false)} footer={null} centered>
        <DeployFormWrapper />
      </Modal>
    </div>
  );
};

const mapState = ({ contract }: ConnectState) => ({
  contractSols: contract.contractSols,
  selectedContract: contract.selectedContract,
});

const mapDispatch = (dispatch: Dispatch) => ({
  fetchContracts: () => dispatch(createAction('contract/fetchContracts')()),
  resetNetwork: () => dispatch(createAction('contract/resetNetwork')()),
});

export default connect(
  mapState,
  mapDispatch,
)(Contract);
