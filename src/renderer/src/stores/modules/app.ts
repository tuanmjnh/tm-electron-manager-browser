import { defineStore } from 'pinia'
import { GetAll } from '../../i18n'
const NAMESPACED = 'app'
export default defineStore({
  id: NAMESPACED,
  persist: true,
  state: () => ({
    loading: {
      get: false,
      post: false,
      put: false,
      patch: false,
      delete: false
    },
    languages: GetAll(),//[],
    rowsPerPageOptions: [10, 20, 50, 100, 200, 0],
  }),
  getters: {},
  actions: {
    setLoading(arg) {
      if (arg) this.loading[arg.key] = arg.value
      else this.loading = {
        get: false,
        post: false,
        put: false,
        patch: false,
        delete: false
      }
    },
    // easily reset state using `$reset`
    clear() {
      this.$reset()
    }
  }
})
