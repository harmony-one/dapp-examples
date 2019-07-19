import { harmony } from '../service/harmony';
import contractFile from '../service/contractFile';
import { createAction } from '../utils/index';
import { Contract } from '@harmony-js/contract';
import { ContractStatus } from '@harmony-js/contract/dist/utils/status';

export default {
  namespace: 'contract',
  state: {
    contractAddress: '0xC09293c153fd34BE07201e661132e091FbB53E62',
    contractBalance: '',
    contract: undefined,
    abi: contractFile.abi,
    manager: '',
    players: [],
  },
  effects: {
    *getContractState({ _ }, { call, put, select }) {
      const contractAddress = yield select(state => state.contract.contractAddress);
      const wallet = yield select(state => state.account.wallet);
      const abi = yield select(state => state.contract.abi);
      // const contract = harmony.contracts.createContract(abi, contractAddress);
      const contract = new Contract(abi, contractAddress, {}, wallet, ContractStatus.INITIALISED);
      // contract.connect(wallet);
      const contractBalance = yield harmony.blockchain.getBalance({ address: contractAddress });

      yield put(
        createAction('updateState')({
          contractBalance: harmony.utils.hexToNumber(contractBalance.result),
          contract,
        }),
      );
      yield put(createAction('getContractOwner')());
      yield put(createAction('getPlayers')());
    },
    *getContractOwner({ _ }, { call, put, select }) {
      const contract = yield select(state => state.contract.contract);

      const manager = yield contract.methods.manager().call();

      yield put(
        createAction('updateState')({
          manager,
        }),
      );
      yield put(createAction('account/checkIsOwner')());
    },
    *getPlayers({ _ }, { call, put, select }) {
      // const anonymousFrom = '0'.repeat(40);

      const contract = yield select(state => state.contract.contract);

      const players = yield contract.methods.getPlayers().call({ from: '0x' });
      console.log({ players });
      yield put(
        createAction('updateState')({
          players,
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
      //   dispatch(createAction('getPlayers')());
      dispatch(createAction('account/checkIsOwner')());
    },
  },
};
