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
    return {
      readonly: false,
      loading: false,
      createdBy: null,
      updatedBy: null,
      fetchUsers: false,
      currentData: this.cloneData(this.data)
    }
  },
  computed: {
    disabled () {
      if (this.readonly || this.loading) return true
      let user = this.currentUser
      return !user || (user.role > 0 && this.currentData._id && user._id !== this.currentData.createdBy)
    },
    currentUser () {
      return this.$store.state.currentUser
    }
  },
  watch: {
    async data (newValue, oldValue) {
      if (newValue === oldValue) return
      this.$refs.form.resetFields()
      let d = this.currentData = this.cloneData(newValue)
      this.createdBy = await this.getUsername(d.createdBy)
      this.updatedBy = await this.getUsername(d.updatedBy)
    }
  },
  methods: {
    test () {
      window.vv = this
      console.info(this)
    },
    async getUsername (userId) {
      if (!this.data) return
      let user = this.currentUser
      if (!user) return
      if (!this.data._id) {
        return user && user.name
      }
      if (!userId) return
      try {
        return await this.$store.dispatch('GET_USERNAME', userId)
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
        console.info('posting', data)
        let ret = await this.$store.dispatch(this.POST_ACTION, data)
        if (!ret) throw new Error('表单提交失败')
        if (this.data) Object.assign(this.data, this.cloneData(ret))
        this.currentData = this.cloneData(ret)
        this.$emit('save', this.data)
        this.loading = false
        close()
        this.$Message.success('表单提交成功!')
      } catch (err) {
        this.$emit('error', err)
        close()
        console.info(err, err.response, err.message, err.toString())
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
    if (this.fetchUsers && !this.$store.state.users) {
      await this.$store.dispatch('FETCH_USERS')
    }
    if (this.name && this.$route.name !== this.name) {
      return
    }
    const id = this.$route.params.id
    if (id) this.setData(id)
  }
}
