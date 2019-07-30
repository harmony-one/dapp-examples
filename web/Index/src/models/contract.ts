import { Effect, Subscription } from 'dva';
import { Reducer } from 'redux';

import { Contract } from '@harmony-js/contract';
import {
  queryContracts,
  querySol,
  getAbiBin,
  saveDeployed,
  getDeployed,
  setDefaultContract,
  readDefaultContract,
} from '@/services/contract';

import { Harmony, getNetworkSetting, Emitter } from '@/services/harmony';

export function logOutput(title: string, content: any) {
  console.log('---------------------------------------------------------------------');
  console.log(`==> Log: ${title}`);
  console.log('---------------------------------------------------------------------');
  console.log();
  console.log(content);
  console.log();
}

export interface IContractData {
  transactionHash: string;
  owner: string;
  address: string;
  network: any;
  receipt: any;
  status: string;
  timeStamp: string;
}

export interface IDefaultContract extends IContractData {
  abi: any;
  bin: string;
}

export interface ContractPath {
  path: string;
}

export interface ContractSol {
  [key: string]: string;
  name: string;
  code: string;
  path: string;
  key: string;
}

export interface ContractModelState {
  contracts?: ContractPath[];
  contractSols?: ContractSol[];
  selectedContract?: ContractSol;
  accountBalance?: string;
  deployedContracts?: IContractData[];
  defaultContract?: IDefaultContract;
  emitter?: Emitter;
}

export interface ContractModelType {
  namespace: 'contract';
  state: ContractModelState;
  effects: {
    fetchContracts: Effect;
    fetchSol: Effect;
    selectContract: Effect;
    fetchAccountBalance: Effect;
    resetNetwork: Effect;
    setupDeploy: Effect;
    fetchDeployed: Effect;
    findContract: Effect;
    setDefaultContract: Effect;
    readDefaultContract: Effect;
  };
  reducers: {
    saveCurrentContracts: Reducer<ContractModelState>;
    saveCurrentSol: Reducer<ContractModelState>;
    updateState: Reducer<ContractModelState>;
  };
  subscriptions: { setup: Subscription };
}

const ContractModel: ContractModelType = {
  namespace: 'contract',
  state: {
    contracts: [],
    contractSols: [],
    deployedContracts: [],
    selectedContract: undefined,
    accountBalance: '',
  },

  effects: {
    *fetchContracts({ payload }, { call, put }) {
      const response = yield call(queryContracts);
      yield put({
        type: 'saveCurrentContracts',
        payload: response,
      });
      if (payload) {
        yield put({
          type: 'fetchSol',
          payload: { select: payload.select },
        });
        yield put({
          type: 'readDefaultContract',
          payload: payload.select,
        });
      } else {
        yield put({
          type: 'fetchSol',
        });
      }
    },
    *fetchSol({ payload }, { call, put, select }) {
      const contracts: ContractPath[] = yield select((state: any) => state.contract.contracts);
      const contractSols = [];
      for (const contract of contracts) {
        const name = Object.keys(contract)[0];
        const code = yield call(querySol, Object.keys(contract)[0]);
        const { path } = contract[name];
        contractSols.push({ name, code, path, key: name });
      }

      yield put({
        type: 'saveCurrentSol',
        payload: contractSols,
      });

      if (payload && payload.select) {
        yield put({
          type: 'findContract',
          payload: payload.select,
        });
      }
    },
    *fetchDeployed({ payload }, { call, put, select }) {
      const deployedContracts = yield getDeployed(payload);
      yield put({ type: 'updateState', payload: { deployedContracts } });
    },

    *setupDeploy({ payload }, { call, put, select }) {
      const selectedContract: ContractSol = yield select(
        (state: any) => state.contract.selectedContract,
      );
      const { amount, from, gasLimit, gasPrice, network } = payload;
      const { url, chainId, chainType } = getNetworkSetting(network);
      const harmony = new Harmony(url, { chainId, chainType, chainUrl: url });
      const prv = from;
      const owner = harmony.wallet.addByPrivateKey(prv);

      const txnObj: any = {
        gasLimit: new harmony.utils.Unit(gasLimit).asWei().toWei(),
        gasPrice: new harmony.utils.Unit(gasPrice).asWei().toWei(),
      };
      if (amount) {
        txnObj.value = new harmony.utils.Unit(amount).asEther().toWei();
      }

      const { abi, bin } = yield getAbiBin(selectedContract.name);
      const toDeploy = harmony.contracts.createContract(abi);
      const emitter: Emitter = toDeploy
        .deploy({
          data: `0x${bin}`,
          arguments: [],
        })
        .send(txnObj);
      yield put({
        type: 'updateState',
        payload: {
          emitter,
        },
      });
      const resolved: Contract = yield emitter;

      const saveDeployedPayload: IContractData = {
        transactionHash: resolved.transaction ? resolved.transaction.txParams.id : '',
        owner: owner.checksumAddress,
        address: resolved.address,
        network: { url, chainId, chainType, network },
        receipt: resolved.transaction ? resolved.transaction.receipt : {},
        status: resolved.status,
        timeStamp: new Date().toJSON(),
      };
      const savePayload = JSON.stringify(saveDeployedPayload);
      const contractName = selectedContract.name;
      yield saveDeployed(contractName, savePayload);
      yield put({ type: 'fetchDeployed', payload: contractName });
    },
    *findContract({ payload }, { call, put, select }) {
      const contractSols: ContractSol[] = yield select((state: any) => state.contract.contractSols);
      const foundSol = contractSols.find(value => value.name === payload);
      yield put({ type: 'selectContract', payload: foundSol });
    },
    *selectContract({ payload }, { call, put, select }) {
      yield put({ type: 'updateState', payload: { emitter: undefined } });
      yield put({
        type: 'updateState',
        payload: {
          selectedContract: payload,
        },
      });
    },
    *setDefaultContract({ payload }, { call, put, select }) {
      const { name, address } = payload;
      if (name !== undefined && address !== undefined) {
        yield call(setDefaultContract, name, address);
        yield put({ type: 'readDefaultContract', payload: name });
      }
    },
    *readDefaultContract({ payload }, { call, put, select }) {
      const defaultContract: IDefaultContract = yield call(readDefaultContract, payload);
      yield put({
        type: 'updateState',
        payload: {
          defaultContract,
        },
      });
    },
    *fetchAccountBalance({ payload }, { put }) {
      const { network, accountAddress } = payload;
      const { url, chainId, chainType } = getNetworkSetting(network);

      try {
        const harmony = new Harmony(url, { chainId, chainType, chainUrl: url });
        const balance = yield harmony.blockchain.getBalance({ address: accountAddress });
        if (balance.result) {
          const accountBalance = new harmony.utils.Unit(harmony.utils.hexToNumber(balance.result))
            .asWei()
            .toEther();

          yield put({
            type: 'updateState',
            payload: {
              accountBalance,
            },
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
    *resetNetwork(_, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          accountBalance: undefined,
        },
      });
    },
  },

  reducers: {
    saveCurrentContracts(state, { payload }) {
      return {
        ...state,
        contracts: payload || [],
      };
    },
    saveCurrentSol(state, { payload }) {
      return {
        ...state,
        contractSols: payload || '',
      };
    },

    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
  subscriptions: {
    setup({ history, dispatch }): void {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      history.listen(({ pathname, search }): void => {
        if (pathname === '/Contracts/detail' && search.startsWith('?name=')) {
          const name = search.substring(6);
          dispatch({ type: 'fetchContracts', payload: { select: name } });
          dispatch({ type: 'updateState', payload: { emitter: undefined } });
        }
      });
    },
  },
};

export default ContractModel;
