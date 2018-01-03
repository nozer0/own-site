import api from '../services'
const BASE = 'http://localhost:3000/v1'

function catchHandler (err, commit) {
  let status = err.response && err.response.status
  if (status === 401) {
    commit('SHOW_LOGIN', true)
  }
  throw err
}

export default {
  async LOGIN ({ commit }, data) {
    let ret = await api(BASE).login(data)
    if (ret && ret.success) {
      commit('SET_CURRENT_USER', ret.user)
      commit('SET_CURRENT_TOKEN', ret.token)
      commit('SHOW_LOGIN', false)
    }
    return ret
  },
  async ACCESS_TOKEN ({ state, commit }, token) {
    let ret = await api(BASE, token).accessToken()
    if (ret && ret.success) {
      commit('SET_CURRENT_USER', ret.user)
      commit('SET_CURRENT_TOKEN', ret.token)
    }
    return ret
  },
  async LOGOUT ({ state, commit }) {
    let ret = await api(BASE, state.currentToken).logout()
    if (ret && ret.success) {
      commit('SET_CURRENT_USER', null)
      commit('SET_CURRENT_TOKEN', null)
    }
    return ret
  },
  async FETCH_GROUPS ({ state, commit }, groupId) {
    try {
      let data = await api(BASE, state.currentToken).fetchGroups(groupId)
      if (data) {
        commit('SET_GROUPS', data)
        commit('SET_GROUP_MAP')
      }
      return data
    } catch (err) {
      catchHandler(err, commit)
    }
  },
  async POST_GROUP ({ state, commit }, data) {
    try {
      data = await api(BASE, state.currentToken).postGroup(data)
      if (data) commit('SET_GROUP', data)
      return data
    } catch (err) {
      catchHandler(err, commit)
    }
  },
  async DELETE_GROUP ({ state, commit }, id) {
    try {
      await api(BASE, state.currentToken).deleteGroup(id)
      commit('UNSET_GROUP', id)
      return id
    } catch (err) {
      catchHandler(err, commit)
    }
  },
  async FETCH_USERS ({ state, commit }) {
    try {
      let data = await api(BASE, state.currentToken).fetchUsers()
      if (data) commit('SET_USERS', data)
      return data
    } catch (err) {
      catchHandler(err, commit)
    }
  },
  async GET_USER ({ state, commit }, id) {
    if (state.users) return state.users.find(u => u._id === id)
    try {
      let data = await api(BASE, state.currentToken).getUser(id)
      if (data) commit('SET_USER', data)
      return data
    } catch (err) {
      catchHandler(err, commit)
    }
  },
  async GET_USERNAME ({ state, commit }, id) {
    if (state.users) {
      let user = state.users.find(u => u._id === id)
      return user && user.name || ''
    }
    try {
      let name = await api(BASE, state.currentToken).getUsername(id)
      return name || ''
    } catch (err) {
      catchHandler(err, commit)
    }
  },
  async POST_USER ({ state, commit }, data) {
    try {
      data = await api(BASE, state.currentToken).postUser(data)
      if (data) commit('SET_USER', data)
      return data
    } catch (err) {
      catchHandler(err, commit)
    }
  },
  async DELETE_USER ({ state, commit }, id) {
    try {
      await api(BASE, state.currentToken).deleteUser(id)
      commit('UNSET_USER', id)
      return id
    } catch (err) {
      catchHandler(err, commit)
    }
  },
  async FETCH_ROLES ({ state, commit }) {
    let data = await api(BASE, state.currentToken).fetchRoles()
    if (data) commit('SET_ROLES', data)
    return data
  },
  async POST_ROLE ({ state, commit }, data) {
    data = await api(BASE, state.currentToken).postRole(data)
    if (data) commit('SET_ROLE', data)
    return data
  },
  async DELETE_ROLE ({ state, commit }, id) {
    await api(BASE, state.currentToken).deleteRole(id)
    commit('UNSET_ROLE', id)
    return id
  },
  QUERY_PRODUCT_NAMES ({ state, commit }, keyword) {
    try {
      return api(BASE, state.currentToken).fetchProductNames(keyword)
    } catch (err) {
      catchHandler(err, commit)
    }
  },
  async FETCH_PRODUCTS ({ state, commit }, query = { offset: 0, size: 25 }) {
    try {
      let ret = await api(BASE, state.currentToken).fetchProducts(query)
      let data = ret && ret.data
      if (!data) return
      for (let d of data) {
        d && commit('SET_PRODUCT', d)
      }
      return ret
    } catch (err) {
      catchHandler(err, commit)
    }
  },
  async GET_PRODUCT ({ state, commit }, id) {
    if (state.products[id]) return state.products[id]
    try {
      let data = await api(BASE, state.currentToken).getProduct(id)
      if (data) commit('SET_PRODUCT', data)
      return data
    } catch (err) {
      catchHandler(err, commit)
    }
  },
  async GET_PRODUCT_BY_MODEL ({ state, commit }, model) {
    let products = state.products
    for (let k in products) {
      let product = products[k]
      if (product && product.model === model) {
        return product
      }
    }
    try {
      let data = await api(BASE, state.currentToken).getProductByModel(model)
      if (data) commit('SET_PRODUCT', data)
      return data
    } catch (err) {
      catchHandler(err, commit)
    }
  },
  async POST_PRODUCT ({ state, commit }, data) {
    try {
      data = await api(BASE, state.currentToken).postProduct(data)
      if (data) commit('SET_PRODUCT', data)
      return data
    } catch (err) {
      catchHandler(err, commit)
    }
  },
  async DELETE_PRODUCT ({ state, commit }, id) {
    try {
      await api(BASE, state.currentToken).deleteProduct(id)
      commit('UNSET_PRODUCT', id)
      return id
    } catch (err) {
      catchHandler(err, commit)
    }
  },
  QUERY_COMPANY_NAMES ({ state, commit }, keyword) {
    try {
      return api(BASE, state.currentToken).fetchCompanyNames(keyword)
    } catch (err) {
      catchHandler(err, commit)
    }
  },
  async FETCH_COMPANIES ({ state, commit }, query = { offset: 0, size: 25 }) {
    try {
      let promise = api(BASE, state.currentToken).fetchCompanies(query)
      let ret = await promise
      let data = ret && ret.data
      if (!data) return
      for (let d of data) {
        if (!d) continue
        commit('SET_COMPANY', d)
        let contacts = d.contacts
        if (Array.isArray(contacts) && contacts.length) {
          for (let c of contacts) {
            c && commit('SET_CONTACT', c)
          }
        }
      }
      return ret
    } catch (err) {
      catchHandler(err, commit)
    }
  },
  async GET_COMPANY ({ state, commit }, option) {
    try {
      let withContacts = false
      if (typeof option === 'string') {
        if (state.companies[option]) return state.companies[option]
      } else {
        withContacts = option.withContacts
      }
      let data = await api(BASE, state.currentToken).getCompany(option)
      if (!data) return
      commit('SET_COMPANY', data)
      if (withContacts) {
        let contacts = data.contacts
        if (Array.isArray(contacts) && contacts.length) {
          for (let c of contacts) {
            c && commit('SET_CONTACT', c)
          }
        }
      }
      return data
    } catch (err) {
      catchHandler(err, commit)
    }
  },
  async POST_COMPANY ({ state, commit }, data) {
    try {
      data = await api(BASE, state.currentToken).postCompany(data)
      if (data) commit('SET_COMPANY', data)
      return data
    } catch (err) {
      catchHandler(err, commit)
    }
  },
  async DELETE_COMPANY ({ state, commit }, id) {
    try {
      await api(BASE, state.currentToken).deleteCompany(id)
      commit('UNSET_COMPANY', id)
      return id
    } catch (err) {
      catchHandler(err, commit)
    }
  },
  QUERY_CONTACT_NAMES ({ state, commit }, option) {
    try {
      return api(BASE, state.currentToken).fetchContactNames(option)
    } catch (err) {
      catchHandler(err, commit)
    }
  },
  async FETCH_CONTACTS ({ state, commit }, query = { offset: 0, size: 25 }) {
    try {
      let promise = api(BASE, state.currentToken).fetchContacts(query)
      if (query.simple) return promise
      let ret = await promise
      let data = ret && ret.data
      if (!data) return
      for (let d of data) {
        d && commit('SET_CONTACT', d)
      }
      return ret
    } catch (err) {
      catchHandler(err, commit)
    }
  },
  async GET_CONTACT ({ state, commit }, option) {
    try {
      if (typeof option === 'string' && state.contacts[option]) return state.contacts[option]
      let data = await api(BASE, state.currentToken).getContact(option)
      if (data) commit('SET_CONTACT', data)
      return data
    } catch (err) {
      catchHandler(err, commit)
    }
  },
  async POST_CONTACT ({ state, commit }, data) {
    try {
      data = await api(BASE, state.currentToken).postContact(data)
      if (data) commit('SET_CONTACT', data)
      return data
    } catch (err) {
      catchHandler(err, commit)
    }
  },
  async DELETE_CONTACT ({ state, commit }, id) {
    try {
      await api(BASE, state.currentToken).deleteContact(id)
      commit('UNSET_CONTACT', id)
      return id
    } catch (err) {
      catchHandler(err, commit)
    }
  },
  QUERY_PROJECT_NAMES ({ state }, keyword) {
    return api(BASE, state.currentToken).fetchProjectNames(keyword)
  },
  async FETCH_PROJECTS ({ state, commit }, query = { offset: 0, size: 25 }) {
    let promise = api(BASE, state.currentToken).fetchProjects(query)
    let ret = await promise
    let data = ret && ret.data
    if (!data) return
    for (let d of data) {
      d && commit('SET_PROJECT', d)
    }
    return ret
  },
  async GET_PROJECT ({ state, commit }, id) {
    if (state.projects[id]) return state.projects[id]
    let data = await api(BASE, state.currentToken).getProject(id)
    if (data) commit('SET_PROJECT', data)
    return data
  },
  async POST_PROJECT ({ state, commit }, data) {
    data = await api(BASE, state.currentToken).postProject(data)
    if (data) commit('SET_PROJECT', data)
    return data
  },
  async DELETE_PROJECT ({ state, commit }, id) {
    await api(BASE, state.currentToken).deleteProject(id)
    commit('UNSET_PROJECT', id)
    return id
  },
  async FETCH_INVENTORIES ({ state, commit }, query = { offset: 0, size: 25 }) {
    let promise = api(BASE, state.currentToken).fetchInventories(query)
    if (query.simple) return promise
    let ret = await promise
    let data = ret && ret.data
    if (!data) return
    for (let d of data) {
      d && commit('SET_INVENTORY', d)
    }
    return ret
  },
  async GET_INVENTORY ({ state, commit }, id) {
    if (state.inventories[id]) return state.inventories[id]
    let data = await api(BASE, state.currentToken).getInventory(id)
    if (data) commit('SET_INVENTORY', data)
    return data
  },
  async POST_INVENTORY ({ state, commit }, data) {
    data = await api(BASE, state.currentToken).postInventory(data)
    if (data) commit('SET_INVENTORY', data)
    return data
  },
  async DELETE_INVENTORY ({ state, commit }, id) {
    await api(BASE, state.currentToken).deleteInventory(id)
    commit('UNSET_INVENTORY', id)
    return id
  },
  async FETCH_VISITS ({ state, commit }, query = { offset: 0, size: 25 }) {
    let promise = api(BASE, state.currentToken).fetchVisits(query)
    if (query.simple) return promise
    let ret = await promise
    let data = ret && ret.data
    if (!data) return
    for (let d of data) {
      d && commit('SET_VISIT', d)
    }
    return ret
  },
  async GET_VISIT ({ state, commit }, id) {
    if (state.projects[id]) return state.projects[id]
    let data = await api(BASE, state.currentToken).getVisit(id)
    if (data) commit('SET_VISIT', data)
    return data
  },
  async POST_VISIT ({ state, commit }, data) {
    data = await api(BASE, state.currentToken).postVisit(data)
    if (data) commit('SET_VISIT', data)
    return data
  },
  async DELETE_VISIT ({ state, commit }, id) {
    await api(BASE, state.currentToken).deleteVisit(id)
    commit('UNSET_VISIT', id)
    return id
  },
  async FETCH_WORKORDERS ({ state, commit }, query = { offset: 0, size: 25 }) {
    let promise = api(BASE, state.currentToken).fetchWorkorders(query)
    if (query.simple) return promise
    let ret = await promise
    let data = ret && ret.data
    if (!data) return
    for (let d of data) {
      d && commit('SET_WORKORDER', d)
    }
    return ret
  },
  async GET_WORKORDER ({ state, commit }, id) {
    if (state.projects[id]) return state.projects[id]
    let data = await api(BASE, state.currentToken).getWorkorder(id)
    if (data) commit('SET_WORKORDER', data)
    return data
  },
  async POST_WORKORDER ({ state, commit }, data) {
    data = await api(BASE, state.currentToken).postWorkorder(data)
    if (data) commit('SET_WORKORDER', data)
    return data
  },
  async DELETE_WORKORDER ({ state, commit }, id) {
    await api(BASE, state.currentToken).deleteWorkorder(id)
    commit('UNSET_WORKORDER', id)
    return id
  }
}
