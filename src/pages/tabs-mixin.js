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
      isCustomerVisible: false,
      customer: null,
      customerLabel (h) {
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
                if (self.currentTab === 'customer') self.currentTab = self.name
              }
            }
          })
        ])
      },
      contact: null
    }
  },
  watch: {
    async project (newValue, oldValue) {
      if (newValue === oldValue) return
      this.currentValue = newValue
      if (newValue) {
        if (!this.customer || this.customer._id !== newValue.customerId) {
          this.loading = true
          this.$Loading.start()
          this.currentData.customerId = newValue.customerId
          let customer = await this.$store.dispatch('GET_COMPANY', newValue.customerId)
          if (customer) {
            this.customer = customer
            this.currentData.customerName = customer.name
          }
          this.loading = false
          this.$Loading.finish()
        }
      } else if (this.customer) {
        this.customer = null
        this.currentData.customerId = null
        this.currentData.customerName = null
      }
    }
  },
  methods: {
    async handleProjectChange (val, name) {
      console.info('handleProjectChange', val, name)
      this.currentData.projectId = val
      this.currentData.projectName = name
      // this.$set(this.currentData, 'projectName', name)
      if (!this.project || this.project._id !== val) {
        this.loading = true
        this.$Loading.start()
        this.project = await this.$store.dispatch('GET_PROJECT', val)
        this.loading = false
        this.$Loading.finish()
      }
    },
    showProject () {
      let pid = this.currentData.projectId
      if (!pid) return
      let tabs = this.$refs.tabs
      tabs.$refs.nav.children[2].style.display = 'inline-block'
      this.isProjectVisible = true
      this.currentTab = 'project'
    },
    showCustomer () {
      let customer = this.customer
      if (!customer) return
      let tabs = this.$refs.tabs
      tabs.$refs.nav.children[3].style.display = 'inline-block'
      this.isProjectVisible = true
      this.isCustomerVisible = true
      this.currentTab = 'customer'
    },
    async handleContactChange (val, name) {
      this.currentData.contactId = val
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
