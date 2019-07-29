import { Harmony } from '@harmony-js/core';
import { ChainID, ChainType } from '@harmony-js/utils';
import { Emitter } from '@harmony-js/network';

export const getNetworkSetting = (network: string) => {
  let url = 'ws://localhost:9800';
  let chainId = ChainID.Default;
  let chainType = ChainType.Harmony;

  switch (network) {
    case 'HarmonyLocal': {
      url = 'ws://localhost:9800';
      chainId = ChainID.Default;
      chainType = ChainType.Harmony;
      break;
    }
    case 'EthGanache': {
      url = 'ws://localhost:18545';
      chainId = ChainID.Ganache;
      chainType = ChainType.Ethereum;
      break;
    }
    case 'EthRopsten': {
      url = 'wss://ropsten.infura.io/ws/v3/4f3be7f5bbe644b7a8d95c151c8f52ec';
      chainId = ChainID.Ropsten;
      chainType = ChainType.Ethereum;
      break;
    }
    default: {
      break;
    }
  }

  return { url, chainId, chainType, getNetworkSetting };
};

export { Harmony, ChainID, ChainType, Emitter };
