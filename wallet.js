const fs = require('fs')
const { importKey } = require('@taquito/signer')
const { TezosToolkit } = require('@taquito/taquito')
const {
  RPC,
  WALLET,
  MINTER_ADDRESS
} = require('./config.js')

const toolkit = new TezosToolkit(RPC)
const wallet = JSON.parse(fs.readFileSync(`./secrets/${WALLET}.json`).toString())
importKey(toolkit,
  wallet.privkey
).catch((e) => console.error(e));

async function mint(ipfsMetadata, receiver) {
//  let contract = await toolkit.contract.at(MINTER_ADDRESS)
//  let methods = contract.parameterSchema.ExtractSignatures()
//  contract.methods.mint(token.actual_metadata, parseInt(token.token_id))
//  const op = await batch.send()
//  await op.confirmation(1)
//  return op.hash 
}

module.exports = { mint }
