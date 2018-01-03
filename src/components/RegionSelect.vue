<template>
  <Cascader :data="options" :value="currentValue" size="small" :disabled="disabled" filterable @on-change="handleChange"></Cascader>
</template>

<script>
import regions from '@/services/regions.json'

export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      currentValue: this.getValue(this.value),
      options: regions.map(r => {
        let opt = { label: r.name, value: r.name }
        if (r.childs) {
          opt.children = r.childs.map(r => ({ label: r.name, value: r.name }))
        }
        return opt
      })
    }
  },
  watch: {
    value (newValue, oldValue) {
      if (newValue === oldValue) return
      this.currentValue = this.getValue(newValue)
    }
  },
  methods: {
    getValue (val) {
      for (let r of regions) {
        if (r.childs) {
          for (let c of r.childs) {
            if (c.name === val) {
              return [r.name, val]
            }
          }
        } else if (r.name === val) {
          return [val]
        }
      }
      return []
    },
    handleChange (value) {
      this.currentValue = value
      console.info(value)
      this.$emit('on-change', value)
    }
  }
}
</script>
