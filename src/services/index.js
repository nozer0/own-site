import axios from 'axios'
// import PROJECTS from './projects.json'
import INVENTORIES from './inventories.json'
import VISITS from './visits.json'
import WORKORDERS from './workorders.json'
// import PRODUCTS from './products.json'
// import COMPANIES from './companies.json'
// import CONTACTS from './contacts.json'

/*
var users = [
  {
    id: 1,
  async   username: 'admin',
  async   password: '12345678',
  async   name: '管理员',
  async   role: -1,
  async   description: '支持WMM队列管理\n支持优先级映射\n基于客户端的智能带宽控制'
  },
  async {
    id: 2,
  async   username: 'jzy',
  async   password: '12345678',
  async   name: '金总',
  async   title: '主管',
  async   role: 1,
  async   email: 'jzy@zjjsit.com',
  async   mobiles: ['1234234', '345346'],
  async   description: '支持WMM队列管理\n支持优先级映射\n基于客户端的智能带宽控制'
  },
  async {
    id: 3,
  async   username: 'lyh',
  async   password: '12345678',
  async   name: '刘总',
  async   title: '主管',
  async   role: 0,
  async   email: 'lyh@zjjsit.com',
  async   mobiles: ['345346'],
  async   description: '支持WMM队列管理\n支持优先级映射\n基于客户端的智能带宽控制'
  },
  async {
    id: 4,
  async   username: 'xiajichang',
  async   password: '12345678',
  async   name: '夏积常',
  async   title: '售前',
  async   role: 2,
  async   email: 'xiajichang@zjjsit.com',
  async   mobiles: ['13813345435', '13813345435'],
  async   description: '支持WMM队列管理\n支持优先级映射\n基于客户端的智能带宽控制'
  },
  async {
    id: 5,
  async   username: 'gaolei',
  async   password: '12345678',
  async   name: '高磊',
  async   title: '售后',
  async   role: 3,
  async   email: 'gaolei@zjjsit.com',
  async   mobiles: ['13813345435', '13813345435'],
  async   description: '支持WMM队列管理\n支持优先级映射\n基于客户端的智能带宽控制'
  }
]

// sales:销售部, market:市场部, technology:技术部, support:运维部, finance:财务部, business:商务部, purchase:采购部, hr:行政部
var groups = [
  {
    id: 1,
  async   name: '销售部',
  async   description: '支持WMM队列管理\n支持优先级映射\n基于客户端的智能带宽控制',
  async   email: '',
  async   phone: '',
  async   fax: '',
  async   leaders: [2],
  async   members: [],
  async   roles: []
  },
  async {
    id: 2,
  async   name: '技术部',
  async   leaders: [3],
  async   members: [],
  async   description: '支持WMM队列管理\n支持优先级映射\n基于客户端的智能带宽控制',
  async   email: ''
  },
  async {
    id: 3,
  async   parentId: 2,
  async   name: '支持部',
  async   description: '支持WMM队列管理\n支持优先级映射\n基于客户端的智能带宽控制',
  async   email: ''
  },
  async {
    id: 4,
  async   parentId: 2,
  async   name: '运维部',
  async   description: '支持WMM队列管理\n支持优先级映射\n基于客户端的智能带宽控制',
  async   email: ''
  },
  async {
    id: 5,
  async   name: '财务部',
  async   description: '支持WMM队列管理\n支持优先级映射\n基于客户端的智能带宽控制',
  async   email: ''
  },
  async {
    id: 6,
  async   name: '商务部',
  async   description: '支持WMM队列管理\n支持优先级映射\n基于客户端的智能带宽控制',
  async   email: ''
  },
  async {
    id: 7,
  async   name: '采购部',
  async   description: '支持WMM队列管理\n支持优先级映射\n基于客户端的智能带宽控制',
  async   email: ''
  },
  async {
    id: 8,
  async   name: '行政部',
  async   description: '支持WMM队列管理\n支持优先级映射\n基于客户端的智能带宽控制',
  async   email: ''
  },
  async {
    id: 9,
  async   parentId: 3,
  async   name: '支持1部',
  async   leaders: [4],
  async   description: '支持WMM队列管理\n支持优先级映射\n基于客户端的智能带宽控制',
  async   email: ''
  },
  async {
    id: 10,
  async   parentId: 3,
  async   name: '支持2部',
  async   description: '支持WMM队列管理\n支持优先级映射\n基于客户端的智能带宽控制',
  async   email: ''
  }
]
*/

var roles = [
  {
    id: 1,
    name: '管理员',
    perms: {
      'companies': [3, {
        'sales': 1,
        'market': 2
      }]
    }
  },
  {
    id: 2,
    name: '大队长',
    description: '支持WMM队列管理\n支持优先级映射\n基于客户端的智能带宽控制'
  },
  {
    id: 35,
    name: '中队长',
    description: '支持WMM队列管理\n支持优先级映射\n基于客户端的智能带宽控制'
  }
]

// const productNamesModels = []
// PRODUCTS.forEach(p => {
//   if (!productNamesModels.includes(p.model)) productNamesModels.push(p.model)
// })
// PRODUCTS.forEach(p => {
//   if (!productNamesModels.includes(p.name)) productNamesModels.push(p.name)
// })

// CONTACTS.forEach(c => {
//   let cid = c.companyId
//   let company = COMPANIES.find(v => v.id === cid)
//   c.companyName = company && company.name
// })

let maxId = 9

var fetchings = {
  groups: null,
  users: null,
  products: null,
  companyNames: {},
  contactNames: {},
  productNames: {},
  projectNames: {}
}
var gettings = {
  users: {},
  usernames: {},
  companies: {},
  contacts: {},
  products: {},
  projects: {}
}

var apis = {
  async login (data) {
    let res = await axios.post('/login', data)
    return res && res.data
  },
  async accessToken () {
    let res = await axios.get('/accessToken')
    return res && res.data
  },
  async logout () {
    let res = await axios.post('/logout')
    return res && res.data
  },

  /* ************** group ***************/
  async fetchGroups () {
    let p = fetchings.groups
    if (!p) {
      p = fetchings.groups = axios.get('/groups')
    }
    try {
      let res = await p
      return res && res.data
    } finally {
      fetchings.groups = null
    }
  },
  async postGroup (data) {
    let res = await (data._id ? axios.put('/groups/' + data._id, data) : axios.post('/groups', data))
    return res && res.data
  },
  async deleteGroup (id) {
    let res = await axios.delete('/groups/' + id)
    return res && res.data
  },

  /* ************** user ***************/
  async fetchUsers () {
    let p = fetchings.users
    if (!p) {
      p = fetchings.users = axios.get('/users')
    }
    try {
      let res = await p
      return res && res.data
    } finally {
      fetchings.users = null
    }
  },
  async getUser (id) {
    let p = gettings.users[id]
    if (!p) {
      p = gettings.users[id] = axios.get('/users/' + id)
    }
    try {
      let res = await p
      return res && res.data
    } finally {
      gettings.users[id] = null
    }
  },
  async getUsername (id) {
    let p = gettings.users[id]
    if (!p) {
      p = gettings.users[id] = axios.get('/users/names/' + id)
    }
    try {
      let res = await p
      return res && res.data
    } finally {
      gettings.usernames[id] = null
    }
  },
  async postUser (data) {
    let res = await (data._id ? axios.put('/users/' + data._id, data) : axios.post('/users', data))
    return res && res.data
  },
  async deleteUser (id) {
    let res = await axios.delete('/users/' + id)
    return res && res.data
  },

  /* ************** role ***************/
  fetchRoles () {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(roles)
      }, 300)
    })
  },
  async postRole (role) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(role)
      }, 300)
    })
  },
  async deleteRole (roleId) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(roleId)
      }, 300)
    })
  },

  /* ************** product ***************/
  async fetchProductNames (keyword) {
    let p = fetchings.productNames[keyword]
    if (!p) {
      p = fetchings.productNames[keyword] = axios.get('/products/names?keyword=' + keyword)
    }
    try {
      let res = await p
      return res && res.data
    } finally {
      fetchings.productNames[keyword] = null
    }
  },
  async fetchProducts (query) {
    let res = await axios.get('/products', { params: query })
    return res && res.data
  },
  async getProduct (id) {
    let p = gettings.products[id]
    if (!p) {
      p = gettings.products[id] = axios.get('/products/' + id)
    }
    try {
      let res = await p
      return res && res.data
    } finally {
      gettings.products[id] = null
    }
  },
  async getProductByModel (model) {
    let p = gettings.products[model]
    if (!p) {
      p = gettings.products[model] = axios.get('/products?model=' + model)
    }
    try {
      let res = await p
      return res && res.data
    } finally {
      gettings.products[model] = null
    }
  },
  async postProduct (data) {
    let res = await (data._id ? axios.put('/products/' + data._id, data) : axios.post('/products', data))
    return res && res.data
  },
  async deleteProduct (id) {
    let res = await axios.delete('/products/' + id)
    return res && res.data
  },

  /* ************** company ***************/
  async fetchCompanyNames (option) {
    if (typeof option === 'string') {
      let p = fetchings.companyNames[option]
      if (!p) {
        p = fetchings.companyNames[option] = axios.get('/companies/names' + (option ? '?keyword=' + option : ''))
      }
      try {
        let res = await p
        return res && res.data
      } finally {
        fetchings.companyNames[option] = null
      }
    }
    let res = await axios.get('/companies/names?keyword=' + option.keyword + '&type=' + option.type)
    return res && res.data
  },
  async fetchCompanies (query) {
    let res = await axios.get('/companies', { params: query })
    return res && res.data
    // return new Promise((resolve, reject) => {
    //   axios.get('/companies', { params: query }).then(res => {
    //     resolve(res && res.data)
    //   }).catch(reject)
    // })
  },
  async getCompany (option) {
    if (typeof option === 'string') {
      let p = gettings.contacts[option]
      if (!p) {
        p = gettings.contacts[option] = axios.get('/companies/' + option)
      }
      try {
        let res = await p
        return res && res.data
      } finally {
        gettings.companies[option] = null
      }
    }
    let res = await axios.get('/companies/' + option.id + (option.withCompanyName ? '?withCompanyName=1' : ''))
    return res && res.data
  },
  async postCompany (data) {
    let res = await (data._id ? axios.put('/companies/' + data._id, data) : axios.post('/companies', data))
    return res && res.data
    // return new Promise((resolve, reject) => {
    //   let promise = data._id ? axios.put('/companies/' + data._id, data) : axios.post('/companies', data)
    //   promise.then(res => {
    //     resolve(res && res.data)
    //   }).catch(reject)
    // })
  },
  async deleteCompany (id) {
    let res = await axios.delete('/companies/' + id)
    return res && res.data
  },

  /* ************** contact ***************/
  async fetchContactNames (option) {
    if (typeof option === 'string') {
      let p = fetchings.contactNames[option]
      if (!p) {
        p = fetchings.contactNames[option] = axios.get('/contacts/names' + (option ? '?keyword=' + option : ''))
      }
      try {
        let res = await p
        return res && res.data
      } finally {
        fetchings.contactNames[option] = null
      }
    }
    let res = await axios.get('/contacts/names', { params: option })
    return res && res.data
  },
  async fetchContacts (query) {
    let res = await axios.get('/contacts', { params: query })
    return res && res.data
  },
  async getContact (option) {
    if (typeof option === 'string') {
      let p = gettings.contacts[option]
      if (!p) {
        p = gettings.contacts[option] = axios.get('/contacts/' + option)
      }
      try {
        let res = await p
        return res && res.data
      } finally {
        gettings.contacts[option] = null
      }
    }
    let res = await axios.get('/contacts/' + option.id, { params: option })
    return res && res.data
  },
  async postContact (data) {
    let res = await (data._id ? axios.put('/contacts/' + data._id, data) : axios.post('/contacts', data))
    return res && res.data
  },
  async deleteContact (id) {
    let res = await axios.delete('/contacts/' + id)
    return res && res.data
  },

  /* ************** project ***************/
  async fetchProjectNames (option) {
    if (typeof option === 'string') {
      let p = fetchings.projectNames[option]
      if (!p) {
        p = fetchings.projectNames[option] = axios.get('/projects/names' + (option ? '?keyword=' + option : ''))
      }
      try {
        let res = await p
        return res && res.data
      } finally {
        fetchings.projectNames[option] = null
      }
    }
    let res = await axios.get('/projects/names', { params: option })
    return res && res.data
  },
  async fetchProjects (query) {
    let res = await axios.get('/projects', { params: query })
    return res && res.data
  },
  async getProject (id) {
    let p = gettings.projects[id]
    if (!p) {
      p = gettings.projects[id] = axios.get('/projects/' + id)
    }
    try {
      let res = await p
      return res && res.data
    } finally {
      gettings.projects[id] = null
    }
  },
  async postProject (data) {
    let res = await (data._id ? axios.put('/projects/' + data._id, data) : axios.post('/projects', data))
    return res && res.data
  },
  async deleteProject (id) {
    let res = await axios.delete('/projects/' + id)
    return res && res.data
  },

  /* ************** inventory ***************/
  fetchInventories ({ category, vendor, name, offset, size = 25 }) {
    return new Promise(resolve => {
      setTimeout(() => {
        if (category || vendor || name) {
          name = name && name.toLowerCase()
          let data = INVENTORIES.filter(v => {
            return (!category || v.category === category) && (!vendor || v.vendor === vendor) && (!name || v.name.toLowerCase().indexOf(name) !== -1 || v.model.toLowerCase().indexOf(name) !== -1)
          })
          resolve({ data: data, total: 100 })
        } else {
          resolve({ data: INVENTORIES, total: INVENTORIES.length })
        }
      }, 300)
    })
  },
  getInventory (id) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(INVENTORIES.find(p => p.id === id))
      }, 300)
    })
  },
  postInventory (data) {
    return new Promise(resolve => {
      setTimeout(() => {
        if (!data.id) data.id = ++maxId
        resolve(data)
      }, 300)
    })
  },
  deleteInventory (id) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(id)
      }, 300)
    })
  },

  /* ************** visit ***************/
  fetchVisits ({ projectId, createdBy, offset, size = 25 }) {
    return new Promise(resolve => {
      setTimeout(() => {
        if (projectId || createdBy) {
          let data = VISITS.filter(v => {
            return (!projectId || v.projectId === projectId) && (!createdBy || v.createdBy === createdBy)
          })
          resolve({ data: data, total: 100 })
        } else {
          resolve({ data: VISITS, total: VISITS.length })
        }
      }, 300)
    })
  },
  getVisit (id) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(VISITS.find(p => p.id === id))
      }, 300)
    })
  },
  postVisit (data) {
    return new Promise(resolve => {
      setTimeout(() => {
        if (!data.id) data.id = ++maxId
        resolve(data)
      }, 300)
    })
  },
  deleteVisit (id) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(id)
      }, 300)
    })
  },

  /* ************** workorder ***************/
  fetchWorkorders ({ step, projectId, assignee, createdBy, offset, size = 25 }) {
    return new Promise(resolve => {
      setTimeout(() => {
        let stepFilter = Number.isInteger(step)
        if (assignee || projectId || stepFilter || createdBy) {
          let data = WORKORDERS.filter(v => {
            return (!projectId || v.projectId === projectId) && (!stepFilter || v.step === step) && (!createdBy || v.createdBy === createdBy) && (!assignee || (Array.isArray(v.assignee) ? v.assignee.includes(assignee) : v.assignee === assignee))
          })
          resolve({ data: data, total: 100 })
        } else {
          resolve({ data: WORKORDERS, total: WORKORDERS.length })
        }
      }, 300)
    })
  },
  getWorkorder (id) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(WORKORDERS.find(p => p.id === id))
      }, 300)
    })
  },
  postWorkorder (data) {
    return new Promise(resolve => {
      setTimeout(() => {
        if (!data.id) data.id = ++maxId
        resolve(data)
      }, 300)
    })
  },
  deleteWorkorder (id) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(id)
      }, 300)
    })
  }
}

axios.defaults.withCredentials = true

export default function (baseURL = '', token = null) {
  axios.defaults.baseURL = baseURL || 'http://localhost:3000/v1'
  if (token) axios.defaults.headers.common['Authorization'] = token
  return apis
}
