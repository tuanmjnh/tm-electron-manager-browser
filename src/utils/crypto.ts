// const crypto = require('crypto')
import { createHash, createHmac, randomBytes } from "crypto"
const SECRET = '48955e33-5871-3982-3c1e-e127e7714958'
interface NewGuidOptions {
  format: string
}
export const MD5Hash = (value) => {
  return createHash('md5')
    .update(value + SECRET)
    .digest('hex')
}

export const SHA256 = (value) => {
  return createHmac('sha256', SECRET).update(value).digest('hex')
}

export const NewGuid = (otps?: NewGuidOptions) => {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)
  }
  if (otps && otps.format && otps.format.toLowerCase() === 'n') {
    return `${s4()}${s4()}${s4()}${s4()}${s4()}${s4()}${s4()}${s4()}`
  } else {
    return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`
  }
}

export const NewToken = () => {
  return randomBytes(64).toString('hex')
}
