<template>
  <Tabs class="dynamic-tabs" ref="tabs" type="card" size="small" :value="currentTab">
    <TabPane label="工单" name="workorder">
      <Form ref="form" :model="currentData" :rules="rules" :label-width="65">
        <Card style="margin-bottom: 24px">
          <Steps size="small" :current="currentData.step" :status="currentData.status">
            <Step title="创建工单" :content="getAssignee(0)"></Step>
            <Step v-for="(title, i) in STEPS" :key="title" :title="title" :content="getAssignee(i + 1)"></Step>
          </Steps>
        </Card>
        <Row>
          <Col :xs="21" :sm="16">
            <FormItem label="项目" prop="project">
              <Input v-if="data.project" size="small" readonly :disabled="disabled || currentData.step > 0" :value="currentData.projectName"></Input>
              <ProjectSelect ref="projectSelect" v-else :value="currentData.projectId" size="small" :disabled="disabled || currentData.step > 0" @on-change="handleProjectChange"></ProjectSelect>
            </FormItem>
          </Col>
          <Col :xs="3" :sm="2">
            <FormItem label="" :label-width="1">
              <Button :disabled="!currentData.projectId" icon="information-circled" size="small" @click.stop.prevent="showProject">详细</Button>
            </FormItem>
          </Col>
        </Row>
        <FormItem label="客户">
          <Input v-if="data.customer" size="small" readonly :disabled="disabled || currentData.step > 0" :value="currentData.customerName"></Input>
        </FormItem>
        <Row>
          <Col :xs="16" :sm="12">
            <FormItem label="联系人" prop="contact">
              <Input v-if="data.contact" :value="currentData.contactName" readonly size="small" :disabled="disabled || currentData.step > 0"></Input>
              <ContactSelect ref="customerContactSelect" v-else size="small" v-model="currentData.contact" :company="currentData.customer" :withPhone="true" :disabled="!currentData.customer || disabled || currentData.step > 0" @on-change="handleContactChange"></ContactSelect>
            </FormItem>
          </Col>
          <Col :xs="8">
            <FormItem label="电话">
              <Input :value="currentData.contactPhone" readonly size="small" :disabled="disabled || currentData.step > 0"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :xs="12" :sm="8">
            <FormItem label="类型" prop="type">
              <Select v-model="currentData.type" size="small" :disabled="disabled || currentData.step > 0">
                <Option v-for="(option, idx) in WORK_TYPES" :value="idx" :key="idx" :label="option"></Option>
            </Select>
            </FormItem>
          </Col>
        </Row>
        <FormItem label="描述" prop="description">
          <Input v-model="currentData.description" type="textarea" :autosize="{minRows:2}" size="small" placeholder="需填写项目简要背景情况，技术需现场需要处理和反馈事项，客户希望处理完成的时间节点，其他需要注意事项" :disabled="disabled || currentData.step > 0"></Input>
        </FormItem>
        <FormItem label="备注">
          <Input v-model="currentData.note" type="textarea" :autosize="{minRows:2}" size="small" :disabled="disabled"></Input>
        </FormItem>
        <Row v-show="!currentData.step || currentData.step > 1">
          <Col :xs="16" :sm="8">
            <FormItem label="受理" prop="dispatcher">
              <Select v-model="currentData.dispatcher" transfer filterable size="small" placeholder="请选择下一步受理人员" :disabled="disabled || currentData.step > 1">
                <Option v-for="item in users" :label="item.name" :value="item._id" :key="item._id">{{ item.name }} ( {{ item.username }} )</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row v-show="currentData.step">
          <Col :xs="24" :sm="12">
            <FormItem label="实施">
              <Select v-model="currentData.workers" transfer multiple filterable size="small" placeholder="请选择实施人员（可多选）" :disabled="disabled || currentData.step > 1">
                <Option v-for="item in users" :label="item.name" :value="item._id" :key="item._id">{{ item.name }} ( {{ item.username }} )</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row v-show="currentData.step">
          <Col :xs="16" :sm="8">
            <FormItem label="预计时间">
              <DatePicker type="daterange" v-model="currentData.workTime" placeholder="选择日期范围" format="yyyy/MM/dd" transfer clearable size="small" :disabled="disabled || currentData.step > 1"></DatePicker>
            </FormItem>
          </Col>
        </Row>
        <Row v-show="currentData.step">
          <Col :xs="16" :sm="8">
            <FormItem label="审核" prop="auditor">
              <Select v-model="currentData.auditor" transfer filterable size="small" placeholder="请选择审核人员" :disabled="disabled || currentData.step > 1">
                <Option v-for="item in users" :label="item.name" :value="item._id" :key="item._id">{{ item.name }} ( {{ item.username }} )</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row v-show="currentData.step > 2">
          <Col :xs="16" :sm="12">
            <FormItem label="开始时间">
              <DatePicker type="datetime" v-model="currentData.workTime" placeholder="选择开始日期" format="yyyy/MM/dd HH:mm" transfer clearable size="small" :disabled="disabled || currentData.step !== 3 && currentData.step !== 4"></DatePicker>
            </FormItem>
          </Col>
          <Col :xs="12">
            <FormItem label="工时">
              <InputNumber v-model="currentData.workHours" size="small" :disabled="disabled || currentData.step !== 3 && currentData.step !== 4"></InputNumber>
            </FormItem>
          </Col>
        </Row>
        <!-- <Row v-show="currentData.step > 2">
          <Col :xs="12">
            <FormItem label="差旅费用">
              <Input v-model="currentData.expense" size="small" :disabled="disabled"><template slot="append">元</template></Input>
            </FormItem>
          </Col>
          <Col :xs="12">
            <FormItem label="额外费用" :label-width="76">
              <Input v-model="currentData.extraExpense" size="small" :disabled="disabled"><template slot="append">元</template></Input>
            </FormItem>
          </Col>
          <Col :xs="24">
            <FormItem label="费用备注">
              <Input v-model="currentData.expenseNote" type="textarea" :autosize="{minRows:2}" size="small" :disabled="disabled"></Input>
            </FormItem>
          </Col>
        </Row> -->
        <Row v-show="currentData.step > 2">
          <Col :xs="12">
            <FormItem label="故障原因">
              <Select v-model="currentData.fault" clearable transfer size="small" :disabled="disabled || currentData.step !== 3 && currentData.step !== 4">
                <Option v-for="(option, idx) in FAULTS" :value="idx" :key="idx" :label="option"></Option>
              </Select>
            </FormItem>
          </Col>
          <Col :xs="24">
            <FormItem label="实施总结">
              <Input v-model="currentData.summary" type="textarea" :autosize="{minRows:2}" size="small" placeholder="项目交流、测试、实施或者运维的工作的结果说明、是否有未解决技术问题或者下次需要技术支持的工作说明、其他需要补充说明的事项" :disabled="disabled || currentData.step !== 3 && currentData.step !== 4"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row v-show="currentData.step > 4">
          <Col :xs="24">
            <FormItem label="评分">
              <Rate v-model="currentData.rate" allow-half show-text :disabled="disabled"></Rate>
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
        <!-- <config-form :configs="configs"></config-form> -->
        <FormItem v-show="!disabled" :label-width="1" class="form-buttons">
          <Button v-show="currentData.step === 3" type="ghost" icon="android-done" size="small" :disabled="loading" :loading="loading" @click.stop.prevent="handleSave">保存</Button>
          <Button v-show="!currentData.step || currentData.step === 3 || currentData.step === 4" type="primary" icon="archive" size="small" :disabled="loading" :loading="loading" @click.stop.prevent="handleSubmit">提交</Button>
          <Button v-show="!currentData.step" type="ghost" icon="android-drafts" size="small" :disabled="loading" :loading="loading" @click.stop.prevent="handleSaveDraft">保存草稿</Button>
          <Button v-show="!currentData.step" type="ghost" icon="refresh" size="small" :disabled="loading" @click.stop.prevent="handleReset">重置</Button>
          <Button v-show="currentData.step === 1" type="info" icon="fork-repo" size="small" :disabled="loading" :loading="loading" @click.stop.prevent="handleDispatch">分派</Button>
          <Button v-show="currentData.step === 2" type="info" icon="heart" size="small" :disabled="loading" :loading="loading" @click.stop.prevent="handleApprove">同意</Button>
          <Button v-show="currentData.step === 1 || currentData.step === 2" type="warning" icon="heart-broken" size="small" :disabled="loading" :loading="loading" @click.stop.prevent="handleReject">拒绝</Button>
          <Button v-show="currentData.step === 5" type="warning" icon="locked" size="small" :disabled="loading" :loading="loading" @click.stop.prevent="handleClose">关闭</Button>
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
import { mapState } from 'vuex'
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
      name: 'workorder',
      GET_ACTION: 'GET_WORKORDER',
      POST_ACTION: 'POST_WORKORDER',
      currentTab: 'workorder'
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
        type: [
          { type: 'number', required: true, message: '请选择工单类型', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请填写具体描述', trigger: 'blur' }
        ],
        dispatcher: [
          { type: 'number', required: true, message: '请选择受理人员', trigger: 'change,blur' }
        ]
      }
    },
    disabled () {
      if (this.readonly) return true
      let user = this.$store.state.currentUser
      if (!user) return true
      let data = this.currentData
      let id = user._id
      return data.step === 6 || user.role > 0 && (data.step === 3 ? !data.assignee.includes(id) : data.step ? data.assignee !== id : (data._id && data.createdBy !== id))
    },
    ...mapState(['users'])
  },
  methods: {
    test () {
      console.info(this)
      let data = this.currentData
      if (data.step) {
        data.step += 1
      } else {
        data.step = 1
      }
      if (data.step > 7) data.step = 0
    },
    cloneData (data) {
      // const DEFAULT = {
      //   step: 0,
      //   status: 'wait',
      //   projectId: null,
      //   projectName: null,
      //   customerId: null,
      //   customerName: null,
      //   contactId: null,
      //   contactName: null,
      //   type: 0
      // }
      return {
        // ...DEFAULT,
        ...data,
        step: data.step || 0,
        assignee: data && data.assignee ? [...data.assignee] : [],
        workers: data && data.workers ? [...data.workers] : []
      }
    },
    getAssignee (step) {
      if (!this.users) return ''
      let data = this.currentData
      let userId
      let user
      switch (step) {
        case 0:
        case 5:
          userId = data.createdBy
          user = this.users.find(u => u._id === userId)
          return user && user.name || ''
        case 1:
          userId = data.dispatcher
          user = this.users.find(u => u._id === userId)
          return user && user.name || ''
        case 2:
        case 4:
          userId = data.auditor
          user = this.users.find(u => u._id === userId)
          return user && user.name || ''
        case 3:
          userId = data.workers
          let names = []
          this.users && this.users.forEach(u => {
            if (userId.includes(u._id)) names.push(u.name)
          })
          return names.join(',')
        default:
          return ''
      }
    },
    async handleSubmit () {
      let valid = await this.$refs.form.validate()
      if (!valid) return
      let data = this.currentData
      data.status = 'process'
      if (data.step) {
        data.assignee = data.step === 3 ? data.auditor : data.createdBy
        data.step += 1
      } else {
        data.assignee = data.dispatcher
        data.step = 1
      }
      this._save()
      // if (data.step === 1) {
      //   this.$router.push('/workorders/' + data._id)
      // }
    },
    handleSaveDraft () {
      let data = this.currentData
      data.assignee = null
      data.status = 'wait'
      this._save()
    },
    handleDispatch () {
      let data = this.currentData
      if (!data.workers.length) {
        this.$Message.warning('请指定分派人员!')
        return
      }
      data.assignee = data.auditor
      data.step += 1
      this._save()
    },
    handleApprove () {
      let data = this.currentData
      data.assignee = data.workers
      data.step += 1
      this._save()
    },
    handleReject () {
      let data = this.currentData
      data.assignee = data.createdBy
      data.step = 0
      data.status = 'error'
      this._save()
    },
    handleClose () {
      let data = this.currentData
      data.step += 1
      data.status = 'finish'
      this._save()
    }
  }
}
</script>

<style>
.dynamic-tabs .ivu-tabs-tab:nth-child(3), .dynamic-tabs .ivu-tabs-tab:nth-child(4) {
  display: none;
}
</style>
