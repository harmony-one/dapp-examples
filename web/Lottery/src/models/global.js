import { Harmony } from '@harmony-js/core';
import { readDefaultContract } from '../service/api';
import { createAction } from '../utils/index';

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
    *intializeNetwork({ _ }, { call, put }) {
      const { abi, bin, address, network } = yield call(readDefaultContract);
      const { chainId, chainType, url } = network;
      const netWork = network.network;
      const harmony = new Harmony(url, { chainId, chainUrl: url, chainType });

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
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
  subscriptions: {},
};
