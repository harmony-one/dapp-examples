import { Wallet } from '@harmony-js/account';
import router from 'umi/router';
import { createAction } from '../utils';
import { WalletDB } from '../services/db/wallet';
import { encryptPhrase, decryptPhrase } from '@harmony-js/crypto';

const wallet = new Wallet();

const walletDB = new WalletDB('HWallet');

interface IWalletState {
  files: any;
  accounts: any[];
  unlockError: false;
  wallet: Wallet;
  isUnlocked: boolean;
}

export default {
  namespace: 'wallet',
  state: {
    files: {},
    accounts: [],
    wallet: undefined,
    unlockError: false,
    isUnlocked: false,
    loading: false,
    importedAccounts: [],
  },
  effects: {
    *createWallet({ payload }: any, { call, put, select }: any) {
      const { mnes, password } = payload;
      const phrase = yield encryptPhrase(mnes, password);
      const newWallet = yield wallet.addByMnemonic(mnes, 0);
      const file = yield newWallet.toFile(password);

      yield put(createAction('updateState')({ wallet }));
      yield put(createAction('saveWallet')({ address: newWallet.address, file, phrase, count: 0 }));
    },
    *saveWallet({ payload }: any, { call, put, select }: any) {
      yield put(createAction('readWallet')());
      const stateAccounts = yield select(
        (state: { wallet: IWalletState }) => state.wallet.accounts,
      );

      const accounts = [...new Set(wallet.accounts.concat(stateAccounts))];

      yield call(walletDB.saveKey, { key: JSON.stringify(accounts) });
      yield call(walletDB.saveFile, { address: payload.address, file: payload.file });
      yield call(walletDB.savePhrase, { phrase: payload.phrase });
      yield call(walletDB.saveIndex, { index: payload.count });

      yield put(createAction('readWallet')());
    },

    *readWallet({ _ }: any, { call, put, select }: any) {
      const isUnlocked = yield select((state: { wallet: IWalletState }) => state.wallet.isUnlocked);
      if (!isUnlocked) {
        router.replace('/');
      }

      const accountsString: any = yield walletDB.loadKey();

      const localAccounts: string[] = JSON.parse(accountsString.key) || [];
      const stateAccounts: string[] = yield select(
        (state: { wallet: IWalletState }) => state.wallet.accounts,
      );

      const accounts = [...new Set(localAccounts.concat(stateAccounts))];

      let files: any = {};

      for (const acc of accounts) {
        const file = yield walletDB.loadFile(acc);

        files[acc] = file.file;
      }

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
          yield put(createAction('updateState')({ unlockError: false, isUnlocked: true }));
        } catch (error) {
          yield put(createAction('updateState')({ unlockError: true, isUnlocked: false }));
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

      const phraseFile = yield walletDB.loadPhrase();
      const hdCount = yield walletDB.loadIndex();
      const count = Number.parseInt(hdCount.index, 10) + 1;
      const mne = yield decryptPhrase(JSON.parse(phraseFile.phrase), payload.password);

      const newAcc = yield wallet.addByMnemonic(mne, count);
      const file = yield newAcc.toFile(payload.password);

      yield put(createAction('updateState')({ wallet }));

      yield put(
        createAction('saveWallet')({
          address: newAcc.address,
          file,
          phrase: phraseFile.phrase,
          count,
        }),
      );

      yield put(createAction('updateState')({ loading: false }));
    },
    *addAccountFromPrivateKey({ payload }: any, { call, put, select }: any) {
      yield put(createAction('updateState')({ loading: true }));

      const phraseFile = yield walletDB.loadPhrase();
      const hdCount = yield walletDB.loadIndex();

      const count = Number.parseInt(hdCount.index, 10);
      const mne = yield decryptPhrase(JSON.parse(phraseFile.phrase), payload.password);
      if (mne) {
        const newAcc = yield wallet.addByPrivateKey(payload.privateKey);
        const file = yield newAcc.toFile(payload.password);
        yield walletDB.saveImported({ address: newAcc.address });
        yield put(createAction('updateState')({ wallet }));
        yield put(
          createAction('saveWallet')({
            address: newAcc.address,
            file,
            phrase: phraseFile.phrase,
            count,
          }),
        );
        yield put(createAction('updateState')({ loading: false }));
      }
    },
    *loadImported(_: any, { call, put, select }: any) {
      const importedArray: any[] = yield walletDB.loadImported();
      const importedAccounts = [];
      if (importedArray.length > 0) {
        for (const imported of importedArray) {
          importedAccounts.push(imported.address);
        }
      }
      yield put(createAction('updateState')({ importedAccounts }));
    },
    *revealPrivate({ payload }: any, { call, put, select }: any) {
      yield put(createAction('updateState')({ loading: true }));

      const phraseFile = yield walletDB.loadPhrase();
      const mne = yield decryptPhrase(JSON.parse(phraseFile.phrase), payload.password);
    },
    *removeAccount({ payload }: any, { call, put, select }: any) {
      yield walletDB.removeFile(payload.address);
      yield put(createAction('updateState')({ isUnlocked: false, files: {}, accounts: [] }));
      yield put(createAction('readWallet')());
      yield put(createAction('loadImported')());
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
      dispatch({ type: 'loadImported' });
    },
  },
};
