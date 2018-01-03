import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export function createRouter () {
  return new Router({
    mode: 'history',
    routes: [
      { path: '/', name: 'Hello', component: () => import('@/components/Hello') },
      { path: '/projects/', name: 'projects', component: () => import('@/pages/projects/index') },
      { path: '/projects/:id', name: 'project', component: () => import('@/pages/projects/id') },
      { path: '/inventories/', name: 'inventories', component: () => import('@/pages/inventories/index') },
      { path: '/inventories/:id', name: 'inventory', component: () => import('@/pages/inventories/id') },
      { path: '/visits/', name: 'visits', component: () => import('@/pages/projects/visits/index') },
      { path: '/visits/:id', name: 'visit', component: () => import('@/pages/projects/visits/id') },
      { path: '/workorders/', name: 'workorders', component: () => import('@/pages/workorders/index') },
      { path: '/workorders/:id', name: 'workorder', component: () => import('@/pages/workorders/id') },
      { path: '/products/', name: 'products', component: () => import('@/pages/products/index') },
      { path: '/products/:id', name: 'product', component: () => import('@/pages/products/id') },
      { path: '/companies/', name: 'companies', component: () => import('@/pages/companies/index'), props: (route) => ({ type: route.query.type }) },
      { path: '/companies/:id', name: 'company', component: () => import('@/pages/companies/id') },
      { path: '/contacts/', name: 'contacts', component: () => import('@/pages/contacts/index') },
      { path: '/contacts/:id', name: 'contact', component: () => import('@/pages/contacts/id') },
      { path: '/groups/', name: 'groups', component: () => import('@/pages/groups/index') },
      { path: '/groups/:id', name: 'group', component: () => import('@/pages/groups/id') },
      { path: '/users/', name: 'users', component: () => import('@/pages/users/index') },
      { path: '/users/:id', name: 'user', component: () => import('@/pages/users/id') },
      { path: '/roles/', name: 'roles', component: () => import('@/pages/roles/index') },
      { path: '/roles/:id', name: 'role', component: () => import('@/pages/roles/id') }
    ]
  })
}
