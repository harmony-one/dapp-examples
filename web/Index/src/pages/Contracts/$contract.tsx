import React, { useEffect, useState } from 'react';
import moment from 'moment';

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
  Steps,
} from 'antd';

import { SortOrder } from 'antd/lib/table';

import { Emitter } from '@harmony-js/network';
import { ConnectProps, ConnectState, Dispatch } from '@/models/connect';
import { ContractSol, IContractData } from '@/models/contract';
import { createAction } from '@/utils/createAction';
import styles from './index.less';

import DeployFormWrapper from './deployForm';

const { Step } = Steps;
const { Content } = Layout;

interface ContractsProps extends ConnectProps {
  deployedContracts: IContractData[];
  contractSols: ContractSol[];
  selectedContract: ContractSol;
  emitter: Emitter;
  fetchContracts: Function;
  resetNetwork: Function;
  fetchDeployed: Function;
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

const mockContract = [
  {
    transactionHash: '0x1231231',
    owner: '0x123123',
    address: '0x123123',
    network: 'ganache',
    receipt: {},
    status: 'DEPLOYED',
    timeStamp: '2019-07-28T15:53:19.122Z',
  },
  {
    transactionHash: '0x1231232',
    owner: '0x123123',
    address: '0x123123',
    network: 'ganache',
    receipt: {},
    status: 'DEPLOYED',
    timeStamp: '2019-07-26T15:53:19.122Z',
  },
  {
    transactionHash: '0x12312324',
    owner: '0x123123',
    address: '0x123123',
    network: 'ganache',
    receipt: {},
    status: 'DEPLOYED',
    timeStamp: '2019-07-27T15:53:19.122Z',
  },
];

interface OrderType {
  ascend: SortOrder;
  descend: SortOrder;
}

const Orders: OrderType = {
  ascend: 'ascend',
  descend: 'descend',
};

function compareResult(a: IContractData, b: IContractData, SortOrder: SortOrder = 'descend') {
  const comp = moment(new Date(a.timeStamp)).isBefore(moment(new Date(b.timeStamp)));
  const comp2 = moment(new Date(a.timeStamp)).isAfter(moment(new Date(b.timeStamp)));
  if (SortOrder === 'ascend') {
    return comp2 ? 1 : -1;
  }
  if (SortOrder === 'descend') {
    return comp ? -1 : 1;
  }
  return comp ? -1 : 1;
}

//   a.transactionHash.length > b.transactionHash.length,

const getColummProps = (
  setContract: (address: string, network: any, abi: any, bin: string) => void,
  showReceipt: (receipt: any) => void,
) => [
  {
    title: 'Time',
    dataIndex: 'timeStamp',
    key: 'timeStamp',
    render: (timeStamp: string) => <span>{timeStamp}</span>,
    sorter: compareResult,
    // sortOrder: 'descend',
    defaultSortOrder: Orders.descend,
    // sortDirections: [<SortOrder>'descend', 'ascend'],
  },
  {
    title: 'Hash',
    dataIndex: 'transactionHash',
    key: 'transactionHash',
    render: (transactionHash: string) => (
      <a href="javascript:;">{`${transactionHash.substring(0, 4)}...`}</a>
    ),
  },
  {
    title: 'Network',
    dataIndex: 'network',
    key: 'network',
    render: (network: any) => <a href="javascript:;">{`${network.network}`}</a>,
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
    render: (address: string) => <a href="javascript:;">{`${address.substring(0, 4)}...`}</a>,
  },
  {
    title: 'Owner',
    dataIndex: 'owner',
    key: 'owner',
    render: (owner: string) => <a href="javascript:;">{`${owner.substring(0, 4)}...`}</a>,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => <a href="javascript:;">{status}</a>,
  },
  {
    title: 'Action',
    key: 'action',
    render: (text: any, contract: any) => (
      <span>
        <a
          href="javascript:;"
          onClick={e => {
            showReceipt(contract.receipt);
          }}
        >
          Show Receipt
        </a>
        <Divider type="vertical" />
        <a
          href="javascript:;"
          onClick={e => {
            setContract(contract.address, contract.network, contract.abi, contract.bin);
          }}
        >
          Set Contract
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
  emitter,
  fetchDeployed,
  deployedContracts,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  interface IPendingEmitter {
    transactionHash?: string;
    receipt?: any;
    confirmation?: any;
    error?: any;
  }
  const InitalPendingEmitter: IPendingEmitter = {
    transactionHash: undefined,
    receipt: undefined,
    confirmation: undefined,
    error: undefined,
  };
  const [pendingEmitter, setPendingEmitter] = useState(InitalPendingEmitter);
  useEffect(() => {
    if (selectedContract) fetchDeployed(selectedContract.name);
  }, []);

  if (emitter) {
    emitter
      .on('transactionHash', (transactionHash: string) => {
        console.log('We got Transaction Hash', transactionHash);
        setPendingEmitter({ ...pendingEmitter, transactionHash });
      })
      .on('receipt', (receipt: any) => {
        console.log('We got transaction receipt', receipt);
        setPendingEmitter({ ...pendingEmitter, receipt });
      })
      .on('confirmation', (confirmation: any) => {
        console.log('The transaction is', confirmation);
        setPendingEmitter({ ...pendingEmitter, confirmation });
      })
      .on('error', (error: any) => {
        console.log('Something wrong happens', error);
        setPendingEmitter({ ...pendingEmitter, error });
      });
  }

  const columns = getColummProps(() => {}, () => {});

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
          <Card title="Histories">
            {emitter ? (
              <Card title="Pending Deployement">
                <Steps direction="vertical" current={1}>
                  <Step title="Finished" description="This is a description." />
                  <Step title="In Progress" description="This is a description." />
                  <Step title="Waiting" description="This is a description." />
                </Steps>
                <div>{pendingEmitter.transactionHash}</div>
                <div>{pendingEmitter.confirmation}</div>
                <div>{JSON.stringify(pendingEmitter.receipt)}</div>
                <div>{JSON.stringify(pendingEmitter.error)}</div>
              </Card>
            ) : null}

            <Table columns={columns} dataSource={deployedContracts} rowKey="transactionHash" />
          </Card>
        </Content>
      </Layout>
      <Modal visible={modalVisible} onCancel={() => setModalVisible(false)} footer={null} centered>
        <DeployFormWrapper onSubmit={() => setModalVisible(false)} />
      </Modal>
    </div>
  );
};

const mapState = ({ contract }: ConnectState) => ({
  contractSols: contract.contractSols,
  selectedContract: contract.selectedContract,
  deployedContracts: contract.deployedContracts,
  emitter: contract.emitter,
});

const mapDispatch = (dispatch: Dispatch) => ({
  fetchContracts: () => dispatch(createAction('contract/fetchContracts')()),
  resetNetwork: () => dispatch(createAction('contract/resetNetwork')()),
  fetchDeployed: (payload: string) => dispatch(createAction('contract/fetchDeployed')(payload)),
});

export default connect(
  mapState,
  mapDispatch,
)(Contract);
