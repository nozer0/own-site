<template>
  <div>
    <Form inline :label-width="38">
      <FormItem label="项目">
        <ProjectSelect ref="projectSelect" style="width: 320px" size="small" @on-change="handleProjectQuery"></ProjectSelect>
      </FormItem>
      <FormItem label="阶段" v-show="!('draft' in $route.query || 'finish' in $route.query)">
        <Select clearable size="small" style="width: 150px" @on-change="handleStepQuery">
          <Option v-for="(label, idx) in WORK_STEPS" :key="idx" :label="label" :value="idx"></Option>
        </Select>
      </FormItem>
      <FormItem label="创建人" :label-width="51">
        <Select filterable clearable size="small" @on-change="handleCreatorQuery">
          <Option v-for="item in userNames" :label="item.name" :value="item._id" :key="item._id">{{ item.name }} ( {{ item.username }} )</Option>
        </Select>
      </FormItem>
      <FormItem class="buttons">
        <Button type="ghost" size="small" icon="plus" :disabled="!addable" @click.stop.prevent="handleAdd">新增</Button>
        <Button type="ghost" size="small" icon="edit" :disabled="!editable" @click.stop.prevent="handleEdit">编辑</Button>
        <Button size="small" @click="test"></Button>
      </FormItem>
    </Form>
    <Table ref="table" :data="dataArray" :columns="columns" :loading="loading" size="small" highlight-row border stripe @on-row-click="handleSelect" @on-row-dblclick="handleEdit"></Table>
    <div style="margin: 10px; overflow: hidden">
      <div style="text-align: right">
        <Page size="small" :page-size="25" :total="total" :current.sync="currentPage"></Page>
      </div>
    </div>

    <Modal ref="modal" v-model="isDialogVisible" transfer :mask-closable="false" width="80%" :class-name="modalClass">
      <div slot="header" style="margin-right: 20px" @click="toggleFullScreen">
        工单信息
        <Icon :type="modalClass === 'normal' ? 'arrow-expand' : 'arrow-shrink'" class="zoom" @click="toggleFullScreen"></Icon>
      </div>
      <WorkOrder v-if="currentData" ref="workorder" :cancelable="true" :readonly="disabled" :data="currentData" @save="handleSave" @cancel="handleCancel"></WorkOrder>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
import { toDateString } from '@/util'
import config from '@/store/config'
import ProjectSelect from '@/components/ProjectSelect'
import mixin from '@/pages/list-mixin'
// import WorkOrder from './id'

const { WORK_TYPES, WORK_STEPS } = config

export default {
  mixins: [mixin],
  components: { ProjectSelect, WorkOrder: () => import('./id') },
  data () {
    return {
      WORK_STEPS,
      FETCH_ACTION: 'FETCH_WORKORDERS',
      DELETE_ACTION: 'DELETE_WORKORDER',
      prefetchUserNames: true,
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
                props: { label: '备注' }
              }, row.note),
              h('FormItem', {
                props: { label: '实施时间' }
              }, row.workTime),
              h('FormItem', {
                props: { label: '工时' }
              }, row.workHours),
              h('FormItem', {
                props: { label: '实施总结' }
              }, row.summary),
              h('FormItem', {
                props: { label: '差旅费用' }
              }, row.expense),
              h('FormItem', {
                props: { label: '额外费用' }
              }, row.extraExpense)
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
          title: '描述',
          key: 'description',
          ellipsis: true,
          width: 250
        },
        {
          title: '类型',
          key: 'type',
          sortable: true,
          width: 100,
          render (h, { row }) {
            return WORK_TYPES[row.type]
          }
        },
        {
          title: '阶段',
          key: 'step',
          sortable: true,
          width: 64,
          render (h, { row }) {
            return h('Tag', {
              style: {
                backgroundColor: row.step ? row.step === 4 ? '#5f9ea0' : '#2578b5' : '#b8844f'
              }
            }, [
              WORK_STEPS[row.step]
            ])
          }
        },
        {
          title: '受理',
          key: 'dispatcher',
          width: 64,
          render (h, { row }) {
            let id = row.dispatcher
            if (!id) return
            let user = state.userNames[id]
            return user && user.name
          }
        },
        {
          title: '审核',
          key: 'auditor',
          width: 64,
          render (h, { row }) {
            let id = row.auditor
            if (!id) return
            let user = state.userNames[id]
            return user && user.name
          }
        },
        {
          title: '实施',
          key: 'workers',
          width: 120,
          render (h, { row }) {
            let ids = row.workers
            if (!ids) return
            let userNames = state.userNames
            return ids.map(i => userNames[i] && userNames[i].name).join(', ')
          }
        },
        {
          title: '备注',
          key: 'note',
          ellipsis: true,
          width: 250
        },
        {
          title: '实施时间',
          key: 'workTime',
          width: 250
        },
        // {
        //   title: '工时',
        //   key: 'workHours',
        //   width: 80
        // },
        // {
        //   title: '实施总结',
        //   key: 'summary',
        //   ellipsis: true,
        //   width: 250
        // },
        {
          title: '创建者',
          key: 'createdBy',
          width: 64,
          render (h, { row }) {
            let id = row.createdBy
            let user = state.userNames[id]
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
        }
      ]
    },
    addable () {
      let query = this.query
      return !query.step || !query.assignee
    }
  },
  methods: {
    handleProjectQuery (value) {
      this.query.project = value
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
      return (!query.project || data.project === query.project) &&
         (!Number.isInteger(query.step) || data.step === query.step) &&
         (!query.createdBy || data.createdBy === query.createdBy)
    },
    getQuery (query) {
      let user = this.$store.state.currentUser
      console.info('getQuery', this.addable, user, query)
      if (!user) return {}
      if ('draft' in query) {
        return { step: 0, createdBy: user._id }
      }
      if ('mine' in query) {
        // -1 represents != 0
        return { createdBy: user._id }
      }
      if ('pending' in query) {
        return { assignee: user._id }
      }
      if ('finish' in query) {
        return user.role ? { step: 4, createdBy: user._id } : { step: 4 }
      }
      return user.role > 0 ? { createdBy: user._id } : {}
    }
  },
  beforeRouteUpdate (to, from, next) {
    console.info('beforeRouteUpdate', to)
    this.query = this.getQuery(to.query)
    this.fetchArray()
    next()
  }
}
</script>
