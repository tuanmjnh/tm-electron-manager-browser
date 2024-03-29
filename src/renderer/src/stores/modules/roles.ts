import { defineStore } from 'pinia'
import localStorage from '../../utils/localStorage'
const NAMESPACED = 'roles'
const LOCALSTORAGE = localStorage.get(NAMESPACED) || {}
interface MRoles {
  _id?: string,
  key: string,
  name: string,
  desc: string,
  level: number,
  color: string,
  routes?: Array<string>,
  flag: number,
  created: any
}
const constant = ({
  _id: undefined,
  key: '',
  name: '',
  desc: '',
  level: 1,
  color: '#027be3',
  routes: [],
  flag: 1,
  created: undefined
}) as MRoles
export default defineStore({
  id: NAMESPACED,
  persist: true,
  state: () => ({
    items: LOCALSTORAGE.items || [],
    item: { ...constant }
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
    // easily reset state using `$reset`
    clear() {
      this.$reset()
    }
  }
})
