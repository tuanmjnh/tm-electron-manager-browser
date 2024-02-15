import fakeLayout from '../layouts/fake-layout.vue'
export const constant = [
  {
    path: '',
    redirect: '/dashboard',
    meta: { constant: true, hidden: true },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    meta: { title: 'dashboard', icon: 'fa-house', constant: true },
    component: () => import('../pages/dashboard/index.vue')
  },
  // {
  //   path: '/window',
  //   name: 'window',
  //   meta: { title: 'window', icon: 'fa-bell', constant: true },
  //   component: () => import('../pages/window/index.vue')
  // },
  // {
  //   path: '/dialog',
  //   name: 'dialog',
  //   meta: { title: 'dialog', icon: 'fa-bell' },
  //   component: () => import('../pages/dialog/index.vue')
  // },
  {
    path: '/profiles',
    name: 'profiles',
    meta: { title: 'profiles', icon: 'fa-folder-open' },
    component: fakeLayout,
    children: [
      {
        path: 'view',
        name: 'profiles-view',
        meta: { parent: 'profiles', title: 'list', icon: 'fa-list' },
        component: () => import('../pages/profiles/index.vue'),
      },
      {
        path: 'add',
        name: 'profiles-add',
        meta: { parent: 'profiles', title: 'add', icon: 'fa-plus' },
        component: () => import('../pages/profiles/add.vue'),
      },
      {
        path: 'edit/:id',
        name: 'profiles-edit',
        meta: { parent: 'profiles', title: 'edit', icon: 'fa-edit', hidden: true },
        component: () => import('../pages/profiles/add.vue')
      },
      {
        path: 'import',
        name: 'profiles-import',
        meta: { parent: 'profiles', title: 'import', icon: 'fa-file-import' },
        component: () => import('../pages/profiles/import.vue'),
      },
    ]
  },
  {
    path: '/settings',
    name: 'settings',
    meta: { title: 'setting', icon: 'fa-gears', hidden: true },
    component: () => import('../pages/settings/index.vue')
  },
  {
    path: '/users',
    name: 'users',
    meta: { title: 'users', icon: 'fa-user' },
    component: fakeLayout,
    children: [
      {
        path: 'view',
        name: 'users-view',
        meta: { title: 'list', icon: 'fa-list' },
        component: () => import('../pages/users/index.vue'),
      },
      {
        path: 'add',
        name: 'users-add',
        meta: { title: 'add', icon: 'fa-plus' },
        component: () => import('../pages/users/add.vue'),
      }
    ]
  },
  {
    path: '/roles',
    name: 'roles',
    meta: { title: 'roles', icon: 'fa-key' },
    component: fakeLayout,
    children: [
      {
        path: 'view',
        name: 'roles-view',
        meta: { parent: 'roles', title: 'list', icon: 'fa-list' },
        component: () => import('../pages/roles/index.vue'),
      },
      {
        path: 'add',
        name: 'roles-add',
        meta: { parent: 'roles', title: 'add', icon: 'fa-plus' },
        component: () => import('../pages/roles/add.vue'),
      },
      {
        path: 'edit/:id',
        name: 'roles-edit',
        meta: { parent: 'roles', title: 'edit', icon: 'fa-edit', hidden: true },
        component: () => import('../pages/roles/add.vue')
      },
    ]
  },
  // {
  //   path: '/about',
  //   name: 'about',
  //   meta: { title: 'about', icon: 'fa-bell' },
  //   component: () => import('../pages/about/index.vue')
  // },
  {
    path: '/login',
    name: 'login',
    meta: { title: 'login', icon: 'login', constant: true, hidden: true },
    component: () => import('../pages/login/index.vue')
  }
]

if (import.meta.env.MODE !== 'ssr') {
  constant.push({
    path: '/:catchAll(.*)*',
    name: '404',
    meta: { title: 'error404', icon: '404', constant: true, hidden: true },
    component: () => import('../pages/error/error404.vue')
  })
}

export const dynamic = [

]
