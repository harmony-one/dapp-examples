import { harmony } from '../service/harmony';
import { createAction } from '../utils/index';

export default {
  namespace: 'account',
  state: {
    wallet: harmony.wallet,
    account: undefined,
    error: undefined,
  },
  effects: {
    *getAccount({ payload }, { call, put, select }) {
      try {
        const account = harmony.wallet.addByPrivateKey(payload.privateKey);
        yield put(createAction('updateState')({ account, wallet: harmony.wallet }));
      } catch (error) {
        yield put(createAction('updateState')({ error }));
      }
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
    // setup({ history, dispatch }) {
    //   dispatch(createAction('getContractState')());
    // },
  },
};
