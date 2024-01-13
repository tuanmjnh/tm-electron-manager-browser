const mongoose = require('mongoose')
const Timezone = {
  auto: Boolean,
  TZ: String
}
const Location = {
  auto: Boolean,
  latitude: Number,
  longitude: Number
}
const schema = new mongoose.Schema({
  name: { type: String, required: true },
  key: { type: String, required: true },
  broserType: { type: String, default: null },
  broserVersion: { type: String, default: null },
  userAgent: { type: String, default: null },
  proxyType: { type: String, default: null },
  proxyHost: { type: String, default: null },
  proxyPort: { type: String, default: null },
  proxyUsername: { type: String, default: null },
  proxyPassword: { type: String, default: null },
  location: { type: Location, default: { auto: true } }, // latitude longitude
  timezone: { type: Timezone, default: { auto: true } },
  webRTC: { type: String, default: null },
  startUrl: { type: String, default: null },
  extensions: { type: String, default: null },
  desc: { type: String, default: null },
  order: { type: Number, default: 1 },
  flag: { type: Number, default: 1 },
  created: { type: Object, default: { at: new Date(), by: '' } }
})
export default mongoose.model('profiles', schema)
