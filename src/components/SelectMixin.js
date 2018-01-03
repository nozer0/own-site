export default {
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    queryOnEnter: false,
    disabled: false
  },
  data () {
    return {
      timer: null,
      loading: false,
      init: false,
      currentValue: this.value,
      lastQuery: null
    }
  },
  watch: {
    async value (newValue, oldValue) {
      if (!this.$store.state.currentUser) return
      let select = this.$refs.select
      // console.info('watch', newValue, 'old', oldValue, 'model', select.model, 'label', select.label, 'currentLabel', select.currentLabel, 'query', select.query, 'lastQuery', select.lastQuery)
      if (newValue === oldValue) return
      // force set value to '' if null cauze select source code === ''
      this.currentValue = newValue || ''
      if (this.init || !newValue) return
      let label = this.getLabel()
      if (label) {
        return// this.$emit('input', newValue, label)
      }
      this.init = true
      this.loading = true
      try {
        let data = await this.$store.dispatch(this.GET_ACTION, newValue)
        if (data) {
          this.lastQuery = data.name
          this.setOptions([data])
          // this.$refs.select.selectToChangeQuery = true
          select.query = select.lastQuery = data.name
          // select.currentLabel = data.name
          // emit again to set with label value
          this.$emit('input', newValue, data.name)
          this.$emit('on-change', newValue, data.name)
        }
      } catch (err) {
        this.$emit('error', err)
      }
      this.loading = false
      // let select = this.$refs.select
      // select.label = data.name
      // select.lastQuery = select.query = data.name
    }
  },
  methods: {
    getLabel () {
      let select = this.$refs.select
      // `select.value` is still old value this moment
      let val = this.currentValue
      let label
      select.findChild(child => {
        if (val === child.value) {
          label = child.label === undefined ? child.$el.innerHTML : child.label
        }
      })
      return label
    },
    handleNameChange (value) {
      // reset after select to prevent emit `on-query-change`
      this.$refs.select.selectToChangeQuery = true
      // let select = this.$refs.select
      // console.info('on-change', value, 'model', select.model, 'label', select.label, 'currentLabel', select.currentLabel, 'query', select.query, 'lastQuery', select.lastQuery)
      if (this.init) {
        this.$emit('input', value.value, value.label)
        this.$refs.select.resetInputState()
      }
      this.$emit('on-change', value.value, value.label)
    },
    handleRemoteFilter (value) {
      if (this.init && !value) return// this.$emit('on-change', value)
      this.getNamesAsync(value)
    },
    getNamesAsync (value) {
      if (!this.$store.state.currentUser) return
      // let select = this.$refs.select
      // console.info('getNamesAsync', value, 'model', select.model, 'label', select.label, 'currentLabel', select.currentLabel, 'query', select.query, 'lastQuery', select.lastQuery)
      clearTimeout(this.timer)
      this.init = true
      this.loading = true
      this.timer = setTimeout(async () => {
        try {
          let data = await this.$store.dispatch(this.QUERY_ACTION, this.getQueryOptions ? this.getQueryOptions(value) : value)
          // store this to prevent repeat fetch
          this.lastQuery = value
          this.setOptions(data || {})
        } catch (err) {
          this.$emit('error', err)
        }
        this.loading = false
        // console.info(this.QUERY_ACTION, value, 'model', select.model, 'label', select.label, 'currentLabel', select.currentLabel, 'query', select.query, 'lastQuery', select.lastQuery)
        // this.$nextTick(() => {
        //   this.$refs.select.modelToQuery()
        // })
      }, !value ? 1000 : 500)
    },
    handleFocus (e) {
      // let select = this.$refs.select
      // console.info('focus', select.query, 'last', select.lastQuery, 'val', e.target.value)
      // if ((this.lastQuery || !this.init) && !e.target.value) {
      if (!e.target.value) {
        this.$refs.select.query = null
        if (this.lastQuery || !this.init) this.getNamesAsync('')
      }
    },
    handleKeydown (e) {
      if (e.keyCode === 13) {
        e.preventDefault()
        let v = e.target.value
        let select = this.$refs.select
        select.model = v
        select.lastQuery = v
        this.$emit('input', v, false)
        this.$emit('on-enter', v, false)
      }
    }
  },
  mounted () {
    let select = this.$refs.select
    // otherwise it won't popup the options when init focus
    // select.setQuery(null)
    let ipt = select.$refs.input
    ipt.addEventListener('focus', this.handleFocus)
    if (!this.queryOnEnter) return
    ipt.addEventListener('keydown', this.handleKeydown)
  },
  beforeDestroy () {
    let ipt = this.$refs.select.$refs.input
    ipt.removeEventListener('focus', this.handleFocus)
    if (!this.queryOnEnter) return
    ipt.removeEventListener('keydown', this.handleKeydown)
  }
}
