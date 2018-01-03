<template>
  <div>
    <Form inline :label-width="38">
      <FormItem label="项目">
        <ProjectSelect ref="projectSelect" size="small" @on-change="handleProjectQuery"></ProjectSelect>
      </FormItem>
      <FormItem v-show="!('mine' in $route.query)" label="创建人" :label-width="51">
        <Select filterable clearable size="small" @on-change="handleCreatorQuery">
          <Option v-for="item in users" :label="item.name" :value="item._id" :key="item._id">{{ item.name }} ( {{ item.username }} )</Option>
        </Select>
      </FormItem>
      <FormItem class="buttons">
        <Button type="ghost" size="small" icon="plus" :disabled="loading" @click.stop.prevent="handleAdd">新增</Button>
        <Button type="ghost" size="small" icon="edit" :disabled="disabled" @click.stop.prevent="handleEdit">编辑</Button>
        <Button @click="test"></Button>
      </FormItem>
    </Form>
    <Table ref="table" :data="dataArray" :columns="columns" :loading="loading" size="small" highlight-row border stripe @on-current-change="handleSelect" @on-row-dblclick="handleEdit"></Table>
    <div style="margin: 10px; overflow: hidden">
      <div style="text-align: right">
        <Page size="small" :page-size="25" :total="total" :current.sync="currentPage"></Page>
      </div>
    </div>

    <Modal title="客勤记录" v-model="isDialogVisible" width="720" transfer>
      <Visit ref="visit" :cancelable="true" :readonly="readonly" :data="currentData" @save="handleSave" @cancel="handleCancel"></Visit>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
import { toDateString } from '@/util'
import ProjectSelect from '@/components/ProjectSelect'
import mixin from '@/pages/list-mixin'
import Visit from './id'

export default {
  mixins: [mixin],
  components: { ProjectSelect, Visit },
  data () {
    return {
      FETCH_ACTION: 'FETCH_VISITS',
      DELETE_ACTION: 'DELETE_VISIT',
      query: this.getQuery(this.$route.query)
    }
  },
  computed: {
    columns () {
      let state = this.$store.state
      return [
        {
          type: 'expand',
          fixed: 'left',
          width: 30,
          render (h, { row }) {
            return h('Form', {
              props: { labelWidth: 64 }
            }, [
              h('FormItem', {
                props: { label: '客户' }
              }, row.customerName),
              h('FormItem', {
                props: { label: '联系人' }
              }, row.contactName),
              h('FormItem', {
                props: { label: '时间' }
              }, row.time),
              h('FormItem', {
                props: { label: '目标' }
              }, row.target),
              h('FormItem', {
                props: { label: '结果' }
              }, row.result),
              h('FormItem', {
                props: { label: '下次计划' }
              }, row.plan),
              h('FormItem', {
                props: { label: '遗留问题' }
              }, row.problem),
              h('FormItem', {
                props: { label: '备注' }
              }, row.note)
            ])
          }
        },
        {
          title: '项目',
          key: 'projectName',
          ellipsis: true,
          width: 250
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
          title: '时间',
          key: 'time',
          sortable: true,
          width: 250
        },
        {
          title: '目标',
          key: 'target',
          ellipsis: true,
          width: 250
        },
        {
          title: '是否完成',
          key: 'isFinished',
          align: 'center',
          width: 70,
          render (h, { row }) {
            return h('Icon', {
              props: {
                size: 24,
                color: row.isFinished ? '#5f9ea0' : '#b8844f',
                // type: row.isFinished ? 'thumbsup' : 'thumbsdown'
                type: row.isFinished ? 'happy' : 'sad'
              }
            })
          }
        },
        {
          title: '结果',
          key: 'result',
          ellipsis: true,
          width: 250
        },
        {
          title: '创建时间',
          key: 'createdAt',
          sortable: true,
          width: 170,
          render (h, { row }) {
            return toDateString(row.createdAt)
          }
        }
      ]
    },
    users () { return this.$store.state.users }
  },
  methods: {
    handleProjectQuery (value) {
      this.query.projectId = value
      this.fetchArray()
    },
    handleStepQuery (value) {
      this.query.step = value
      this.fetchArray()
    },
    handleCreatorQuery (value) {
      this.query.createdBy = value
      this.fetchArray()
    },
    matchQuery () {
      let query = this.query
      let data = this.currentData
      return (!query.projectId || data.projectId === query.projectId) &&
         (!Number.isInteger(query.step) || data.step === query.step) &&
         (!query.createdBy || data.createdBy === query.createdBy)
    },
    getQuery (query) {
      let user = this.$store.state.currentUser
      if (!user) return {}
      if ('mine' in query) {
        // -1 represents != 0
        return { createdBy: user._id }
      }
      return user.role > 0 ? { createdBy: user._id } : {}
    }
  },
  beforeRouteUpdate (to, from, next) {
    this.query = this.getQuery(to.query)
    this.fetchArray()
    next()
  }
  // async beforeMount () {
  //   let store = this.$store
  //   if (store.state.users) return
  //   this.loading = true
  //   await store.dispatch('FETCH_USERS')
  //   this.loading = false
  // }
}
</script>
