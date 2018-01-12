<template>
  <Form ref="form" :model="currentData" :rules="rules" :label-width="52">
    <Row>
      <Col :xs="12">
        <FormItem label="姓名" prop="name">
          <Input v-model="currentData.name" size="small" :disabled="freezed"></Input>
        </FormItem>
      </Col>
      <Col :xs="12" v-if="!embed">
        <FormItem label="公司">
          <Input v-if="data && data.company" size="small" readonly :disabled="freezed" :value="currentData.companyName"></Input>
          <CompanySelect ref="select" v-else size="small" :disabled="freezed" @on-change="handleCompanySelect"></CompanySelect>
        </FormItem>
      </Col>
      <Col :xs="12">
        <FormItem label="部门">
          <Input v-model="currentData.department" size="small" :disabled="freezed"></Input>
        </FormItem>
      </Col>
      <Col :xs="12">
        <FormItem label="职位">
          <Input v-model="currentData.title" size="small" :disabled="freezed"></Input>
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col :xs="12">
        <FormItem label="Email" prop="email">
          <Input v-model="currentData.email" size="small" :disabled="freezed"></Input>
        </FormItem>
      </Col>
      <Col :xs="12">
        <FormItem label="电话">
          <Input v-model="currentData.phone" size="small" :disabled="freezed"></Input>
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col :xs="12">
        <FormItem label="传真">
          <Input v-model="currentData.fax" size="small" :disabled="freezed"></Input>
        </FormItem>
      </Col>
      <Col :xs="12">
        <FormItem label="QQ">
          <Input v-model="currentData.qq" size="small" :disabled="freezed"></Input>
        </FormItem>
      </Col>
      <Col :xs="12">
        <FormItem label="微信">
          <Input v-model="currentData.wechat" size="small" :disabled="freezed"></Input>
        </FormItem>
      </Col>
    </Row>
    <FormItem label="备注">
      <Input type="textarea" :autosize="{minRows: 2}" v-model="currentData.note" size="small" :disabled="freezed"></Input>
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
      <Button type="primary" icon="android-done" size="small" :loading="loading" @click.stop.prevent="handleSave">确定</Button>
      <Button type="ghost" icon="refresh" size="small" @click.stop.prevent="handleReset">重置</Button>
      <Button v-if="cancelable" type="ghost" icon="close" size="small" @click.stop.prevent="handleCancel">取消</Button>
      <Button @click.stop.prevent="test"></Button>
    </FormItem>
  </Form>
</template>

<script>
import { toDateString } from '@/util'
import CompanySelect from '@/components/CompanySelect'
import mixin from '@/pages/mixin'

export default {
  mixins: [mixin],
  filters: { toDateString },
  components: { CompanySelect },
  data () {
    return {
      name: 'contact',
      GET_ACTION: 'GET_CONTACT',
      POST_ACTION: 'POST_CONTACT'
    }
  },
  computed: {
    rules () {
      return {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        email: [
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
        ]
      }
    }
  },
  methods: {
    cloneData (data) {
      let c = data && data.company
      let companyName = this.currentData && this.currentData.companyName
      return (!c || typeof c === 'string') ? {
        ...data,
        company: c,
        companyName
      } : {
        ...data,
        company: c._id,
        companyName: c.name || companyName
      }
    },
    handleCompanySelect (val, name) {
      this.currentData.company = val
      this.currentData.companyName = name
      // should use `$set` method instead
      // this.$set(this.currentData, 'companyId', val)
      // this.$set(this.currentData, 'companyName', name)
    }
  }
}
</script>
