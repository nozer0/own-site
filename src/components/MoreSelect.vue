<template>
  <Select size="small" :disabled="readonly" filterable clearable @on-query-change="getOptionsAsync" @on-change="handleChange">
    <Option v-for="option in options" :value="option.value" :key="option.value">{{ option.label }}</Option>
    <Option v-if="showMore" value="0">更多...</Option>
  </Select>
</template>

<script>
export default {
  props: {
    readonly: {
      type: Boolean,
      default: false
    },
    queryHandler: {
      type: Function,
      default: null
    }
  },
  data () {
    return {
      timer: null,
      offset: 0,
      showMore: false,
      options: []
    }
  },
  computed: {
  },
  methods: {
    getOptionsAsync (value) {
      clearTimeout(this.timer)
      if (!this.queryHandler) return
      this.timer = setTimeout(async () => {
        let ret = await this.queryHandler({ keyword: value, offset: this.offset })
        console.info(ret)
        // this.companyNames = ret.data
        // this.showMore = ret.offset + 1 < ret.total
      }, 500)
    },
    handleChange (value) {

    }
  },
  beforeMount () {
    let store = this.$store
    if (!store.state.groups) {
      store.dispatch('FETCH_GROUPS')
    }
  }
}
</script>
