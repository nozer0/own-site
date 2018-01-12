<template>
  <Form ref="form" :model="currentData" :rules="rules" :label-width="62">
    <Row>
      <Col :xs="12">
        <FormItem label="分类" prop="category">
          <Select size="small" v-model="currentData.category" :disabled="freezed">
            <Option v-for="(label, id) in CATEGORIES" :key="id" :label="label" :value="id"></Option>
          </Select>
        </FormItem>
      </Col>
      <Col :xs="12">
        <FormItem label="厂商" prop="vendor">
          <Select size="small" v-model="currentData.vendor" :disabled="freezed">
            <Option v-for="(label, id) in VENDORS" :key="id" :label="label" :value="id"></Option>
          </Select>
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col :xs="16" :sm="12">
        <FormItem label="型号" prop="model">
          <Input v-model="currentData.model" size="small" :disabled="freezed"></Input>
        </FormItem>
      </Col>
      <Col :xs="16" :sm="12">
        <FormItem label="名称">
          <Input v-model="currentData.name" size="small" :disabled="freezed"></Input>
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col :xs="12">
        <FormItem label="零售价" prop="retailPrice">
          <Input v-model.number="currentData.retailPrice" size="small" :disabled="freezed"><template slot="append">元</template></Input>
        </FormItem>
      </Col>
      <Col :xs="12">
        <FormItem label="集采价" prop="finalistPrice">
          <Input v-model.number="currentData.finalistPrice" size="small" :disabled="freezed"><template slot="append">元</template></Input>
        </FormItem>
      </Col>
    </Row>
    <FormItem label="参数">
      <Input v-model="currentData.parameter" type="textarea" :autosize="{minRows:2}" size="small" :disabled="freezed"></Input>
    </FormItem>
    <FormItem label="描述">
      <Input v-model="currentData.description" type="textarea" :autosize="{minRows:2}" size="small" :disabled="freezed"></Input>
    </FormItem>
    <FormItem label="备注">
      <Input v-model="currentData.note" type="textarea" :autosize="{minRows:2}" size="small" :disabled="freezed"></Input>
    </FormItem>
    <Row>
      <Col :xs="24" :sm="12">
        <FormItem label="创建">{{ createdBy }} ({{ currentData.createdAt | toDateString }})</FormItem>
      </Col>
      <Col :xs="24" :sm="12">
        <FormItem label="修改">{{ updatedBy }} ({{ currentData.updatedAt | toDateString }})</FormItem>
      </Col>
    </Row>
    <!-- <config-form :configs="configs"></config-form> -->
    <FormItem v-if="!disabled" :label-width="1" class="form-buttons">
      <Button type="primary" icon="android-done" size="small" :loading="loading" @click.stop.prevent="handleSave">确定</Button>
      <Button type="ghost" icon="refresh" size="small" @click.stop.prevent="handleReset">重置</Button>
      <Button v-if="cancelable" type="ghost" icon="close" size="small" @click.stop.prevent="handleCancel">取消</Button>
      <Button @click.stop.prevent="test"></Button>
    </FormItem>
  </Form>
</template>

<script>
import { toDateString } from '@/util'
import config from '@/store/config'
import mixin from '@/pages/mixin'
// import ConfigForm from '@/components/ConfigForm'

const { PRODUCT: { VENDORS, CATEGORIES } } = config

export default {
  mixins: [mixin],
  filters: { toDateString },
  data () {
    return {
      VENDORS,
      CATEGORIES,
      name: 'product',
      GET_ACTION: 'GET_PRODUCT',
      POST_ACTION: 'POST_PRODUCT'
    }
  },
  computed: {
    rules () {
      return {
        category: [
          { required: true, message: '请选择产品分类', trigger: 'change' }
        ],
        vendor: [
          { required: true, message: '请选择产品厂商', trigger: 'change' }
        ],
        model: [
          { required: true, message: '请输入产品型号', trigger: 'blur' }
        ],
        retailPrice: [
          { type: 'number', min: 0, message: '请输入有效价格', trigger: 'blur' }
        ],
        finalistPrice: [
          { type: 'number', min: 0, message: '请输入有效价格', trigger: 'blur' }
        ]
      }
    }
  }
}
</script>
