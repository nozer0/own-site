<template>
  <Modal title="登录" v-model="visible" transfer :loading="loading" :mask-closable="false" @on-ok="handleLogin">
    <Form ref="form" :model="user" :rules="rules">
      <FormItem label="用户名" prop="username">
        <Input v-model="user.username" icon="person" size="small" placeholder="请输入用户名"></Input>
      </FormItem>
      <FormItem label="密码" prop="password">
        <Input v-model="user.password" type="password" icon="lock-combination" size="small" placeholder="请输入密码，6-20位" @on-enter="handleLogin"></Input>
      </FormItem>
      <FormItem label="记住密码">
        <i-switch v-model="remember">
          <span slot="open">是</span>
          <span slot="close">否</span>
        </i-switch>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button type="primary" size="small" @click="handleLogin">登录</Button>
      <Button size="small" @click="handleCancel">取消</Button>
    </div>
  </Modal>
</template>

<script>
import localStorage from '@/util/localStorage'

export default {
  name: 'login',
  data () {
    let remember = localStorage.getItem('remember')
    let user = remember ? {
      username: localStorage.getItem('username'),
      password: localStorage.getItem('password')
    } : {
      username: null,
      password: null
    }
    return {
      loading: false,
      remember: !!remember,
      user: user
    }
  },
  watch: {
    visible (newValue, oldValue) {
      console.info('watch visible', newValue)
      // this.$store.commit('SHOW_LOGIN', newValue)
    }
  },
  computed: {
    visible: {
      get: function () {
        return this.$store.state.showLogin
      },
      // setter
      set: function (newValue) {
        this.$store.commit('SHOW_LOGIN', newValue)
      }
    },
    rules () {
      return {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 20, message: '密码长度6-20位', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async handleLogin () {
      let valid = await this.$refs.form.validate()
      if (valid) {
        let username = this.user.username
        let password = this.user.password
        if (this.remember) {
          localStorage.setItem('remember', true)
          localStorage.setItem('username', username)
          localStorage.setItem('password', password)
        } else {
          localStorage.removeItem('remember')
          localStorage.removeItem('username')
          localStorage.removeItem('password')
        }
        try {
          let ret = await this.$store.dispatch('LOGIN', { username, password })
          if (ret && ret.success) {
            // localStorage.setItem('token', ret.token)
            // await store.dispatch('FETCH_USERS')
            this.visible = false
          } else {
            this.$Message.warning('登录失败')
          }
        } catch (err) {
          console.info(err.response)
          this.$Message.error(err.toString())
        }
      }
    },
    handleCancel () { this.visible = false }
  }
}
</script>