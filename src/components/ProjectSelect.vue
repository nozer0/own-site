<template>
  <Select ref="select" v-if="grouped" :value="currentValue" size="small" transfer placeholder="请输入编码或名称" clearable filterable remote label-in-value :disabled="disabled" :loading="loading" :remote-method="handleRemoteFilter" @on-change="handleNameChange">
    <OptionGroup v-for="item in regions" :label="item.region" :key="item.region">
      <Option v-for="option in item.data" :value="option._id" :key="option._id" :label="option.name + ' [' + option.code + ']'"></Option>
    </OptionGroup>
  </Select>
  <Select ref="select" v-else :value="currentValue" size="small" transfer placeholder="请输入编码或名称" clearable filterable remote label-in-value :disabled="disabled" :loading="loading" :remote-method="handleRemoteFilter" @on-change="handleNameChange">
    <Option v-for="option in projects" :value="option._id" :key="option._id" :label="option.name + ' [' + option.code + ']'"></Option>
  </Select>
</template>

<script>
import mixin from './SelectMixin'

export default {
  name: 'ProjectSelect',
  mixins: [mixin],
  props: ['grouped', 'company'],
  data () {
    return {
      QUERY_ACTION: 'QUERY_PROJECT_NAMES',
      GET_ACTION: 'GET_PROJECT',
      regions: [],
      projects: []
    }
  },
  methods: {
    getQueryOptions (val) {
      let company = this.company
      if (!company && !this.grouped) return val
      let opt = val ? { keyword: val } : {}
      if (company) opt.company = company
      if (this.grouped) opt.withRegion = 1
      return opt
    },
    setOptions (data) {
      let options = []
      if (this.grouped) {
        let regions = {}
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
      } else {
        this.projects = data
      }
    }
  }
}
</script>
