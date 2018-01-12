<template>
  <div id="app" :class="{ hideSide: hideSide }">
    <header id="headbar">
      <Button id="nav_btn" size="small" :class="{ active: !hideSide }" icon="navicon-round" @click="hideSide=!hideSide"></Button>
      <img src="../assets/logo.png">
      <slot name="headnav"></slot>
      <div style="float: right">
        <Button size="small" @click="handleLogin">登录</Button>
        <Dropdown v-show="user" style="margin:0 10px" trigger="click" transfer @on-click="handleMenu">
          {{ user }}
          <Icon type="arrow-down-b"></Icon>
          <DropdownMenu slot="list">
            <DropdownItem name="setting">修改个人资料</DropdownItem>
            <DropdownItem name="logout">注销</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </header>
    <main>
      <Sider id="sidebar"></Sider>
      <article id="content">
        <slot></slot>
      </article>
    </main>
    <Login ref="login"></Login>
  </div>
</template>

<script>
import Sider from './nav'
import Login from '@/components/Login'

export default {
  components: { Sider, Login },
  data () {
    return {
      hideSide: true
    }
  },
  computed: {
    user () {
      let user = this.$store.state.currentUser
      return user && user.name
    }
  },
  methods: {
    handleLogin () {
      this.$store.commit('SHOW_LOGIN', true)
    },
    async logout () {
      try {
        let ret = await this.$store.dispatch('LOGOUT')
        if (ret && ret.success) {
          this.$Message.info('成功注销')
          this.$router.push('/')
        } else {
          this.$Message.error('注销失败')
        }
      } catch (err) {
        console.info(err.response)
        this.$Message.error(err.response || err.toString())
      }
    },
    async handleMenu (name) {
      if (name === 'logout') {
        await this.logout()
      } else {
        this.$router.push('/users/' + this.$store.state.currentUser._id)
      }
    }
  }
}
</script>

<style>
header {
  position: fixed;
  width: 100%;
  text-align: left;
  height: 50px;
  line-height: 50px;
  padding: 0 8px;
  color: #fff;
  background: #485c6a;
}
header img {
  vertical-align: middle;
}

#nav_btn {
  background: transparent;
  color: #bfcbd9;
  border-color: #bfcbd9; 
  margin: 8px;
  display: none;
}
#nav_btn:hover {
  cursor: pointer;
  color: #fff;
  border-color: #fff; 
}
#nav_btn.active {
  color: #20a0ff;
  border-color: #20a0ff; 
}

main {
  position: absolute;
  overflow-x: hidden;
  top: 50px;
  bottom: 0;
  width: 100%;
}

#content {
  margin-left: 180px;
  transition: margin-left ease-in-out .2s;
}

#sidebar {
  top: 50px;
  bottom: 0;
  position: fixed;
  background: #485c6a;
  width: 180px;
  transition: width ease-in-out .2s;
  overflow: hidden;
  z-index: 999;
}

#sidebar:hover {
  overflow-y: auto;
}

.ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item {
  padding-left: 18px;
}

.ivu-menu-submenu i:first-child {
  font-size: 20px;
  width: 20px;
  text-align: center;
}

@media screen and (max-width: 768px) {
  #sidebar, #sidebar ul { width: 56px !important; }
  #sidebar:hover, #sidebar:hover ul { width: 180px !important; }
  #sidebar .menu_title, #sidebar .ivu-menu-submenu-title-icon {
    display: none;
  }
  #sidebar:hover .menu_title, #sidebar:hover .ivu-menu-submenu-title-icon {
    display: inline-block;
  }
  #content { margin-left: 56px; }
}

@media screen and (max-width: 540px) {
  #nav_btn { display: inline-block; }
  .hideSide #sidebar { display: none; }
  .hideSide #content { margin-left: 0; }
}

article {
  padding: 10px;
  height: 100%;
  position: relative;
}
</style>