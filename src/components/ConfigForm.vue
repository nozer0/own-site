<template>
  <el-row>
    <el-col v-for="(cfg, model) in configs" :key="model" :xs="cfg.xs || 12" :sm="cfg.sm || 12">
      <el-form-item :label="cfg.label" :label-width="cfg.labelWidth || '60px'">
        <el-select v-if="cfg.type == 'select'" v-model="paras[model]" filterable>
          <el-option v-if="cfg.options && cfg.options.length" v-for="option in cfg.options" :key="option.value" :label="option.label" :value="option.value"></el-option>
        </el-select>
        <el-switch v-else-if="cfg.type == 'switch'" v-model="paras[model]" :on-text="cfg.onText" :off-text="cfg.offText"></el-switch>
        <el-input v-else v-model="paras[model]" :type="cfg.type"><template v-if="cfg.append" slot="append">{{ cfg.append }}</template></el-input>
      </el-form-item>
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: {
    'configs': {
      type: Object,
      default () {
        return {
          'para1': {
            label: '参数1',
            labelWidth: '60px',
            type: 'select',
            options: [
            { value: 'v1', label: 'lab1' },
            { value: 'v2', label: 'lab3' },
            { value: 'v3', label: 'lab3' }
            ]
          },
          'switch': {
            label: '开关',
            type: 'switch',
            onText: 'On',
            offText: 'Off',
            xs: 8,
            sm: 6
          },
          'ipt': {
            label: '参数2'
          },
          'ipt2': {
            label: '参数2',
            append: '人'
          },
          'para3': {
            label: '参数3',
            type: 'textarea',
            xs: 24,
            sm: 24
          }
        }
      }
    }
  },
  data () {
    return {
      paras: {}
    }
  }
}
</script>
