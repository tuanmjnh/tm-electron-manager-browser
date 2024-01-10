import { ipcMain } from 'electron'
import MUser from './model'
import { SHA256, NewToken } from '../../../utils/crypto'
const collectionName = MUser.collection.collectionName
const Instant = <{
  _id: string,
  username: string,
  password: string
}>({
  _id: 'ea0e730263830d356c78f6554977c88997a34290282cfa5e7fc491af9d5d723aa44c95e93d8a715f2fc9fdeeda27b036355c85584f66c3c7de052c9122fa56da',
  username: 'admin',
  password: 'admin'
})
ipcMain.handle(`${collectionName}.login`, async (event, args) => {
  try {
    // throw new Error('wrong')
    const rs = await MUser.findOne({ username: args.username })
    // console.log(arg)
    // not exist username
    // if (!rs) return res.status(502).json({ msg: 'no_exist' })
    if (!rs) {
      if (args.username == Instant.username && args.password == Instant.password) {
        global.authUser = {
          _id: Instant._id,
          username: Instant.username,
          token: NewToken()
        }
        return { ...{ user: Instant }, ...{ token: global.authUser.token } }
      }
    } else {
      // check password
      if (rs.password !== SHA256(args.password + rs.salt)) throw new Error('password')
      // check lock
      if (!rs.enable) throw new Error('locked')
      // Routes
      // rs = rs.toJSON()
      // rs.routes = await getAuthRoutes(rs.roles)
      // fix date
      // rs.dateBirth = moment(rs.dateBirth).format('YYYY-MM-DD')
      // Update last login
      await MUser.updateOne(
        { _id: rs._id },
        {
          $set: {
            lastLogin: new Date()
          }
        })

      //set global Authenticates User
      global.authUser = {
        _id: rs._id,
        username: rs.username,
        token: rs.token
      }
      return rs
    }
  } catch (e) {
    if (e instanceof Error) throw new Error(e.message)
    else throw new Error((e as any))
  }
})
