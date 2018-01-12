<template>
  <Form ref="form" :model="currentData" :rules="rules" :label-width="52">
    <Row v-if="!embed">
      <Col :xs="21" :sm="16">
        <FormItem label="项目" prop="project">
          <Input v-if="data && data.project" size="small" :disabled="true" :value="currentData.projectName"></Input>
          <ProjectSelect ref="projectSelect" v-else :value="currentData.project" size="small" :disabled="freezed" @on-change="handleProjectChange"></ProjectSelect>
        </FormItem>
      </Col>
    </Row>
    <FormItem label="备注">
      <Input v-model="currentData.note" type="textarea" :autosize="{minRows:2}" size="small" :disabled="freezed"></Input>
    </FormItem>
    <Row>
      <Col :xs="12" :sm="6" :lg="3"> 
        <FormItem label="折扣" :label-width="52">
          <Select v-model="priceBase" size="small" :disabled="freezed">
            <Option value="retailPrice">零售价</Option>
            <Option value="finalistPrice">集采价</Option>
          </Select>
        </FormItem>
      </Col>
      <Col :xs="12" :sm="6" :lg="3"> 
        <FormItem label="" :label-width="1">
          <InputNumber v-model="currentData.discount" size="small" :min="0" :disabled="freezed"><template slot="append">%</template></InputNumber> %
        </FormItem>
      </Col>
      <Col :xs="12" :sm="12" :lg="6"> 
        <FormItem label="预估毛利" :label-width="70">
          {{ totalPrice }} - {{ totalFinalistPrice }} = {{ +(totalPrice - totalFinalistPrice).toFixed(2) }} 元
        </FormItem>
      </Col>
      <FormItem v-if="!disabled" :label-width="1" class="form-buttons">
        <Button type="ghost" size="small" icon="plus" :loading="loading" @click.stop.prevent="handleAdd">新增</Button>
        <Button size="small" type="primary" icon="android-done" :disabled="loading || !this.products.length" :loading="loading" @click.stop.prevent="handleSave">保存</Button>
        <Button size="small" icon="archive" :disabled="loading || !selectRows" :loading="loading" @click.stop.prevent="handleSaveProducts">更新产品库</Button>
        <!-- <Button size="small" type="ghost" icon="trash-b" :disabled="loading" @click.stop.prevent="handleRemove">删除</Button> -->
        <Button v-if="cancelable" type="ghost" icon="close" size="small" @click.stop.prevent="handleCancel">取消</Button>
        <Button @click.stop.prevent="test"></Button>
      </FormItem>
    </Row>
    <div style="position: relative; clear: both">
      <!-- <Table ref="table" :data="currentData.products" :columns="columns" :loading="loading" size="small" highlight-row border></Table> -->
      <HotTable ref="table" class="dark" :columns="columns" :settings="tableSettings"></HotTable>
    </div>
    <Row>
      <Col :xs="24" :sm="12">
        <FormItem label="创建">{{ createdBy }} ({{ currentData.createdAt | toDateString }})</FormItem>
      </Col>
      <Col :xs="24" :sm="12">
        <FormItem label="修改">{{ updatedBy }} ({{ currentData.updatedAt | toDateString }})</FormItem>
      </Col>
    </Row>
  </Form>
</template>

<script>
import Handsontable from 'handsontable'
import HotTable from 'vue-handsontable-official'
import { fastInnerText } from '@/util'
import config from '@/store/config'
import ProjectSelect from '@/components/ProjectSelect'
import mixin from '@/pages/mixin'

const { PRODUCT: { VENDORS, CATEGORIES } } = config

const VENDOR_MAP = {}
for (let k in VENDORS) {
  VENDOR_MAP[VENDORS[k]] = k
}
const CATEGORY_MAP = {}
for (let k in CATEGORIES) {
  CATEGORY_MAP[CATEGORIES[k]] = k
}

function overflowRenderer (instance, td, row, col, prop, value, cellProperties) {
  Handsontable.renderers.BaseRenderer.apply(this, arguments)
  if (td.children.length) {
    if (value && value.indexOf('\n') >= 0) {
      td.children[0].innerHTML = value.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>')
    } else {
      fastInnerText(td.children[0], value || '')
    }
  } else {
    let div = document.createElement('DIV')
    div.className = 'wrap'
    if (value && value.indexOf('\n') >= 0) {
      div.innerHTML = value.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>')
    } else {
      fastInnerText(div, value || '')
    }
    td.appendChild(div)
  }
  return td
}

export default {
  mixins: [mixin],
  components: { ProjectSelect, HotTable },
  data () {
    return {
      name: 'inventory',
      GET_ACTION: 'GET_INVENTORY',
      POST_ACTION: 'POST_INVENTORY',
      priceBase: 'retailPrice',
      timer: null,
      lastQuery: null,
      queryData: null,
      selectRows: null,
      totalPrice: 0,
      totalRetailPrice: 0,
      totalFinalistPrice: 0,
      totalCell: null,
      totalRetailCell: null,
      totalFinalistCell: null,
      products: []// this.setProducts(this.data && this.data.products)
    }
  },
  computed: {
    rules () {
      return {
        project: [
          { required: true, message: '请选择所属项目', trigger: 'change,blur' }
        ]
      }
    },
    columns () {
      return [
        {
          data: 'checked',
          className: 'htCenter',
          observeChanges: false,
          editor: false,
          type: 'checkbox'
        },
        {
          data: 'model',
          type: 'dropdown',
          width: 200,
          strict: false,
          validator2 (value, callback) {
            if (value == null) value = ''
            if (this.allowEmpty && value === '') {
              return callback(true)
            }
            if (this.strict && this.source) {
              if (typeof this.source === 'function') {
                this.source(value, process(value, callback))
              } else {
                process(value, callback)(this.source)
              }
            } else {
              callback(true)
            }
          },
          allowEmpty: true,
          allowInvalid: true,
          source: this.handleProductQuery
        },
        { data: 'name' },
        {
          data: 'category',
          editor: 'select',
          selectOptions: CATEGORIES,
          className: 'htCenter',
          renderer (instance, td, row, col, prop, value, cellProperties) {
            if (value in CATEGORY_MAP) {
              value = arguments[5] = CATEGORY_MAP[value]
            }
            Handsontable.renderers.BaseRenderer.apply(this, arguments)
            fastInnerText(td, CATEGORIES[value] || '')
            return td
          }
        },
        {
          data: 'vendor',
          editor: 'select',
          selectOptions: VENDORS,
          className: 'htCenter',
          renderer (instance, td, row, col, prop, value, cellProperties) {
            if (value in VENDOR_MAP) {
              value = arguments[5] = VENDOR_MAP[value]
            }
            Handsontable.renderers.BaseRenderer.apply(this, arguments)
            fastInnerText(td, VENDORS[value] || '')
            return td
          }
        },
        {
          data: 'retailPrice',
          type: 'numeric',
          format: '0,0.00'
        },
        {
          data: 'finalistPrice',
          type: 'numeric',
          format: '0,0.00'
        },
        {
          data: 'unitPrice',
          type: 'numeric',
          format: '0,0.00',
          allowEmpty: true
        },
        {
          data: 'amount',
          type: 'numeric',
          allowEmpty: true
        },
        {
          data: 'price',
          type: 'numeric',
          format: '0,0.00',
          readOnly: true,
          editor: false,
          allowEmpty: true
        },
        { data: 'parameter', renderer: overflowRenderer },
        { data: 'description', renderer: overflowRenderer },
        { data: 'note', renderer: overflowRenderer }
      ]
    },
    tableSettings () {
      // console.info('tableSettings', this)
      let self = this
      return {
        data: [],
        height: 400,
        preventOverflow: 'horizontal',
        observeChanges: true,
        renderAllRow: true,
        outsideClickDeselects: false,
        fillHandle: false,
        trimDropdown: true,
        allowInsertColumn: false,
        allowRemoveColumn: false,
        allowInsertRow2: true,
        currentRowClassName: 'select',
        currentColClassName: 'select',
        manualRowResize: true,
        manualColumnResize: false,
        stretchH: 'last',
        manualRowMove: true,
        autoRowSize: false,
        rowHeights: 39,
        fixedColumnsLeft: 2,
        rowHeaders: true,
        colHeaders: ['', '型号', '名称', '分类', '厂商', '零售价', '集采价', '单价', '数量', '小计', '参数', '描述', '备注'],
        contextMenu: {
          items: {
            'row_above': { name: '向上插入一行' },
            'row_below': { name: '向下插入一行' },
            'hsep1': '---------',
            'remove_row': { name: '删除行' }
          }
        },
        dataSchema2: { category: 'switch', vendor: 'RG' },
        afterInit () {
          let tfoot = document.createElement('TFOOT')
          let tr = document.createElement('TR')
          let td = document.createElement('TH')
          td.className = 'htRight'
          let setttings = this.getSettings()
          let cnt = setttings.fixedColumnsLeft + 1
          while (cnt--) {
            let t = td.cloneNode()
            tr.appendChild(t)
          }
          let cfoot = tfoot.cloneNode()
          cfoot.appendChild(tr)
          let clone = this.view.wt.wtOverlays.leftOverlay.clone.wtTable.TABLE
          clone.appendChild(cfoot)

          cnt = setttings.colHeaders.length + 1
          tr = tr.cloneNode()
          while (cnt--) {
            let t = td.cloneNode()
            tr.appendChild(t)
          }
          self.totalCell = tr.children[10]
          self.totalRetailCell = tr.children[6]
          self.totalFinalistCell = tr.children[7]
          tfoot.appendChild(tr)
          this.table.appendChild(tfoot)
        },
        beforeOnCellMouseDown (event, coords, TD) {
          if (TD.parentNode.parentNode.tagName === 'TFOOT') coords.row = -1
        },
        afterSelection2: this.afterSelection,
        afterRemoveRow: this.afterRemoveRow,
        beforeRowMove2: this.beforeRowMove,
        // afterRowMove: this.handleRowMove,
        afterValidate: this.afterValidate,
        // afterLoadData () {},
        afterPaste2 () {
          console.info('afterPaste', arguments)
        },
        afterChange: this.afterChange
      }
    }
  },
  watch: {
    'currentData.discount': function (newValue, oldValue) {
      if (newValue === oldValue) return
      if (isNaN(newValue)) return
      let products = this.products
      if (!products || !products.length) return
      let d = newValue / 100
      let priceBase = this.priceBase
      for (let p of products) {
        if (p[priceBase]) {
          p.unitPrice = +(p[priceBase] * d).toFixed(2)
          p.price = +(p.unitPrice * p.amount).toFixed(2)
        }
      }
    }
  },
  methods: {
    test () {
      window.table = this.$refs.table.table
      window.vv = this
      window.Handsontable = Handsontable
      console.info(this)
      console.info(this.products === this.$refs.table.table.getSourceData())
      console.info(this.products)
      console.info(this.$refs.table.table.getData())
      console.info(this.$refs.table.table.getSourceData())
    },
    setProducts (array) {
      let clone = []
      if (array) {
        for (let d of array) {
          delete d._id
          d.unitPrice = +(Math.random() * 10000).toFixed(2)
          d.amount = 1// parseInt(Math.random() * 10, 10)
          d.price = +(d.unitPrice * d.amount).toFixed(2)
          // total += d.price
          clone.push({...d})
        }
      }
      return clone
    },
    cloneData (data) {
      return {
        ...data,
        discount: data && data.discount || 100,
        project: data && data.project
      }
    },
    async setData (id) {
      this.loading = true
      this.$Loading.start()
      try {
        let data = await this.$store.dispatch(this.GET_ACTION, id)
        if (data) {
          if (this.data) Object.assign(this.data, this.cloneData(data))
          this.currentData = this.cloneData(data)
          this.products = this.setProducts(data.products)
          this.$refs.table.table.updateSettings({data: this.products})
          this.calculateTotalPrice()
        } else {
          this.$Message.warning('没有相应数据!')
        }
      } catch (err) {
        this.$emit('error', err)
        let res = err.response
        this.$Message.error(res && res.data && res.data.error || err.message || err.toString())
      }
      this.loading = false
      this.$Loading.finish()
    },
    handleProductQuery (query, process) {
      clearTimeout(this.timer)
      if (query === this.lastQuery) {
        process(this.queryData.map(d => d.model))
        return
      }
      this.loading = true
      this.$Loading.start()
      this.timer = setTimeout(async () => {
        let data = await this.$store.dispatch('QUERY_PRODUCT_NAMES', query)
        // console.info('QUERY_PRODUCT_NAMES', query, data)
        this.lastQuery = query
        this.queryData = data
        this.loading = false
        this.$Loading.finish()
        process(data ? data.map(d => d.model) : [])
        // process([])
      }, query ? 500 : 1000)
    },
    // afterSelection () {
    //   this.selectRows = null
    //   let table = this.$refs.table.table
    //   if (table.selection.selectedHeader.rows) {
    //     let range = table.getSelected()
    //     if (range) {
    //       let rows = []
    //       let [i,, l] = range
    //       if (i > l) [i, l] = [l, i]
    //       for (let data = this.products, d, pi; i <= l; i += 1) {
    //         d = data[pi = table.toPhysicalRow(i)]
    //         if (d && d.model) rows.push(pi)
    //       }
    //       this.selectRows = rows.length ? rows : null
    //     }
    //   }
    // },
    afterValidate (isValid, value, row, prop, source) {
      // let table = this.$refs.table.table
      // table.setCellMeta(row, prop, 'isValid', isValid)
      if (!isValid) {
        this.$Message.warning('请确认数据 ' + value + ' 是否正确')
      }
    },
    calculateTotalPrice () {
      let products = this.products
      this.totalRetailPrice = 0
      this.totalFinalistPrice = 0
      this.totalPrice = 0
      for (let p of products) {
        if (!isNaN(p.retailPrice)) this.totalRetailPrice += p.retailPrice
        if (!isNaN(p.finalistPrice)) this.totalFinalistPrice += p.finalistPrice
        if (!isNaN(p.price)) this.totalPrice += p.price
      }
      fastInnerText(this.totalRetailCell, this.totalRetailPrice = +(this.totalRetailPrice).toFixed(2))
      fastInnerText(this.totalFinalistCell, this.totalFinalistPrice = +(this.totalFinalistPrice).toFixed(2))
      fastInnerText(this.totalCell, this.totalPrice = +(this.totalPrice).toFixed(2))
    },
    afterRemoveRow (row, amount) {
      this.calculateTotalPrice()
    },
    // afterPaste (pasteData, [{startRow, startCol}]) {
    //   if (startCol === 0) {
    //     console.info(pasteData)
    //     let table = this.$refs.table.table
    //     table.populateFromArray(startRow, startCol, pasteData)
    //     // let data = table.getSourceData()
    //     // for (let pd of pasteData) {
    //     //   let d = data[table.toPhysicalRow(startRow)]
    //     //   console.info(d.model, d.name, pd[0])
    //     //   d.model = pd[0]
    //     //   // table.setDataAtCell(startRow, 0, pd[0])
    //     //   startRow += 1
    //     // }
    //   }
    // },
    async afterChange (changes, source) {
      // console.info('afterChange', arguments)
      if (source === 'edit') {
        let [[row, col, oldValue, value]] = changes
        if (col === 'checked') {
          let products = this.$refs.table.table.getSourceData()
          let checked = []
          for (let p of products) {
            if (p.checked && p.model) {
              checked.push(p)
            }
          }
          this.selectRows = checked.length ? checked : null
          return
        }
        if (col === 'model' && oldValue !== value) {
          let table = this.$refs.table.table
          // console.info(row, col, oldValue, value)
          let meta = table.getCellMeta(row, 1)
          console.info(meta)
          if (meta.valid) {
            this.loading = true
            this.$Loading.start()
            try {
              let data = await this.$store.dispatch('GET_PRODUCT_BY_MODEL', value)
              if (!data) return
              delete data._id
              for (let k in data) {
                if (k !== 'model') table.setDataAtRowProp(row, k, data[k])
              }
              let price = (isNaN(data.unitPrice) || isNaN(data.amount)) ? 0 : data.unitPrice * data.amount
              data.price = price
              // table.setDataAtRowProp(row, 'price', price)
              this.calculateTotalPrice()
            } catch (err) {
              this.$emit('error', err)
              let res = err.response
              this.$Message.error(res && res.data && res.data.error || err.message || err.toString())
            }
            this.loading = false
            this.$Loading.finish()
            // let rowData = table.getSourceDataAtRow(meta.row)
            // Object.assign(rowData, data)
            return
          }
        }
      }
      if (source === 'edit' || source === 'CopyPaste.paste') {
        let [[row, col]] = changes
        if (col === 'unitPrice' || col === 'amount') {
          let table = this.$refs.table.table
          let d = this.products[table.toPhysicalRow(row)]
          // d.price = isNaN(d.unitPrice) || isNaN(d.amount) ? 0 : d.unitPrice * d.amount
          let price = (isNaN(d.unitPrice) || isNaN(d.amount)) ? 0 : +((d.unitPrice * d.amount).toFixed(2))
          if (d.price === price) return
          table.setDataAtCell(row, 9, d.price = price)
          this.calculateTotalPrice()
        } else if (col === 'retailPrice' || col === 'finalistPrice') {
          this.calculateTotalPrice()
        }
      }
    },
    handleAdd () {
      let data = this.$refs.table.table.getSourceData()
      data.push({})
      this.products = data
    },
    handleProjectChange (val, name) {
      this.currentData.project = val
      this.currentData.projectName = name
      // this.$set(this.currentData, 'projectName', name)
    },
    async handleSave () {
      let table = this.$refs.table.table
      let products = table.getSourceData()
      if (products.length < 1) {
        this.$Message.warning('清单有效项目为空!')
        return
      }
      let valid = await this.$refs.form.validate()
      if (valid) {
        // let newModels = []
        let clone = []
        let l = products.length
        for (let i = 0; i < l; i += 1) {
          let vi = table.toPhysicalRow(i)
          let p = products[vi]
          if (p.model) {
            let dp = {...p}
            delete dp.price
            delete dp.checked
            clone.push(dp)
            // if (!p._id) newModels.push(dp.model)
          }
        }
        if (!clone.length) {
          this.$Message.warning('清单有效项目为空!')
          return
        }
        console.info(clone.map(p => p.model))
        this.currentData.totalPrice = this.totalPrice
        this.currentData.products = clone
        this._save()
      } else {
        this.$Message.warning('表单验证失败!')
      }
    },
    async handleSaveProducts () {
      // let table = this.$refs.table.table
      let data = this.$refs.table.table.getSourceData()
      this.loading = true
      this.$Loading.start()
      let store = this.$store
      // let [i, , l] = table.getSelected()
      for (let p of data) {
        // let vi = table.toPhysicalRow(i)
        // let p = data[vi]
        if (p.checked && p.model) {
          let dp = {...p}
          delete dp._id
          delete dp.price
          delete dp.unitPrice
          delete dp.amount
          delete dp.checked
          try {
            dp = await store.dispatch('POST_PRODUCT', dp)
            if (!dp) throw new Error(dp.model + ' 更新失败')
            this.$Message.success(dp.model + ' 更新成功')
            // this.$Notice.success({ title: dp.model + ' 更新成功' })
          } catch (err) {
            this.$emit('error', err)
            this.$Message.error(err)
          }
        }
      }
      this.loading = false
      this.$Loading.finish()
    },
    async afterInitData () {
      let d = this.currentData
      this.products = this.setProducts(d && d.products)
      // let ret = await this.$store.dispatch('FETCH_PRODUCTS')
      // this.products = this.setProducts(ret.data)
      this.$refs.table.table.updateSettings({data: this.products})
      this.calculateTotalPrice()
      // console.info('watch', this.totalCell, this.totalPrice)
      fastInnerText(this.totalRetailCell, this.totalRetailPrice)
      fastInnerText(this.totalFinalistCell, this.totalFinalistPrice)
      fastInnerText(this.totalCell, this.totalPrice)
    }
    // handleRemove () {
    //   let table = this.$refs.table.table
    //   console.info(table.getSelected())
    // }
  }
}
</script>

<style>
.ivu-table-cell input, .ivu-table-cell .ivu-select-selection {
  border-width: 0;
}
.ivu-table-row-highlight input, .ivu-table-row-highlight .ivu-select-selection {
  border-width: 1px;
}

.dark {
  margin-bottom: 12px;
  overflow: visible !important;
}

.dark .handsontable th, .dark>.handsontable td {
  vertical-align: middle;
  /*line-height: 39px;*/
  height: 39px;
}

.dark .handsontable th {
  background-color: #687c8a;
  color: #eef2f6;
}

.dark .handsontable .htDimmed {
  color: #eef2f6;
}

.dark .handsontable td>.wrap {
  overflow-x: hidden;
  overflow-y: auto;
  height: 100%;
}

.dark>.handsontable tr:nth-of-type(odd) > td {
  background-color: #1f2d3d;
}

.dark>.handsontable tr:nth-of-type(even) > td {
  background-color: #414d5a;
}

/*.dark>.handsontable tr:last-child > td {
  background-color: #687c8a;
}*/
.handsontable.ht__manualRowMove.after-selection--rows tr:last-child th.ht__highlight {
  cursor: auto;
}

.dark .handsontable tbody th.ht__highlight, .dark .handsontable thead th.ht__highlight {
  background-color: #788c9a;
}

.dark .handsontable.listbox tr td.current, .dark .handsontable.listbox tr:hover td, 
.dark.handsontable.ht__selection--columns thead th.ht__highlight, .dark.handsontable.ht__selection--rows tbody th.ht__highlight {
  background-color: #5f9ea0;
  color: #eef2f6;
}

.dark .ht_master tr.select > td, .dark .ht_master tr > td.select {
  /*background-color: #5f7e80;*/
}

.dark .handsontable td.area {
  background-color: #485c6a;
}

.dark .wtBorder {
  background-color: #7fbec0 !important;
}

.dark .handsontableInput {
  background-color: #1f2d3d !important;
  color: #eef2f6;
  /*line-height: 39px;*/
  padding: 0 2px 0 8px;
}

.htSelectEditor, .handsontable.listbox tr, .handsontable.listbox tr td, .htContextMenu.handsontable table tbody tr td {
  background-color: #485c6a;
  color: #eef2f6;
  line-height: 39px;
}

.htContextMenu.handsontable table tbody tr td.current, .htContextMenu.handsontable table tbody tr td.zeroclipboard-is-hover, .htContextMenu.handsontable table tbody tr td.htDisabled:hover {
  background-color: #485c6a;
}

.handsontable, .ht_master .wtHolder, .handsontable .wtHider, .handsontable .wtHolder {
  height: auto !important;
}
.ht_clone_top, .ht_clone_bottom {
  display: none;
}
.ht_clone_top .wtHolder, .ht_clone_bottom .wtHolder {
  overflow-x: hidden !important;
}
.handsontable tfoot th {
  border-top: none !important;
}
/*.handsontable tfoot th:nth-child(13n+1) {
  border-right: none;
}*/
</style>
