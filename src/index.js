// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import iView from 'iview'
import Vuebar from 'vuebar'
// import 'element-ui/lib/theme-default/index.css'
// import '../theme/index.css'
// import 'iview/dist/styles/iview.css'
import './assets/themes/index.less'
import App from './App'
import { createRouter } from './router'
import { createStore } from './store'
import ProductSelect from '@/components/ProductSelect'
import localStorage from './util/localStorage'

Vue.config.productionTip = false

Vue.use(iView)
Vue.use(Vuebar)
Vue.component('ProductSelect', ProductSelect)

const store = createStore()
const router = createRouter()

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App },
  methods: {
    async accessToken () {
      let store = this.$store
      console.info(store)
      try {
        let token = localStorage.getItem('token')
        if (token) {
          let ret = await store.dispatch('ACCESS_TOKEN', token)
          if (ret && ret.success) {
            store.commit('SET_CURRENT_USER', ret.user)
            store.commit('SET_CURRENT_TOKEN', ret.token)
            // await store.dispatch('FETCH_USERS')
          } else {
            store.commit('SHOW_LOGIN', true)
          }
        } else {
          store.commit('SHOW_LOGIN', true)
        }
      } catch (err) {
        console.info(err.response)
        store.commit('SHOW_LOGIN', true)
      }
    },
    async beforeRoute (to, from, next) {
      if (!this.$store.state.currentUser) await this.accessToken()
      await next()
    }
  },
  watch: {
    '$route' (to, from) {
      if (!this.$store.state.currentUser) this.accessToken()
    }
  },
  async created () {
    // if (!store.state.currentUser) {
    //   try {
    //     let ret = await store.dispatch('ACCESS_TOKEN')
    //     if (ret && ret.success) {
    //       store.commit('SET_CURRENT_USER', ret.user)
    //       // store.commit('SET_CURRENT_TOKEN', ret.token)
    //       // localStorage.setItem('token', ret.token)
    //       console.info(ret)
    //       // await store.dispatch('FETCH_USERS')
    //     } else {
    //       store.commit('SHOW_LOGIN', true)
    //     }
    //   } catch (err) {
    //     console.info(err.response)
    //     // this.$Message.error(err.toString())
    //     // if (err.response.status === 401) {
    //     store.commit('SHOW_LOGIN', true)
    //     // }
    //   }
    // }
    if (!this.$store.state.currentUser) await this.accessToken()
  }
  // won't be triggered
  // beforeRouteUpdate (to, from, next) {
  //   console.info(to)
  //   if (!this.$store.state.currentUser) this.accessToken()
  //   next()
  // }
})
