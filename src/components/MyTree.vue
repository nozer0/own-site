<template>
  <div>
    <Tree ref="tree" :data="tree" :render="renderNode"></Tree>
    <Button size="small" icon="plus" :disabled="!addable" @click="append()">新增</Button>
    <Button @click="test"></Button>
    <Modal v-model="delModalVisible" title="删除部门" :loading="true" @on-ok="remove">
      是否确定删除 <b>{{ tobeDeleteNode && tobeDeleteNode.node.title }}</b> 及下属数据，该操作无法恢复?
    </Modal>
  </div>
</template>

<script>
const NODE = {
  title: '未命名',
  expand: false,
  selected: true
}

export default {
  props: {
    addable: {
      default: true
    },
    editable: {
      default: true
    },
    newNode: {
      default () {
        return NODE
      }
    },
    tree: {
      default () {
        return []
      }
    }
  },
  data () {
    return {
      disabled: false,
      delModalVisible: false,
      tobeDeleteNode: null,
      currentNodeParent: null,
      currentNode: null
    }
  },
  computed: {
  },
  watch: {
    tree (newValue, oldValue) {
      if (newValue !== oldValue) {
        newValue[0] && this.handleSelect(newValue[0])
      }
    }
  },
  methods: {
    test () {
      console.info(this.$store.state, this.tree, this)
    },
    renderNode (h, { root, node, data }) {
      let self = this
      return h('span', {
        attrs: { class: 'tree_node' }
      }, [
        h('span', {
          domProps: {
            className: 'tree_title ivu-tree-title ' + (data.selected ? 'ivu-tree-title-selected' : '')
          },
          on: {
            click () { self.handleSelect(data) }
          }
        }, data.title),
        h('ButtonGroup', {
          class: 'tree_node_btns',
          props: { size: 'small' }
        }, data.id && self.editable ? [
          h('Button', {
            props: {
              icon: 'ios-plus-empty'
            },
            on: {
              click () { self.append(data) }
            }
          }),
          h('Poptip', {
            props: {
              title: '是否确定删除*' + (self.tobeDeleteNode && self.tobeDeleteNode.node.title) + '*及下属数据，该操作无法恢复?',
              confirm: true,
              width: 240,
              placement: 'right'
            },
            on: {
              'on-ok' () { self.remove() }
            }
          }, [
            h('Button', {
              style: {
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0
              },
              props: {
                size: 'small',
                icon: 'ios-minus-empty'
              },
              on: {
                click () {
                  self.tobeDeleteNode = node
                }
              }
            })]
          )
        ] : [])
      ])
    },
    handleSelect (data) {
      let oldData = this.currentNode
      if (oldData === data) return
      if (!oldData || !data || oldData.parent !== data.parent || oldData.id !== data.id) {
        this.cancel(true)
        if (data) data.selected = true
        this.currentNode = data
        this.$emit('select', data)
      }
    },
    append (data) {
      if (!this.addable) return
      if (this.currentNodeParent === data && (!this.currentNode || !this.currentNode.id)) return
      // this.cancel(true)
      const child = {...this.newNode}
      if (data) {
        let children = data.children
        child.parent = data.id
        if (children) {
          children.push(child)
        } else {
          this.$set(data, 'children', [child])
        }
        data.expand = true
      } else {
        this.tree.push(child)
      }
      this.handleSelect(child)
      this.$emit('append', child, data)
      this.currentNodeParent = data
    },
    cancel (noNeedSelect) {
      const data = this.currentNode
      if (!data) return
      data.selected = false
      if (!data.id) {
        const parent = this.currentNodeParent
        if (parent) {
          let children = parent.children
          console.info('idned', children.indexOf(data))
          let i = children.indexOf(data)
          if (i !== -1) children.splice(i, 1)
          noNeedSelect || this.handleSelect(parent)
        } else {
          let tree = this.tree
          let i = tree.indexOf(data)
          if (i !== -1) tree.splice(i, 1)
          noNeedSelect || this.handleSelect(tree[0])
        }
      }
      this.$emit('cancel', data)
    },
    remove () {
      // this.delModalVisible = false
      if (!this.editable) return
      const node = this.tobeDeleteNode
      const data = node.node
      const parentKey = node.parent
      if (isNaN(parentKey)) {
        let tree = this.tree
        tree.splice(tree.indexOf(data), 1)
        this.handleSelect(tree[0])
      } else {
        const root = this.$refs.tree.flatState
        const parent = root.find(el => el.nodeKey === parentKey)
        const children = parent.node.children
        children.splice(children.indexOf(data), 1)
        this.handleSelect(parent.node)
      }
      this.$emit('remove', data)
    }
  }
}
</script>

<style>
.tree_node {
  display: inline-block;
  width: 100%;
  vertical-align: middle;
  padding: 2px 0;
}
.tree_title {
  display: block;
  margin-right: 70px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tree_node_btns {
  display: inline-block;
  position: absolute;
  right: 10px;
  top: 0;
}
</style>