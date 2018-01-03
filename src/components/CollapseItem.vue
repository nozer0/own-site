<template>
  <div class="el-collapse-item" :class="{'is-active': isActive}">
    <div class="el-collapse-item__header">
      <span @click="handleHeaderClick($event)">
        <i class="el-collapse-item__header__arrow el-icon-arrow-right"></i>
        <slot name="title">{{title}}</slot>
      </span>
      <slot name="append"></slot>
    </div>
    <el-collapse-transition>
      <div class="el-collapse-item__wrap" v-show="isActive">
        <div class="el-collapse-item__content">
          <slot></slot>
        </div>
      </div>
    </el-collapse-transition>
  </div>
</template>
<script>
  import ElCollapseTransition from 'element-ui/src/transitions/collapse-transition'
  import Emitter from 'element-ui/src/mixins/emitter'
  export default {
    name: 'ElCollapseItem',
    componentName: 'ElCollapseItem',
    mixins: [Emitter],
    components: { ElCollapseTransition },
    data () {
      return {
        contentWrapStyle: {
          height: 'auto',
          display: 'block'
        },
        contentHeight: 0
      }
    },
    props: {
      title: String,
      name: {
        type: [String, Number],
        default () {
          return this._uid
        }
      }
    },
    computed: {
      isActive () {
        return this.$parent.activeNames.indexOf(this.name) > -1
      }
    },
    watch: {
      'isActive' (value) {
      }
    },
    methods: {
      handleHeaderClick ($event) {
        this.dispatch('ElCollapse', 'item-click', [this, $event])
      }
    },
    mounted () {
    }
  }
</script>