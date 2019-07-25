import express from 'express'
import staticGenerator from '../utils/staticGenerator'

export const lottery = '/statics/Lottery'

export const wallet = '/statics/WebWallet'

const routerTable = [
  {
    url: '/lottery',
    path: lottery
  },
  {
    url: '/wallet',
    path: wallet
  }
]

const routes = staticGenerator(routerTable)

export default routes
