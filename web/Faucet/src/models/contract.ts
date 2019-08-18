import { createAction } from '../utils/index';
import { Contract } from '@harmony-js/contract';
import { getAddress } from '@harmony-js/crypto';
import { ContractStatus } from '@harmony-js/contract/dist/utils/status';
import { Unit } from '@harmony-js/utils';

export default {
  namespace: 'contract',
  state: {
    // contractAddress: '0xC09293c153fd34BE07201e661132e091FbB53E62',
    contractAddress: '',
    contractBalance: '',
    contract: undefined,
    abi: '',
    emitter: undefined,
  },
  effects: {
    *getContractState({ _ }: any, { call, put, select }: any) {
      const harmony = yield select((state: any) => state.global.harmony);
      const contractAddress = yield select((state: any) => state.global.contractAddress);
      const wallet = harmony.wallet;
      const abi = yield select((state: any) => state.global.abi);

      const contract = new Contract(abi, contractAddress, {}, wallet, ContractStatus.INITIALISED);

      // contract.connect(wallet);
      const contractBalance = yield harmony.blockchain.getBalance({ address: contractAddress });

      yield put(
        createAction('updateState')({
          contractAddress,
          contractBalance: harmony.utils.hexToNumber(contractBalance.result),
          contract,
        }),
      );
    },
    *requestFreeMoney({ payload }: any, { call, put, select }: any) {
      const { address } = payload;
      const contract: Contract = yield select((state: any) => state.contract.contract);
      const emitter = contract.methods.request(getAddress(address).checksum).send({
        gasLimit: new Unit('210000').asWei().toWei(),
        gasPrice: new Unit('100').asGwei().toWei(),
      });
      yield put(createAction('updateState')({ emitter }));
    },
    *cleanEmitter({ _ }: any, { put }: any) {
      yield put(
        createAction('updateState')({
          emitter: undefined,
        }),
      );
    },
  },
  reducers: {
    updateState(state: any, { payload }: any) {
      return {
        ...state,
        ...payload,
      };
    },
  },
  subscriptions: {
    setup({ history, dispatch }: any) {
      // dispatch(createAction('getContractState')());
      //   dispatch(createAction('getPlayers')());
      // dispatch(createAction('account/checkIsOwner')());
    },
  },
};
