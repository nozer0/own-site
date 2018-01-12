<template>
  <div ref="projects">
    <Form inline :label-width="50">
      <FormItem label="区域">
        <RegionSelect ref="regionSelect" size="small" :disabled="loading || !currentUser" :value="query.region" @on-change="handleRegionQuery"></RegionSelect>
      </FormItem>
      <FormItem label="客户">
        <CompanySelect ref="companySelect" style="width: 320px" :disabled="loading || !currentUser" :value="query.customer" @on-change="handleCompanyQuery"></CompanySelect>
      </FormItem>
      <FormItem label="类型">
        <Select clearable size="small" style="width: 150px" :disabled="loading || !currentUser" :value="query.type" @on-change="handleTypeQuery">
          <Option v-for="(v, k) in TYPES" :key="k" :label="v" :value="k"></Option>
        </Select>
      </FormItem>
      <FormItem label="阶段">
        <Select clearable size="small" style="width: 150px" :disabled="loading || !currentUser" :value="query.phase" @on-change="handlePhaseQuery">
          <Option v-for="(v, k) in PHASES" :key="k" :label="v" :value="k"></Option>
        </Select>
      </FormItem>
      <FormItem class="buttons">
        <Button type="ghost" size="small" icon="plus" :disabled="!addable" @click.stop.prevent="handleAdd">新增</Button>
        <Button type="ghost" size="small" icon="edit" :disabled="!editable" @click.stop.prevent="handleEdit">编辑</Button>
        <Poptip v-if="currentUser && currentUser.role < 0" confirm placement="left" transfer :title="'操作不可恢复，是否确定该删除该项目及所属数据 ' + (selectData ? selectData.name + ' [' + selectData._id + ']？' : '')" @on-ok="handleRemove">
          <Button type="ghost" size="small" icon="trash-b" :disabled="!editable">删除</Button>
        </Poptip>
        <!-- <div v-show="$refs.upload && $refs.upload.dropActive" class="drop-active">
          <h3>拖放文件并上传</h3>
        </div>
        <FileUpload ref="upload" v-model="files"
          extensions="csv" accept="text/csv"
          name="csv" :headers="headers" :post-action="uploadUrl"
          :drop="addable" :drop-directory="false"
          @input-filter="inputFilter" @input-file="inputFile">
          <Tag :disabled="!addable"><Icon type="ios-upload"></Icon> 导入</Tag>
        </FileUpload> -->
        <Button @click="test"></Button>
      </FormItem>
    </Form>
    <Table ref="table" :data="dataArray" :columns="columns" :loading="loading" size="small" highlight-row border stripe @on-row-click="handleSelect" @on-row-dblclick="handleEdit"></Table>
    <div style="margin: 10px; overflow: hidden">
      <div style="text-align: right">
        <Page size="small" :page-size="query.size" :total="total" :current.sync="currentPage"></Page>
      </div>
    </div>

    <Modal ref="modal" v-model="isDialogVisible" transfer :mask-closable="false" width="80%" :class-name="modalClass">
      <div slot="header" style="margin-right: 20px" @click="toggleFullScreen">
        项目信息
        <Icon :type="modalClass === 'normal' ? 'arrow-expand' : 'arrow-shrink'" class="zoom" @click="toggleFullScreen"></Icon>
      </div>
      <Project v-if="currentData" ref="project" :cancelable="true" :readonly="readonly" :data="currentData" @save="handleSave" @cancel="handleCancel"></Project>
      <div slot="footer"></div>
    </Modal>

    <!-- <Modal v-model="showUploadDialog" title="上传文件" transfer :closable="false" :mask-closable="false" @on-ok="handleUploadOk" @on-cancel="handleUploadCancel">
      {{ uploadFile.name }} - {{ (uploadFile.size / 1024).toFixed(2) }}K
      <Progress :percent="~~uploadFile.progress" :status="uploadStatus"></Progress>
      <ul v-show="uploadFile.success">
        <li v-for="ret in uploadResults">
          <span v-if="Array.isArray(ret)">
            <Icon type="checkmark-circled" color="#f30"></Icon>
            {{ ret[0] + ' ' + ret[1] }}
          </span>
          <span v-else>
            <Icon type="close-circled" color="#5f9ea0"></Icon>
            {{ ret }}' 成功'
          </span>
        </li>
      </ul>
    </Modal> -->
  </div>
</template>

<script>
import { toDateString } from '@/util'
import config from '@/store/config'
import RegionSelect from '@/components/RegionSelect'
import CompanySelect from '@/components/CompanySelect'
import mixin from '@/pages/list-mixin'
// import uploadMixin from '@/pages/upload-mixin'
// import Project from './id'

const { PROJECT: { TYPES, CATEGORIES, PHASES } } = config

export default {
  mixins: [mixin],
  components: { RegionSelect, CompanySelect, Project: () => import('./id') },
  data () {
    return {
      FETCH_ACTION: 'FETCH_PROJECTS',
      GET_ACTION: 'GET_PROJECT',
      DELETE_ACTION: 'DELETE_PROJECT',
      STORE_NAME: 'projects',
      // UPLOAD_URL: config.BASE + '/projects/import',
      TYPES,
      CATEGORIES,
      PHASES,
      prefetchUsernames: true,
      query: {
        step: null,
        status: null,
        region: null,
        customer: null,
        type: null,
        phase: null
      }
    }
  },
  computed: {
    addable () {
      if (this.loading || this.readonly) return false
      return this.currentUser && !this.query.step && !this.query.status
    },
    columns () {
      let state = this.$store.state
      return [
        {
          title: '名称',
          key: 'name',
          width: 200
        },
        {
          title: '编码',
          key: 'code',
          width: 110
        },
        {
          title: '客户',
          key: 'customer.company',
          width: 200,
          render (h, { row }) {
            return row.customer.companyName || ''
          }
        },
        {
          title: '类型',
          key: 'type',
          width: 80,
          render (h, { row }) {
            return TYPES[row.type]
          }
        },
        {
          title: '分类',
          key: 'category',
          width: 70,
          render (h, { row }) {
            return CATEGORIES[row.category]
          }
        },
        {
          title: '阶段',
          key: 'phase',
          width: 120,
          render (h, { row }) {
            return PHASES[row.phase]
          }
        },
        {
          title: '区域',
          key: 'region',
          sortable: true,
          width: 80
        },
        {
          title: '地址',
          key: 'address',
          width: 200
        },
        {
          title: '销售',
          key: 'salesman',
          width: 80,
          render (h, { row }) {
            let id = row.salesman
            let user = state.users && state.users.find(u => u._id === id)
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
        }
      ]
    }
  },
  methods: {
    handleRegionQuery (value) {
      this.query.offset = 0
      this.query.region = value.length ? value[value.length - 1] : null
      this.fetchArray()
    },
    handleCompanyQuery (value) {
      this.query.offset = 0
      this.query.customer = value
      this.fetchArray()
    },
    handleTypeQuery (value) {
      this.query.offset = 0
      this.query.type = value
      this.fetchArray()
    },
    handlePhaseQuery (value) {
      this.query.offset = 0
      this.query.phase = value
      this.fetchArray()
    },
    matchQuery (data) {
      let query = this.query
      return (!Number.isInteger(query.step) || data.step === query.step) && (!Number.isInteger(query.type) || data.type === query.type) && (!Number.isInteger(query.phase) || data.phase === query.phase) && (!query.region || data.region === query.region) && (!query.customer || data.customer.company === query.customer) && (!query.status || data.status === query.status)
    },
    setQuery (query) {
      if (!this.currentUser) return
      let q = this.query
      q.step = query.step
      q.status = query.status
      q.region = null
      q.customer = null
      q.type = null
      q.phase = null
      q.offset = 0
    }
  },
  beforeRouteUpdate (to, from, next) {
    this.setQuery(to.query)
    // this.query.type = to.query.type && +to.query.type
    // this.$refs.companySelect.init = false
    // this.query.offset = 0
    this.fetchArray()
    next()
  }
}
</script>
