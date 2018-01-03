<template>
  <nav class="headnav">
    <Menu ref="menu" theme="dark" width="180px" :open-names="openNames" :active-name="activeName" @on-select="handleSelect">
      <MenuItem name="/"><i class="ivu-icon ivu-icon-ios-home" style="font-size: 24px"></i><span class="menu_title">首页</span></MenuItem>
      <Submenu name="/projects">
        <template slot="title"><Icon type="ios-box"></Icon><span class="menu_title">项目系统</span></template>
        <MenuItem name="/projects"><Icon type="ios-albums"></Icon><span class="menu_title">项目列表</span></MenuItem>
        <MenuItem name="/projects?mine"><Icon type="ios-photos"></Icon><span class="menu_title">我的项目</span></MenuItem>
        <MenuItem name="/projects?finish"><Icon type="android-checkbox"></Icon><span class="menu_title">完结项目</span></MenuItem>
        <MenuItem name="/inventories"><Icon type="clipboard"></Icon><span class="menu_title">清单列表</span></MenuItem>
        <MenuItem name="/inventories"><Icon type="android-list"></Icon><span class="menu_title">我的清单</span></MenuItem>
        <MenuItem name="/contracts"><Icon type="ios-paper"></Icon><span class="menu_title">合同列表</span></MenuItem>
        <MenuItem name="/contracts?mine"><Icon type="ios-list"></Icon><span class="menu_title">我的合同</span></MenuItem>
        <MenuItem name="/visits"><Icon type="wineglass"></Icon><span class="menu_title">客勤记录</span></MenuItem>
        <MenuItem name="/visits?mine"><Icon type="coffee"></Icon><span class="menu_title">我的客勤记录</span></MenuItem>
      </Submenu>
      <Submenu name="/purchases">
        <template slot="title"><Icon type="ios-cart"></Icon><span class="menu_title">采购系统</span></template>
        <MenuItem name="/suppliers"><Icon type="android-plane"></Icon><span class="menu_title">供货商列表</span></MenuItem>
        <MenuItem name="/purchases/1/orders"><Icon type="ios-list"></Icon><span class="menu_title">订单列表</span></MenuItem>
        <MenuItem name="/purchases/1/contracts"><Icon type="clipboard"></Icon><span class="menu_title">合同列表</span></MenuItem>
      </Submenu>
      <Submenu name="/stocks">
        <template slot="title"><i class="el-icon-fa-cubes"></i><span class="menu_title">库存系统</span></template>
        <MenuItem name="/stocks"><i class="el-icon-fa-archive"></i><span class="menu_title">库存列表</span></MenuItem>
        <MenuItem name="/stocks/imports"><i class="el-icon-fa-download"></i><span class="menu_title">入库列表</span></MenuItem>
        <MenuItem name="/stocks/exports"><i class="el-icon-fa-upload"></i><span class="menu_title">出库列表</span></MenuItem>
      </Submenu>
      <Submenu name="/workorders">
        <template slot="title"><Icon type="clipboard"></Icon><span class="menu_title">工单系统</span></template>
        <MenuItem name="/workorders"><Icon type="ios-paper"></Icon><span class="menu_title">工单列表</span></MenuItem>
        <MenuItem name="/workorders?mine"><Icon type="ios-list"></Icon><span class="menu_title">我的工单</span></MenuItem>
        <MenuItem name="/workorders?pending"><Icon type="android-checkbox-outline"></Icon><span class="menu_title">待处理工单</span></MenuItem>
        <MenuItem name="/workorders?finish"><Icon type="android-checkbox"></Icon><span class="menu_title">已完结工单</span></MenuItem>
        <MenuItem name="/workorders?draft"><Icon type="android-drafts"></Icon><span class="menu_title">我的草稿</span></MenuItem>
      </Submenu>
      <Submenu name="/workorders">
        <template slot="title"><Icon type="clipboard"></Icon><span class="menu_title">差旅系统</span></template>
        <MenuItem name="/workorders"><Icon type="ios-paper"></Icon><span class="menu_title">工单列表</span></MenuItem>
        <MenuItem name="/workorders?mine"><Icon type="ios-list"></Icon><span class="menu_title">我的工单</span></MenuItem>
        <MenuItem name="/workorders?pending"><Icon type="android-checkbox-outline"></Icon><span class="menu_title">待处理工单</span></MenuItem>
        <MenuItem name="/workorders?finish"><Icon type="android-checkbox"></Icon><span class="menu_title">已完结工单</span></MenuItem>
        <MenuItem name="/workorders?draft"><Icon type="android-drafts"></Icon><span class="menu_title">我的草稿</span></MenuItem>
      </Submenu>
      <Submenu name="/workorders">
        <template slot="title"><Icon type="clipboard"></Icon><span class="menu_title">核销系统</span></template>
        <MenuItem name="/workorders"><Icon type="ios-paper"></Icon><span class="menu_title">工单列表</span></MenuItem>
        <MenuItem name="/workorders?mine"><Icon type="ios-list"></Icon><span class="menu_title">我的工单</span></MenuItem>
        <MenuItem name="/workorders?pending"><Icon type="android-checkbox-outline"></Icon><span class="menu_title">待处理工单</span></MenuItem>
        <MenuItem name="/workorders?finish"><Icon type="android-checkbox"></Icon><span class="menu_title">已完结工单</span></MenuItem>
        <MenuItem name="/workorders?draft"><Icon type="android-drafts"></Icon><span class="menu_title">我的草稿</span></MenuItem>
      </Submenu>
      <Submenu name="/companies">
        <template slot="title"><Icon type="information-circled"></Icon><span class="menu_title">客户信息系统</span></template>
        <MenuItem name="/companies"><Icon type="ios-people"></Icon></Icon><span class="menu_title">公司列表</span></MenuItem>
        <MenuItem name="/companies?type=0"><Icon type="chatbubbles"></Icon></Icon><span class="menu_title">客户列表</span></MenuItem>
        <MenuItem name="/companies?type=1"><Icon type="ios-chatboxes"></Icon></Icon><span class="menu_title">运营商列表</span></MenuItem>
        <MenuItem name="/companies?type=2"><Icon type="chatboxes"></Icon></Icon><span class="menu_title">厂商列表</span></MenuItem>
        <MenuItem name="/companies?type=3"><Icon type="android-chat"></Icon></Icon><span class="menu_title">供货商列表</span></MenuItem>
        <MenuItem name="/companies?type=4"><Icon type="chatboxes"></Icon></Icon><span class="menu_title">集成商列表</span></MenuItem>
        <MenuItem name="/companies?type=5"><Icon type="chatbubbles"></Icon><span class="menu_title">代理商列表</span></MenuItem>
        <MenuItem name="/contacts"><Icon type="android-contacts"></Icon><span class="menu_title">联系人列表</span></MenuItem>
      </Submenu>
      <Submenu name="/products">
        <template slot="title"><Icon type="social-pinterest"></Icon><span class="menu_title">产品系统</span></template>
        <MenuItem name="/products"><Icon type="ios-bookmarks"></Icon><span class="menu_title">产品列表</span></MenuItem>
        <MenuItem name="/products/comparisons"><Icon type="ios-grid-view"></Icon><span class="menu_title">产品比较列表</span></MenuItem>
      </Submenu>
      <Submenu name="/reports" v-if="$store.state.currentUser && $store.state.currentUser.role < 1">
        <template slot="title"><i class="el-icon-fa-line-chart"></i><span class="menu_title">报表系统</span></template>
        <MenuItem name="/stocks"></MenuItem>
        <MenuItem name="/stocks/imports"></MenuItem>
        <MenuItem name="/stocks/imports/1"></MenuItem>
        <MenuItem name="/stocks/exports"></MenuItem>
        <MenuItem name="/stocks/exports/1"></MenuItem>
      </Submenu>
      <Submenu name="/users" v-if="$store.state.currentUser && $store.state.currentUser.role < 1">
        <template slot="title"><Icon type="at"></Icon><span class="menu_title">管理系统</span></template>
        <MenuItem name="/groups"><Icon type="network"></Icon><span class="menu_title">部门列表</span></MenuItem>
        <MenuItem name="/users"><Icon type="person-stalker"></Icon><span class="menu_title">用户列表</span></MenuItem>
        <!-- <MenuItem name="/roles"><Icon type="ios-body"></Icon><span class="menu_title">角色列表</span></MenuItem> -->
      </Submenu>
    </Menu>
  </nav>
</template>

<script>
const menus = {
  'projects': '/projects',
  'project': '/projects',
  'inventories': '/projects',
  'inventory': '/projects',
  'visits': '/projects',
  'visit': '/projects',
  'workorders': '/workorders',
  'workorder': '/workorders',
  'companies': '/companies',
  'company': '/companies',
  'contacts': '/companies',
  'contact': '/companies',
  'products': '/products',
  'product': '/products',
  'groups': '/users',
  'group': '/users',
  'users': '/users',
  'user': '/users'
}

export default {
  data () {
    return {
      openNames: [],
      activeName: '/'
    }
  },
  watch: {
    '$route' (to, from) {
      console.info(to)
      this.activeName = to.fullPath.replace(/\/$/, '')
      this.openNames = [menus[to.name] || to.path]
      let menu = this.$refs.menu
      this.$nextTick(() => {
        menu.updateOpened()
        menu.updateActiveName()
      })
    }
  },
  methods: {
    handleSelect (name) {
      this.$router.push(name)
    }
  }
}
</script>