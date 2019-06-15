import { Harmony } from '@harmony-js/core';
import { createAction } from '../../../utils';

export default {
  namespace: 'new',
  state: {
    password: '',
    mnes: '',
  },
  reducers: {
    updateState(state: any, { payload }: any) {
      return { ...state, ...payload };
    },
  },
  effects: {
    *sendPassword({ payload }: any, { call, put, select }: any) {
      const harmony: Harmony = yield select(
        (state: { global: { harmony: Harmony } }) => state.global.harmony,
      );

      yield put(
        createAction('updateState')({
          password: payload,
          mnes: harmony.wallet.generateMnemonic(),
        }),
      );
    },
    *confirmCreate(_: any, { call, put, select }: any) {
      const mnes = yield select((state: { new: { mnes: string } }) => state.new.mnes);
      const password = yield select((state: { new: { password: string } }) => state.new.password);
      yield put(createAction('global/createWallet')({ password, mnes }));
    },
  },
  subscriptions: {},
};
