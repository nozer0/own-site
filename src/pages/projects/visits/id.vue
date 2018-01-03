<template>
  <Tabs class="dynamic-tabs" ref="tabs" type="card" size="small" :value="currentTab">
    <TabPane label="客勤记录" name="visit">
      <Form ref="form" :model="currentData" :rules="rules" :label-width="65">
        <Row>
          <Col :xs="21" :sm="16">
            <FormItem label="项目" prop="projectId">
              <ProjectSelect ref="projectSelect" :value="currentData.projectId" size="small" :disabled="disabled" @on-change="handleProjectChange"></ProjectSelect>
            </FormItem>
          </Col>
          <Col :xs="3" :sm="2">
            <FormItem label="" :label-width="1">
              <Button :disabled="!currentData.projectId" icon="information-circled" size="small" @click.stop.prevent="showProject">详细</Button>
            </FormItem>
          </Col>
        </Row>
        <FormItem label="客户">
          {{ customer && customer.name }}
          <Button :disabled="!customer" icon="information-circled" size="small" @click.stop.prevent="showCustomer">详细</Button>
        </FormItem>
        <Row>
          <Col :xs="12">
            <FormItem label="联系人" prop="contactId">
              <ContactSelect ref="contactSelect" grouped :value="currentData.contactId" size="small" :disabled="disabled" @on-change="handleContactChange"></ContactSelect>
            </FormItem>
          </Col>
          <Col :xs="6">
            <FormItem label="电话">
              <Input :value="contact && contact.phone" size="small" :disabled="disabled"></Input>
            </FormItem>
          </Col>
          <Col :xs="6">
            <FormItem label="Email">
              <Input :value="contact && contact.email" size="small" :disabled="disabled"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :xs="12">
            <FormItem label="时间" prop="time">
              <DatePicker type="datetimerange" v-model="currentData.time" placeholder="选择日期范围" format="yyyy/MM/dd HH:mm" transfer clearable size="small" style="width: 300px" :disabled="disabled"></DatePicker>
            </FormItem>
          </Col>
        </Row>
        <FormItem label="目标" prop="target">
          <Input v-model="currentData.target" type="textarea" :autosize="{minRows:2}" size="small" :disabled="disabled"></Input>
        </FormItem>
        <FormItem label="是否完成">
          <i-switch v-model="currentData.isFinished" :disabled="disabled">
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
        </FormItem>
        <FormItem label="结果">
          <Input v-model="currentData.result" type="textarea" :autosize="{minRows:2}" size="small" :disabled="disabled"></Input>
        </FormItem>
        <FormItem label="下次计划">
          <Input v-model="currentData.plan" type="textarea" :autosize="{minRows:2}" size="small" :disabled="disabled"></Input>
        </FormItem>
        <FormItem label="遗留问题">
          <Input v-model="currentData.problem" type="textarea" :autosize="{minRows:2}" size="small" :disabled="disabled"></Input>
        </FormItem>
        <FormItem label="备注">
          <Input v-model="currentData.note" type="textarea" :autosize="{minRows:2}" size="small" :disabled="disabled"></Input>
        </FormItem>
        <Row>
          <Col :xs="12">
            <FormItem label="创建">{{ createdBy }}（{{ currentData.createdAt | toDateString }}）</FormItem>
          </Col>
          <Col :xs="12">
            <FormItem label="修改">{{ updatedBy }}（{{ currentData.updatedAt | toDateString }}）</FormItem>
          </Col>
        </Row>
        <!-- <config-form :configs="configs"></config-form> -->
        <FormItem v-if="!disabled" :label-width="1" class="form-buttons">
          <Button type="primary" icon="archive" size="small" :disabled="loading" :loading="loading" @click.stop.prevent="handleSave">提交</Button>
          <Button type="ghost" icon="refresh" size="small" :disabled="loading" @click.stop.prevent="handleReset">重置</Button>
          <Button v-if="cancelable" type="ghost" icon="close" size="small" :disabled="loading" @click.stop.prevent="handleCancel">取消</Button>
          <Button @click.stop.prevent="test"></Button>
        </FormItem>
      </Form>
    </TabPane>
    <TabPane :label="projectLabel" name="project" v-show="isProjectVisible">
      <Project ref="project" v-if="project" :readonly="disabled" :data="project"></Project>
    </TabPane>
    <TabPane :label="customerLabel" name="customer" v-show="isCustomerVisible">
      <Company ref="customer" v-if="customer" :readonly="disabled" :data="customer"></Company>
    </TabPane>
  </Tabs>
</template>

<script>
import config from '@/store/config'
import ProjectSelect from '@/components/ProjectSelect'
import ContactSelect from '@/components/ContactSelect'
import mixin from '@/pages/mixin'
import tabsMixin from '@/pages/tabs-mixin'
// import ConfigForm from '@/components/ConfigForm'

const { WORK_TYPES, WORK_STEPS, FAULTS } = config

const STEPS = WORK_STEPS.slice(1)

export default {
  mixins: [mixin, tabsMixin],
  components: {
    ProjectSelect,
    Project: () => import('@/pages/projects/id'),
    Company: () => import('@/pages/companies/id'),
    ContactSelect
  },
  data () {
    return {
      WORK_TYPES,
      STEPS,
      FAULTS,
      name: 'visit',
      GET_ACTION: 'GET_VISIT',
      POST_ACTION: 'POST_VISIT',
      currentTab: 'visit'
    }
  },
  computed: {
    rules () {
      return {
        projectId: [
          { type: 'number', required: true, message: '请选择所属项目', trigger: 'change,blur' }
        ],
        contactId: [
          { type: 'number', required: true, message: '请选择相关联系人', trigger: 'change,blur' }
        ],
        time: [
          { required: true, message: '请选择时间范围', trigger: 'blur' }
        ],
        target: [
          { required: true, message: '请填写访问目标', trigger: 'blur' }
        ]
      }
    },
    disabled2 () {
      if (this.readonly) return true
      let user = this.$store.state.currentUser
      if (!user) return true
      let data = this.currentData
      return data._id && data.createdBy !== user._id
    }
  }
}
</script>

<style>
.dynamic-tabs .ivu-tabs-tab:nth-child(3), .dynamic-tabs .ivu-tabs-tab:nth-child(4) {
  display: none;
}
</style>
