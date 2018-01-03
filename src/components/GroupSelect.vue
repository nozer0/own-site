<template>
  <Cascader v-if="cascade" :value="currentValue" :disabled="disabled" :data="cascaderOptions" @on-change="handleChange" style2="max-width: 200px" clearable size="small" change-on-select></Cascader>
  <Select v-else :value="currentValue" :disabled="disabled" @on-change="handleChange" style2="max-width: 150px" clearable size="small">
    <Option v-for="item in selectOptions" :label="item.label" :value="item.value" :key="item.value">{{ Array(item.level).join('-') + ' ' + item.label }}</Option>
  </Select>
</template>

<script>
export default {
  name: 'GroupSelect',
  props: {
    disabled: Boolean,
    value: {
      type: [Number, String, Array]
    },
    cascade: Boolean,
    group: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      currentValue: this.value
    }
  },
  computed: {
    selectOptions () {
      const groups = this.$store.state.groups
      if (!groups || !groups.length) return []
      const options = []
      for (let g of groups) {
        let option = { value: g._id, label: g.name }
        let parent = g.parent
        if (parent) {
          let idx = options.findIndex(g => g.value === parent || g.parent === parent)
          option.parent = parent
          if (idx === -1) {
            option.level = 2
            options.unshift(option)
          } else {
            let p = options[idx]
            option.level = p.value === parent ? p.level + 1 : p.level
            options.splice(idx, 0, option)
          }
        } else {
          option.level = 1
          options.unshift(option)
        }
      }
      return options.reverse()
    },
    cascaderOptions () {
      const groups = this.$store.state.groups
      if (!groups || !groups.length) return []
      const tree = []
      const options = []
      for (let g of groups) {
        let option = { value: g._id, label: g.name }
        options.push(option)
        let parent = g.parent
        if (parent) {
          let parent = options.find(g => g.value === parent)
          if (parent) {
            let children = parent.children
            if (children) {
              children.push(option)
            } else {
              parent.children = [option]
            }
          }
        } else {
          tree.push(option)
        }
      }
      return tree
    },
    currentUser () {
      return this.$store.state.currentUser
    }
  },
  watch: {
    currentUser (newValue, oldValue) {
      if (newValue && !oldValue) {
        if (this.$store.state.groups) return
        try {
          this.$store.dispatch('FETCH_GROUPS')
        } catch (err) {
          this.$emit('error', err)
        }
      }
    },
    value (newValue, oldValue) {
      if (newValue !== oldValue) this.currentValue = newValue
    }
  },
  methods: {
    handleChange (value) {
      console.info('change', value)
      let v = (Array.isArray(value) ? value[value.length - 1] : value) || null
      // input to trigger `v-model` directive
      this.$emit('input', v)
      this.$emit('on-change', v)
    }
  },
  beforeMount () {
    let store = this.$store
    if (!store.state.currentUser) return
    if (!store.state.groups) {
      try {
        store.dispatch('FETCH_GROUPS')
      } catch (err) {
        this.$emit('error', err)
      }
    }
  }
}
</script>
