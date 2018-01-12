<template>
  <Form ref="form" :model="currentData" :rules="rules" :label-width="60">
    <Row>
      <Col :xs="24" :sm="18">
        <FormItem label="名称" prop="name">
          <Input v-model="currentData.name" size="small" :disabled="freezed"></Input>
        </FormItem>
      </Col>
      <Col :xs="12">
        <FormItem label="编码">
          <Input :value="currentData.code" size="small" placeholder="系统自动生成" :disabled="true"></Input>
        </FormItem>
      </Col>
    </Row>
    <slot name="expand"></slot>
    <Row>
      <Col :xs="12" :sm="6">
        <FormItem label="类型" prop="type">
          <Select v-model="currentData.type" size="small" :disabled="freezed">
            <Option v-for="(v, k) in COMPANY_TYPES" :key="k" :label="v" :value="k"></Option>
          </Select>
        </FormItem>
      </Col>
      <Col :xs="12" :sm="8">
        <FormItem label="分类">
          <Select v-model="currentData.category" size="small" :disabled="freezed">
          </Select>
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col :xs="12" :sm="8">
        <FormItem label="区域" prop="region">
          <RegionSelect :value="currentData.region" @on-change="handleRegionChange" size="small" :disabled="freezed"></RegionSelect>
        </FormItem>
      </Col>
      <Col :xs="24" :sm="16">
        <FormItem label="地址" prop="address">
          <Input v-model="currentData.address" size="small" :disabled="freezed"></Input>
        </FormItem>
      </Col>
    </Row>

    <Collapse>
      <!-- detail pane -->
      <Panel name="detail">
        详细信息
        <Row slot="content">
          <Col :xs="24">
            <FormItem label="描述">
              <Input type="textarea" :autosize="{minRows: 2}" v-model="currentData.description" size="small" :disabled="freezed"></Input>
            </FormItem>
          </Col>
          <Col :xs="18" :sm="6">
            <FormItem label="邮编">
              <Input v-model="currentData.zipcode" size="small" :disabled="freezed"></Input>
            </FormItem>
          </Col>
          <Col :xs="24" :sm="16">
            <FormItem label="网址">
              <Input v-model="currentData.site" size="small" :disabled="freezed"></Input>
            </FormItem>
          </Col>
          <Col :xs="16" :sm="6">
            <FormItem label="级别">
              <InputNumber v-model="currentData.level" size="small" :disabled="freezed"></InputNumber>
            </FormItem>
          </Col>
          <Col :xs="16" :sm="8">
            <FormItem label="资本">
              <Input v-model="currentData.fund" size="small" :disabled="freezed"><template slot="append">万元</template></Input>
            </FormItem>
          </Col>
          <Col :xs="16" :sm="8">
            <FormItem label="规模">
              <Input v-model="currentData.staff" size="small" :disabled="freezed"><template slot="append">人</template></Input>
            </FormItem>
          </Col>
          <Col :xs="24">
            <FormItem label="备注">
              <Input type="textarea" :autosize="{minRows: 2}" v-model="currentData.note" size="small" :disabled="freezed"></Input>
            </FormItem>
          </Col>
        </Row>
      </Panel>
      <!-- detail pane end -->

      <!-- billing pane -->
      <Panel name="billing">
        财务信息
        <div slot="content">
          <FormItem slot="content" label="税号">
            <Input v-model="currentData.billing.taxNum" placeholder="请输入企业税号" size="small" :disabled="freezed"></Input>
          </FormItem>
          <FormItem label="银行">
            <Input v-model="currentData.billing.bank" placeholder="请输入开户银行" size="small" :disabled="freezed"></Input>
          </FormItem>
          <FormItem label="账号">
            <Input v-model="currentData.billing.account" placeholder="请输入银行账号" size="small" :disabled="freezed"></Input>
          </FormItem>
          <FormItem label="抬头">
            <Input v-model="currentData.billing.title" placeholder="请输入账户抬头" size="small" :disabled="freezed"></Input>
          </FormItem>
        </div>
      </Panel>
      <!-- billing pane end -->
    </Collapse>
    <br>
    <Row v-if="currentUser && (currentUser.role < 1 || currentUser._id === currentData.createdBy)">
      <Col :xs="24" :sm="12">
        <FormItem label="只读共享" :label-width="74">
          <Select v-model="currentData.readers" multiple filterable size="small" :disabled="freezed" placeholder="可多选">
            <Option v-for="item in userNames" :label="item.name" :value="item._id" :key="item._id" :disabled="currentData.editors.includes(item._id)">{{ item.name }} ( {{ item.username }} )</Option>
          </Select>
        </FormItem>
      </Col>
      <Col :xs="24" :sm="12">
        <FormItem label="编辑共享" :label-width="74">
          <Select v-model="currentData.editors" multiple filterable size="small" :disabled="freezed" placeholder="可多选">
            <Option v-for="item in userNames" :label="item.name" :value="item._id" :key="item._id" :disabled="currentData.readers.includes(item._id)">{{ item.name }} ( {{ item.username }} )</Option>
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
        <Button type="primary" icon="android-done" size="small" :loading="loading" @click.stop.prevent="handleSave">确定</Button>
        <Button type="ghost" icon="refresh" size="small" @click.stop.prevent="handleReset">重置</Button>
        <Button v-if="cancelable" type="ghost" icon="close" size="small" @click.stop.prevent="handleCancel">取消</Button>
        <Button @click.stop.prevent="test"></Button>
      </FormItem>
    </Row>
    <div v-if="!embed">
      <FormItem label="联系信息" :label-width="75">
        <Button :disabled="freezed || !currentData._id" size="small" @click="addContact" icon="plus"></Button>
        <span v-if="freezed || !currentData._id">（请先提交新建公司数据）</span>
      </FormItem>
      <Collapse>
        <Panel v-for="(contact, i) in contacts" :ref="'contact' + i" :name="contact.name" :key="contact._id">
          {{ contact.name || '未命名' + i }}
          <Poptip v-if="contact._id" confirm placement="right" transfer :title="'操作不可恢复，是否确定删除该联系人 ' + contact.name + '？'" @on-ok="delContact(i)">
            <Button icon="trash-b" size="small" :disabled="freezed"></Button>
          </Poptip>
          <Button v-else icon="trash-b" size="small" @click.stop.prevent="delContact(i)"></Button>
          <Contact slot="content" :data="contact" :embed="true" :readonly="readonly || disabled"></Contact>
        </Panel>
      </Collapse>
    </div>
  </Form>
</template>

<script>
import config from '@/store/config'
import { toDateString } from '@/util'
import RegionSelect from '@/components/RegionSelect'
import mixin from '@/pages/mixin'
import Contact from '../contacts/id'

export default {
  mixins: [mixin],
  filters: { toDateString },
  components: { RegionSelect, Contact },
  data () {
    let data = this.data
    return {
      name: 'company',
      GET_ACTION: 'GET_COMPANY',
      POST_ACTION: 'POST_COMPANY',
      prefetchUserNames: true,
      COMPANY_TYPES: config.COMPANY_TYPES,
      contacts: data && data.contacts ? [...data.contacts] : []
    }
  },
  computed: {
    rules () {
      return {
        name: [
          { required: true, message: '请输入公司名称', trigger: 'blur' }
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
    disabled () {
      if (this.readonly || this.loading) return true
      let user = this.currentUser
      let data = this.currentData
      return !user || (user.role >= 0 && data._id && (user._id !== data.createdBy || !data.editors.includes(user._id)))
    }
  },
  watch: {
    data (newValue, oldValue) {
      if (newValue !== oldValue) {
        this.$refs.form.resetFields()
        this.currentData = this.cloneData(newValue)
      }
      if (this.embed || !newValue) return
      this.contacts = []
      if (newValue._id) this.fetchContacts(newValue._id)
    }
  },
  methods: {
    cloneData (data) {
      let def = {
        taxNum: null,
        bank: null,
        account: null,
        title: null
      }
      return {
        ...data,
        region: data && data.region || '',
        readers: data && data.readers ? [...data.readers] : [],
        editors: data && data.editors ? [...data.editors] : [],
        billing: data && data.billing ? {...def, ...data.billing} : {...def}
      }
    },
    addContact () {
      this.contacts.push({ name: '', company: this.data._id })
    },
    async deleteContact (data) {
      if (!data || this.disabled) return
      const title = data.name
      const close = this.$Message.loading({
        content: '删除数据...',
        duration: 0
      })
      this.loading = true
      this.$Loading.start()
      try {
        await this.$store.dispatch('DELETE_CONTACT', data._id)
        this.$emit('remove.contact', data)
        close()
        this.$Message.success(title + '删除成功!')
        return true
      } catch (err) {
        // this.$emit('error', err)
        close()
        this.$Message.error(title + '删除失败!', err)
      } finally {
        this.loading = false
        this.$Loading.finish()
      }
    },
    async delContact (i) {
      if (await this.deleteContact(this.contacts[i])) {
        this.contacts.splice(i, 1)
      }
    },
    handleRegionChange (val) {
      // this.$set(this.currentData, 'region', val[val.length - 1])
      this.currentData.region = val[val.length - 1]
    },
    async fetchContacts (companyId) {
      let ret = await this.$store.dispatch('FETCH_CONTACTS', { company: companyId })
      if (this.data._id === companyId) {
        this.contacts = ret && ret.data ? [...ret.data] : []
      }
    },
    async afterInitData () {
      if (this.embed) return
      let id = this.data._id
      if (id) await this.fetchContacts(id)
    }
  }
}
</script>
