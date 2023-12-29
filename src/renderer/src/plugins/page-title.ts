import { Router } from '../router'
import { i18n } from '../i18n'

const i18nGet = (str) => {
  if (!str) return ''
  return str.split('-').map(x => i18n.global.t(`route.${x}`)).join(' ')
  // return i18n.global.t(`route.${str}`)
}

Router.afterEach((to, from) => {
  // Use next tick to handle router history correctly
  // see: https://github.com/vuejs/vue-router/issues/914#issuecomment-384477609
  // Vue.nextTick(() => {
  //     document.title = to.meta.title || DEFAULT_TITLE;
  // })
  // console.log(to.meta)
  // console.log(`${document.title} - ${to.meta.titles}`)
  // ${i18n.global.t('success.update')
  document.title = to.meta.title ? `${import.meta.env.RENDERER_VITE_TITLE} - ${i18nGet(to.meta.title)}` : import.meta.env.RENDERER_VITE_TITLE
})
export { }
