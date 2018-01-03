<template>
  <Row>
    <Col :xs="24" :sm="6">
      <Button @click="test"></Button>
      <MyTree ref="tree" :tree="groupTree" :addable="addable" :editable="editable" :disabled="!currentUser" @select="handleSelect" @remove="handleRemove"></MyTree>
    </Col>
    <Col :xs="24" :sm="18">
      <Card>
        <Group ref="group" :cancelable="true" :readonly="!currentData || !(currentData._id ? editable : addable)" :data="currentData" @save="handleSave" @cancel="handleCancel"></Group>
      </Card>
    </Col>
  </Row>
</template>

<script>
import MyTree from '@/components/MyTree.vue'
import Group from './id'

export default {
  components: { MyTree, Group },
  data () {
    return {
      readonly: false,
      loading: false,
      currentData: null,
      groupTree: this.getTree(this.$store.state.groups)
    }
  },
  computed: {
    currentUser () {
      return this.$store.state.currentUser
    },
    addable () {
      if (this.loading || this.readonly) return false
      let user = this.currentUser
      return user && user.role < 1
    },
    editable () {
      if (this.loading || this.readonly) return false
      let user = this.currentUser
      let data = this.currentData
      console.info('editable', user, data, 'id', data && data._id, 'role', user && user.role, user && user.isManager, 'group', user && user.group)
      return user && data && (user.role < 1 || user.isManager && (user.group === data.parent || user.group === data._id))
    }
  },
  watch: {
    currentUser (newValue, oldValue) {
      if (newValue && !oldValue) {
        this.fetchArray()
      }
    }
  },
  methods: {
    test () {
      let user = this.currentUser
      let data = this.currentData
      console.info(user, data, 'id', data && data._id, 'role', user && user.role, user && user.isManager, 'group', user && user.group)
      console.info(this, this.addable, this.editable)
    },
    async fetchArray () {
      if (!this.currentUser) return
      this.currentData = null
      let store = this.$store
      if (store.state.groups) {
        this.groupTree = this.getTree(store.state.groups)// getTreeNode(store.getters.groupTree)
      } else {
        this.loading = true
        this.$Loading.start()
        try {
          await store.dispatch('FETCH_GROUPS')
          this.groupTree = this.getTree(store.state.groups)
        } catch (err) {
          let res = err.response
          this.$Message.error(res && res.data && res.data.error || err.message || err.toString())
        }
        this.loading = false
        this.$Loading.finish()
      }
    },
    getTree (data) {
      if (!this.currentUser || !data) return []
      const nodes = []
      const tree = []
      for (let d of data) {
        let node = {
          d: d,
          id: d._id,
          title: d.name,
          expand: false,
          selected: false
        }
        nodes.push(node)
        let parent = d.parent
        if (parent) {
          let parentNode = nodes.find(g => g.id === parent)
          if (parentNode) {
            let children = parentNode.children
            if (children) {
              children.push(node)
            } else {
              parentNode.children = [node]
            }
          }
        } else {
          tree.push(node)
        }
      }
      return tree
    },
    // getTreeNode (data) {
    //   if (!data) return []
    //   const tree = []
    //   for (let d of data) {
    //     let node = {
    //       d: d,
    //       id: d._id,
    //       title: d.name,
    //       expand: false,
    //       selected: false
    //     }
    //     let groups = d.groups
    //     if (groups && groups.length) node.children = this.getTreeNode(groups)
    //     tree.push(node)
    //   }
    //   return tree
    // },
    handleSelect (data) {
      console.info('handleSelect', this.currentData, data)
      this.currentData = data && (data.d || { parent: data.parent })
    },
    async handleRemove (data) {
      if (!data || !this.editable) return
      const title = data.title
      const close = this.$Message.loading({
        content: '删除数据...',
        duration: 0
      })
      try {
        await this.$store.dispatch('DELETE_GROUP', data.id)
        this.$emit('remove', data)
        close()
        this.$Message.success(title + '删除成功!')
        this.$refs.tree.delModalVisible = false
      } catch (err) {
        this.$emit('error', err)
        close()
        this.$Message.error(title + '删除失败!', err)
        this.$refs.tree.delModalVisible = false
      }
    },
    handleSave (data) {
      const node = this.$refs.tree.currentNode
      node.d = data
      node.id = data._id
      node.title = data.name
    },
    handleCancel () {
      if (this.currentData && !this.currentData._id) this.$refs.tree.cancel()
    }
  },
  async created () {
    await this.fetchArray()
  }
}
</script>