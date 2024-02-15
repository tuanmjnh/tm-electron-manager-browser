import { defineStore } from 'pinia'
import { IProfiles, IProxy, IAccount } from '../../../../interfaces/IProfiles'
import localStorage from '../../utils/localStorage'
const NAMESPACED = 'profiles'
const LOCALSTORAGE = localStorage.get(NAMESPACED) || {}
const constant = ({
  _id: undefined,
  key: '',
  name: '',
  browserType: 'chrome',
  browserVersion: '',
  userAgent: '',
  proxies: [] as any,
  // proxyType: '',
  // proxyHost: '',
  // proxyPort: '',
  // proxyUsername: '',
  // proxyPassword: '',
  location: { auto: true },//{ latitude: undefined, longitude: undefined },
  timezone: { auto: true },
  webRTC: '',
  startUrl: 'https://ipfighter.com',
  extensions: '',
  accounts: [] as any,
  desc: '',
  order: 1,
  flag: 1,
  created: undefined
}) as IProfiles
export default defineStore({
  id: NAMESPACED,
  persist: true,
  state: () => ({
    items: LOCALSTORAGE.items || [],
    item: { ...constant },
    proxyType: [
      { label: 'No Proxy', value: '' },
      { label: 'HTTP', value: 'http' },
      { label: 'HTTPS', value: 'https' },
      { label: 'SOCKS V4', value: 'socks4' },
      { label: 'SOCKS V5', value: 'socks5' },
    ],
    accountType: [
      {
        label: 'Gmail',
        key: 'gmail',
        value: 'https://accounts.google.com/ServiceLogin?service=mail',
      }
    ]
  }),
  getters: {},
  actions: {
    async set(args) {
      if (args) this.item = args
      else this.item = JSON.parse(JSON.stringify(constant))
      return this.item
    },
    async get(args) {
      const rs = JSON.parse(await window.electron.ipcRenderer.invoke(`${NAMESPACED}.get`, args))
      if (rs && rs.data) this.items = rs.data
      return rs
      // return api.get(collection, { params }).then((res) => {
      //   if (res && res.data) {
      //     const page = JSON.parse(JSON.stringify(params))
      //     page.rowsNumber = res.rowsNumber
      //     page.totalPage = Math.ceil(res.rowsNumber / params.rowsPerPage)
      //     if (scroll) {
      //       commit('CONCAT_ITEMS', res.data)
      //       page.page = page.page + 1
      //     } else commit('SET_ITEMS', res.data)
      //     commit('SET_PAGINATION', page)
      //   }
      // })
    },
    async find(args) {
      try {
        const rs = JSON.parse(await window.electron.ipcRenderer.invoke(`${NAMESPACED}.find`, args))
        if (rs) return rs
        else return null
      } catch (e) {
        return null
      }
    },
    async post(args) {
      try {
        const rs = JSON.parse(await window.electron.ipcRenderer.invoke(`${NAMESPACED}.post`, args))
        if (rs) {
          if (Array.isArray(rs)) this.items.concat(rs)
          else this.items.push(rs)
          return rs
        }
        return null
      } catch (e) {
        throw new Error((e as any))
        // if (e instanceof Error) throw new Error(e.message)
        // else throw new Error((e as any).toString())
      }
    },
    async put(args) {
      try {
        const rs = JSON.parse(await window.electron.ipcRenderer.invoke(`${NAMESPACED}.put`, args))
        if (args) {
          if (Array.isArray(args)) {
            args.forEach(e => {
              const i = this.items.findIndex(x => x._id === e._id)
              if (i > -1) this.items.splice(i, 1, e)
            })
          } else {
            const i = this.items.findIndex(x => x._id === args._id)
            if (i > -1) this.items.splice(i, 1, args)
          }
          return args
        }
        return null
      } catch (e) {
        throw new Error((e as any))
        // if (e instanceof Error) throw new Error(e.message)
        // else throw new Error((e as any).toString())
      }
    },
    async patch(args) {
      try {
        const rs = JSON.parse(await window.electron.ipcRenderer.invoke(`${NAMESPACED}.patch`, args))
        if (Array.isArray(rs.s)) {
          rs.s.forEach(e => {
            const i = this.items.findIndex(x => x._id === e)
            if (i > -1) this.items.splice(i, 1)
          })
        } else {
          const i = this.items.findIndex(x => x._id === rs)
          if (i > -1) this.items.splice(i, 1)
        }
        return rs
      } catch (e) {
        throw new Error((e as any))
      }
    },
    async delete(args) {
      try {
        const rs = JSON.parse(await window.electron.ipcRenderer.invoke(`${NAMESPACED}.delete`, args))
        if (Array.isArray(rs)) {
          rs.forEach(e => {
            const i = this.items.findIndex(x => x._id === e)
            if (i > -1) this.items.splice(i, 1)
          })
        } else {
          const i = this.items.findIndex(x => x._id === rs)
          if (i > -1) this.items.splice(i, 1)
        }
        return rs
      } catch (e) {
        throw new Error((e as any))
      }
    },
    async import(args) {
      try {
        const result = { data: [] as any, success: [] as any, error: [] as any }
        const data = args.txt.split('\n')
        for await (const e of data) {
          const r = e.split(':')
          if (r.length > 10) {
            const proxy: IProxy = {
              type: r[3],
              host: r[4],
              port: r[5],
              username: r[6],
              password: r[7]
            }
            const account: IAccount = {
              type: r[8],
              username: r[9],
              password: r[10]
            }
            const row: IProfiles = {
              key: r[0].removeCharsFolder(),
              name: r[0],
              browserType: r[1],
              browserVersion: '',
              userAgent: r[2] || '',
              proxies: [proxy],
              // proxyType: '',
              // proxyHost: '',
              // proxyPort: '',
              // proxyUsername: '',
              // proxyPassword: '',
              location: { auto: true },//{ latitude: undefined, longitude: undefined },
              timezone: { auto: true },
              webRTC: '',
              startUrl: 'https://ipfighter.com',
              extensions: '',
              accounts: [account],
              desc: '',
              order: 1,
              flag: 1,
              created: undefined
            }
            result.data.push(row)
            const rs = JSON.parse(await window.electron.ipcRenderer.invoke(`${NAMESPACED}.post`, row))
            if (rs.error) result.error.push(row)
            else result.success.push(row)
          }
        }
        return result
      } catch (e) {
        throw new Error((e as any))
      }
    },
    // easily reset state using `$reset`
    clear() {
      this.$reset()
    }
  }
})
