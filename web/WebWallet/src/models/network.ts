import { Messenger, HttpProvider, WSProvider } from '@harmony-js/network';
import { ChainID, ChainType, isHttp, isWs } from '@harmony-js/utils';
import { write, read } from '../services/localstorage';
import { createAction } from '@/utils';

const defaultProviderKey = '@@HProvider';

const defaultProviders = [
  {
    id: ChainID.Default,
    type: ChainType.Harmony,
    name: 'Harmony TestNet',
    http: 'http://localhost:9500',
    ws: 'ws://localhost:9800',
  },
  {
    id: ChainID.Ropsten,
    type: ChainType.Ethereum,
    name: 'Ropsten',
    http: 'https://ropsten.infura.io/v3/4f3be7f5bbe644b7a8d95c151c8f52ec',
    ws: 'wss://ropsten.infura.io/ws/v3/4f3be7f5bbe644b7a8d95c151c8f52ec',
  },
];

export default {
  namespace: 'network',
  state: {
    providerList: [...defaultProviders],
    selected: 'Ropsten',
    messenger: new Messenger(
      new WSProvider(defaultProviders[1].ws),
      defaultProviders[1].type,
      defaultProviders[1].id,
    ),
  },
  reducers: {
    updateState(state: any, { payload }: any) {
      return { ...state, ...payload };
    },
  },
  effects: {
    *setMessenger({ _ }: any, { call, put, select }: any) {
      const selected = yield select(
        (state: { network: { selected: string } }) => state.network.selected,
      );
      const providerList: any[] = yield select(
        (state: { network: { providerList: any } }) => state.network.providerList,
      );
      const selectedProvider = providerList.find(value => {
        return value.name === selected;
      });
      const provider = new WSProvider(selectedProvider.ws);

      const messenger = new Messenger(
        provider,
        selectedProvider.ChainType,
        selectedProvider.ChainID,
      );

      yield put(createAction('updateState')({ messenger }));
    },
    *setProvider({ payload }: any, { call, put, select }: any) {
      const providerList: any[] = yield select(
        (state: { network: { providerList: any } }) => state.network.providerList,
      );
      const selectedProvider = providerList.find(value => {
        return value.name === payload.name;
      });
      if (selectedProvider) {
        yield put(createAction('updateState')({ selected: payload.name }));
        yield put(createAction('setMessenger')());
      }
    },
    *addProviderToList({ payload }: any, { call, put, select }: any) {
      const providerList: any[] = yield select(
        (state: { network: { providerList: any } }) => state.network.providerList,
      );
      const toAdd = payload.provider;

      const addList = providerList.concat(toAdd);
      const uniqList = [...new Set(addList)];
      yield put(createAction('updateState')({ providerList: uniqList }));
    },
    *getProvidersFromLocal({ _ }: any, { call, put, select }: any) {
      const localProviderList = yield read(defaultProviderKey);
      const readFromLocal = JSON.parse(localProviderList);
      yield put(createAction('updateState')({ providerList: readFromLocal }));
    },
    *saveProvidersToLocal({ _ }: any, { call, put, select }: any) {
      const providerList = yield select(
        (state: { network: { providerList: any } }) => state.network.providerList,
      );
      const saveToLocal = JSON.stringify(providerList);
      yield write(defaultProviderKey, saveToLocal);
    },
  },

  subscriptions: {},
};
