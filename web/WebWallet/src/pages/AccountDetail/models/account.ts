import { Harmony, Blockchain } from '@harmony-js/core';
import { Wallet, Account } from '@harmony-js/account';
import { hexToNumber, hexToBN } from '@harmony-js/utils';
import { createAction } from '../../../utils';

const getBalance = async (acc: Account) => {
  const result = await acc.getBalance();
  return result;
};

const getBlanceBlockchain = async (blockchain: Blockchain, address: string) => {
  const balance = await blockchain.getBalance({ address });
  const nonce = await blockchain.getTransactionCount({ address });
  return {
    balance: hexToBN(balance.result).toString(),
    nonce: hexToNumber(nonce.result),
  };
};

export default {
  namespace: 'account',
  state: {
    balance: '',
    nonce: 0,
  },
  reducers: {
    updateState(state: any, { payload }: any) {
      return { ...state, ...payload };
    },
  },
  effects: {
    *getBalance({ payload }: any, { call, put, select }: any) {
      const harmony: Harmony = yield select(
        (state: { global: { harmony: { wallet: Wallet } } }) => state.global.harmony,
      );
      const acc = harmony.wallet.getAccount(payload);
      if (acc) {
        const { balance, nonce } = yield call(getBalance, acc);
        yield put(createAction('updateState')({ balance, nonce }));
      } else {
        const blockchainResult = yield call(getBlanceBlockchain, harmony.blockchain, payload);
        yield put(
          createAction('updateState')({
            balance: blockchainResult.balance,
            nonce: blockchainResult.nonce,
          }),
        );
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }: any) {
      if (history.location.pathname === '/AccountDetail') {
        const query = Object.keys(history.location.query)[0];
        dispatch(createAction('getBalance')(`${query}`));
      }
      // dispatch(createAction('getBalance')(`${query}`));
    },
  },
};
