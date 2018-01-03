export default {
  groupTree (state) {
    let groups = state.groups
    if (!groups) return []
    const tree = []
    for (let d of groups) {
      let parent = d.parent
      if (parent) {
        let parent = groups.find(g => g._id === parent)
        if (parent) {
          let children = parent.groups || (parent.groups = [])
          children.push(d)
        }
      } else {
        tree.push(d)
      }
    }
    return tree
  },
  newRoleId (state) {
    let newId = 0
    if (!state.roles) return 1
    for (let role of state.roles) {
      if (role.id > newId) newId = role.id
    }
    return +newId + 1
  },
  managers (state) {
    let users = state.users
    return users ? users.filter(u => u.role === 0) : []
  },
  salesmen (state) {
    let users = state.users
    return users ? users.filter(u => u.role === 1) : []
  },
  supportmen (state) {
    let users = state.users
    return users ? users.filter(u => u.role === 2) : []
  },
  engineers (state) {
    let users = state.users
    return users ? users.filter(u => u.role === 3) : []
  },
  techonicians (state) {
    let users = state.users
    return users ? users.filter(u => u.role === 2 || u.role === 3) : []
  },
  // ids of the items that should be currently displayed based on
  // current list type and current pagination
  activeIds (state) {
    const { activeType, itemsPerPage, lists } = state

    if (!activeType) {
      return []
    }

    const page = Number(state.route.params.page) || 1
    const start = (page - 1) * itemsPerPage
    const end = page * itemsPerPage

    return lists[activeType].slice(start, end)
  },

  // items that should be currently displayed.
  // this Array may not be fully fetched.
  activeItems (state, getters) {
    return getters.activeIds.map(id => state.items[id]).filter(_ => _)
  }
}
