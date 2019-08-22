import contractFile from '../service/contractFile';
import { createAction } from '../utils/index';
import { Contract } from '@harmony-js/contract';
import { ContractStatus } from '@harmony-js/contract/dist/utils/status';
import { Unit } from '@harmony-js/utils';
import { getAddress } from '@harmony-js/crypto';

export default {
  namespace: 'contract',
  state: {
    contractAddress: '',
    contractBalance: '',
    contract: undefined,
    abi: contractFile.abi,
    manager: '',
    players: [],
    emitter: undefined,
  },
  effects: {
    *getContractState({ _ }, { call, put, select }) {
      const contractAddress = yield select(state => state.global.contractAddress);
      const harmony = yield select(state => state.global.harmony);
      const abi = yield select(state => state.global.abi);

      const contract = new Contract(
        abi,
        contractAddress,
        {},
        harmony.wallet,
        ContractStatus.INITIALISED,
      );
      const contractBalance = yield harmony.blockchain.getBalance({ address: contractAddress });

      yield put(
        createAction('updateState')({
          contractAddress,
          contractBalance: harmony.utils.hexToNumber(contractBalance.result),
          contract,
        }),
      );
      yield put(createAction('getPlayers')());
      yield put(createAction('getContractOwner')());
    },
    *getContractOwner({ _ }, { call, put, select }) {
      const contract = yield select(state => state.contract.contract);
      const manager = yield contract.methods.manager().call({
        gasLimit: new Unit('210000').asWei().toWei(),
        gasPrice: new Unit('100').asGwei().toWei(),
      });
      yield put(
        createAction('updateState')({
          manager,
        }),
      );
      yield put(createAction('account/checkIsOwner')());
    },
    *getPlayers({ _ }, { call, put, select }) {
      const contract = yield select(state => state.contract.contract);
      const players = yield contract.methods.getPlayers().call({
        gasLimit: new Unit('210000').asWei().toWei(),
        gasPrice: new Unit('100').asGwei().toWei(),
      });

      yield put(
        createAction('updateState')({
          players: players !== null ? players : [],
        }),
      );
    },
    *deposit({ payload }, { call, put, select }) {
      yield put(createAction('updateState')({ emitter: undefined }));
      const contract = yield select(state => state.contract.contract);
      const contractAddress = yield select(state => state.contract.contractAddress);
      // const harmony = yield select(state => state.global.harmony);
      // const account = yield select(state => state.account.account);

      // const nonce = yield harmony.blockchain.getTransactionCount({
      //   address: getAddress(account.address).checksum,
      // });

      const emitter = contract.methods.enter().send({
        // from: account.address,
        to: getAddress(contractAddress).checksum,
        // nonce: Number.parseInt(hexToNumber(nonce.result), 10),
        gasLimit: new Unit('210000').asWei().toWei(),
        gasPrice: new Unit('100').asGwei().toWei(),
        value: new Unit(payload).asEther().toWei(),
      });

      yield put(createAction('updateState')({ emitter }));
    },
    *pickWinner({ _ }, { call, put, select }) {
      yield put(createAction('updateState')({ emitter: undefined }));

      const contract = yield select(state => state.contract.contract);
      const contractAddress = yield select(state => state.contract.contractAddress);
      // const harmony = yield select(state => state.global.harmony);
      // const account = yield select(state => state.account.account);

      // const nonce = yield harmony.blockchain.getTransactionCount({
      //   address: getAddress(account.address).checksum,
      // });

      const emitter = contract.methods.pickWinner().send({
        // from: account.address,
        to: getAddress(contractAddress).checksum,
        // nonce: Number.parseInt(hexToNumber(nonce.result), 10),
        gasLimit: new Unit('210000').asWei().toWei(),
        gasPrice: new Unit('100').asGwei().toWei(),
      });

      yield put(createAction('updateState')({ emitter }));
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
      // dispatch(createAction('getPlayers')());
      // dispatch(createAction('account/checkIsOwner')());
    },
  },
};
