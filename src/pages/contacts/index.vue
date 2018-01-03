<template>
  <div>
    <Form inline :label-width="50">
      <FormItem label="公司">
        <CompanySelect ref="companySelect" style="width: 200px" :disabled="loading || !currentUser" @on-change="handleCompanyQuery"></CompanySelect>
      </FormItem>
      <FormItem label="姓名">
        <ContactSelect ref="contactSelect" style="width: 200px" :disabled="loading || !currentUser" @on-change="handleContactQuery"></ContactSelect>
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
    <Table ref="table" :data="dataArray" :columns="columns" :loading="loading" size="small" highlight-row border stripe @on-current-change="handleSelect" @on-row-dblclick="handleEdit"></Table>
    <div style="margin: 10px; overflow: hidden">
      <div style="text-align: right">
        <Page size="small" :page-size="query.size" :total="total" :current.sync="currentPage"></Page>
      </div>
    </div>

    <Modal title="联系人信息" v-model="isDialogVisible" width="720" transfer>
      <Contact ref="contact" :cancelable="true" :readonly="readonly" :data="currentData" @save="handleSave" @cancel="handleCancel"></Contact>
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
import ContactSelect from '@/components/ContactSelect'
import CompanySelect from '@/components/CompanySelect'
import mixin from '@/pages/list-mixin'
import uploadMixin from '@/pages/upload-mixin'

export default {
  mixins: [mixin, uploadMixin],
  components: { CompanySelect, ContactSelect, Contact: () => import('./id') },
  data () {
    return {
      FETCH_ACTION: 'FETCH_CONTACTS',
      GET_ACTION: 'GET_CONTACT',
      DELETE_ACTION: 'DELETE_CONTACT',
      STORE_NAME: 'contacts',
      fetchUsers: true,
      query: {
        withCompanyName: 1,
        id: null,
        company: null
      }
    }
  },
  computed: {
    columns () {
      let state = this.$store.state
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
          key: 'company.name',
          width: 150,
          render (h, { row }) {
            return row.companyName || row.company && row.company.name
          }
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
          title: '创建者',
          key: 'createdBy',
          width: 80,
          render (h, { row }) {
            let id = row.createdBy
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
      this.query.offset = 0
      this.query.company = value
      this.fetchArray()
    },
    handleContactQuery (value) {
      this.query.offset = 0
      this.query.id = value
      this.fetchArray()
    },
    getQueryOptions (id) {
      return { id, withCompanyName: 1 }
    },
    matchQuery (data) {
      let query = this.query
      return (!query.id || query.id === data._id) && (!query.company || data.company._id === query.company)
    }
  }
}
</script>
