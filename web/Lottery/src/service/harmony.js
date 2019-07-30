import { Harmony } from '@harmony-js/core';
import { ChainID, ChainType } from '@harmony-js/utils';

// const url = 'wss://ropsten.infura.io/ws/v3/4f3be7f5bbe644b7a8d95c151c8f52ec';
// const url = 'https://ropsten.infura.io/v3/4f3be7f5bbe644b7a8d95c151c8f52ec';
// const chainId = ChainID.Ropsten;
// const chainType = ChainType.Ethereum;

// access-control-allow-origin: *
// content-length: 39
// content-type: application/json
// date: Wed, 24 Jul 2019 15:06:50 GMT
// status: 200
// vary: Origin

// const url = 'http://localhost:9500';
// const url = 'ws://localhost:9800';
// const chainId = ChainID.Default;
// const chainType = ChainType.Harmony;

export const harmony = new Harmony();
// export const harmony = new Harmony(url, { chainId, chainType });
export { ChainID, ChainType };
