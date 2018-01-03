<template>
  <div>
    <el-popover ref="delPopover" placement="left" width="160" v-model="isPopoverVisible">
      <p>操作不可恢复，是否确定删除角色 {{ currentRole.name }} [{{ currentRole.id }}]？</p>
      <div style="text-align: right; margin: 0">
        <el-button size="mini" type="text" @click="isPopoverVisible = false">取消</el-button>
        <el-button type="primary" size="mini" @click="ensureDelete">确定</el-button>
      </div>
    </el-popover>
    <div class="toolbar">
      <el-button size="small" icon="plus" @click="handleAdd">新增</el-button>
    </div>
    <el-table :data="roles" border style="width: 100%" max-height="600" tooltip-effect="light">
      <el-table-column prop="id" label="id" width="40"></el-table-column>
      <el-table-column prop="name" label="名称" width="100"></el-table-column>
      <el-table-column prop="description" label="描述" show-overflow-tooltip></el-table-column>
      <el-table-column width="100" label="操作">
        <template slot-scope="scope">
          <el-button size="small" icon="edit" @click="handleEdit(scope.$index, scope.row)"></el-button>
          <el-button size="small" type="danger" icon="delete" v-popover:delPopover @click="handleDelete(scope.$index, scope.row, $event)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="角色信息" size="large" top="5%" :visible.sync="isDialogVisible">
      <role ref="role" @save="handleSave" @cancel="handleCancel" :readonly="readonly" :role="currentRole"></role>
    </el-dialog>
  </div>
</template>

<script>
import Role from './id'
import { mapState } from 'vuex'
// import { SET_CURRENT_ROLE } from '@/store/mutation-types.js'

export default {
  components: { Role },
  data () {
    return {
      readonly: false,
      isDialogVisible: false,
      isPopoverVisible: false,
      currentIndex: 0,
      currentRole: {}
    }
  },
  computed: {
    // ...mapGetters(['newRoleId'])
    ...mapState(['roles'])
  },
  methods: {
    // ...mapMutations(['SET_CURRENT_ROLE']),
    // getter or computed will cache the result to return same id
    newRoleId: function () {
      let roles = this.$store.state.roles
      console.info('newId', roles)
      let newId = 0
      for (let id in roles) {
        if (id > newId) newId = id
      }
      return +newId + 1
    },
    handleAdd () {
      this.isDialogVisible = true
      this.currentRole = {}
      let role = this.$refs.role
      if (role) role.reset()
    },
    handleEdit (index, row) {
      this.isDialogVisible = true
      this.currentRole = {...row}
      let role = this.$refs.role
      if (role) role.reset()
    },
    handleSave (role) {
      console.info(role.id, this.newRoleId)
      if (!role.id) {
        role.id = this.newRoleId()
        this.roles.push(role)
      }
      this.$store.commit('SET_ROLE', {role, id: role.id})
      // this.SET_CURRENT_ROLE(row)
      this.isDialogVisible = false
    },
    handleCancel () {
      this.isDialogVisible = false
    },
    handleDelete (index, row, $event) {
      this.currentRole = row
      this.currentIndex = index
      this.$refs.delPopover.referenceElm = $event.srcElement
      this.isPopoverVisible = true
    },
    ensureDelete () {
      console.info(arguments)
      this.roles.splice(this.currentIndex, 1)
      this.$store.commit('DELETE_ROLE', this.currentRole.id)
      console.info(this.$store.state.roles)
      this.isPopoverVisible = false
    }
  },
  beforeMount () {
    console.info('beforeMount')
    let store = this.$store
    if (!store.state.roles) {
      store.dispatch('FETCH_ROLES')
    }
  }
}
</script>
