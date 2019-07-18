import { Harmony } from '@harmony-js/core';
import { ChainID, ChainType } from '@harmony-js/utils';

const url = 'wss://ropsten.infura.io/ws/v3/4f3be7f5bbe644b7a8d95c151c8f52ec';
const chainId = ChainID.Ropsten;
const chainType = ChainType.Ethereum;

export const harmony = new Harmony(url, { chainId, chainType });
