<template>
  <div>
    <Form inline>
      <FormItem label="部门" :label-width="38">
        <GroupSelect :cascade="false" style="width: 150px" :disabled="loading || !currentUser" @on-change="handleGroupQuery"></GroupSelect>
      </FormItem>
      <FormItem label="用户" :label-width="51">
        <Select filterable clearable size="small" :disabled="loading || !currentUser" @on-change="handleUserQuery">
          <Option v-for="item in userNames" :label="item.name" :value="item._id" :key="item._id">{{ item.name }} ( {{ item.username }} )</Option>
        </Select>
      </FormItem>
      <FormItem class="buttons">
        <Button type="ghost" size="small" icon="plus" :disabled="!addable" @click.stop.prevent="handleAdd">新增</Button>
        <Button type="ghost" size="small" icon="edit" :disabled="!editable" @click.stop.prevent="handleEdit">编辑</Button>
        <Poptip confirm placement="left" transfer :title="'操作不可恢复，是否确定删除该用户 ' + (selectData ? selectData.name + ' [' + selectData._id + ']？' : '')" @on-ok="handleRemove">
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
        用户信息
        <Icon :type="modalClass === 'normal' ? 'arrow-expand' : 'arrow-shrink'" class="zoom" @click="toggleFullScreen"></Icon>
      </div>
      <User v-if="currentData" ref="user" :cancelable="true" :readonly="disabled" :data="currentData" @save="handleSave" @cancel="handleCancel"></User>
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
import GroupSelect from '@/components/GroupSelect'
import mixin from '@/pages/list-mixin'
import uploadMixin from '@/pages/upload-mixin'
// import User from './id'

export default {
  mixins: [mixin, uploadMixin],
  components: { GroupSelect, User: () => import('./id') },
  data () {
    return {
      FETCH_ACTION: 'FETCH_USERS',
      GET_ACTION: 'GET_USER',
      DELETE_ACTION: 'DELETE_USER',
      STORE_NAME: 'users',
      UPLOAD_URL: config.BASE + '/users/import',
      prefetchUserNames: true,
      query: {
        id: null,
        group: null
      }
    }
  },
  computed: {
    addable () {
      if (this.loading || this.readonly) return false
      let user = this.currentUser
      return user && user.role < 1
    },
    editable () {
      if (this.loading || this.readonly) return false
      let user = this.currentUser
      let data = this.selectData
      return user && data && data._id && (user.role < 0 || data.createdBy === user._id || data._id === user._id)
    },
    columns () {
      let state = this.$store.state
      const ROLES = config.ROLES
      return [
        {
          title: '账号',
          key: 'username',
          width: 100
        },
        {
          title: '姓名',
          key: 'name',
          width: 80
        },
        {
          title: '部门',
          key: 'group',
          width: 100,
          render (h, { row }) {
            const gid = row.group
            let group = state.groups ? state.groups.find(g => g._id === gid) : null
            // row.group = group
            return group && group.name
          }
        },
        {
          title: '职位',
          key: 'title',
          width: 80
        },
        {
          title: '角色',
          key: 'role',
          width: 80,
          render (h, { row }) {
            return ROLES[row.role]
          }
        },
        {
          title: 'Email',
          key: 'email',
          width: 180
        },
        {
          title: '电话',
          render (h, { row: { mobiles } }) {
            return mobiles && h('span', {
              domProps: { innerHTML: mobiles.join('<br>') }
            })
          }
        },
        {
          title: '备注',
          key: 'note'
        }
      ]
    }
    // users2  () {
    //   const users = this._users
    //   this.selectData = this.currentData = null
    //   let state = this.$store.state
    //   if (!state.currentUser || !users) return []
    //   let userId = this.filterUserId
    //   if (userId) {
    //     let user = users.find(u => u._id === userId)
    //     this.total = user ? 1 : 0
    //     return user ? [user] : []
    //   }
    //   let filter = this.filterGroup
    //   // if (!filters || !filters.length || !filters[0]) return users
    //   const gid = Array.isArray(filter) ? filter[filter.length - 1] : filter
    //   let ret = gid ? users.filter(u => u.group === gid) : users
    //   let query = this.query
    //   this.total = ret.length
    //   return ret.slice(query.offset, query.offset + query.size)
    //   // const group = state.groups.find(g => g._id === gid)
    //   // if (group) {
    //   //   const uids = this.memberIds(group)
    //   //   console.info('users', uids)
    //   //   return users.filter(u => uids.includes(u._id))
    //   // }
    //   // return users
    // }
  },
  methods: {
    async fetchArray2 (force = false) {
      if (!this.currentUser) return
      let store = this.$store
      this._users = store.state.users
      if (!force && store.state.groups && store.state.users) return
      this.loading = true
      this.$Loading.start()
      try {
        if (!store.state.groups) {
          await store.dispatch('FETCH_GROUPS')
        }
        if (force || !store.state.users) {
          await store.dispatch('FETCH_USERS')
        }
      } catch (err) {
        console.info(err)
        let res = err.response
        this.$Message.error(res && res.data && res.data.error || err.message || err.toString())
      }
      this.selectData = this.currentData = null
      this.loading = false
      this.$Loading.finish()
    },
    handleGroupQuery (value) {
      this.query.offset = 0
      this.query.group = Array.isArray(value) ? value[value.length - 1] : value
      this.fetchArray()
    },
    handleUserQuery (value) {
      this.query.offset = 0
      this.query.id = value
      this.fetchArray()
      // this.filterUserId = value
    },
    // handleSave (data) {
    //   this.isDialogVisible = false
    //   this.selectData = this.currentData = null
    // },
    // async handleRemove () {
    //   let data = this.selectData
    //   if (!data || !this.editable) return
    //   const title = data.name
    //   const close = this.$Message.loading({
    //     content: '删除数据...',
    //     duration: 0
    //   })
    //   this.loading = true
    //   this.$Loading.start()
    //   try {
    //     await this.$store.dispatch(this.DELETE_ACTION, data._id)
    //     this.selectData = null
    //     this.$emit('remove', data)
    //     close()
    //     this.$Message.success(title + '删除成功!')
    //   } catch (err) {
    //     this.$emit('error', err)
    //     close()
    //     this.$Message.error(title + '删除失败!', err)
    //   }
    //   this.loading = false
    //   this.$Loading.finish()
    // },
    matchQuery (data) {
      let query = this.query
      return (!query.id || query.id === data._id) && (!query.group || data.group === query.group)
    }
  }
}
</script>