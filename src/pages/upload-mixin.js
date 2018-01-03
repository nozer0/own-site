import FileUpload from 'vue-upload-component'

export default {
  components: { FileUpload },
  data () {
    return {
      files: [],
      showUploadDialog: false,
      uploadStatus: 'normal',
      uploadResults: []
    }
  },
  computed: {
    uploadFile () { return this.files[0] || {} },
    headers () {
      let token = this.$store.state.currentToken
      return token ? { Authorization: token } : null
    },
    uploadUrl () {
      let user = this.currentUser
      return user ? this.UPLOAD_URL : null
    }
  },
  watch: {
    'uploadFile.active' (newValue, oldValue) {
      if (newValue && !oldValue) {
        this.showUploadDialog = true
        // if (this.closeHandler) this.closeHandler()
        // this.closeHandler = this.$Message.loading({
        //   content: this.uploadFile.name + ' 上传中...',
        //   duration: 0
        // })
      } else if (!newValue && oldValue) {
        let ret = this.uploadFile.response
        if (ret && ret.success) {
          this.uploadStatus = 'success'
          this.showUploadDialog = false
          this.fetchArray()
        } else {
          if (ret.error) {
            this.uploadResults = ret.error
          } else {
            this.$Message.error('上传失败，' + this.uploadFile.error)
          }
          this.uploadStatus = 'wrong'
        }
        // if (this.closeHandler) this.closeHandler()
      }
    }
  },
  methods: {
    inputFile (newFile, oldFile, prevent) {
      if (newFile && newFile !== oldFile) {
        this.uploadStatus = 'active'
        this.$refs.upload.active = true
      }
    },
    inputFilter (newFile, oldFile, prevent) {
      if (!this.currentUser || this.readonly) return prevent()
      if (newFile && !oldFile) {
        if (!/\.csv$/i.test(newFile.name)) {
          this.$Message.warning('请上传CSV文件')
          return prevent()
        }
      }
      // if (newFile && (!oldFile || newFile.file !== oldFile.file)) {
      //   newFile.url = ''
      //   let URL = window.URL || window.webkitURL
      //   if (URL && URL.createObjectURL) {
      //     newFile.url = URL.createObjectURL(newFile.file)
      //   }
      // }
    },
    handleUploadOk () {
      this.fetchArray(true)
    },
    handleUploadCancel () {
      let upload = this.$refs.upload
      if (upload.active) {
        upload.active = false
      }
    }
  }
}
