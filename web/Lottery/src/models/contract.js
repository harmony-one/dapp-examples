import { harmony } from '../service/harmony';
import contractFile from '../service/contractFile';
import { createAction } from '../utils/index';

export default {
  namespace: 'contract',
  state: {
    contractAddress: '0xC09293c153fd34BE07201e661132e091FbB53E62',
    contractBalance: '',
    contract: undefined,
    abi: contractFile.abi,
    manager: '',
  },
  effects: {
    *getContractState({ _ }, { call, put, select }) {
      const contractAddress = yield select(state => state.contract.contractAddress);
      const wallet = yield select(state => state.account.wallet);
      const abi = yield select(state => state.contract.abi);
      const contract = harmony.contracts.createContract(abi, contractAddress);
      contract.connect(wallet);
      const contractBalance = yield harmony.blockchain.getBalance({ address: contractAddress });

      yield put(
        createAction('updateState')({
          contractBalance: harmony.utils.hexToNumber(contractBalance.result),
          contract,
        }),
      );
      yield put(createAction('getContractOnwer')());
    },
    *getContractOwner({ _ }, { call, put, select }) {
      const contract = yield select(state => state.contract.contract);
      const manager = yield contract.methods.manager().call();
      yield put(
        createAction('updateState')({
          manager,
        }),
      );
    },
  },
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
  subscriptions: {
    setup({ history, dispatch }) {
      dispatch(createAction('getContractState')());
    },
  },
};
