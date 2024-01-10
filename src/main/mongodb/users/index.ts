import { ipcMain } from 'electron'
import { collectionName, Get } from './actions'
import { SHA256, NewToken } from '../../../utils/crypto'
ipcMain.handle(`${collectionName}.get`, async (event, args) => {
  try {
    const rs = { data: [], rowsNumber: 0 }
    const conditions = { $and: [{ enable: args.enable && args.enable === 'true' ? true : false }] } as any
    if (args.filter) {
      conditions.$and.push({
        $or: [
          { email: new RegExp(args.filter, 'i') },
          { fullName: new RegExp(args.filter, 'i') },
          { personNumber: new RegExp(args.filter, 'i') },
          { phone: new RegExp(args.filter, 'i') }
        ]
      })
    }
    if (args.group) conditions.$and.push({ group: args.group })
    if (!args.sortBy) args.sortBy = 'username'
    rs.rowsNumber = (await Get(conditions)).length
    rs.data = await Get(conditions)
      .skip((parseInt(args.page) - 1) * parseInt(args.rowsPerPage))
      .limit(parseInt(args.rowsPerPage))
      .sort({ [(args.sortBy) || 'username']: args.descending === 'true' ? -1 : 1 }) // 1 ASC, -1 DESC
      .exec()
    return rs
  } catch (e) {
    if (e instanceof Error) throw new Error(e.message)
    else throw new Error((e as any).toString())
  }
})

ipcMain.handle(`${collectionName}.getAll`, async (event, args) => {
  try {
  } catch (e) {
    if (e instanceof Error) throw new Error(e.message)
    else throw new Error((e as any).toString())
  }
})
