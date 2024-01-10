import { createApp } from 'vue'
import { i18n } from './i18n'
import { pinia } from './stores'
import { library, dom } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
// import { fab } from '@fortawesome/free-brands-svg-icons'
// import { far } from '@fortawesome/free-regular-svg-icons'
import router from './router'
import plugins from './plugins'
import App from './App.vue'
import 'element-plus/dist/index.css'
// import './styles/index.scss'
// If you want to use ElMessage, import it.
import 'element-plus/theme-chalk/dark/css-vars.css'
import './styles/element-plus-extra.scss'
import './styles/flag.css'
import './plugins/middleware'
//ts
// window.electronAPI.loadPreferences()
//fortawesome
library.add(fas) //fas,fab
dom.watch()

const app = createApp(App)
app.use(pinia)
app.use(i18n)
app.use(router)
app.component('font-awesome-icon', FontAwesomeIcon)
plugins(app)
app.mount('#app')
