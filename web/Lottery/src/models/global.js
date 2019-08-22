import { HarmonyExtension } from '@harmony-js/core';
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
      console.log({ url });
      const netWork = network.network;
      const harmony = new HarmonyExtension(window.harmony);
      harmony.setProvider('ws://3.88.229.39:9800');

      yield put(
        createAction('updateState')({
          abi,
          bin,
          contractAddress: address,
          chainId,
          chainType,
          url: 'ws://3.88.229.39:9800',
          netWork,
          harmony,
        }),
      );
      yield put(createAction('contract/getContractState')());
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
