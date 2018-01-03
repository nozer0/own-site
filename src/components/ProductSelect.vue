<template>
  <Select ref="select" :value="currentValue" placeholder="请输入型号或名称" size="small" transfer clearable filterable remote label-in-value :disabled="disabled" :loading="loading" :remote-method="handleRemoteFilter" @on-change="handleNameChange">
    <OptionGroup v-for="item in vendors" :label="item.vendor" :key="item.vendor">
      <Option v-for="option in item.data" :value="option._id" :key="option._id" :label="option.name">{{ option.name }} [{{ option.model }}]</Option>
    </OptionGroup>
  </Select>
</template>

<script>
import mixin from './SelectMixin'

export default {
  name: 'ProductSelect',
  mixins: [mixin],
  data () {
    return {
      QUERY_ACTION: 'QUERY_PRODUCT_NAMES',
      GET_ACTION: 'GET_PRODUCT',
      vendors: []
    }
  },
  methods: {
    setOptions (data) {
      let vendors = {}
      let options = []
      for (let c of data) {
        let vendor = c.vendor
        if (vendor in vendors) {
          vendors[vendor].push(c)
        } else {
          options.push({
            vendor: vendor,
            data: vendors[vendor] = [c]
          })
        }
      }
      this.vendors = options
    }
  }
}
</script>

<style>
.ivu-select-item {
  white-space: normal;
}
</style>