<template>
  <!-- <Cascader :data="options" size="small" :disabled="disabled" filterable clearable :load-data="loadCompaniesAsync"></Cascader> -->
  <Select ref="select" :value="currentValue" placeholder="请输入编码或名称" size="small" transfer clearable filterable remote label-in-value :disabled="disabled" :loading="loading" :remote-method="handleRemoteFilter" @on-change="handleNameChange">
    <OptionGroup v-for="item in regions" :label="item.region" :key="item.region">
      <Option v-for="option in item.data" :value="option._id" :key="option._id" :label="option.name + ' [' + option.code + ']'"></Option>
    </OptionGroup>
  </Select>
</template>

<script>
import mixin from './SelectMixin'

export default {
  props: ['type', 'region'],
  name: 'CompanySelect',
  mixins: [mixin],
  data () {
    return {
      QUERY_ACTION: 'QUERY_COMPANY_NAMES',
      GET_ACTION: 'GET_COMPANY',
      regions: []
    }
  },
  methods: {
    getQueryOptions (val) {
      let type = this.type
      let region = this.region
      if (isNaN(type) && !region) return val
      let opt = { keyword: val }
      if (!isNaN(type)) opt.type = +type
      if (region) opt.region = region
      return opt
    },
    setOptions (data) {
      let regions = {}
      let options = []
      for (let c of data) {
        let region = c.region
        if (region in regions) {
          regions[region].push(c)
        } else {
          options.push({
            region: region,
            data: regions[region] = [c]
          })
        }
      }
      this.regions = options
    }
  }
}
</script>
