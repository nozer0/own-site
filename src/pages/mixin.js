import { compare, toDateString } from '@/util'

export default {
  filters: { toDateString },
  props: {
    embed: false,
    cancelable: false,
    data: {
      type: Object,
      default () { return {} }
    }
  },
  data () {
    let d = this.data
    return {
      readonly: false,
      loading: false,
      prefetchUserNames: false,
      createdBy: d && this.getUsername(d.createdBy),
      updatedBy: d && this.getUsername(d.updatedBy),
      currentData: this.cloneData(d)
    }
  },
  computed: {
    disabled () {
      let user = this.currentUser
      let data = this.currentData
      return !user || !data || (user.role >= 0 && data._id && user._id !== data.createdBy)
    },
    freezed () {
      return this.readonly || this.loading || this.disabled
    },
    // createdBy () {
    //   let data = this.data
    //   let user = this.currentUser
    //   if (!data || !currentUser) return ''
    //   if (!data._id) {
    //     return user && user.name
    //   }
    //   let createdBy = data.createdBy
    //   if (!createdBy) return ''
    //   let username
    //   try {
    //     this.$store.dispatch('GET_USERNAME', createdBy).then(u => {
    //       username = u
    //     })
    //   } catch (err) {}
    //   return username
    // },
    // updatedBy () {
    //   let data = this.data
    //   let user = this.currentUser
    //   if (!data || !currentUser) return ''
    //   if (!data._id) {
    //     return user && user.name
    //   }
    //   let updatedBy = data.updatedBy
    //   if (!updatedBy) return ''
    //   let username
    //   try {
    //     this.$store.dispatch('GET_USERNAME', updatedBy).then(u => {
    //       username = u
    //     })
    //   } catch (err) {}
    //   return username
    // },
    currentUser () {
      return this.$store.state.currentUser
    }
  },
  watch: {
    async data (newValue, oldValue) {
      if (newValue === oldValue) return
      this.$refs.form.resetFields()
      let d = this.currentData = this.cloneData(newValue)
      console.info('watch', this.$store.state.userNames)
      this.createdBy = await this.getUsernameAsync(d.createdBy)
      this.updatedBy = await this.getUsernameAsync(d.updatedBy)
      if (this.afterInitData) {
        await this.afterInitData()
      }
    }
  },
  methods: {
    test () {
      window.vv = this
      console.info(this)
    },
    getUsername (userId) {
      if (!this.data) return
      let user = this.currentUser
      if (!user) return
      if (!this.data._id) {
        return user && user.name
      }
      if (!userId) return
      user = this.$store.state.userNames[userId]
      return user && user.name
    },
    getUsernameAsync (userId) {
      if (!this.data) return
      let user = this.currentUser
      if (!user) return
      if (!this.data._id) {
        return user && user.name
      }
      if (!userId) return
      let store = this.$store
      user = store.state.userNames[userId]
      if (user || store.state.FETCH_ALL_USERNAMES) return user && user.name
      try {
        return store.dispatch('GET_USERNAME', userId)
      } catch (err) {
        this.$emit('error', err)
        let res = err.response
        this.$Message.error(res && res.data && res.data.error || err.message || err.toString())
      }
    },
    cloneData (data) {
      return data ? {...data} : {}
    },
    async setData (id) {
      this.loading = true
      this.$Loading.start()
      try {
        let data = await this.$store.dispatch(this.GET_ACTION, this.getQueryOptions ? this.getQueryOptions(id) : id)
        if (data) {
          if (this.data) Object.assign(this.data, this.cloneData(data))
          this.currentData = this.cloneData(data)
        } else {
          this.$Message.warning('没有相应数据!')
        }
      } catch (err) {
        this.$emit('error', err)
        let res = err.response
        this.$Message.error(res && res.data && res.data.error || err.message || err.toString())
      }
      this.loading = false
      this.$Loading.finish()
    },
    async _save () {
      let data = this.currentData
      if (this.disabled || data._id && compare(this.data, data)) return
      const close = this.$Message.loading({
        content: '提交数据...',
        duration: 0
      })
      // data[data._id ? 'updatedBy' : 'createdBy'] = this.$store.state.currentUser._id
      this.loading = true
      this.$Loading.start()
      try {
        let ret = await this.$store.dispatch(this.POST_ACTION, data)
        if (!ret) throw new Error('表单提交失败')
        if (this.data) Object.assign(this.data, this.cloneData(ret))
        this.currentData = this.cloneData(ret)
        this.$emit('save', this.data)
        close()
        this.$Message.success('表单提交成功!')
      } catch (err) {
        this.$emit('error', err)
        close()
        // console.info(err, err.response, err.message, err.toString())
        let res = err.response
        this.$Message.error(res && res.data && res.data.error || err.message || err.toString())
      }
      this.loading = false
      this.$Loading.finish()
    },
    async handleSave () {
      if (this.disabled) return
      let valid = await this.$refs.form.validate()
      if (valid) {
        await this._save()
      } else {
        this.$Message.warning('表单验证失败!')
      }
    },
    handleReset () {
      this.$refs.form.resetFields()
      this.currentData = this.cloneData(this.data)
      this.$emit('reset')
    },
    handleCancel () {
      this.$emit('cancel')
    }
  },
  async created () {
    if (!this.currentUser) return
    let store = this.$store
    let state = store.state
    if (this.prefetchUserNames && !state.FETCH_ALL_USERNAMES) {
      await store.dispatch('QUERY_USER_NAMES')
    }
    let d = this.data
    if (d) {
      this.createdBy = await this.getUsernameAsync(d.createdBy)
      this.updatedBy = await this.getUsernameAsync(d.updatedBy)
    }
    if (this.name && this.$route.name === this.name) {
      const id = this.$route.params.id
      if (id) await this.setData(id)
    }
    if (this.afterInitData) {
      await this.afterInitData()
    }
  }
}
