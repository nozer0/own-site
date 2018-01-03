<template>
  <el-form ref="form" :model="roleData" :rules="rules" label-width="60px">
    <el-row>
      <el-col :xs="20" :sm="12">
        <el-form-item label="名称" prop="name">
          <el-input required size="small" v-model="roleData.name" :disabled="readonly"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="描述" prop="description">
      <el-input size="small" v-model="roleData.description" :disabled="readonly"></el-input>
    </el-form-item>
    <el-form-item label="权限" prop="perms">
      <el-collapse ref="collapse">
        <el-collapse-item v-for="(db, id) in dbinfo" :key="id">
          <template slot="title">
            <span class="db">{{ db.name }}</span>
          </template>
          <template slot="append">
            <el-checkbox v-model="db.read" :disabled="readonly">读</el-checkbox>
            <el-checkbox v-model="db.write" :disabled="readonly">写</el-checkbox>
          </template>
          <div v-for="(group, gid) in db.groups" :key="id + '-' + gid">
            <span class="group">{{ group.name }}</span>
            <el-checkbox v-model="group.read" :disabled="readonly">读</el-checkbox>
            <el-checkbox v-model="group.write" :disabled="readonly">写</el-checkbox>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-form-item>
    <el-form-item v-if="!readonly">
      <el-button size="small" type="primary" @click="handleSave">确定</el-button>
      <el-button size="small" @click="handleReset">重置</el-button>
      <el-button size="small" @click="handleCancel">取消</el-button>
      <el-button @click="test"></el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import config from '@/store/config'
import Collapse from '@/components/Collapse'
import CollapseItem from '@/components/CollapseItem'

const { DBS, GROUPS } = config

export default {
  components: {
    elCollapse: Collapse,
    elCollapseItem: CollapseItem
  },
  props: {
    readonly: {
      type: Boolean,
      default: false
    },
    role: {
      type: Object,
      default () {
        console.info('props')
        let id = this.$route.params.id
        let roles = this.$store.state.roles
        if (id && roles) {
          for (let v of roles) {
            if (v.id === id) return {...v}
          }
        }
        return {}
      }
    }
  },
  data () {
    console.info('data')
    let role = {...this.role}
    return {
      rules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      },
      roleData: role,
      // computed data can't bind with the checkbox
      dbinfo: this.initDbinfo(role.perms)
    }
  },
  computed: {
  },
  watch: {
    role: function (newValue, oldValue) {
      console.info('watch')
      if (newValue === oldValue) return
      this.roleData = {...newValue}
      this.dbinfo = this.setDbinfo()
    }
  },
  methods: {
    test () { console.info(this) },
    async handleSave () {
      let valid = await this.$refs.form.validate()
      if (valid) {
        console.info('submit')
        this.roleData.perms = this.getPerms()
        Object.assign(this.role, this.roleData)
        this.$store.dispatch('POST_ROLE', this.role).then(
          () => this.$emit('save', this.roleData),
          (err) => this.$emit('error', err)
        )
      } else {
        console.info('error')
      }
    },
    handleReset: function () {
      this.reset()
      this.$emit('reset')
    },
    handleCancel: function () {
      this.$emit('cancel')
    },
    initDbinfo: function (perms = {}) {
      let dbinfo = {}
      for (let dbid in DBS) {
        let perm = perms[dbid]
        let db = dbinfo[dbid] = {
          name: DBS[dbid],
          read: !!perm && !!(perm[0] & 1),
          write: !!perm && !!(perm[0] & 2),
          groups: {}
        }
        let groups = db.groups
        let gperms = perm && perm[1]
        for (let gid in GROUPS) {
          let gperm = gperms && gperms[gid]
          groups[gid] = {
            name: GROUPS[gid],
            read: !!(gperm & 1),
            write: !!(gperm & 2)
          }
        }
      }
      return dbinfo
    },
    setDbinfo: function () {
      let perms = this.role.perms || {}
      let dbinfo = this.dbinfo
      for (let dbid in DBS) {
        let perm = perms[dbid]
        let db = dbinfo[dbid]
        db.read = !!perm && !!(perm[0] & 1)
        db.write = !!perm && !!(perm[0] & 2)
        let groups = db.groups
        let gperms = perm && perm[1]
        for (let gid in GROUPS) {
          let gperm = gperms && gperms[gid]
          let group = groups[gid]
          group.read = !!(gperm & 1)
          group.write = !!(gperm & 2)
        }
      }
      return dbinfo
    },
    getPerms: function () {
      let perms = {}
      let dbinfo = this.dbinfo
      for (let dbid in dbinfo) {
        let db = dbinfo[dbid]
        let perm = (db.read ? 1 : 0) + (db.write ? 2 : 0)
        let groups = db.groups
        let gperms = {}
        let set = false
        for (let gid in groups) {
          let group = groups[gid]
          let gperm = (group.read ? 1 : 0) + (group.write ? 2 : 0)
          if (gperm) {
            set = true
            gperms[gid] = gperm
          }
        }
        if (perm || set) {
          perms[dbid] = set ? [perm, gperms] : [perm]
        }
      }
      return perms
    },
    reset: function () {
      // this.$refs.form.resetFields()
      this.roleData = {...this.role}
      this.$refs.collapse.setActiveNames([])
      this.setDbinfo()
    }
  },
  beforeMount () {
    console.info('beforeMount')
    let id = this.$route.params.id
    if (!id) return
    let store = this.$store
    if (!store.state.roles) {
      store.dispatch('FETCH_ROLES').then(() => {
        let roles = store.state.roles
        if (roles) {
          for (let v of roles) {
            if (v.id === id) {
              Object.assign(this.role, v)
              this.reset()
            }
          }
        }
      })
    }
  },
  mounted () { console.info('mounted') },
  update () { console.info('update') },
  beforeUpdated () { console.info('beforeUpdated') },
  beforeDestory () { console.info('beforeDestory') }
}
</script>

<style>
.db {
  display: inline-block;
  width: 150px;
}
.group {
  display: inline-block;
  margin-left: 25px;
  width: 150px;
}
</style>
