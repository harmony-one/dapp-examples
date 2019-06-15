import { Harmony } from '@harmony-js/core';
import { Account, Wallet } from '@harmony-js/account';
import { ChainID, ChainType } from '@harmony-js/utils';
import router from 'umi/router';
import { createAction } from '../utils';

const harmony = new Harmony(undefined, {
  chainId: ChainID.Ropsten,
  chainType: ChainType.Ethereum,
  chainUrl: 'https://ropsten.infura.io/v3/4f3be7f5bbe644b7a8d95c151c8f52ec',
});

const encrypt = async (wallet: Wallet, address: string, password: string) => {
  await wallet.encryptAccount(address, password);
};

export default {
  state: {
    harmony,
  },
  reducers: {
    updateState(state: any, { payload }: any) {
      return { ...state, ...payload };
    },
  },
  effects: {
    *createWallet({ payload }: any, { call, put, select }: any) {
      const wallet = yield select((state: any) => state.global.harmony.wallet);
      const created: Account = wallet.addByMnemonic(payload.mnes, 0);
      if (created.address) {
        yield call(encrypt, wallet, created.address, payload.password);
        yield put(createAction('updateState')(harmony));
        yield call(router.push, `/AccountDetail?${created.bech32Address}`);
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }: any) {
      dispatch({ type: 'updateState', payload: harmony });
    },
  },
};
