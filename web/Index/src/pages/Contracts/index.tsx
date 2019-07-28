import React, { useEffect, useState } from 'react';
import AceEditor from 'react-ace';
import { connect } from 'dva';

import 'brace/mode/java';
import 'brace/theme/github';

import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Table, Divider, Modal } from 'antd';
import router from 'umi/router';

import { ConnectProps, ConnectState, Dispatch } from '@/models/connect';
import { ContractSol } from '@/models/contract';
import { createAction } from '@/utils/createAction';

interface ContractsProps extends ConnectProps {
  contractSols: ContractSol[];
  fetchContracts: Function;
  selectContract: Function;
}

const columns = (
  showCode: (code: string, name: string) => void,
  goToDeploy: (contract: ContractSol) => void,
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
          Detail
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

const Contracts: React.FC<ContractsProps> = ({ contractSols, fetchContracts, selectContract }) => {
  const [modalInfo, setModalInfo] = useState({ modalVisible: false, code: '', name: '' });

  useEffect(() => {
    fetchContracts();
  }, []);

  const popModal = (code: string, name: string) => setModalInfo({ modalVisible: true, code, name });
  const goToDeploy = (contract: ContractSol) => {
    selectContract(contract);
    router.push(`/Contracts/detail?name=${contract.name}`);
  };

  return (
    <PageHeaderWrapper>
      <Table columns={columns(popModal, goToDeploy)} dataSource={contractSols} />
      <Modal
        visible={modalInfo.modalVisible}
        title={`Contract: ${modalInfo.name}`}
        onOk={() => setModalInfo({ modalVisible: false, code: '', name: '' })}
        onCancel={() => setModalInfo({ modalVisible: false, code: '', name: '' })}
        width={860}
        footer={null}
      >
        <AceEditor
          mode="java"
          theme="github"
          // onChange={onChange}
          name="UNIQUE_ID_OF_DIV"
          editorProps={{ $blockScrolling: true }}
          fontSize={14}
          showPrintMargin
          showGutter
          highlightActiveLine
          height="520px"
          width="100%"
          value={modalInfo.code}
          setOptions={{
            enableBasicAutocompletion: false,
            enableLiveAutocompletion: false,
            enableSnippets: false,
            showLineNumbers: true,
            tabSize: 2,
          }}
        />
      </Modal>
    </PageHeaderWrapper>
  );
};

const mapState = ({ contract }: ConnectState) => ({
  contractSols: contract.contractSols,
});

const mapDispatch = (dispatch: Dispatch) => ({
  fetchContracts: () => dispatch(createAction('contract/fetchContracts')()),
  selectContract: (payload: ContractSol) =>
    dispatch(createAction('contract/selectContract')(payload)),
});

export default connect(
  mapState,
  mapDispatch,
)(Contracts);
