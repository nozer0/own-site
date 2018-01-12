<template>
  <div ref="companies">
    <Form inline :label-width="50">
      <FormItem label="类型" v-show="!$route.query.type">
        <Select clearable size="small" style="width: 150px" :disabled="loading || !currentUser" @on-change="handleTypeQuery">
          <Option v-for="(v, k) in COMPANY_TYPES" :key="k" :label="v" :value="k"></Option>
        </Select>
      </FormItem>
      <FormItem label="区域">
        <RegionSelect ref="regionSelect" :disabled="loading || !currentUser" @on-change="handleRegionQuery" size="small"></RegionSelect>
      </FormItem>
      <FormItem label="名称">
        <CompanySelect ref="companySelect" style="width: 320px" :disabled="loading || !currentUser" :region="query.region" :type="$route.query.type" @on-change="handleCompanyQuery"></CompanySelect>
      </FormItem>
      <FormItem class="buttons">
        <Button type="ghost" size="small" icon="plus" :disabled="!addable" @click.stop.prevent="handleAdd">新增</Button>
        <Button type="ghost" size="small" icon="edit" :disabled="!editable" @click.stop.prevent="handleEdit">编辑</Button>
        <Poptip confirm placement="left" transfer :title="'操作不可恢复，是否确定该删除该公司及所属数据 ' + (selectData ? selectData.name + ' [' + selectData._id + ']？' : '')" @on-ok="handleRemove">
          <Button type="ghost" size="small" icon="trash-b" :disabled="!editable">删除</Button>
        </Poptip>
        <div v-show="$refs.upload && $refs.upload.dropActive" class="drop-active">
          <h3>拖放文件并上传</h3>
        </div>
        <FileUpload ref="upload" v-model="files"
          extensions="csv" accept="text/csv"
          name="csv" :headers="headers" :post-action="uploadUrl"
          :drop="addable" :drop-directory="false"
          @input-filter="inputFilter" @input-file="inputFile">
          <Tag :disabled="!addable"><Icon type="ios-upload"></Icon> 导入</Tag>
        </FileUpload>
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
        公司信息
        <Icon :type="modalClass === 'normal' ? 'arrow-expand' : 'arrow-shrink'" class="zoom" @click="toggleFullScreen"></Icon>
      </div>
      <Company v-if="currentData" ref="company" :cancelable="true" :readonly="disabled" :data="currentData" @save="handleSave" @cancel="handleCancel"></Company>
      <div slot="footer"></div>
    </Modal>

    <Modal v-model="showUploadDialog" title="上传文件" transfer :closable="false" :mask-closable="false" @on-ok="handleUploadOk" @on-cancel="handleUploadCancel">
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
    </Modal>
  </div>
</template>

<script>
import { toDateString } from '@/util'
import config from '@/store/config'
import RegionSelect from '@/components/RegionSelect'
import CompanySelect from '@/components/CompanySelect'
import mixin from '@/pages/list-mixin'
import uploadMixin from '@/pages/upload-mixin'
// import Company from './id'

const { COMPANY_TYPES } = config

export default {
  mixins: [mixin, uploadMixin],
  components: { RegionSelect, CompanySelect, Company: () => import('./id') },
  props: ['type'],
  data () {
    // let type = this.$route.query.type
    return {
      FETCH_ACTION: 'FETCH_COMPANIES',
      GET_ACTION: 'GET_COMPANY',
      DELETE_ACTION: 'DELETE_COMPANY',
      STORE_NAME: 'companies',
      UPLOAD_URL: config.BASE + '/companies/import',
      COMPANY_TYPES,
      prefetchUserNames: true,
      query: {
        type: ~~this.type,
        id: null,
        region: null
      }
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
              props: { labelPosition: 'top' }
            }, [
              h('FormItem', {
                props: { label: '税号' }
              }, row.billing.taxNum),
              h('FormItem', {
                props: { label: '银行' }
              }, row.billing.bank),
              h('FormItem', {
                props: { label: '账号' }
              }, row.billing.account),
              h('FormItem', {
                props: { label: '抬头' }
              }, row.billing.title),
              h('FormItem', {
                props: { label: '描述' }
              }, row.description),
              h('FormItem', {
                props: { label: '备注' }
              }, row.note)
            ])
          }
        },
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
          title: '类型',
          key: 'type',
          width: 70,
          render (h, { row }) {
            return COMPANY_TYPES[row.type]
          }
        },
        {
          title: '分类',
          key: 'category',
          sortable: true,
          width: 80
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
          width: 120
        },
        {
          title: '邮编',
          key: 'zipcode',
          width: 80
        },
        {
          title: '网址',
          key: 'site',
          width: 100
        },
        {
          title: '级别',
          key: 'level',
          width: 50
        },
        {
          title: '资本（万元）',
          key: 'fund',
          width: 100
        },
        {
          title: '规模',
          key: 'staff',
          width: 80
        },
        {
          title: '创建者',
          key: 'createdBy',
          width: 80,
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
        }
      ]
    }
  },
  watch: {
    type (newValue, oldValue) {
      if (newValue === oldValue) return
      this.query.type = newValue
      this.$refs.companySelect.init = false
      this.query.offset = 0
      this.fetchArray()
    }
  },
  methods: {
    handleAdd () {
      this.isNew = true
      let query = this.query
      this.currentData = {
        type: query.type && +query.type,
        region: query.region
      }
      this.isDialogVisible = true
    },
    handleTypeQuery (value) {
      this.query.offset = 0
      this.query.type = value
      this.fetchArray()
    },
    handleRegionQuery (value) {
      this.query.offset = 0
      this.query.region = value.length ? value[value.length - 1] : null
      this.$refs.companySelect.init = false
      this.fetchArray()
    },
    handleCompanyQuery (value) {
      this.query.offset = 0
      this.query.id = value
      this.fetchArray()
    },
    matchQuery (data) {
      let query = this.query
      return (!query.id || query.id === data._id) && (!Number.isInteger(query.type) || data.type === query.type) && (!query.region || data.region === query.region)
    }
  },
  beforeRouteUpdate2 (to, from, next) {
    console.info(this.type, this.query)
    this.query.type = this.type// to.query.type && +to.query.type
    this.$refs.companySelect.init = false
    this.query.offset = 0
    this.fetchArray()
    next()
  }
}
</script>
