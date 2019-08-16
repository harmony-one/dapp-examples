const s = {
  // These work fine
  // GetBlockByHash: 'hmy_getBlockByHash',
  // GetBlockByNumber: 'hmy_getBlockByNumber',
  // GetBlockTransactionCountByHash: 'hmy_getBlockTransactionCountByHash',
  GetBlockTransactionCountByNumber: 'hmy_getBlockTransactionCountByNumber',
  GetTransactionByBlockHashAndIndex: 'hmy_getTransactionByBlockHashAndIndex',
  GetTransactionByBlockNumberAndIndex: 'hmy_getTransactionByBlockNumberAndIndex',
  GetTransactionByHash: 'hmy_getTransactionByHash',
  GetTransactionReceipt: 'hmy_getTransactionReceipt',
  // Syncing: 'hmy_syncing',
  GetStorageAt: 'hmy_getStorageAt',
  GetTransactionCount: 'hmy_getTransactionCount',
  SendTransaction: 'hmy_sendTransaction',
  SendRawTransaction: 'hmy_sendRawTransaction',
  Subscribe: 'hmy_subscribe',
  GetWork: 'hmy_getWork',
  GetProof: 'hmy_getProof',
  GetFilterChanges: 'hmy_getFilterChanges',
  NewPendingTransactionFilter: 'hmy_newPendingTransactionFilter',
  NewBlockFilter: 'hmy_newBlockFilter',
  NewFilter: 'hmy_newFilter',
  Call: 'hmy_call',
  EstimateGas: 'hmy_estimateGas',
  // GasPrice: 'hmy_gasPrice',
  // BlockNumber: 'hmy_blockNumber',
  UnSubscribe: 'hmy_unsubscribe',
  // NetVersion: 'net_version',
  // ProtocolVersion: 'hmy_protocolVersion',
  // GetBalance: 'hmy_getBalance',
  // PeerCount: 'net_peerCount',

  // These need parameters I don't know about
  GetPastLogs: 'hmy_getLogs',
  GetCode: 'hmy_getCode',
};
