<template>
  <div>
    <Form inline :label-width="38">
      <FormItem label="项目">
        <ProjectSelect ref="projectSelect" size="small" @on-change="handleProjectQuery"></ProjectSelect>
      </FormItem>
      <FormItem class="buttons">
        <Button type="ghost" size="small" icon="plus" :disabled="loading" @click.stop.prevent="handleAdd">新增</Button>
        <Button type="ghost" size="small" icon="edit" :disabled="disabled" @click.stop.prevent="handleEdit">编辑</Button>
        <Button size="small" @click="test"></Button>
      </FormItem>
    </Form>
    <Table ref="table" :data="dataArray" :columns="columns" :loading="loading" size="small" highlight-row border stripe @on-current-change="handleSelect" @on-row-dblclick="handleEdit"></Table>
    <div style="margin: 10px; overflow: hidden">
      <div style="text-align: right">
        <Page size="small" :page-size="25" :total="total" :current.sync="currentPage"></Page>
      </div>
    </div>

    <Modal title="清单" v-model="isDialogVisible" width="960" transfer>
      <Inventory ref="visit" :cancelable="true" :readonly="readonly" :data="currentData" @save="handleSave" @cancel="handleCancel"></Inventory>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
import { toDateString } from '@/util'
import ProjectSelect from '@/components/ProjectSelect'
import mixin from '@/pages/list-mixin'
import Inventory from './id'

export default {
  mixins: [mixin],
  components: { ProjectSelect, Inventory },
  data () {
    return {
      FETCH_ACTION: 'FETCH_INVENTORIES',
      DELETE_ACTION: 'DELETE_INVENTORY'
    }
  },
  computed: {
    columns () {
      let state = this.$store.state
      return [
        {
          title: '项目',
          key: 'projectName',
          ellipsis: true,
          width: 250
        },
        {
          title: '总价',
          key: 'totalPrice',
          width: 150
        },
        {
          title: '创建者',
          key: 'createdBy',
          width: 64,
          render (h, { row }) {
            let id = row.createdBy
            let user = state.users.find(u => u._id === id)
            return user && user.name
          }
        },
        {
          title: '创建时间',
          key: 'createdAt',
          sortable: true,
          width: 170,
          render (h, { row }) {
            return toDateString(row.createdAt)
          }
        },
        {
          title: '修改时间',
          key: 'updatedAt',
          sortable: true,
          width: 170,
          render (h, { row }) {
            return toDateString(row.updatedAt)
          }
        },
        {
          title: '备注',
          key: 'note',
          ellipsis: true
        }
      ]
    }
  },
  methods: {
    handleProjectQuery (value) {
      this.query.projectId = value
      this.fetchArray()
    },
    matchQuery () {
      let query = this.query
      let data = this.currentData
      return (!query.projectId || data.projectId === query.projectId)
    }
  },
  async beforeMount () {
    let store = this.$store
    if (store.state.users) return
    this.loading = true
    await store.dispatch('FETCH_USERS')
    this.loading = false
  }
}
</script>
