export default {
  data () {
    return {
      timer: null,
      readonly: false,
      loading: false,
      isDialogVisible: false,
      isNew: false,
      query: {
        offset: 0,
        size: 2
      },
      fetchUsers: false,
      total: 0,
      currentPage: 1,
      selectData: null,
      currentData: null,
      dataArray: []
    }
  },
  computed: {
    currentUser () {
      return this.$store.state.currentUser
    },
    addable () {
      if (this.loading || this.readonly) return false
      let user = this.currentUser
      return user && user.role < 1
    },
    editable () {
      if (this.loading || this.readonly) return false
      let user = this.currentUser
      let data = this.selectData
      return user && data && data._id && (user.role < 1 || data.createdBy === user._id)
    },
    disabled () {
      let data = this.currentData
      return !data || !(data._id ? this.editable : this.addable)
    }
  },
  watch: {
    currentUser (newValue, oldValue) {
      if (newValue && !oldValue) {
        this.fetchArray()
      }
    },
    currentPage (newValue, oldValue) {
      if (newValue !== oldValue) {
        let query = this.query
        query.offset = (newValue - 1) * query.size
        this.fetchArray()
      }
    }
  },
  methods: {
    test () {
      window.vv = this
      console.info(this)
    },
    fetchArray () {
      clearTimeout(this.timer)
      if (!this.currentUser) return
      this.loading = true
      this.$Loading.start()
      this.selectData = this.currentData = null
      this.timer = setTimeout(async () => {
        try {
          let store = this.$store
          if (this.fetchUsers && !store.state.users) {
            await store.dispatch('FETCH_USERS')
          }
          let id = this.query.id
          if (id) {
            let d = store.state[this.STORE_NAME][id] || await store.dispatch(this.GET_ACTION, this.getQueryOptions ? this.getQueryOptions(id) : id)
            this.dataArray = this.matchQuery(d) ? [d] : []
            this.total = this.dataArray.length
          } else {
            let ret = await store.dispatch(this.FETCH_ACTION, this.query)
            // console.info(this.FETCH_ACTION, this.query, ret && ret.data)
            this.dataArray = ret && ret.data || []
            this.total = ret && ret.total || 0
          }
        } catch (err) {
          let res = err.response
          this.$Message.error(res && res.data && res.data.error || err.message || err.toString())
        }
        this.loading = false
        this.$Loading.finish()
      }, 500)
    },
    handleSelect (row) {
      this.selectData = row
    },
    handleAdd () {
      this.isNew = true
      this.currentData = {}
      this.isDialogVisible = true
    },
    handleEdit () {
      this.isNew = false
      this.currentData = this.selectData
      this.isDialogVisible = true
    },
    handleSave (data) {
      if (!data) return
      const id = this.currentData && this.currentData._id
      let array = this.dataArray
      if (id && this.selectData && this.selectData._id === id) {
        const idx = array.findIndex(p => p._id === id)
        if (idx !== -1) {
          this.selectData = null
          array.splice(idx, 1, data)
        }
      } else if (this.isNew && this.matchQuery(data)) {
        this.selectData = null
        array.unshift(data)
        if (array.length > this.query.size) {
          array.pop()
        }
        this.total += 1
      }
      this.isDialogVisible = false
    },
    async handleRemove () {
      let data = this.selectData
      if (!data || !this.editable) return
      const title = data.name
      const close = this.$Message.loading({
        content: '删除数据...',
        duration: 0
      })
      this.loading = true
      this.$Loading.start()
      try {
        await this.$store.dispatch(this.DELETE_ACTION, data._id)
        const id = this.selectData._id
        this.selectData = null
        let idx = this.dataArray.findIndex(p => p._id === id)
        if (idx !== -1) {
          this.dataArray.splice(idx, 1)
          this.total -= 1
        }
        this.$emit('remove', data)
        close()
        this.$Message.success(title + '删除成功!')
      } catch (err) {
        // this.$emit('error', err)
        close()
        this.$Message.error(title + '删除失败!', err)
      }
      this.loading = false
      this.$Loading.finish()
    },
    handleCancel () {
      this.isDialogVisible = false
    }
  },
  async created () {
    await this.fetchArray()
  }
}
