<template>
  <Tabs ref="tabs" type="card" size="small" @on-click="handleTabClick">
    <TabPane label="项目" name="project">
      <Form ref="form" :model="currentData" :rules="rules" :label-width="60">
        <!-- main info -->
        <Row>
          <Col :xs="24" :sm="16">
            <FormItem label="名称" prop="name">
              <Input v-model="currentData.name" size="small" :disabled="freezed"></Input>
            </FormItem>
          </Col>
          <Col :xs="12" :sm="8">
            <FormItem label="编码">
              <Input :value="currentData.code" size="small" placeholder="系统自动生成" :disabled="true"></Input>
            </FormItem>
          </Col>
        </Row>

        <Tabs ref="tabs" id="companiesTabs" type="card" size="small" closable style="margin:0 10px 15px" @on-tab-remove="handleTabRemove">
          <TabPane v-for="(v, k, i) in labels" :label="v" :key="v" :closable="false">
            <Row>
              <Col :xs="18" :sm="12">
                <FormItem label="公司" :prop="k">
                  <Input v-if="data && data[k] && data[k].company" size="small" readonly :disabled="freezed" :value="currentData[k].companyName"></Input>
                  <CompanySelect v-else :ref="k + 'Select'" v-model="currentData[k].company" size="small" :disabled="freezed" :type="i" @on-change="handleCompanyChange(k, ...arguments)"></CompanySelect>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col :xs="16" :sm="12">
                <FormItem label="负责人" :prop="k + 'Contact'">
                  <Input v-if="data && data[k] && data[k].contact" size="small" readonly :disabled="freezed || !currentData[k].company" :value="currentData[k].contactName"></Input>
                  <ContactSelect v-else :ref="k + 'ContactSelect'" size="small" v-model="currentData[k].contact" :company="currentData[k].company" :withPhone="true" :disabled="freezed || !currentData[k].company" @on-change="handleContactChange(k, ...arguments)"></ContactSelect>
                </FormItem>
              </Col>
              <Col :xs="8" :sm="8">
                <FormItem label="电话">
                  <Input :value="currentData[k].contactPhone" size="small" readonly :disabled="freezed || !currentData[k].company"></Input>
                </FormItem>
              </Col>
            </Row>
          </TabPane>
          <TabPane v-for="(v, i) in currentData.vendors" :label="'厂商' + (i ? i + 1 : '')" :name="v.key" :key="v.key" :closable="!disabled && currentData.vendors.length > 1">
            <Row>
              <Col :xs="18" :sm="12">
                <FormItem label="公司">
                  <Input v-if="data && data.vendors && data.vendors[i] && data.vendors[i].company" size="small" readonly :disabled="freezed" :value="v.companyName"></Input>
                  <CompanySelect v-else ref="vendorSelect" v-model="v.company" size="small" :disabled="freezed" type="3" @on-change="handleVendorCompanyChange(i, ...arguments)"></CompanySelect>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col :xs="16" :sm="12">
                <FormItem label="负责人">
                  <Input v-if="data && data.vendors && data.vendors[i] && data.vendors[i].contact" size="small" readonly :disabled="freezed || !v.company" :value="v.contactName"></Input>
                  <ContactSelect v-else ref="vendorContactSelect" size="small" v-model="v.contact" :company="v.company" :withPhone="true" :disabled="freezed || !v.company" @on-change="handleVendorContactChange(i, ...arguments)"></ContactSelect>
                </FormItem>
              </Col>
              <Col :xs="8" :sm="8">
                <FormItem label="电话">
                  <Input :value="v.contactPhone" size="small" readonly :disabled="freezed || !v.company"></Input>
                </FormItem>
              </Col>
            </Row>
          </TabPane>
          <Button size="small" type="ghost" slot="extra" :disabled="freezed" @click.stop.prevent="handleAddVendor">增加厂商</Button>
        </Tabs>
        <Row>
          <Col :xs="12">
            <FormItem label="类型" prop="type">
              <Select v-model="currentData.type" size="small" :disabled="freezed">
                <Option v-for="(v, k) in TYPES" :key="k" :label="v" :value="k"></Option>
              </Select>
            </FormItem>
          </Col>
          <Col :xs="12" :sm="8">
            <FormItem label="分类" prop="category">
              <Select v-model="currentData.category" size="small" :disabled="freezed">
                <Option v-for="(v, k) in CATEGORIES" :key="k" :label="v" :value="k"></Option>
              </Select>
            </FormItem>
          </Col>
          <Col :xs="12">
            <FormItem label="阶段" prop="phase">
              <Select v-model="currentData.phase" size="small" :disabled="freezed">
                <Option v-for="(v, k) in PHASES" :key="k" :label="v" :value="k"></Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :xs="16" :sm="6">
            <FormItem label="区域" prop="region">
              <RegionSelect :value="currentData.region" @on-change="handleRegionChange" size="small" :disabled="freezed"></RegionSelect>
            </FormItem>
          </Col>
          <Col :xs="24" :sm="18">
            <FormItem label="地址" prop="address">
              <Input v-model="currentData.address" placeholder="请输入项目具体地址" size="small" :disabled="freezed"></Input>
            </FormItem>
          </Col>
        </Row>
        <FormItem label="简介">
          <Input v-model="currentData.description" type="textarea" :autosize="{minRows:2}" size="small" :disabled="freezed"></Input>
        </FormItem>

        <!-- frequent update info -->
        <Collapse value="progress">
        <!-- detail pane -->
          <Panel name="detail">
            详细信息
            <div slot="content">
              <Row>
                <Col :xs="16" :sm="12">
                  <FormItem label="预估开标时间" :label-width="100">
                    <DatePicker type="date" v-model="currentData.estimateBidDate" format="yyyy/MM/dd" transfer clearable size="small" :disabled="freezed"></DatePicker>
                  </FormItem>
                </Col>
                <Col :xs="16" :sm="12">
                  <FormItem label="实际开标时间" :label-width="100">
                    <DatePicker type="date" v-model="currentData.bidDate" format="yyyy/MM/dd" transfer clearable size="small" :disabled="freezed"></DatePicker>
                  </FormItem>
                </Col>
              </Row>
              <!-- <Row>
                <Col :xs="16" :sm="12">
                  <FormItem label="预估下单时间" :label-width="100">
                    <DatePicker type="date" v-model="currentData.estimateOrderDate" format="yyyy/MM/dd" transfer clearable size="small" :disabled="freezed"></DatePicker>
                  </FormItem>
                </Col>
                <Col :xs="16" :sm="12">
                  <FormItem label="实际下单时间" :label-width="100">
                    <DatePicker type="date" v-model="currentData.orderDate" format="yyyy/MM/dd" transfer clearable size="small" :disabled="freezed"></DatePicker>
                  </FormItem>
                </Col>
              </Row> -->
              <Row>
                <!-- <Col :xs="12" :sm="8">
                  <FormItem label="付款方式" :label-width="73">
                    <Select v-model="currentData.paytype" size="small" :disabled="freezed">
                      <Option key="1" label="预付" value="1"></Option>
                      <Option key="2" label="后付" value="2"></Option>
                    </Select>
                  </FormItem>
                </Col> -->
                <Col :xs="12">
                  <FormItem label="预估额度" :label-width="76">
                    <Input v-model="currentData.estimateQuote" size="small" :disabled="freezed"><template slot="append">万元</template></Input>
                  </FormItem>
                </Col>
                <Col :xs="12">
                  <FormItem label="实际额度" :label-width="76">
                    <Input :value="currentData.quote" size="small" readonly :disabled="freezed"><template slot="append">万元</template></Input>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col :xs="13" :sm="8">
                  <FormItem label="已收/应收款项" :label-width="104">
                    <Input :value="currentData.received" size="small" readonly :disabled="freezed"></Input>
                  </FormItem>
                </Col>
                <Col :xs="11" :sm="6">
                  <FormItem label="/" :label-width="28">
                    <Input :value="currentData.receivable" size="small" readonly :disabled="freezed"><template slot="append">万元</template></Input>
                  </FormItem>
                </Col>
                <Col :xs="12" :sm="{span: 8, offset: 2}">
                  <FormItem label="已开发票" :label-width="76">
                    <Input :value="currentData.sentInvoice" size="small" readonly :disabled="freezed"><template slot="append">万元</template></Input>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col :xs="13" :sm="8">
                  <FormItem label="已付/应付款项" :label-width="104">
                    <Input :value="currentData.paid" size="small" readonly :disabled="freezed"></Input>
                  </FormItem>
                </Col>
                <Col :xs="11" :sm="6">
                  <FormItem label="/" :label-width="28">
                    <Input :value="currentData.payable" size="small" readonly :disabled="freezed"><template slot="append">万元</template></Input>
                  </FormItem>
                </Col>
                <Col :xs="12" :sm="{span: 8, offset: 2}">
                  <FormItem label="已收发票" :label-width="76">
                    <Input :value="currentData.receiveInvoice" size="small" readonly :disabled="freezed"><template slot="append">万元</template></Input>
                  </FormItem>
                </Col>
              </Row>
             <!--  <Row>
                <Col :xs="12" :sm="8">
                  <FormItem label="到货/已发/应发货品" :label-width="134">
                    <Input :value="inventory.arrival" size="small" readonly :disabled="freezed"></Input>
                  </FormItem>
                </Col>
                <Col :xs="6" :sm="5">
                  <FormItem label="/" :label-width="28">
                    <Input :value="inventory.sent" size="small" readonly :disabled="freezed"></Input>
                  </FormItem>
                </Col>
                <Col :xs="6" :sm="5">
                  <FormItem label="/" :label-width="28">
                    <Input :value="inventory.sendable" size="small" readonly :disabled="freezed"></Input>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col :xs="12" :sm="8">
                  <FormItem label="已收/已购/应购货品" :label-width="134">
                    <Input :value="inventory.received" size="small" readonly :disabled="freezed"></Input>
                  </FormItem>
                </Col>
                <Col :xs="6" :sm="5">
                  <FormItem label="/" :label-width="28">
                    <Input :value="inventory.purchased" size="small" readonly :disabled="freezed"></Input>
                  </FormItem>
                </Col>
                <Col :xs="6" :sm="5">
                  <FormItem label="/" :label-width="28">
                    <Input :value="inventory.purchasable" size="small" readonly :disabled="freezed"></Input>
                  </FormItem>
                </Col>
              </Row> -->
              <FormItem label="备注" :label-width="48">
                <Input v-model="currentData.note" type="textarea" :autosize="{minRows:2}" size="small" :disabled="freezed"></Input>
              </FormItem>
            </div>
          </Panel>
          <Panel name="progress">
            项目进展更新
            <Button type="ghost" size="small" icon="plus" :disabled="freezed" @click.stop.prevent="handleAddProgress">新增</Button>
            <div slot="content">
              <div v-for="(p, i) in progress">
                {{ p.time | toDateString }}
                <Input v-model="p.content" type="textarea" :autosize="{minRows:2}" size="small" :readonly="!data || data.progress && data.progress[i] && !data.progress[i].content" :disabled="freezed"></Input>
              </div>
              <Button v-show="currentData.progress.length > 2" type="ghost" style="float: right; margin: 10px 0" size="small" :icon="showAllProgress ? 'chevron-up' : 'chevron-down'" :disabled="disabled" @click.stop.prevent="showAllProgress = !showAllProgress">{{ showAllProgress ? '收起' : '展开' }}</Button>
            </div>
          </Panel>
        </Collapse>
        <!-- main info end -->
        <br>
        <Row>
          <Col :xs="12">
            <FormItem label="销售">
              <Select v-model="currentData.salesman" filterable size="small" :disabled="freezed">
                <Option v-for="item in salesmen" :label="item.name" :value="item._id" :key="item._id">{{ item.name }} ( {{ item.username }} )</Option>
              </Select>
            </FormItem>
          </Col>
          <Col :xs="12">
            <FormItem label="售前">
              <Select v-model="currentData.supportmen" multiple filterable size="small" :disabled="freezed">
                <Option v-for="item in supportmen" :label="item.name" :value="item._id" :key="item._id">{{ item.name }} ( {{ item.username }} )</Option>
              </Select>
            </FormItem>
          </Col>
          <Col :xs="12">
            <FormItem label="售后">
              <Select v-model="currentData.engineers" multiple filterable size="small" :disabled="freezed">
                <Option v-for="item in engineers" :label="item.name" :value="item._id" :key="item._id">{{ item.name }} ( {{ item.username }} )</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :xs="16" :sm="8">
            <FormItem label="审核">
              <Select v-model="currentData.auditor" transfer filterable size="small" placeholder="请选择审核人员" :disabled="freezed">
                <Option v-for="item in users" :label="item.name" :value="item._id" :key="item._id">{{ item.name }} ( {{ item.username }} )</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <FormItem label="审核反馈" :label-width="74">
          <Input v-model="currentData.feedback" type="textarea" :autosize="{minRows:2}" size="small" :disabled="auditable"></Input>
        </FormItem>
        <Row>
          <Col :xs="24" :sm="12">
            <FormItem label="创建">{{ createdBy }} ({{ currentData.createdAt | toDateString }})</FormItem>
          </Col>
          <Col :xs="24" :sm="12">
            <FormItem label="修改">{{ updatedBy }} ({{ currentData.updatedAt | toDateString }})</FormItem>
          </Col>
        </Row>

        <FormItem v-if="!disabled" :label-width="1" class="form-buttons">
          <Button type="ghost" v-if="savable" icon="android-done" size="small" :loading="loading" @click.stop.prevent="handleSave">保存</Button>
          <Button v-if="savable" type="primary" icon="archive" size="small" :loading="loading" @click.stop.prevent="handleSubmit">提交</Button>
          <!-- <Button type="ghost" icon="refresh" size="small" @click.stop.prevent="handleReset">重置</Button> -->
          <Button v-if="auditable" type="info" icon="heart" size="small" :loading="loading" @click.stop.prevent="handleApprove">同意</Button>
          <Button v-if="auditable" type="warning" icon="heart-broken" size="small" :loading="loading" @click.stop.prevent="handleReject">拒绝</Button>
          <!-- <Button v-if="currentData._id" type="warning" icon="locked" size="small" :loading="loading" @click.stop.prevent="handleClose">关闭</Button> -->
          <Button v-if="cancelable" type="ghost" icon="close" size="small" @click.stop.prevent="handleCancel">取消</Button>
          <Button @click.stop.prevent="test"></Button>
        </FormItem>
      </Form>
    </TabPane>
    <TabPane label="清单" name="inventory">
      <div>
        <Row v-if="!data.inventory">
          <Col :xs="18" :sm="12">
            <Select ref="inventorySelect" v-model="currentData.inventory" size="small" :disabled="freezed" @on-change="handleInventoryChange">
              <Option v-for="(item, i) in inventories" :label="'清单' + i" :value="item._id" :key="item._id"></Option>
            </Select>
          </Col>
          <Col :xs="4">
            <Button type="ghost" icon="android-done" size="small" :disabled="freezed" :loading="loading" @click.stop.prevent="handleSave">保存</Button>
          </Col>
        </Row>
        <br>
        <Invetory ref="inventory" v-if="inventory" :readonly="disabled" :embed="true" :data="inventory"></Invetory>
      </div>
    </TabPane>
  </Tabs>
</template>

<script>
import { mapGetters } from 'vuex'
import config from '@/store/config'
import { toDateString } from '@/util'
import RegionSelect from '@/components/RegionSelect'
import ContactSelect from '@/components/ContactSelect'
import CompanySelect from '@/components/CompanySelect'
import mixin from '@/pages/mixin'
// import Contact from '@/pages/contacts/id'
// import Company from '@/pages/companies/id'

const labels = {
  customer: '客户',
  operator: '运营商',
  integrator: '集成商'
}

const { PROJECT: { CATEGORIES, TYPES, PHASES } } = config

export default {
  mixins: [mixin],
  filters: { toDateString },
  components: {
    RegionSelect,
    ContactSelect,
    CompanySelect,
    Contact: () => import('@/pages/contacts/id'),
    Company: () => import('@/pages/companies/id'),
    Invetory: () => import('@/pages/inventories/id')
  },
  data () {
    return {
      CATEGORIES,
      TYPES,
      PHASES,
      name: 'project',
      GET_ACTION: 'GET_PROJECT',
      POST_ACTION: 'POST_PROJECT',
      prefetchUsers: true,
      labels,
      showAllProgress: false,
      inventory: null,
      inventories: null
    }
  },
  computed: {
    disabled () {
      if (this.readonly || this.loading) return true
      let user = this.currentUser
      let data = this.currentData
      return !user || !data || user.role >= 0 && (data.step > 0 || (data._id && user._id !== data.createdBy && user._id !== data.createdBy))
    },
    savable () {
      if (this.readonly) return false
      let user = this.currentUser
      let data = this.currentData
      return user && data && (user.role < 0 || !data.step && (!data._id || user._id === data.createdBy || user._id === data.salesman))
    },
    auditable () {
      if (this.readonly) return false
      let user = this.currentUser
      let data = this.currentData
      return user && data && (user.role < 0 || data.step === 1 && user._id === data.auditor)
    },
    rules () {
      return {
        name: [
          { required: true, message: '请输入公司名称', trigger: 'blur' }
        ],
        category: [
          { type: 'number', required: true, message: '请选择项目分类', trigger: 'change' }
        ],
        type: [
          { type: 'number', required: true, message: '请选择项目类型', trigger: 'change' }
        ],
        phase: [
          { type: 'number', required: true, message: '请选择项目阶段', trigger: 'change' }
        ],
        region: [
          { required: true, message: '请选择所在区域', trigger: 'blur,change' }
        ],
        address: [
          { required: true, message: '请填写项目具体地址', trigger: 'blur' }
        ]
      }
    },
    progress () {
      let progress = this.currentData.progress
      return this.showAllProgress ? progress : progress.slice(0, 2)
    },
    users () { return this.$store.state.users },
    ...mapGetters(['salesmen', 'supportmen', 'engineers'])
  },
  watch: {
    async data (newValue, oldValue) {
      if (newValue === oldValue) return
      this.$refs.form.resetFields()
      let d = this.currentData = this.cloneData(newValue)
      this.createdBy = await this.getUsername(d.createdBy)
      this.updatedBy = await this.getUsername(d.updatedBy)
      this.inventory = null
      if ((newValue && newValue._id) !== (oldValue && oldValue._id)) this.inventories = null
    }
  },
  methods: {
    showStatus (newValue) {
      if (newValue === 'wait') {
        this.$Message.info('等待审核中...')
      } else if (newValue === 'failed') {
        this.$Message.error('审核未通过')
      } else if (newValue === 'success') {
        this.$Message.success('审核通过')
      }
    },
    getCompanyData (d, cd) {
      if (!d) {
        return {
          company: null,
          contact: null,
          contactPhone: null
        }
      }
      let c = d.company
      let c2 = d.contact
      if (!c) {
        return cd ? {
          company: c,
          contact: c2,
          ...cd
        } : {
          company: c,
          contact: c2
        }
      }
      return {...d}
    },
    cloneData (data) {
      let vendors = []
      let dvendors = data && data.vendors
      let currentData = this.currentData
      let cdvendors = currentData && currentData.vendors
      if (dvendors && dvendors.length) {
        vendors = []
        let i = 0
        for (let d of dvendors) {
          let v = this.getCompanyData(d, cdvendors && cdvendors[i])
          v.key = 'vendor' + ++i
          vendors.push(v)
        }
      } else {
        vendors = [{key: 'vendor1'}]
      }
      let user = this.currentUser
      let ret = {
        ...data,
        customer: this.getCompanyData(data && data.customer, currentData && currentData.customer),
        operator: this.getCompanyData(data && data.operator, currentData && currentData.operator),
        integrator: this.getCompanyData(data && data.integrator, currentData && currentData.integrator),
        vendors,
        region: data && data.region || '',
        progress: data && data.progress ? [...data.progress] : [],
        salesman: data && data.salesman || (user && user.role === 1 ? user._id : null),
        supportmen: data && data.supportmen ? [...data.supportmen] : [],
        engineers: data && data.engineers ? [...data.engineers] : []
      }
      this.showStatus(ret.status)
      return ret
    },
    async showInventories () {
      this.loading = true
      this.$Loading.start()
      try {
        let ret = await this.$store.dispatch('FETCH_INVENTORIES')
        if (ret && ret.data) {
          this.inventories = ret.data
        } else {
          this.$Message.warning('相应清单数据为空!')
        }
        this.currentTab = 'inventory'
      } catch (err) {
        this.$emit('error', err)
        let res = err.response
        this.$Message.error(res && res.data && res.data.error || err.message || err.toString())
      }
      this.loading = false
      this.$Loading.finish()
    },
    async showInventory () {
      let pid = this.currentData.inventory
      if (!pid) {
        if (!this.inventories) this.showInventories()
        return
      }
      if (this.inventory && this.inventory._id === pid) {
        this.currentTab = 'inventory'
      } else {
        this.loading = true
        this.$Loading.start()
        try {
          let data = await this.$store.dispatch('GET_INVENTORY', pid)
          if (!data) {
            this.$Message.warning('没有相应清单数据!')
            this.inventory = null
            if (!this.inventories) this.showInventories()
            return
          }
          this.inventory = data
          this.currentTab = 'inventory'
        } catch (err) {
          this.$emit('error', err)
          let res = err.response
          this.$Message.error(res && res.data && res.data.error || err.message || err.toString())
        }
        this.loading = false
        this.$Loading.finish()
      }
    },
    handleTabClick (name) {
      if (name === 'inventory') {
        this.showInventory()
      }
    },
    handleAddVendor () {
      let vendors = this.currentData.vendors
      vendors.push({key: 'vendor' + (vendors.length + 1)})
    },
    handleTabRemove (name) {
      let vendors = this.currentData.vendors
      const i = vendors.findIndex(v => v.key === name)
      vendors.splice(i, 1)
      if (vendors.length === 1) {
        this.$nextTick(() => this.$refs.tabs.updateNav())
      }
      // this.$set(this.currentData, 'vendors', vendors)
      console.info(i, vendors.length, vendors)
    },
    handleCompanyChange (k, val, name) {
      this.$refs[k + 'ContactSelect'][0].init = false
      this.currentData[k].companyName = name
      this.currentData[k].contact = null
    },
    handleVendorCompanyChange (i, val, name) {
      this.$refs.vendorContactSelect[i].init = false
      let v = this.currentData.vendors[i]
      if (v) {
        v.companyName = name
        v.contact = null
      }
    },
    handleContactChange (k, val, name) {
      let d = this.currentData[k]
      if (val) {
        let select = this.$refs[k + 'ContactSelect'][0]
        let c = select.contacts.find(c => c._id === val)
        d.contactName = name
        d.contactPhone = c && c.phone || ''
      } else {
        d.contactName = null
        d.contactPhone = ''
      }
    },
    handleVendorContactChange (i, val, name) {
      let v = this.currentData.vendors[i]
      if (val) {
        let select = this.$refs.vendorContactSelect[i]
        let c = select.contacts.find(c => c._id === val)
        v.contactName = name
        v.contactPhone = c && c.phone || ''
      } else {
        v.contactName = null
        v.contactPhone = ''
      }
    },
    handleRegionChange (val) {
      this.currentData.region = val[val.length - 1]
    },
    handleAddProgress () {
      this.currentData.progress.unshift({
        time: Date.now(),
        content: ''
      })
    },
    handleInventoryChange (val) {
      this.inventory = val ? this.inventories.find(c => c._id === val) : null
    },
    async handleSave () {
      if (this.disabled) return
      let valid = await this.$refs.form.validate()
      if (!valid) {
        this.$Message.warning('表单验证失败!')
        return
      }
      let data = this.currentData
      if (data._id) {
        if (!isNaN(this.data.type) && data.type !== this.data.type) {
          this.$Message.warning('修改项目类型后必须提交审核!')
          return
        }
        if (this.data.salesman && data.salesman !== this.data.salesman) {
          this.$Message.warning('修改相关销售后必须提交审核!')
          return
        }
      }
      data.status = 'normal'
      data.vendors = data.vendors.filter(v => !!v.company)
      data.progress = data.progress.filter(p => !!p.content)
      await this._save()
    },
    async handleSubmit () {
      if (this.disabled) return
      let valid = await this.$refs.form.validate()
      if (!valid) {
        this.$Message.warning('表单验证失败!')
        return
      }
      let data = this.currentData
      if (!data.customer.company) {
        this.$Message.warning('请选择相关客户!')
        return
      }
      if (!data.salesman) {
        this.$Message.warning('请选择相关销售!')
        return
      }
      if (!data.auditor) {
        this.$Message.warning('请指定审核人员!')
        return
      }
      data.vendors = data.vendors.filter(v => !!v.company)
      data.progress = data.progress.filter(p => !!p.content)
      data.step = 1
      data.status = 'wait'
      this._save()
    },
    handleApprove () {
      let data = this.currentData
      data.step = 0
      data.status = 'success'
      this._save()
    },
    handleReject () {
      let data = this.currentData
      data.step = 0
      data.status = 'failed'
      this._save()
    },
    handleClose () {
      let data = this.currentData
      data.step = 2
      data.status = 'finish'
      this._save()
    }
  }
}
</script>
<style>
#companiesTabs .ivu-tabs-bar {
  margin-bottom: 0;
}

#companiesTabs.ivu-tabs .ivu-tabs-tabpane {
  border-left: 1px solid;
  border-right: 1px solid;
  border-bottom: 1px solid;
  padding-top: 16px;
}
</style>