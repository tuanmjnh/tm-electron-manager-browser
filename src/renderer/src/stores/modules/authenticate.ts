import { defineStore } from 'pinia'
// import Cookies from 'js-cookie'
import localStorage from '../../utils/localStorage'
import { Router, addRoutes, generateRoutes, resetRouter, constant } from '../../router'
import { api } from '../../plugins/axios'
const NAMESPACED = 'authenticate'
const LOCALSTORAGE = localStorage.get(NAMESPACED) || {}
export default defineStore({
  id: NAMESPACED,
  persist: true,
  state: () => ({
    routesConstant: constant,
    token: LOCALSTORAGE.token || undefined,
    user: null,
    routes: [] as any
  }),
  getters: {},
  actions: {
    async login(arg) {
      try {
        const rs = await api.post(`/${NAMESPACED}`, arg)
        if (rs) {
          if (rs.token) this.token = rs.token
          if (rs.user) {
            this.user = rs.user
            if (rs.user.routes) {
              const routes = await generateRoutes(rs.user.routes)
              addRoutes(routes, true)
              this.routes = routes
            }
          }
        }
        return this.user
      } catch (e) {
        return null
      }
    },
    async verify(arg) {
      let rs: any = null
      try {
        // api.post(`/${NAMESPACED}`, arg).then(x => {
        //   console.log(x)
        // })
        if (arg) rs = await api.post(`/${NAMESPACED}`, arg)
        else rs = await api.get(`/${NAMESPACED}`, { arg })
        // console.log(rs)
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
        } else {
          this.token = null
          this.user = null
          this.routes = []
          resetRouter()
        }
        return rs
      } catch (e) {
        return rs
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
