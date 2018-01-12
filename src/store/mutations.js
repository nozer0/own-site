// import { SET_CURRENT_ROLE } from './mutation-types.js'
import localStorage from '@/util/localStorage'

export default {
  SHOW_LOGIN (state, showLogin) {
    state.showLogin = showLogin
  },
  SET_CURRENT_USER (state, user) {
    state.currentUser = user
  },
  SET_CURRENT_TOKEN (state, token) {
    state.currentToken = token
    if (token) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }
  },
  SET_CURRENT_VIEW (state, view) {
    state.currentView = view
  },
  SET_GROUPS (state, groups) {
    state.groups = groups
  },
  SET_GROUP_MAP ({ groups }) {
    if (!groups) return
    for (let g of groups) {
      let parentId = g.parent
      if (parentId) {
        let parent = groups.find(g => g._id === parentId)
        if (parent) {
          let children = parent.children
          if (children) {
            children.push(g)
          } else {
            parent.children = [g]
          }
        }
      }
    }
  },
  SET_GROUP ({ groups }, data) {
    if (!groups) return
    let id = data._id
    for (let i in groups) {
      let v = groups[i]
      if (v._id === id) {
        groups.splice(i, 1, data)
        return
      }
    }
    groups.push(data)
  },
  UNSET_GROUP ({ groups }, id) {
    if (!groups) return
    for (let i in groups) {
      let r = groups[i]
      if (r.id === id) {
        groups.splice(i, 1)
        return
      }
    }
  },
  SET_USERS (state, users) {
    state.users = users
    let usernames = state.userNames || (state.userNames = {})
    for (let u of users) {
      usernames[u._id] = u
    }
    state.FETCH_ALL_USERS = true
    state.FETCH_ALL_USERNAMES = true
  },
  FETCH_ALL_USERS (state, all) {
    state.FETCH_ALL_USERS = all
  },
  SET_USER ({ users, userNames }, data) {
    let id = data._id
    users[id] = data
    userNames[id] = data
  },
  UNSET_USER ({ users, userNames }, id) {
    delete users[id]
    delete userNames[id]
  },
  SET_USERNAMES (state, names) {
    let usernames = state.userNames || (state.userNames = {})
    for (let u of names) {
      usernames[u._id] = u
    }
  },
  SET_USERNAME (state, name) {
    let d = state.userNames[name._id]
    if (d) {
      d.name = name.name
    } else {
      state.userNames[name._id] = name
    }
  },
  FETCH_ALL_USERNAMES (state, all) {
    state.FETCH_ALL_USERNAMES = all
  },
  SET_ROLES (state, roles) {
    state.roles = roles
  },
  SET_ROLE ({ roles }, data) {
    if (!roles) return
    let id = data.id
    for (let i in roles) {
      let r = roles[i]
      if (r.id === id) {
        roles.splice(i, 1, data)
        return
      }
    }
    roles.push(data)
  },
  UNSET_ROLE ({ roles }, id) {
    if (!roles) return
    for (let i in roles) {
      let r = roles[i]
      if (r.id === id) {
        roles.splice(i, 1)
        return
      }
    }
  },
  SET_PRODUCT ({ products }, data) {
    products[data._id] = data
  },
  UNSET_PRODUCT ({ products }, id) {
    delete products[id]
  },
  SET_COMPANY ({ companies }, data) {
    companies[data._id] = data
  },
  UNSET_COMPANY ({ companies }, id) {
    delete companies[id]
  },
  SET_CONTACT ({ contacts }, data) {
    contacts[data._id] = data
  },
  UNSET_CONTACT ({ contacts }, id) {
    delete contacts[id]
  },
  SET_PROJECT ({ projects }, data) {
    projects[data._id] = data
  },
  UNSET_PROJECT ({ projects }, id) {
    delete projects[id]
  },
  SET_INVENTORY ({ inventories }, data) {
    inventories[data._id] = data
  },
  UNSET_INVENTORY ({ inventories }, id) {
    delete inventories[id]
  },
  SET_VISIT ({ visits }, data) {
    visits[data._id] = data
  },
  UNSET_VISIT ({ visits }, id) {
    delete visits[id]
  },
  SET_WORKORDER ({ workorders }, data) {
    workorders[data._id] = data
  },
  UNSET_WORKORDER ({ workorders }, id) {
    delete workorders[id]
  }
}
