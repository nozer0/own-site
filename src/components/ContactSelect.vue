<template>
  <Select ref="select" v-if="grouped" :value="currentValue" size="small" transfer placeholder="请输入名称或邮箱" clearable filterable remote label-in-value :disabled="disabled" :loading="loading" :remote-method="handleRemoteFilter" @on-change="handleNameChange">
    <OptionGroup v-for="item in companies" :label="item.companyName" :key="item.companyName">
      <Option v-for="option in item.data" :value="option._id" :key="option._id" :label="option.name + '<' + option.email + '>'"></Option>
    </OptionGroup>
  </Select>
  <Select ref="select" v-else :value="currentValue" size="small" transfer placeholder="请输入名称或邮箱" clearable filterable remote label-in-value :disabled="disabled" :loading="loading" :remote-method="handleRemoteFilter" @on-change="handleNameChange">
    <Option v-for="option in contacts" :value="option._id" :key="option._id" :label="option.name + '<' + (option.email || '') + '>'"></Option>
  </Select>
</template>

<script>
import mixin from './SelectMixin'

export default {
  name: 'ContactSelect',
  mixins: [mixin],
  props: ['grouped', 'company', 'withPhone'],
  data () {
    return {
      QUERY_ACTION: 'QUERY_CONTACT_NAMES',
      GET_ACTION: 'GET_CONTACT',
      companies: [],
      contacts: []
    }
  },
  methods: {
    getQueryOptions (val) {
      let company = this.company
      if (!company && !this.grouped) return val
      let opt = val ? { keyword: val } : {}
      if (company) opt.company = company
      if (this.grouped) opt.withCompanyName = 1
      if (this.withPhone) opt.withPhone = 1
      return opt
    },
    setOptions (data) {
      let options = []
      if (this.grouped) {
        let companies = {}
        for (let c of data) {
          let company = c.company
          let cid = company._id
          if (cid in companies) {
            companies[cid].push(c)
          } else {
            options.push({
              companyName: company.name,
              data: companies[cid] = [c]
            })
          }
        }
        this.companies = options
      } else {
        this.contacts = data
      }
    }
  }
}
</script>
