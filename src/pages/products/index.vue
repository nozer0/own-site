<template>
  <div>
    <Form inline :label-width="50">
      <FormItem label="分类">
        <Select clearable size="small" style="width: 150px" :disabled="loading || !currentUser" @on-change="handleCategoryChange">
          <Option v-for="(label, id) in CATEGORIES" :key="id" :label="label" :value="id"></Option>
        </Select>
      </FormItem>
      <FormItem label="厂商">
        <Select clearable size="small" style="width: 150px" :disabled="loading || !currentUser" @on-change="handleVendorChange">
          <Option v-for="(label, id) in VENDORS" :key="id" :label="label" :value="id"></Option>
        </Select>
      </FormItem>
      <FormItem label="型号">
        <ProductSelect ref="productSelect" style="width: 200px" queryOnEnter :disabled="loading || !currentUser" :category="query.category" :vendor="query.vendor" @on-change="handleProductQuery"></ProductSelect>
      </FormItem>
      <FormItem class="buttons">
        <Button type="ghost" size="small" icon="plus" :disabled="!addable" @click.stop.prevent="handleAdd">新增</Button>
        <Button type="ghost" size="small" icon="edit" :disabled="!editable" @click.stop.prevent="handleEdit">编辑</Button>
        <Poptip confirm placement="left" transfer :title="'操作不可恢复，是否确定该删除产品 ' + (selectData ? selectData.model + ' [' + selectData._id + ']？' : '')" @on-ok="handleRemove">
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
        产品信息
        <Icon :type="modalClass === 'normal' ? 'arrow-expand' : 'arrow-shrink'" class="zoom" @click="toggleFullScreen"></Icon>
      </div>
      <Product v-if="currentData" ref="product" :cancelable="true" :readonly="disabled" :data="currentData" @save="handleSave" @cancel="handleCancel"></Product>
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
import config from '@/store/config'
import ProductSelect from '@/components/ProductSelect'
import mixin from '@/pages/list-mixin'
import uploadMixin from '@/pages/upload-mixin'
// import Product from './id'

const { PRODUCT: { VENDORS, CATEGORIES } } = config

export default {
  mixins: [mixin, uploadMixin],
  components: { ProductSelect, Product: () => import('./id') },
  data () {
    return {
      FETCH_ACTION: 'FETCH_PRODUCTS',
      GET_ACTION: 'GET_PRODUCT',
      DELETE_ACTION: 'DELETE_PRODUCT',
      STORE_NAME: 'products',
      UPLOAD_URL: config.BASE + '/products/import',
      VENDORS,
      CATEGORIES,
      query: {
        id: null,
        category: null,
        vendor: null,
        name: null
      }
    }
  },
  computed: {
    addable () {
      return !this.loading && !this.readonly && !!this.currentUser
    },
    editable () {
      if (this.loading || this.readonly) return false
      let user = this.currentUser
      let data = this.selectData
      return user && data && data._id
    },
    columns () {
      return [
        {
          type: 'expand',
          width: 30,
          fixed: 'left',
          render (h, { row }) {
            return h('Form', {
              props: { labelPosition: 'top' }
            }, [
              h('FormItem', {
                props: { label: '参数' }
              }, row.parameter),
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
          title: '型号',
          key: 'model',
          width: 100
        },
        {
          title: '名称',
          key: 'name',
          width: 120
        },
        {
          title: '分类',
          key: 'category',
          width: 80,
          render (h, { row }) {
            return CATEGORIES[row.category]
          }
        },
        {
          title: '厂商',
          key: 'vendor',
          width: 60,
          render (h, { row }) {
            return VENDORS[row.vendor]
          }
        },
        {
          title: '零售价',
          key: 'retailPrice',
          sortable: true,
          width: 80
        },
        {
          title: '集采价',
          key: 'finalistPrice',
          sortable: true,
          width: 80
        },
        {
          title: '参数',
          key: 'parameter',
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
          title: '备注',
          key: 'note',
          ellipsis: true,
          width: 250
        }
      ]
    }
  },
  methods: {
    handleCategoryChange (value) {
      this.query.offset = 0
      this.query.category = value
      this.$refs.productSelect.init = false
      this.fetchArray()
    },
    handleVendorChange (value) {
      this.query.offset = 0
      this.query.vendor = value
      this.$refs.productSelect.init = false
      this.fetchArray()
    },
    handleProductQuery (value, select) {
      let query = this.query
      query.offset = 0
      if (select) {
        query.id = value
        query.name = null
      } else {
        query.id = null
        query.name = value
      }
      this.fetchArray()
    },
    matchQuery (data) {
      let query = this.query
      let name = query.name && query.name.toLowerCase()
      return (!query.id || query.id === data._id) && (!query.category || data.category === query.category) &&
         (!query.vendor || data.vendor === query.vendor) &&
         (!name || data.name.toLowerCase().indexOf(name) !== -1 || data.model.toLowerCase().indexOf(name) !== -1)
    }
  }
}
</script>