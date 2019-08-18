import express from 'express'
import staticGenerator from '../utils/staticGenerator'

export const lottery = '/statics/Lottery'

export const wallet = '/statics/WebWallet'
export const index = '/statics/Index'
export const faucet = '/statics/Faucet'

const routerTable = [
  {
    url: '/',
    path: index
  },
  {
    url: '/lottery',
    path: lottery
  },
  {
    url: '/wallet',
    path: wallet
  },
  {
    url: '/faucet',
    path: faucet
  }
]

const routes = staticGenerator(routerTable)

export default routes
