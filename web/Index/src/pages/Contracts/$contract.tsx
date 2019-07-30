import React, { useEffect, useState } from 'react';
import moment from 'moment';

import { connect } from 'dva';

import {
  PageHeader,
  Tag,
  Button,
  Modal,
  Row,
  Col,
  Table,
  Divider,
  Card,
  Layout,
  Steps,
  Spin,
} from 'antd';

import { SortOrder } from 'antd/lib/table';

import { Emitter } from '@harmony-js/network';
import { hexToNumber, Unit } from '@harmony-js/utils';
import { ConnectProps, ConnectState, Dispatch } from '@/models/connect';
import { ContractSol, IContractData, IDefaultContract } from '@/models/contract';
import { createAction } from '@/utils/createAction';
import styles from './index.less';

import DeployFormWrapper from './deployForm';

const { Step } = Steps;
const { Content } = Layout;

interface ContractsProps extends ConnectProps {
  deployedContracts: IContractData[];
  contractSols: ContractSol[];
  selectedContract: ContractSol;
  defaultContract: IDefaultContract;
  emitter: Emitter;
  fetchContracts: Function;
  resetNetwork: Function;
  fetchDeployed: Function;
  setDefaultContract: Function;
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
  setContract: (address: string) => void,
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
            setContract(contract.address);
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
  setDefaultContract,
  defaultContract,
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
        setPendingEmitter({ ...pendingEmitter, transactionHash });
      })
      .on('receipt', (receipt: any) => {
        setPendingEmitter({ ...pendingEmitter, receipt });
      })
      .on('confirmation', (confirmation: any) => {
        setPendingEmitter({ ...pendingEmitter, confirmation });
      })
      .on('error', (error: any) => {
        setPendingEmitter({ ...pendingEmitter, error });
      });
  }

  function showPropsConfirm(content: string, doOk: Function, doCancel?: any) {
    Modal.confirm({
      title: 'Do you wanna set this contract to default?',
      content: `${content}`,
      okText: 'Yes',
      okType: 'primary',
      okButtonProps: {
        disabled: false,
      },
      cancelText: 'No',
      onOk() {
        doOk();
      },
      onCancel() {
        doCancel ? doCancel() : null;
      },
    });
  }
  const columns = getColummProps(
    (address: string) => {
      showPropsConfirm(address, () => setDefaultContract({ name: selectedContract.name, address }));
    },
    () => {},
  );

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
        <Row>
          <Card title="Current Default Contract" style={{ marginTop: '2em' }}>
            <Description term="Owner(Deployer)">
              {defaultContract ? defaultContract.owner : 'Unkown'}
            </Description>
            <Description term="Save path">
              <a>{selectedContract ? selectedContract.path : 'Unkown'}</a>
            </Description>
            <Description term="Deployed Time">
              {defaultContract ? defaultContract.timeStamp : 'Unkown'}
            </Description>
            <Description term="Network">
              {defaultContract ? defaultContract.network.network : 'Unkown'}
            </Description>
            <Description term="Network Url">
              {defaultContract ? defaultContract.network.url : 'Unkown'}
            </Description>
            <Description term="Default Contract" span={24}>
              {defaultContract ? defaultContract.address : 'Unkown'}
            </Description>
          </Card>
        </Row>
      </PageHeader>
      <Layout>
        <Content style={{ margin: '16px 0px' }}>
          <Card title="Histories">
            {emitter ? (
              <Card title="Pending Deployement" style={{ marginBottom: '2em' }}>
                <Steps
                  direction="vertical"
                  status={pendingEmitter.error || undefined}
                  current={
                    pendingEmitter.transactionHash === undefined &&
                    pendingEmitter.confirmation === undefined &&
                    pendingEmitter.receipt === undefined
                      ? 0
                      : pendingEmitter.transactionHash !== undefined &&
                        pendingEmitter.confirmation === undefined &&
                        pendingEmitter.receipt === undefined
                      ? 1
                      : pendingEmitter.transactionHash !== undefined &&
                        pendingEmitter.confirmation !== undefined &&
                        pendingEmitter.receipt === undefined
                      ? 2
                      : pendingEmitter.transactionHash !== undefined &&
                        pendingEmitter.confirmation !== undefined &&
                        pendingEmitter.receipt !== undefined
                      ? 3
                      : 0
                  }
                >
                  <Step title="Transaction Hash" description={pendingEmitter.transactionHash} />
                  <Step
                    title="Confirmation"
                    description={
                      pendingEmitter.confirmation ? (
                        pendingEmitter.confirmation
                      ) : (
                        <Spin size="large" />
                      )
                    }
                  />
                  <Step
                    title="Receipt"
                    description={
                      <div>
                        <Description term="Contract Address">
                          {pendingEmitter.receipt ? pendingEmitter.receipt.contractAddress : null}
                        </Description>
                        <Description term="Gas Used">
                          {pendingEmitter.receipt
                            ? `${new Unit(hexToNumber(pendingEmitter.receipt.gasUsed))
                                .asWei()
                                .toEther()} Ether`
                            : null}
                        </Description>
                      </div>
                    }
                  />
                </Steps>
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
  defaultContract: contract.defaultContract,
  emitter: contract.emitter,
});

const mapDispatch = (dispatch: Dispatch) => ({
  fetchContracts: () => dispatch(createAction('contract/fetchContracts')()),
  resetNetwork: () => dispatch(createAction('contract/resetNetwork')()),
  fetchDeployed: (payload: string) => dispatch(createAction('contract/fetchDeployed')(payload)),
  setDefaultContract: (payload: any) =>
    dispatch(createAction('contract/setDefaultContract')(payload)),
});

export default connect(
  mapState,
  mapDispatch,
)(Contract);
