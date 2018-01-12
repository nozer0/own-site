<template>
  <Form ref="form" :model="currentData" :rules="rules" :label-width="64">
    <FormItem label="名称" prop="name">
      <Input v-model="currentData.name" size="small" :disabled="freezed"></Input>
    </FormItem>
    <FormItem label="主管">
      <Select v-model="leaders" multiple filterable size="small" :disabled="freezed" placeholder="可多选">
        <Option v-for="item in users" :label="item.name" :value="item._id" :key="item._id" :disabled="members.includes(item._id)">{{ item.name }} ( {{ item.username }} )</Option>
      </Select>
    </FormItem>
    <FormItem label="成员">
      <Select v-model="members" multiple filterable size="small" :disabled="freezed" placeholder="可多选">
        <Option v-for="item in users" :label="item.name" :value="item._id" :key="item._id" :disabled="leaders.includes(item._id)">{{ item.name }} ( {{ item.username }} )</Option>
      </Select>
    </FormItem>
    <!-- <FormItem label="下属部门">
      <Tag v-for="item in currentData.groups" :key="item._id">
        {{ item.name }}
      </Tag>
    </FormItem> -->
    <Row>
      <Col :xs="12" :sm="8">
        <FormItem label="Email" prop="email">
          <Input v-model="currentData.email" size="small" :disabled="freezed"></Input>
        </FormItem>
      </Col>
      <Col :xs="12" :sm="8">
        <FormItem label="电话" prop="phone">
          <Input v-model="currentData.phone" size="small" :disabled="freezed"></Input>
        </FormItem>
      </Col>
      <Col :xs="12" :sm="8">
        <FormItem label="传真">
          <Input v-model="currentData.fax" size="small" :disabled="freezed"></Input>
        </FormItem>
      </Col>
    </Row>
    <FormItem label="描述">
      <Input type="textarea" :autosize="{minRows:2, maxRows:6}" v-model="currentData.description" size="small" :disabled="freezed"></Input>
    </FormItem>
    <Row>
      <Col :xs="24" :sm="12">
        <FormItem label="创建">{{ createdBy }} ({{ currentData.createdAt | toDateString }})</FormItem>
      </Col>
      <Col :xs="24" :sm="12">
        <FormItem label="修改">{{ updatedBy }} ({{ currentData.updatedAt | toDateString }})</FormItem>
      </Col>
    </Row>
    <FormItem v-show="!disabled" :label-width="1" class="form-buttons">
      <Button type="primary" icon="android-done" size="small" :loading="loading" @click.stop.prevent="handleSave">确定</Button>
      <Button type="ghost" icon="refresh" size="small" @click.stop.prevent="handleReset">重置</Button>
      <Button v-if="cancelable && !currentData._id" type="ghost" icon="close" size="small" @click.stop.prevent="handleCancel">取消</Button>
      <Button @click.stop.prevent="test"></Button>
    </FormItem>
  </Form>
</template>

<script>
import { mapState } from 'vuex'
import { toDateString } from '@/util'
import mixin from '@/pages/mixin'

export default {
  mixins: [mixin],
  filters: { toDateString },
  data () {
    return {
      POST_ACTION: 'POST_GROUP',
      leaders: [],
      members: []
    }
  },
  computed: {
    disabled () {
      let user = this.currentUser
      let data = this.currentData
      return !user || (user.role >= 0 && data._id && (!user.isManager || user.group !== data._id && user.group !== data.parent))
    },
    rules () {
      return {
        name: [
          { required: true, message: '请输入部门名称', trigger: 'blur' }
        ],
        email: [
          { type: 'email', message: '请输入有效邮件', trigger: 'blur' }
        ]
      }
    },
    ...mapState(['users'])
  },
  methods: {
    setMembers () {
      if (!this.users) return
      let leaders = []
      let members = []
      let id = this.currentData._id
      if (id) {
        for (let u of this.users) {
          if (u.group === id) {
            (u.isManager ? leaders : members).push(u._id)
          }
        }
      }
      this.leaders = leaders
      this.members = members
    },
    async fetchUsers () {
      this.loading = true
      this.$Loading.start()
      try {
        await this.$store.dispatch('FETCH_USERS')
      } catch (err) {
        this.$emit('error', err)
        let res = err.response
        this.$Message.error(res && res.data && res.data.error || err.message || err.toString())
      }
      this.loading = false
      this.$Loading.finish()
    },
    // async setData () {
    //   let store = this.$store
    //   if (!store.state.users) {
    //     await this.fetchUsers()
    //   }
      // const id = this.$route.params.id
      // if (id) {
      //   let groups = store.state.groups
      //   if (!groups) {
      //     this.loading = true
      //     this.$Loading.start()
      //     try {
      //       await store.dispatch('FETCH_GROUPS')
      //       let data = groups && groups.find(g => g.id === id)
      //       if (data) {
      //         if (this.data) Object.assign(this.data, this.cloneData(data))
      //         this.currentData = this.cloneData(data)
      //         this.setMembers()
      //       } else {
      //         this.$Message.warning('没有相应数据!')
      //       }
      //     } catch (err) {
      //       this.$emit('error', err)
      //       let res = err.response
      //  this.$Message.error(res && res.data && res.data.error || err.message || err.toString())
      //     }
      //     this.loading = false
      //     this.$Loading.finish()
      //     return
      //   }
      // }
    //   this.setMembers()
    // },
    async handleSave () {
      if (this.disabled) return
      let valid = await this.$refs.form.validate()
      if (valid) {
        await this._save()
        let gid = this.currentData._id
        if (!gid) return
        let users = this.users
        let leaders = this.leaders
        let members = this.members
        let store = this.$store
        this.loading = true
        this.$Loading.start()
        for (let u of users) {
          let uid = u._id
          if (leaders.includes(uid)) {
            if (!u.isManager || u.group !== gid) {
              try {
                await store.dispatch('POST_USER', {
                  _id: uid,
                  isManager: true,
                  group: gid
                })
                this.$Message.success('用户更新成功!')
              } catch (err) {
                this.$emit('error', err)
                let res = err.response
                this.$Message.error(res && res.data && res.data.error || err.message || err.toString())
              }
            }
          } else if (members.includes(uid)) {
            if (u.isManager || u.group !== gid) {
              try {
                await store.dispatch('POST_USER', {
                  _id: uid,
                  isManager: false,
                  group: gid
                })
                this.$Message.success('用户更新成功!')
              } catch (err) {
                this.$emit('error', err)
                let res = err.response
                this.$Message.error(res && res.data && res.data.error || err.message || err.toString())
              }
            }
          } else if (u.group === gid) {
            try {
              await store.dispatch('POST_USER', {
                _id: uid,
                isManager: false,
                group: null
              })
              this.$Message.success('用户更新成功!')
            } catch (err) {
              this.$emit('error', err)
              let res = err.response
              this.$Message.error(res && res.data && res.data.error || err.message || err.toString())
            }
          }
        }
        this.loading = false
        this.$Loading.finish()
      } else {
        this.$Message.warning('表单验证失败!')
      }
    },
    async afterInitData () {
      if (!this.users) await this.fetchUsers()
      this.setMembers()
    }
  }
}
</script>
