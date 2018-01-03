import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'

Vue.use(Vuex)

export function createStore () {
  return new Vuex.Store({
    // strict: true,
    state: {
      showLogin: false,
      currentUser: null,
      currentToken: null,
      users: null,
      groups: null,
      roles: null,
      companies: {},
      contacts: {},
      products: {},
      projects: {},
      inventories: {},
      visits: {},
      workorders: {}
    },
    actions,
    mutations,
    getters
  })
}
