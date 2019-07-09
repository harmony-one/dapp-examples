import { Wallet } from '@harmony-js/account';
import router from 'umi/router';
import { createAction } from '../utils';
import { write, read } from '../services/localstorage';
import { encryptPhrase, decryptPhrase } from '@harmony-js/crypto';
import { create } from 'domain';

const wallet = new Wallet();
const defaultWalletKey = '@@HWallet';
const defaultWalletPhrase = '@@HPhrase';
const defaultWalletChildIndex = `@@HWalletChildIndex`;

interface IWalletState {
  files: any;
  accounts: any[];
  unlockError: false;
  wallet: Wallet;
}

export default {
  namespace: 'wallet',
  state: {
    files: {},
    accounts: [],
    wallet: undefined,
    unlockError: false,
    loading: false,
  },
  effects: {
    *createWallet({ payload }: any, { call, put, select }: any) {
      const { mnes, password } = payload;
      const phrase = yield encryptPhrase(mnes, password);
      const newWallet = yield wallet.addByMnemonic(mnes, 0);
      const file = yield newWallet.toFile(password);

      yield put(createAction('saveWallet')({ address: newWallet.address, file, phrase, count: 0 }));
    },
    *saveWallet({ payload }: any, { call, put, select }: any) {
      yield put(createAction('readWallet')());
      const stateAccounts = yield select(
        (state: { wallet: IWalletState }) => state.wallet.accounts,
      );

      const accounts = [...new Set(wallet.accounts.concat(stateAccounts))];

      yield write(`${defaultWalletKey}`, JSON.stringify(accounts));
      yield write(`${payload.address}`, payload.file);
      yield write(`${defaultWalletPhrase}`, payload.phrase);
      yield write(`${defaultWalletChildIndex}`, payload.count);
    },

    *readWallet({ _ }: any, { call, put, select }: any) {
      const accountsString: string = yield read(`${defaultWalletKey}`);
      const localAccounts: string[] = JSON.parse(accountsString) || [];
      const stateAccounts: string[] = yield select(
        (state: { wallet: IWalletState }) => state.wallet.accounts,
      );

      const accounts = [...new Set(localAccounts.concat(stateAccounts))];

      let files: any = {};

      accounts.forEach((acc: string) => {
        const file = read(acc);
        files[acc] = file;
      });

      yield put(createAction('updateState')({ accounts, files }));
    },
    *unlockWallet({ payload }: any, { call, put, select }: any) {
      yield put(createAction('updateState')({ loading: true }));
      const files = yield select((state: { wallet: IWalletState }) => state.wallet.files);
      const fileArray: string[] = Object.values(files);

      for (let i = 0; i < fileArray.length; i += 1) {
        const file = fileArray[i];
        try {
          yield wallet.addByKeyStore(file, payload.password);
          yield put(createAction('updateState')({ unlockError: false }));
        } catch (error) {
          yield put(createAction('updateState')({ unlockError: true }));
        }
      }

      yield put(createAction('updateState')({ loading: false, wallet }));
      const error = yield select((state: { wallet: IWalletState }) => state.wallet.unlockError);
      if (error === false) {
        router.push('/wallet');
      }
    },
    *addAccountFromMnes({ payload }: any, { call, put, select }: any) {
      yield put(createAction('updateState')({ loading: true }));

      const phraseFile = yield read(`${defaultWalletPhrase}`);
      const hdCount = yield read(`${defaultWalletChildIndex}`);
      const count = Number.parseInt(hdCount, 10) + 1;
      const mne = yield decryptPhrase(JSON.parse(phraseFile), payload.password);
      const newAcc = yield wallet.addByMnemonic(mne, count);
      const file = yield newAcc.toFile(payload.password);

      yield put(
        createAction('saveWallet')({ address: newAcc.address, file, phrase: phraseFile, count }),
      );
      yield put(createAction('updateState')({ loading: false }));
    },
  },
  reducers: {
    updateState(state: any, { payload }: any) {
      return { ...state, ...payload };
    },
  },
  subscriptions: {
    setup({ dispatch }: any) {
      dispatch({ type: 'readWallet' });
    },
  },
};
