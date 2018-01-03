export default {
  BASE: 'http://localhost:3000/v1',
  WORK_TYPES: ['售前技术交流', '地勘', '售前测试', '项目实施', '故障运维', '其他'],
  WORK_STEPS: ['草稿', '分派', '审批', '实施', '结果审核', '反馈', '完结'],
  FAULTS: ['实施疏漏', '操作不当', '产品故障', '不可抗因素', '其他'],
  // 0:customer, 1:operator, 2:vendor, 3: supplier, 4:integrator, 5: agent
  COMPANY_TYPES: ['客户', '运营商', '厂商', '供货商', '集成商', '代理商'],
  PROJECT: {
    CATEGORIES: ['产品销售', '软件销售', '系统集成', '服务'],
    TYPES: ['平台', '拓展'],
    PHASES: ['商机挖掘', '项目立项与资金到位', '技术认可', '用户及合作厂家分析', '引导招投标工作', '中标及下单', '开票与回款']
  },
  PRODUCT: {
    VENDORS: {
      'RG': '锐捷',
      'H3C': '华三',
      'DP': '迪普',
      'LG': 'LG',
      'DELL': '戴尔'
    },
    CATEGORIES: {
      'switch': '交换机',
      'server': '服务器',
      'display': '显示屏'
    }
  },
  // 0: manager, 1:salesman, 2:supportman, 3:engineers, 2+3:techonician, 4:businessman, 5: purchaser, 6:stocker, 7:hr
  ROLES: ['管理', '销售', '售前', '售后', '商务', '采购', '库管', '行政'],
  GROUPS: {
    'sales': '销售部',
    'market': '市场部',
    'technology': '技术部',
    'support': '运维部',
    'finance': '财务部',
    'business': '商务部',
    'purchase': '采购部',
    'hr': '行政部'
  },
  DBS: {
    'companies': '公司信息数据库',
    'contacts': '客户信息数据库',
    'users': '内部用户信息数据库',
    'groups': '内部部门信息数据库',
    'products': '产品信息数据库',
    'projects': '项目信息数据库'
  }
}
