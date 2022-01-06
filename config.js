const env = process.env
const config = {
  RPC                   : env['RPC'],
  WALLET                : env['WALLET'],
  MINTER_ADDRESS        : env['MINTER_ADDRESS'],
  PINATA_API_KEY        : env['PINATA_API_KEY'],
  PINATA_SECRET_API_KEY : env['PINATA_SECRET_API_KEY']
}
module.exports = config
