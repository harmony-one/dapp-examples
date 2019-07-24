import { Harmony } from '@harmony-js/core';
import { ChainID, ChainType } from '@harmony-js/utils';

// const url = 'wss://ropsten.infura.io/ws/v3/4f3be7f5bbe644b7a8d95c151c8f52ec';
// // const url = 'https://ropsten.infura.io/v3/4f3be7f5bbe644b7a8d95c151c8f52ec';
// const chainId = ChainID.Ropsten;
// const chainType = ChainType.Ethereum;

const url = 'http://192.168.3.160:9500';
// const url = 'https://ropsten.infura.io/v3/4f3be7f5bbe644b7a8d95c151c8f52ec';
const chainId = ChainID.Default;
const chainType = ChainType.Harmony;

export const harmony = new Harmony(url, { chainId, chainType });
