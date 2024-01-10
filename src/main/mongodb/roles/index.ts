import { ipcMain } from 'electron'
import { collectionName, Get, Exist, FindOne, Insert, Update, Flag, Delete } from './actions'
import { Types, startSession } from 'mongoose'
import { SetLog } from '../../../services/logger'
ipcMain.handle(`${collectionName}.get`, async (event, args) => {
  try {
    const rs = { data: [], rowsNumber: 0 }
    const conditions = { $and: [{ flag: args.flag ? parseInt(args.flag) : 1 }] } as any
    if (args.filter) {
      conditions.$and.push({
        $or: [
          { key: new RegExp(args.filter, 'i') },
          { name: new RegExp(args.filter, 'i') }
        ]
      })
    }
    if (!args.sortBy) args.sortBy = 'level'
    rs.rowsNumber = (await Get(conditions)).length
    rs.data = await Get(conditions)
      .skip((parseInt(args.page) - 1) * parseInt(args.rowsPerPage))
      .limit(parseInt(args.rowsPerPage))
      .sort({ [(args.sortBy) || 'level']: args.descending === 'true' ? -1 : 1 }) // 1 ASC, -1 DESC
      .exec()
    return JSON.stringify(rs)
  } catch (e) {
    if (e instanceof Error) throw new Error(e.message)
    else throw new Error((e as any).toString())
  }
})

ipcMain.handle(`${collectionName}.getAll`, async (event, args) => {
  try {
    const conditions = { $and: [{ flag: args.flag ? parseInt(args.flag) : 1 }] }
    const rs = await Get(conditions)
    return JSON.stringify(rs)
  } catch (e) {
    if (e instanceof Error) throw new Error(e.message)
    else throw new Error((e as any).toString())
  }
})

ipcMain.handle(`${collectionName}.find`, async (event, args) => {
  try {
    if (args.id) {
      if (Types.ObjectId.isValid(args.id)) {
        if (Array.isArray(args.id)) {
          const conditions = { $and: [{ _id: { $in: args.id } }] }
          const rs = await Get(conditions).exec()
          if (!rs) return null
          return rs
        } else {
          const conditions = { $and: [{ _id: new Types.ObjectId(args.id) }] }
          const rs = await Get(conditions).exec()
          if (!rs || rs.length < 1) return null
          return JSON.stringify(rs[0])
        }
      } else {
        throw new Error('invalid')
      }
    } else if (args.key) {
      if (Array.isArray(args.key)) {
        const conditions = { $and: [{ key: { $in: args.key } }] }
        const rs = await Get(conditions).exec()
        if (!rs) return null
        return rs
      } else {
        const conditions = { $and: [{ key: args.key }] }
        const rs = await Get(conditions).exec()
        if (!rs || rs.length < 1) return null
        return JSON.stringify(rs[0])
      }
    } else return null
  } catch (e) {
    if (e instanceof Error) throw new Error(e.message)
    else throw new Error((e as any).toString())
  }
})

ipcMain.handle(`${collectionName}.exist`, async (event, args) => {
  try {
    if (!args.key) return null
    const rs = await Exist(args.key)
    if (rs) return true
    else return false
  } catch (e) {
    if (e instanceof Error) throw new Error(e.message)
    else throw new Error((e as any).toString())
  }
})

ipcMain.handle(`${collectionName}.post`, async (event, args) => {
  try {
    // check exist code
    const exist = await Exist(args.data.key)
    if (exist) throw new Error('exist') //return res.status(501).send('exist')
    // insert
    const rs = await Insert(args.data, global.authUser._id)
    if (!rs) throw new Error('invalid')//res.status(500).send('invalid')
    //Set Logger
    SetLog(collectionName, rs._id, 'insert')
    // reGet
    // rs = await FindOne({ _id: rs.data._id })
    return JSON.stringify(rs)
  } catch (e) {
    if (e instanceof Error) throw new Error(e.message)
    else throw new Error((e as any).toString())
  }
})

ipcMain.handle(`${collectionName}.put`, async (event, args) => {
  try {
    const rs = { success: [], error: [], ok: 0 }
    rs.ok = await Update(args.data)
    if (!rs) throw new Error('invalid')//res.status(500).send('invalid')
    //Set Logger
    SetLog(collectionName, args.data._id, 'update')
    return rs
  } catch (e) {
    if (e instanceof Error) throw new Error(e.message)
    else throw new Error((e as any).toString())
  }
})

ipcMain.handle(`${collectionName}.patch`, async (event, args) => {
  try {
    const rs = { success: [] as any, error: [] as any, ok: 0 }
    if (!Array.isArray(args.data)) throw new Error('invalid')//res.status(500).send('invalid')
    const session = await startSession()
    const transaction = await session.withTransaction<any>(async () => {
      for await (const id of args.data) {
        try {
          rs.ok = await Flag(id, session)
          if (!rs.ok) {
            rs.error.push(id)
            session.abortTransaction()
            break
          } else {
            rs.success.push(id)
            SetLog(collectionName, id, 'flag') // Set Log
          }
        } catch (e) {
          rs.error.push(id)
          session.abortTransaction()
          break
        }
      }
    })
    session.endSession()
    return rs
  } catch (e) {
    if (e instanceof Error) throw new Error(e.message)
    else throw new Error((e as any).toString())
  }
})

ipcMain.handle(`${collectionName}.delete`, async (event, args) => {
  try {
    const rs = { success: [] as any, error: [] as any, ok: 0 }
    if (!Array.isArray(args.data)) throw new Error('invalid')//res.status(500).send('invalid')
    const session = await startSession()
    const transaction = await session.withTransaction(async () => {
      for await (const id of args.data) {
        try {
          rs.ok = await Delete(id, session)
          if (!rs.ok) {
            rs.error.push(id)
            session.abortTransaction()
            break
          } else {
            rs.success.push(id)
            SetLog(collectionName, id, 'flag') // Set Log
          }
        } catch (e) {
          rs.error.push(id)
          session.abortTransaction()
          break
        }
      }
    })
    session.endSession()
    return rs
  } catch (e) {
    if (e instanceof Error) throw new Error(e.message)
    else throw new Error((e as any).toString())
  }
})
