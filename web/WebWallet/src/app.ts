import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  timeout: 1000, // you can define your time. But is required.
  key: 'root',
  storage,
  whitelist: ['global'],
};

const persistEnhancer = () => (createStore: Function) => (
  reducer: any,
  initialState: any,
  enhancer: any,
) => {
  const store = createStore(persistReducer(persistConfig, reducer), initialState, enhancer);
  const persist = persistStore(store);
  return {
    persist,
    ...store,
  };
};

export const dva = {
  config: {
    onError(err: ErrorEvent) {
      err.preventDefault();
    },
    // extraEnhancers: [persistEnhancer()],
  },
};
