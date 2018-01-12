<template>
  <div>
    <Form inline :label-width="38">
      <FormItem label="项目">
        <ProjectSelect ref="projectSelect" style="width: 320px" size="small" @on-change="handleProjectQuery"></ProjectSelect>
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
        清单信息
        <Icon :type="modalClass === 'normal' ? 'arrow-expand' : 'arrow-shrink'" class="zoom" @click="toggleFullScreen"></Icon>
      </div>
      <Inventory v-if="currentData" ref="inventory" :cancelable="true" :readonly="disabled" :data="currentData" @save="handleSave" @cancel="handleCancel"></Inventory>
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
      DELETE_ACTION: 'DELETE_INVENTORY',
      prefetchUserNames: true
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
            let user = state.userNames[row.createdBy]
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
    toggleFullScreen () {
      this.modalClass = this.modalClass === 'normal' ? 'fullscreen' : 'normal'
      this.$nextTick(() => {
        this.$refs.inventory.$refs.table.table.view.wt.wtScroll.instance.draw()
      })
    },
    handleProjectQuery (value) {
      this.query.projectId = value
      this.fetchArray()
    },
    matchQuery () {
      let query = this.query
      let data = this.currentData
      return (!query.projectId || data.projectId === query.projectId)
    }
  }
}
</script>
