import { bip39 } from '@harmony-js/crypto';
import { createAction } from '../../../utils';

export interface INewWallet {
  mnes: string;
  password: string;
  privateKey: string;
  loading: boolean;
}

export default {
  namespace: 'create',
  state: {
    mnes: undefined,
    password: undefined,
    privateKey: undefined,
    loading: false,
  },
  effects: {
    *generateMnemonic({ _ }: any, { put }: any) {
      const mnes = bip39.generateMnemonic();
      yield put(createAction('updateState')({ mnes }));
    },
    *sendMnemonic({ payload }: any, { put }: any) {
      yield put(createAction('updateState')({ mnes: payload.mnes }));
    },
    *sendPrivateKey({ payload }: any, { put }: any) {
      yield put(createAction('updateState')({ privateKey: payload.privateKey }));
    },
    *sendPassword({ payload }: any, { call, put, select }: any) {
      yield put(
        createAction('updateState')({
          password: payload,
        }),
      );
      yield put(createAction('nextAction')());
    },
    *nextAction({ _ }: any, { call, select, put }: any) {
      const password = yield select((state: { create: INewWallet }) => state.create.password);
      const mnes = yield select((state: { create: INewWallet }) => state.create.mnes);
      if (password && mnes) {
        yield put(createAction('wallet/createWallet')({ password, mnes }));
      } else if (password && !mnes) {
        yield put(createAction('wallet/addAccountFromMnes')({ password }));
      }
    },
    *resetMnes({ _ }: any, { put }: any) {
      yield put(
        createAction('updateState')({
          mnes: undefined,
        }),
      );
    },
    *resetPrivateKey({ _ }: any, { put }: any) {
      yield put(
        createAction('updateState')({
          privateKey: undefined,
        }),
      );
    },
    *resetPassword({ _ }: any, { put }: any) {
      yield put(
        createAction('updateState')({
          password: undefined,
        }),
      );
    },
    *resetAll({ _ }: any, { put }: any) {
      yield put(
        createAction('updateState')({
          password: undefined,
          mnes: undefined,
        }),
      );
    },
  },
  reducers: {
    updateState(state: INewWallet, { payload }: any) {
      return { ...state, ...payload };
    },
  },
  subscription: {},
};
