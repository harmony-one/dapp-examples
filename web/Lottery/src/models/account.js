import { isAddress } from '@harmony-js/utils';
import { getAddress } from '@harmony-js/crypto';
// import { harmony } from '../service/harmony';
import { createAction, router } from '../utils/index';

export default {
  namespace: 'account',
  state: {
    wallet: undefined,
    account: undefined,
    error: undefined,
    isOwner: false,
    accountBalance: '',
  },
  effects: {
    *getAccount({ payload }, { call, put, select }) {
      try {
        const harmony = yield select(state => state.global.harmony);

        const account = harmony.wallet.addByPrivateKey(payload.privateKey);
        yield put(createAction('updateState')({ account, wallet: harmony.wallet }));
      } catch (error) {
        yield put(createAction('updateState')({ error }));
      }
    },
    *getAccountBalance({ _ }, { call, put, select }) {
      try {
        const account = yield select(state => state.account.account);

        const balance = yield account.getBalance();
        yield put(createAction('updateState')({ accountBalance: balance.balance }));
      } catch (error) {
        yield put(createAction('updateState')({ error }));
      }
    },
    *checkIsOwner({ _ }, { call, put, select }) {
      const account = yield select(state => state.account.account);
      const manager = yield select(state => state.contract.manager);
      if (isAddress(manager) && account !== undefined) {
        const isOwner = getAddress(manager).checksum === account.checksumAddress;
        yield put(
          createAction('updateState')({
            isOwner,
          }),
        );
        if (isOwner) {
          router.replace('/owner');
        } else if (!isOwner) {
          router.replace('/player');
        }
      } else {
        router.replace('/');
      }
    },
    *logout({ _ }, { call, put, select }) {
      const harmony = yield select(state => state.global.harmony);
      harmony.wallet.accounts.forEach(acc => {
        harmony.wallet.removeAccount(acc);
      });

      yield put(
        createAction('updateState')({
          wallet: harmony.wallet,
          account: undefined,
          error: undefined,
          isOwner: false,
          accountBalance: '',
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
    // setup({ history, dispatch }) {
    //   dispatch(createAction('getContractState')());
    // },
  },
};
