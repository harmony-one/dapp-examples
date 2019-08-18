import { Harmony } from '@harmony-js/core';
import { ChainID, ChainType } from '@harmony-js/utils';
import { readDefaultContract } from '../service/api';
import { createAction } from '../utils/index';

export interface GlobalState {
  abi: any;
  bin: string;
  contractAddress: string;
  chainId: ChainID;
  chainType: ChainType;
  url: string;
  netWork: string;
  harmony: Harmony;
}

export default {
  namespace: 'global',
  state: {
    abi: undefined,
    bin: undefined,
    contractAddress: '0x',
    chainId: undefined,
    chainType: undefined,
    url: '',
    netWork: '',
    harmony: undefined,
  },
  effects: {
    *intializeNetwork({ _ }: any, { call, put }: any) {
      const { abi, bin, address, network } = yield call(readDefaultContract);
      const { chainId, chainType, url } = network;
      const netWork = network.network;
      const harmony = new Harmony(url, {
        chainId,
        chainUrl: url,
        chainType,
      });
      yield harmony.wallet.addByPrivateKey(
        'e19d05c5452598e24caad4a0d85a49146f7be089515c905ae6a19e8a578a6930',
      );

      yield put(
        createAction('updateState')({
          abi,
          bin,
          contractAddress: address,
          chainId,
          chainType,
          url,
          netWork,
          harmony,
        }),
      );
    },
  },
  reducers: {
    updateState(state: GlobalState, { payload }: { payload: any }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
  subscriptions: {
    setup({ dispatch }: any) {
      dispatch({ type: 'intializeNetwork' });
    },
  },
};
