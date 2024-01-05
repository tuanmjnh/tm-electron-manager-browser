import fakeLayout from '../layouts/fake-layout.vue'
export const constant = [
  {
    path: '',
    redirect: '/dashboard',
    meta: { hidden: true },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    meta: { title: 'dashboard', icon: 'fa-house' },
    component: () => import('../pages/dashboard/index.vue')
  },
  // {
  //   path: '/window',
  //   name: 'window',
  //   meta: { title: 'window', icon: 'fa-bell' },
  //   component: () => import('../pages/window/index.vue')
  // },
  // {
  //   path: '/dialog',
  //   name: 'dialog',
  //   meta: { title: 'dialog', icon: 'fa-bell' },
  //   component: () => import('../pages/dialog/index.vue')
  // },
  // {
  //   path: '/data',
  //   name: 'data',
  //   meta: { title: 'data', icon: 'fa-database' },
  //   component: fakeLayout,
  //   children: [
  //     {
  //       path: 'table',
  //       name: 'table',
  //       meta: { title: 'table', icon: 'fa-table' },
  //       component: () => import('../pages/table/index.vue'),
  //     },
  //     {
  //       path: 'tree',
  //       name: 'tree',
  //       meta: { title: 'tree', icon: 'fa-tree' },
  //       component: () => import('../pages/tree/index.vue'),
  //     }
  //   ]
  // },
  // {
  //   path: '/about',
  //   name: 'about',
  //   meta: { title: 'about', icon: 'fa-bell' },
  //   component: () => import('../pages/about/index.vue')
  // },
  {
    path: '/login',
    name: 'login',
    meta: { title: 'login', icon: 'login', hidden: true },
    component: () => import('../pages/login/index.vue')
  }
]

if (import.meta.env.MODE !== 'ssr') {
  constant.push({
    path: '/:catchAll(.*)*',
    name: '404',
    meta: { title: 'error404', icon: '404', hidden: true },
    component: () => import('../pages/error/error404.vue')
  })
}

export const dynamic = []
