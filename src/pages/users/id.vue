<template>
  <Form ref="form" style="max-width: 720px" :model="currentData" :rules="rules" :label-width="56">
    <Modal :value="!!files.length && cropping" width="720" :styles="{top: 0}" transfer @on-ok="handleCrop" @on-cancel="$refs.upload && $refs.upload.clear">
      <div style="max-width: 100%" v-if="files.length">
        <img ref="editImage" :src="files[0].url" />
      </div>
    </Modal>
    <Row>
      <Col :xs="4" :sm="3" style="text-align: center">
        <div v-show="$refs.upload && $refs.upload.dropActive" class="drop-active">
          <h3>拖放文件并上传</h3>
        </div>
        <FileUpload ref="upload" v-model="files"
          :size="8 * 1024 * 1024" extensions="gif,jpg,jpeg,png,webp"
          accept="image/png,image/gif,image/jpeg,image/webp"
          name="avatar" :headers="headers" :post-action="avatarUrl"
          :drop="!disabled && !cropping" :drop-directory="false"
          @input-filter="inputFilter" @input-file="inputFile">
          <Avatar class="avatar" :src="files.length ? files[0].url : avatarUrl" size="large">{{ currentData.name && currentData.name[0] }}</Avatar>
          <div><Tag>上传头像</Tag></div>
        </FileUpload>
      </Col>
      <Col :xs="20" :sm="21">
        <Row>
          <Col :xs="12">
            <FormItem label="账号" prop="username">
              <Input v-model="currentData.username" size="small" :disabled="disabled"></Input>
            </FormItem>
          </Col>
          <Col :xs="12">
            <FormItem label="密码" prop="password">
              <Input type="password" size="small" :disabled="disabled"></Input>
            </FormItem>
          </Col>
          <Col :xs="12">
            <FormItem label="姓名" prop="name">
              <Input v-model="currentData.name" size="small" :disabled="disabled"></Input>
            </FormItem>
          </Col>
          <Col :xs="12">
            <FormItem label="Email" prop="email">
              <Input v-model="currentData.email" size="small" :disabled="disabled"></Input>
            </FormItem>
          </Col>
          <Col :xs="12">
            <FormItem label="部门">
              <GroupSelect ref="groupSelect" v-model="currentData.group" :cascade="false" :disabled="disabled"></GroupSelect>
              <!-- <Input :value="group.name" size="small" disabled :disabled="disabled"></Input> -->
            </FormItem>
          </Col>
          <Col :xs="12">
            <FormItem label="管理职位" :label-width="76">
              <i-switch v-model="currentData.isManager" :disabled="disabled">
                <span slot="open">是</span>
                <span slot="close">否</span>
              </i-switch>
            </FormItem>
          </Col>
          <Col :xs="12">
            <FormItem label="职位">
              <Input v-model="currentData.title" size="small" :disabled="disabled"></Input>
            </FormItem>
          </Col>
          <Col :xs="12">
            <FormItem label="角色">
              <Select v-model="currentData.role" filterable size="small" :disabled="disabled">
                <Option v-for="(v, k) in ROLES" :key="k" :label="v" :value="k"></Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col v-for="(mobile, i) in currentData.mobiles" :key="i" :xs="12">
            <FormItem :label="'手机' + (i + 1)">
              <Input :value="mobile" @on-blur="setMobileValue(i, target.value)" size="small" :disabled="disabled">
                <Button type="ghost" slot="append" icon="minus-circled" size="small" :disabled="disabled" @click="removeMobileField(i)"></Button>
              </Input>
            </FormItem>
          </Col>
          <Col :xs="2" :sm="2">
            <FormItem :label-width="5">
              <Button icon="plus" size="small" :disabled="disabled" @click="addMobileField"></Button>
            </FormItem>
          </Col>
        </Row>
        <FormItem label="备注">
          <Input v-model="currentData.note" type="textarea" :autosize="{minRows:2}" size="small" :disabled="disabled"></Input>
        </FormItem>
        <Row v-if="currentData.roles === 'sales'">
          <Col :xs="14" :sm="8">
            <FormItem label="实际/计划销售额" :label-width="134">
              <Input v-model="currentData.amount" size="small" :disabled="disabled"><template slot="append">万元</template></Input>
            </FormItem>
          </Col>
          <Col :xs="8" :sm="5">
            <FormItem label="/" :label-width="24">
              <Input v-model="currentData.planAmount" size="small" :disabled="disabled"><template slot="append">万元</template></Input>
            </FormItem>
          </Col>
        </Row>
        <Row v-if="currentData.type == 2">
          <Col :xs="16" :sm="8">
            <FormItem label="计划额">
              <Input v-model="currentData.planAmount" size="small" :disabled="disabled"><template slot="append">万元</template></Input>
            </FormItem>
          </Col>
        </Row>
        <FormItem v-if="!disabled" :label-width="1" class="form-buttons">
          <Button type="primary" icon="android-done" size="small" :loading="loading" @click.stop.prevent="handleSave">确定</Button>
          <Button type="ghost" icon="refresh" size="small" @click.stop.prevent="handleReset">重置</Button>
          <Button v-if="cancelable" type="ghost" icon="close" size="small" @click.stop.prevent="handleCancel">取消</Button>
          <Button @click.stop.prevent="test"></Button>
        </FormItem>
      </Col>
    </Row>
  </Form>
</template>

<script>
import FileUpload from 'vue-upload-component'
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'
import config from '@/store/config'
import GroupSelect from '@/components/GroupSelect'
import mixin from '@/pages/mixin'

const { BASE } = config

export default {
  mixins: [mixin],
  components: { GroupSelect, FileUpload },
  data () {
    return {
      name: 'user',
      cropping: false,
      cropper: false,
      files: [],
      POST_ACTION: 'POST_USER',
      ROLES: config.ROLES
    }
  },
  computed: {
    rules () {
      return {
        username: [
          { required: true, message: '请输入账号名称', trigger: 'blur' }
        ],
        password: [
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入用户名称', trigger: 'blur' }
        ],
        email: [
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
        ]
      }
    },
    headers () {
      let token = this.$store.state.currentToken
      return token ? { Authorization: token } : null
    },
    avatarUrl () {
      let data = this.currentData
      return this.currentUser && data ? BASE + '/users/' + data._id + '/avatar' : null
    }
  },
  watch: {
    currentUser (newValue, oldValue) {
      if (newValue && !oldValue) {
        this.setData()
      }
    },
    cropping (value) {
      if (value) {
        this.$nextTick(function () {
          if (!this.$refs.editImage) return
          let cropper = new Cropper(this.$refs.editImage, {
            aspectRatio: 1,
            modal: false,
            viewMode: 1
          })
          this.cropper = cropper
        })
      } else if (this.cropper) {
        this.cropper.destroy()
        this.cropper = false
      }
    }
  },
  methods: {
    handleCrop () {
      this.cropping = false
      let oldFile = this.files[0]
      let binStr = atob(this.cropper.getCroppedCanvas().toDataURL(oldFile.type).split(',')[1])
      let arr = new Uint8Array(binStr.length)
      for (let i = 0; i < binStr.length; i++) {
        arr[i] = binStr.charCodeAt(i)
      }
      let file = new File([arr], oldFile.name, { type: oldFile.type })
      this.$refs.upload.update(oldFile.id, {
        file,
        type: file.type,
        size: file.size,
        active: true
      })
    },
    inputFile (newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        this.$nextTick(function () {
          this.cropping = true
        })
      }
      if (!newFile && oldFile) {
        this.cropping = false
      }
    },
    inputFilter (newFile, oldFile, prevent) {
      if (!this.currentUser || this.readonly) return prevent()
      if (newFile && !oldFile) {
        if (!/\.(gif|jpg|jpeg|png|webp)$/i.test(newFile.name)) {
          this.$Message.warning('请上传图片')
          return prevent()
        }
      }
      if (newFile && (!oldFile || newFile.file !== oldFile.file)) {
        newFile.url = ''
        let URL = window.URL || window.webkitURL
        if (URL && URL.createObjectURL) {
          newFile.url = URL.createObjectURL(newFile.file)
        }
      }
    },
    test () { console.info(this.group, this) },
    cloneData (data) {
      let mobiles = data && data.mobiles
      return {
        ...data,
        group: data && data.group,
        mobiles: mobiles && mobiles.length ? [...mobiles] : ['']
      }
    },
    async setData () {
      if (!this.currentUser || !this.name || this.$route.name !== this.name) return
      const id = this.$route.params.id
      if (!id) return
      try {
        let store = this.$store
        if (!store.state.groups) store.dispatch('FETCH_GROUPS')
        let users = store.state.users
        let data = users ? users.find(u => u._id === id) : await store.dispatch('GET_USER', id)
        if (data) {
          if (this.data) Object.assign(this.data, this.cloneData(data))
          this.currentData = this.cloneData(data)
          this.readonly = false
        } else {
          this.$Message.warning('未找到对应用户!')
          this.readonly = true
        }
      } catch (err) {
        this.$emit('error', err)
        let res = err.response
        this.$Message.error(res && res.status === 404 ? '未找到对应用户!' : (res || err.toString()))
        this.readonly = true
      }
      // this.$Loading.finish()
    },
    addMobileField () {
      this.currentData.mobiles.push('')
    },
    removeMobileField (i) {
      if (this.currentData.mobiles.length > 1) this.currentData.mobiles.splice(i, 1)
    },
    setMobileValue (i, value) {
      this.currentData.mobiles[i] = value
    }
  },
  async beforeRouteUpdate (to, from, next) {
    await next()
    await this.setData()
  }
}
</script>

<style>
.avatar {
  color: #333;
  transform-origin: 0% 0%;
  /*font-size: 2em;*/
  transform2: scale(2);
  width: 80px;
  height: 80px;
  line-height: 80px;
  border-radius: 40px;
  margin-bottom: 10px;
}

.avatar:hover {
  cursor: pointer;
}

.avatar>span {
  font-size: 2em;
  transform: scale(2) translate(-7px, 10px) !important;
}
</style>