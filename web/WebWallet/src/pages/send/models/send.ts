import { Unit } from '@harmony-js/utils';
import { Blockchain } from '@harmony-js/core';
import { Wallet } from '@harmony-js/account';
import { Transaction, TxStatus } from '@harmony-js/transaction';
import { createAction } from '../../../utils';
import { getAddress } from '@harmony-js/crypto';

export default {
  namespace: 'send',
  state: {
    from: '0x',
    to: '0x',
    gasLimit: '0x',
    gasPrice: '0x',
    value: '0x',
    hash: undefined,
    TxStatus: undefined,
    receipt: undefined,
    emitter: undefined,
    confirmation: undefined,
  },
  effects: {
    *toNext({ payload }: any, { call, put, select }: any) {
      yield put(createAction('updateState')({ ...payload, value: payload.amount }));
    },
    *makeTxn({ payload }: any, { call, put, select, all, race }: any) {
      const wallet: Wallet = yield select(
        (state: { wallet: { wallet: Wallet } }) => state.wallet.wallet,
      );
      const messenger = yield select(
        (state: { network: { messenger: any } }) => state.network.messenger,
      );

      const blockchain = new Blockchain(messenger);

      wallet.setMessenger(messenger);

      const { from, to, gasLimit, gasPrice, amount } = payload;

      const tx = new Transaction(
        {
          to: getAddress(to).checksum,
          gasLimit: new Unit(gasLimit).asWei().toWei(),
          gasPrice: new Unit(gasPrice).asWei().toWei(),
          value: new Unit(`${amount}`).asEther().toWei(),
        },
        messenger,
        TxStatus.INTIALIZED,
      );

      const signWith = wallet.getAccount(from);

      if (signWith) {
        signWith.setMessenger(messenger);
      }

      const signedTxn: Transaction = yield wallet.signTransaction(tx, signWith);
      yield put(createAction('updateState')({ TxStatus: signedTxn.txStatus }));

      const emitter = blockchain.createObservedTransaction(signedTxn);

      yield put(createAction('updateState')({ emitter }));

      const result = yield emitter;

      yield put(createAction('updateState')({ TxStatus: result.TxStatus }));
    },
    *onTransactionHash({ payload }: any, { call, put, select }: any) {
      yield put(createAction('updateState')({ hash: payload.transactionHash }));
    },
    *onReceipt({ payload }: any, { call, put, select }: any) {
      yield put(createAction('updateState')({ receipt: payload.receipt }));
    },
    *onConfirmation({ payload }: any, { call, put, select }: any) {
      yield put(createAction('updateState')({ confirmation: payload.confirmation }));
    },
    *resetAll({ _ }: any, { put }: any) {
      yield put(
        createAction('updateState')({
          from: '0x',
          to: '0x',
          gasLimit: '0x',
          gasPrice: '0x',
          value: '0x',
          hash: undefined,
          TxStatus: undefined,
          receipt: undefined,
          emitter: undefined,
          confirmation: undefined,
        }),
      );
    },
  },
  reducers: {
    updateState(state: any, { payload }: any) {
      return { ...state, ...payload };
    },
  },
  subscription: {},
};
