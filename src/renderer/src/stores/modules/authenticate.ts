import { defineStore } from 'pinia'
// import Cookies from 'js-cookie'
import localStorage from '../../utils/localStorage'
import { Router, addRoutes, generateRoutes, resetRouter, constant } from '../../router'
const NAMESPACED = 'authenticates'
const LOCALSTORAGE = localStorage.get(NAMESPACED) || {}
export default defineStore({
  id: NAMESPACED,
  persist: false,
  state: () => ({
    routesConstant: constant,
    token: LOCALSTORAGE.token || undefined,
    user: null,
    routes: [] as any
  }),
  getters: {},
  actions: {
    async login(args) {
      try {
        const rs = await window.electron.ipcRenderer.invoke(`${NAMESPACED}.login`, args)
        if (rs) {
          if (rs.token) this.token = rs.token
          if (rs.user) {
            this.user = rs.user
            if (rs.user.routes) {
              const routes = await generateRoutes(rs.user.routes)
              for await (const r of routes) {
                Router.addRoute(r)
              }
              this.routes = routes
            }
          }
        } else
          this.logout()
        return this.user
      } catch (e) {
        throw new Error((e as any))
      }
    },
    logout() {
      this.token = null
      this.user = null
      this.routes = []
      resetRouter()
    },
    // easily reset state using `$reset`
    clear() {
      this.$reset()
    }
  }
})
