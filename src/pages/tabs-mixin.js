export default {
  data () {
    let self = this
    return {
      isProjectVisible: false,
      project: null,
      projectLabel (h) {
        return h('div', [
          h('span', '项目'),
          h('Icon', {
            props: {
              type: 'ios-close-empty'
            },
            nativeOn: {
              click (e) {
                e.stopPropagation()
                e.target.parentNode.parentNode.style.display = 'none'
                if (self.currentTab === 'project') self.currentTab = self.name
              }
            }
          })
        ])
      },
      isCompanyVisible: false,
      company: null,
      companyLabel (h) {
        return h('div', [
          h('span', '客户'),
          h('Icon', {
            props: {
              type: 'ios-close-empty'
            },
            nativeOn: {
              click (e) {
                e.stopPropagation()
                e.target.parentNode.parentNode.style.display = 'none'
                if (self.currentTab === 'company') self.currentTab = self.name
              }
            }
          })
        ])
      },
      contact: null
    }
  },
  watch2: {
    async project (newValue, oldValue) {
      if (newValue === oldValue) return
      this.currentValue = newValue
      if (newValue) {
        if (!this.company || this.company._id !== newValue.company) {
          this.loading = true
          this.$Loading.start()
          this.currentData.company = newValue.company
          let company = await this.$store.dispatch('GET_COMPANY', newValue.company)
          if (company) {
            this.company = company
            this.currentData.companyName = company.name
          }
          this.loading = false
          this.$Loading.finish()
        }
      } else if (this.company) {
        this.company = null
        this.currentData.company = null
        this.currentData.companyName = null
      }
    }
  },
  methods: {
    handleProjectChange (val, name) {
      this.currentData.project = val
      this.currentData.projectName = name
      // this.$set(this.currentData, 'projectName', name)
    },
    async showProject () {
      let pid = this.currentData.project
      if (!pid) return
      if (!this.project || this.project._id !== pid) {
        this.loading = true
        this.$Loading.start()
        try {
          this.project = await this.$store.dispatch('GET_PROJECT', pid)
          let tabs = this.$refs.tabs
          tabs.$refs.nav.children[2].style.display = 'inline-block'
          this.isProjectVisible = true
          this.currentTab = 'project'
        } catch (err) {
          this.$emit('error', err)
          let res = err.response
          this.$Message.error(res && res.data && res.data.error || err.message || err.toString())
        }
        this.loading = false
        this.$Loading.finish()
      }
    },
    showCustomer () {
      let company = this.company
      if (!company) return
      let tabs = this.$refs.tabs
      tabs.$refs.nav.children[3].style.display = 'inline-block'
      this.isProjectVisible = true
      this.isCompanyVisible = true
      this.currentTab = 'company'
    },
    async handleContactChange (val, name) {
      this.currentData.contact = val
      this.currentData.contactName = name
      if (!this.contact || this.contact._id !== val) {
        this.loading = true
        this.$Loading.start()
        this.contact = await this.$store.dispatch('GET_CONTACT', val)
        this.loading = false
        this.$Loading.finish()
      }
      // this.$set(this.currentData, 'contact', name)
    }
  }
}
