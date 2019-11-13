import express from 'express'
import staticGenerator from '../utils/staticGenerator'

export const lottery = '/statics/Lottery'

export const wallet = '/statics/WebWallet'
export const index = '/statics/Index'
export const faucet = '/statics/Faucet'
export const puzzle = '/statics/Puzzle'

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
  },
  {
    url: '/puzzle',
    path: puzzle
  }
]

const routes = staticGenerator(routerTable)

export default routes
