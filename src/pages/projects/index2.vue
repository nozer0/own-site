2€<template>
  <div>
    <Form inline>
      <FormItem label="公司" :label-width="40">
        <CompanySelect ref="select" @on-change="handleCompanyQuery"></CompanySelect>
      </FormItem>
      <FormItem label="姓名" :label-width="40">
        <Select clearable size="small" style="width: 200px" filterable remote :loading="nameLoading" :remote-method="getNamesAsync" @on-change="handleNameQuery">
          <Option v-for="(option, index) in contactNames" :value="option._id" :key="index" :label="option.name">{{ option.name }} &lt;{{ option.email }}&gt;</Option>
        </Select>
      </FormItem>
      <FormItem class="buttons">
        <Button type="ghost" size="small" icon="plus" @click="handleAdd">新增</Button>
        <Button size="small" @click="test"></Button>
        <Button type="ghost" size="small" icon="edit" :disabled="disabled" @click="handleEdit">编辑</Button>
        <Poptip confirm placement="left" transfer :title="'操作不可恢复，是否确定删除该联系人 ' + selectData.name + ' [' + selectData._id + ']？'" @on-ok="handleRemove">
          <Button type="ghost" size="small" icon="trash-b" :disabled="disabled">删除</Button>
        </Poptip>
      </FormItem>
    </Form>
    <Table ref="table" :data="dataArray" :columns="columns" :loading="loading" size="small" highlight-row border stripe @on-row-click="handleSelect" @on-row-dblclick="handleEdit"></Table>
    <div style="margin: 10px; overflow: hidden">
      <div style="text-align: right">
        <Page size="small" :page-size="25" :total="total" :current.sync="currentPage"></Page>
      </div>
    </div>

    <Modal title="联系人信息" v-model="isDialogVisible" width="720" transfer>
      <Contact ref="contact" :readonly="readonly" :data="currentData" @save="handleSave" @cancel="handleCancel"></Contact>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
import CompanySelect from '@/components/CompanySelect'
import mixin from '@/pages/list-mixin'
import Contact from './id'

export default {
  mixins: [mixin],
  components: { CompanySelect, Contact },
  data () {
    return {
      FETCH_ACTION: 'FETCH_CONTACTS',
      DELETE_ACTION: 'DELETE_CONTACT',
      nameTimer: null,
      nameLoading: false,
      query: {
        companyId: null,
        id: null,
        email: null,
        offset: 0,
        size: 25
      },
      contactNames: []
    }
  },
  computed: {
    columns () {
      return [
        {
          title: '姓名',
          fixed: 'left',
          key: 'name',
          width: 80
        },
        {
          title: '公司',
          fixed: 'left',
          key: 'companyName',
          width: 150
        },
        {
          title: '部门',
          key: 'department',
          width: 80
        },
        {
          title: '职位',
          key: 'title',
          width: 80
        },
        {
          title: 'Email',
          key: 'email',
          width: 120
        },
        {
          title: '电话',
          key: 'phone',
          width: 120
        },
        {
          title: '手机',
          key: 'mobile',
          width: 120
        },
        {
          title: '传真',
          key: 'fax',
          width: 120
        },
        {
          title: 'QQ',
          key: 'qq',
          width: 120
        },
        {
          title: '微信',
          key: 'wechat',
          width: 120
        },
        {
          title: '备注',
          key: 'note',
          ellipsis: true,
          width: 150
        }
      ]
    }
  },
  methods: {
    handleCompanyQuery (value) {
      this.query.companyId = value
      this.fetchArray()
    },
    handleNameQuery (value) {
      console.info(value)
      this.query.id = value
      if (!value) return this.fetchArray()
      clearTimeout(this.timer)
      this.loading = true
      console.info('fetch', this.query)
      this.timer = setTimeout(async () => {
        this.dataArray = [await this.$store.dispatch('GET_CONTACT', value)]
        this.loading = false
        this.total = 1
      }, 500)
    },
    getNamesAsync (value) {
      clearTimeout(this.nameTimer)
      this.nameLoading = true
      this.query.id = value
      this.nameTimer = setTimeout(async () => {
        this.contactNames = await this.$store.dispatch('FETCH_SIMPLE_CONTACTS', { name: value })
        this.nameLoading = false
      }, 500)
    },
    matchQuery () {
      let query = this.query
      let data = this.currentData
      return !query.id && (!query.companyId || data.companyId === query.companyId)
    }
  },
  beforeMount () {
    this.fetchArray()
  }
}
</script>
