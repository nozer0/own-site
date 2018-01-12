<template>
  <Form ref="form" :model="currentData" :rules="rules" :label-width="60">
    <Card style="margin-bottom: 24px">
      <Steps>
        <Step title="调研" icon="eye"></Step>
        <Step title="定项" icon="flag"></Step>
        <Step title="供货" icon="plane"></Step>
        <Step title="实施" icon="wrench"></Step>
        <Step title="维护" icon="bug"></Step>
        <Step title="结项" icon="trophy"></Step>
      </Steps>
    </Card>

    <!-- main info -->
    <Row>
      <Col :xs="24" :sm="16">
        <FormItem label="名称" prop="name">
          <Input v-model="currentData.name" size="small" :disabled="disabled"></Input>
        </FormItem>
      </Col>
      <Col :xs="8">
        <FormItem label="编码" prop="code">
          <Input v-model="currentData.code" size="small" :disabled="disabled"></Input>
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col :xs="12" :sm="6">
        <FormItem label="分类" prop="category">
          <Select v-model="currentData.category" size="small" :disabled="disabled">
          </Select>
        </FormItem>
      </Col>
      <Col :xs="12" :sm="6">
        <FormItem label="区域" prop="region">
          <RegionSelect :value="currentData.region" @on-change="handleRegionChange" size="small" :disabled="disabled"></RegionSelect>
        </FormItem>
      </Col>
      <Col :xs="24" :sm="14">
        <FormItem label="地址">
          <Input v-model="currentData.address" placeholder="请输入地址" size="small" :disabled="disabled"></Input>
        </FormItem>
      </Col>
    </Row>
    <FormItem label="描述">
      <Input v-model="currentData.description" type="textarea" :autosize="{minRows:2}" size="small" :disabled="disabled"></Input>
    </FormItem>

    <Tabs size="small" style="margin:15px 10px">
      <TabPane v-for="(label, k) in labels" :label="label" :key="label">
        <Collapse @on-change="handleCollapseChange">
          <Panel :name="k">
            {{ currentData[k + 'Name'] }}
            <Company :ref="k" slot="content" :data="companies[k] || {}" :embed="true" :readonly="disabled"></Company>
            <Spin v-if="!companies[k]" slot="content">
              <Icon type="load-c" class="spin-icon-load"></Icon>
              <div>加载中...</div>
            </Spin>
          </Panel>
          <Panel :name="k + 'Contact'">
            {{ currentData[k + 'ContactName'] }}
            <Contact :ref="k + 'Contact'" slot="content" v-if="contacts[k]" :data="contacts[k]" :embed="true" :readonly="disabled"></Contact>
            <Spin v-else slot="content">
                <Icon type="load-c" class="spin-icon-load"></Icon>
                <div>加载中...</div>
            </Spin>
          </Panel>
        </Collapse>
      </TabPane>
    </Tabs>

    <!-- frequent update info -->
    <Row>
      <Col :sm="12">
        <FormItem label="预估时间" :label-width="76">
          <DatePicker type="daterange" v-model="currentData.estimateTime" placeholder="选择日期范围" format="yyyy/MM/dd" transfer clearable size="small" :disabled="disabled"></DatePicker>
        </FormItem>
      </Col>
      <Col :sm="12">
        <FormItem label="实际时间" :label-width="76">
          <DatePicker type="daterange" v-model="currentData.time" placeholder="选择日期范围" format="yyyy/MM/dd" transfer clearable size="small" :disabled="disabled"></DatePicker>
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col :xs="16" :sm="8">
        <FormItem label="付款方式" :label-width="76">
          <Select v-model="currentData.paytype" size="small" :disabled="disabled">
            <Option key="1" label="预付" value="1"></Option>
            <Option key="2" label="后付" value="2"></Option>
          </Select>
        </FormItem>
      </Col>
      <Col :xs="16" :sm="8">
        <FormItem label="预估额度" :label-width="76">
          <Input v-model="currentData.estimateQuote" size="small" :disabled="disabled"><template slot="append">万元</template></Input>
        </FormItem>
      </Col>
      <Col :xs="16" :sm="8">
        <FormItem label="实际额度" :label-width="76">
          <Input v-model="currentData.quote" size="small" :disabled="disabled"><template slot="append">万元</template></Input>
        </FormItem>
      </Col>
    </Row>
    <FormItem label="需求">
      <Input v-model="currentData.requirement" type="textarea" :autosize="{minRows:2}" size="small" :disabled="disabled"></Input>
    </FormItem>
    <Row>
      <Col :xs="16" :sm="8">
        <FormItem label="市场成本" :label-width="76">
          <Input v-model="currentData.marketCost" size="small" :disabled="disabled"><template slot="append">元</template></Input>
        </FormItem>
      </Col>
      <Col :xs="16" :sm="8">
        <FormItem label="货品成本" :label-width="76">
          <Input v-model="inventory.cost" size="small" :disabled="disabled"><template slot="append">万元</template></Input>
        </FormItem>
      </Col>
      <Col :xs="16" :sm="8">
        <FormItem label="其他成本" :label-width="76">
          <Input v-model="currentData.otherCost" size="small" :disabled="disabled"><template slot="append">元</template></Input>
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col :xs="13" :sm="8">
        <FormItem label="已收/应收款项" :label-width="108">
          <Input v-model="currentData.received" size="small" :disabled="disabled"></Input>
        </FormItem>
      </Col>
      <Col :xs="11" :sm="6">
        <FormItem label="/" :label-width="28">
          <Input v-model="currentData.receivable" size="small" :disabled="disabled"><template slot="append">万元</template></Input>
        </FormItem>
      </Col>
      <Col :xs="12" :sm="{span: 8, offset: 2}">
        <FormItem label="已开发票" :label-width="76">
          <Input v-model="currentData.sentInvoice" size="small" :disabled="disabled"><template slot="append">万元</template></Input>
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col :xs="13" :sm="8">
        <FormItem label="已付/应付款项" :label-width="108">
          <Input v-model="currentData.paid" size="small" :disabled="disabled"></Input>
        </FormItem>
      </Col>
      <Col :xs="11" :sm="6">
        <FormItem label="/" :label-width="28">
          <Input v-model="currentData.payable" size="small" :disabled="disabled"><template slot="append">万元</template></Input>
        </FormItem>
      </Col>
      <Col :xs="12" :sm="{span: 8, offset: 2}">
        <FormItem label="已收发票" :label-width="76">
          <Input v-model="currentData.receiveInvoice" size="small" :disabled="disabled"><template slot="append">万元</template></Input>
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col :xs="12" :sm="8">
        <FormItem label="到货/已发/应发货品" :label-width="140">
          <Input v-model="inventory.arrival" size="small" :disabled="disabled"></Input>
        </FormItem>
      </Col>
      <Col :xs="6" :sm="5">
        <FormItem label="/" :label-width="28">
          <Input v-model="inventory.sent" size="small" :disabled="disabled"></Input>
        </FormItem>
      </Col>
      <Col :xs="6" :sm="5">
        <FormItem label="/" :label-width="28">
          <Input v-model="inventory.sendable" size="small" :disabled="disabled"></Input>
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col :xs="12" :sm="8">
        <FormItem label="已收/已购/应购货品" :label-width="140">
          <Input v-model="inventory.received" size="small" :disabled="disabled"></Input>
        </FormItem>
      </Col>
      <Col :xs="6" :sm="5">
        <FormItem label="/" :label-width="28">
          <Input v-model="inventory.purchased" size="small" :disabled="disabled"></Input>
        </FormItem>
      </Col>
      <Col :xs="6" :sm="5">
        <FormItem label="/" :label-width="28">
          <Input v-model="inventory.purchasable" size="small" :disabled="disabled"></Input>
        </FormItem>
      </Col>
    </Row>
    <FormItem label="备注">
      <Input v-model="currentData.requirement" type="textarea" :autosize="{minRows:2}" size="small" :disabled="disabled"></Input>
    </FormItem>
    <!-- main info end -->

    <Row>
      <Col :xs="12">
        <FormItem label="销售">
          <Select v-model="currentData.salesman" filterable size="small" :disabled="disabled">
            <Option v-for="item in salesmen" :label="item.name" :value="item._id" :key="item._id">{{ item.name }} ( {{ item.username }} )</Option>
          </Select>
        </FormItem>
      </Col>
      <Col :xs="12">
        <FormItem label="售前">
          <Select v-model="currentData.supportmen" multiple filterable size="small" :disabled="disabled">
            <Option v-for="item in supportmen" :label="item.name" :value="item._id" :key="item._id">{{ item.name }} ( {{ item.username }} )</Option>
          </Select>
        </FormItem>
      </Col>
      <Col :xs="12">
        <FormItem label="售后">
          <Select v-model="currentData.engineers" multiple filterable size="small" :disabled="disabled">
            <Option v-for="item in engineers" :label="item.name" :value="item._id" :key="item._id">{{ item.name }} ( {{ item.username }} )</Option>
          </Select>
        </FormItem>
      </Col>
    </Row>

    <Row>
      <Col :xs="24" :sm="12">
        <FormItem label="创建">{{ createdBy }} ({{ currentData.createdAt | toDateString }})</FormItem>
      </Col>
      <Col :xs="24" :sm="12">
        <FormItem label="修改">{{ updatedBy }} ({{ currentData.updatedAt | toDateString }})</FormItem>
      </Col>
    </Row>

    <Row>
      <FormItem v-if="!disabled" :label-width="1" class="form-buttons">
        <Button size="small" type="primary" :loading="loading" @click.stop.prevent="handleSave">确定</Button>
        <Button type="ghost" size="small" @click.stop.prevent="handleReset">重置</Button>
        <Button v-if="cancelable" type="ghost" size="small" @click.stop.prevent="handleCancel">取消</Button>
        <Button @click.stop.prevent="test"></Button>
      </FormItem>
    </Row>
  </Form>
</template>

<script>
import { mapGetters } from 'vuex'
import { toDateString } from '@/util'
import RegionSelect from '@/components/RegionSelect'
import mixin from '@/pages/mixin'
import Contact from '@/pages/contacts/id'
// import Company from '@/pages/companies/id'

const labels = {
  customer: '客户',
  operator: '运营商',
  supplier: '供货商',
  integrator: '集成商'
  vendor: '厂商',
}

export default {
  mixins: [mixin],
  filters: { toDateString },
  components: { RegionSelect, Contact, Company: () => import('@/pages/companies/id') },
  data () {
    let companies = {}
    for (let k in labels) {
      companies[k] = null
    }
    return {
      name: 'project',
      GET_ACTION: 'GET_PROJECT',
      POST_ACTION: 'POST_PROJECT',
      labels: labels,
      companies: companies,
      contacts: {...companies}
    }
  },
  computed: {
    rules () {
      return {
        name: [
          { required: true, message: '请输入公司名称', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入公司编码', trigger: 'blur' }
        ],
        type: [
          { type: 'number', required: true, message: '请选择公司类型', trigger: 'change' }
        ],
        region: [
          { required: true, message: '请选择所在区域', trigger: 'blur' }
        ],
        email: [
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
        ]
      }
    },
    inventory () {
      return {}
    },
    ...mapGetters(['salesmen', 'supportmen', 'engineers'])
  },
  methods: {
    cloneData (data) {
      return {
        ...data,
        region: data && data.region || '',
        salesman: data && data.salesman || null,
        supportmen: data && data.supportmen ? [...data.supportmen] : [],
        engineers: data && data.engineers ? [...data.engineers] : []
      }
    },
    async setData () {
      let store = this.$store
      if (!store.state.users) await store.dispatch('FETCH_USERS')
      if (this.name && this.$route.name !== this.name) {
        this.$Loading.finish()
        return
      }
      const id = +this.$route.params.id
      if (id) {
        let data = await store.dispatch(this.GET_ACTION, id)
        console.info(this.GET_ACTION, id, data)
        if (data) {
          if (this.data) Object.assign(this.data, this.cloneData(data))
          this.currentData = this.cloneData(data)
        } else {
          this.$Message.warning('没有相应数据!')
        }
      }
      this.$Loading.finish()
    },
    handleRegionChange (val) {
      this.currentData.region = val[val.length - 1]
    },
    async fetchCompanyOrContact (name) {
      let data = this.currentData
      if (name.indexOf('Contact') > 0) {
        name = name.replace('Contact', '')
        if (!this.contacts[name]) {
          this.$Loading.start()
          this.contacts[name] = await this.$store.dispatch('GET_CONTACT', data[name + 'ContactId'])
          this.$Loading.finish()
        }
      } else if (!this.companies[name]) {
        this.$Loading.start()
        this.companies[name] = await this.$store.dispatch('GET_COMPANY', data[name + 'Id'])
        this.$Loading.finish()
      }
    },
    async handleCollapseChange (val) {
      val[0] && this.fetchCompanyOrContact(val[0])
      val[1] && this.fetchCompanyOrContact(val[1])
    }
  }
}
</script>