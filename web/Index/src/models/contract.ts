import { Effect } from 'dva';
import { Reducer } from 'redux';

import { queryContracts, querySol, getAbiBin } from '@/services/contract';

import { Harmony, getNetworkSetting, Emitter } from '@/services/harmony';

export function logOutput(title: string, content: any) {
  console.log('---------------------------------------------------------------------');
  console.log(`==> Log: ${title}`);
  console.log('---------------------------------------------------------------------');
  console.log();
  console.log(content);
  console.log();
}

export interface ContractPath {
  path: string;
}

export interface Contract {
  [key: string]: ContractPath;
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
  };
  reducers: {
    saveCurrentContracts: Reducer<ContractModelState>;
    saveCurrentSol: Reducer<ContractModelState>;
    updateState: Reducer<ContractModelState>;
  };
}

const ContractModel: ContractModelType = {
  namespace: 'contract',
  state: {
    contracts: [],
    contractSols: [],
    selectedContract: undefined,
    accountBalance: '',
  },

  effects: {
    *fetchContracts(_, { call, put }) {
      const response = yield call(queryContracts);
      yield put({
        type: 'saveCurrentContracts',
        payload: response,
      });
      yield put({
        type: 'fetchSol',
      });
    },
    *fetchSol(_, { call, put, select }) {
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
    },

    *setupDeploy({ payload }, { call, put, select }) {
      const selectedContract: ContractSol = yield select(
        (state: any) => state.contract.selectedContract,
      );
      const { amount, from, gasLimit, gasPrice, network } = payload;
      const { url, chainId, chainType } = getNetworkSetting(network);
      const harmony = new Harmony(url, { chainId, chainType, chainUrl: url });
      const prv = from;
      harmony.wallet.addByPrivateKey(prv);

      const txnObj: any = {
        gasLimit: new harmony.utils.Unit(gasLimit).asWei().toWei(),
        gasPrice: new harmony.utils.Unit(gasPrice).asGwei().toWei(),
      };
      if (amount) {
        txnObj.value = new harmony.utils.Unit(amount).asEther().toWei();
      }

      const { abi, bin } = yield getAbiBin(selectedContract.name);
      const toDeploy = harmony.contracts.createContract(abi);
      const emitter = yield toDeploy
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
    },

    *selectContract({ payload }, { call, put, select }) {
      yield put({
        type: 'updateState',
        payload: {
          selectedContract: payload,
        },
      });
    },
    *fetchAccountBalance({ payload }, { put }) {
      const { network, accountAddress } = payload;
      const { url, chainId, chainType } = getNetworkSetting(network);
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
};

export default ContractModel;
