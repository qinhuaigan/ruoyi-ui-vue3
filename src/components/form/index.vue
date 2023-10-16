<template>
  <div id="my-form">
    <el-form ref="formRef" :model="formData" label-width="auto" :rules="rules">
      <el-row :gutter="20">
        <el-col :span="item.span || 24" v-for="(item, i) in props.list" :key="i">
          <el-form-item :label="item.label" :prop="item.prop">
            <el-radio-group v-model="formData[item.prop]" v-if="item.type === 'radio'">
              <el-radio :label="option.value" v-for="(option, j) in item.options" :key="j">{{ option.label }}</el-radio>
            </el-radio-group>
            <el-checkbox-group v-model="formData[item.prop]" v-else-if="item.type === 'checkbox'">
              <el-checkbox :label="option.value" v-for="(option, j) in item.options" :key="j">{{ option.label }}</el-checkbox>
            </el-checkbox-group>
            <el-select class="w100" v-else-if="item.type === 'select'" v-model="formData[item.prop]" :placeholder="`请输入${item.label}`">
              <el-option v-for="(option, j) in item.options" :key="j" :label="option.label" :value="option.value" />
            </el-select>
            <el-input v-else-if="item.type === 'textarea'" v-model="formData[item.prop]" :autosize="{ minRows: item.rows, maxRows: 10 }" type="textarea" :placeholder="`请输入${item.label}`" />
            <el-input-number class="w100" v-else-if="item.type === 'number'" v-model="formData[item.prop]" :min="item.min" :max="item.max" />
            <el-date-picker
              class="w100"
              v-else-if="item.type === 'date'"
              v-model="formData[item.prop]"
              :type="item.pickerType"
              range-separator="-"
              :placeholder="item.placeholder || '请选择时间'"
              :start-placeholder="item.startPlaceholder || '开始时间'"
              :end-placeholder="item.endPlaceholder || '结束时间'"
            />
            <el-time-picker class="w100" v-else-if="item.type === 'time'" v-model="formData[item.prop]" :placeholder="item.placeholder || '请选择时间'" is-range range-separator="-" :start-placeholder="item.startPlaceholder || '开始时间'" :end-placeholder="item.endPlaceholder || '结束时间'" />
            <el-upload v-else-if="item.type === 'upload'" :ref="`upload_${item.prop}`" :file-list="fileList[item.prop]" class="upload-demo" :action="uploadUrl" :on-remove="handleRemove" list-type="picture">
              <el-button type="primary" size="small">选择文件</el-button>
            </el-upload>
            <el-input v-else v-model="formData[item.prop]" :placeholder="`请输入${item.label}`" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item>
            <div class="w100" :class="[`text-${props.btnPosition}`]">
              <el-button>{{props.cancelText}}</el-button>
              <el-button type="primary" @click="submit()">{{props.submitText}}</el-button>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script setup>
/**
 * 接收参数：
 *  list: [{ // 表单列表
 *    type: 'input' // input, upload, radio, checkbox, select, textarea, number, date, time
 *    label: '姓名' // 字段名
 *    prop: 'name' // 表单字段
 *    required: false, // 是否必填
 *    span: 24 // 栅格数
 *    multiple: false // 文件是否支持多选
 *    default: '' // 默认值
 *    options: [{ // select, radio, checkbox 组件的选项
 *      label: '' // 选项名称
 *      value: '' // 选项值
 *    }]
 *  }]
 * 
 * submitText: '确定' // 提交按钮文字
 * cancelText: '取消' // 取消按钮文字
 * 
 * 组件事件
 * @submit(data) {} // 提交事件，data 为表单内容
 * @cancel() {} // 取消事件
*/
import useGetGlobalProperties from '@/hooks/useGlobal' // 获取全局参数或方法
import { reactive, toRaw, ref } from 'vue'
const { uploadUrl } = useGetGlobalProperties() // 读取全局函数/参数
const props = defineProps({
  list: {
    type: Array,
    default() {
      return []
    }
  },
  btnPosition: {
    type: String,
    default: 'right'
  },
  hideBtn: {
    type: Boolean,
    default: false
  },
  submitText: {
    type: String,
    default: '确定'
  },
  cancelText: {
    type: String,
    default: '取消'
  }
})
const formData = reactive({})
const fileList = reactive({})
const emit = defineEmits(['cancel', 'submit'])
const formRef = ref(null)
const rules = reactive({})
/**
 * 初始化 "验证规则"
 */
function initRules() {
  const data = toRaw(props.list)
  for (let i = 0; i < data.length; i++) {
    const inputType = ['input', 'textarea']
    rules[data[i].prop] = [
      {
        trigger: ['blur', 'change'],
        required: data[i].required,
        message: inputType.includes(data[i].type) ? `请输入${data[i].label}` : `请选择${data[i].label}`
      }
    ]
  }
}

/**
 * 删除 "已上传" 文件
 * @param {object} file 文件
 * @param {array} fileList 文件列表
 */
function handleRemove(file, fileList) {}
/**
 * 表单提交
 *
 */
async function submit() {
  await formRef.value.validate()
  const data = toRaw(formData)
  emit('submit', data)
}

/**
 * 取消
 */
function cancel() {
  emit('cancel')
}

onMounted(() => {
  // 组件挂载
  initRules()
})
</script>

<style lang="scss" scoped>
:deep(.el-form-item__label) {
  font-weight: normal;
}
</style>
