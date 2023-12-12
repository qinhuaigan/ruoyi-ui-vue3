<template>
  <div id="my-form">
    <!-- <input v-model="formData.companyName" /> -->
    <el-form ref="formRef" :model="formData" :disabled="disabled" :label-width="labelWidth" :rules="rules">
      <el-row :gutter="20">
        <el-col :span="item.span || 24" v-for="(item, i) in props.list" :key="i">
          <el-form-item :label="item.label" :prop="item.prop" @change="formChange(item.onChange, formData[item.prop])">
            <el-radio-group v-model="formData[item.prop]" v-if="item.type === 'radio'">
              <el-radio :label="option.value" v-for="(option, j) in item.options" :key="j">{{ option.label }}</el-radio>
            </el-radio-group>
            <el-checkbox-group @change="formChange(item.onChange, formData[item.prop])" v-model="formData[item.prop]" v-else-if="item.type === 'checkbox'">
              <el-checkbox :label="option.value" v-for="(option, j) in item.options" :key="j">{{ option.label }}</el-checkbox>
            </el-checkbox-group>
            <el-select @change="formChange(item.onChange, formData[item.prop])" class="w100" v-else-if="item.type === 'select'" v-model="formData[item.prop]" :placeholder="`请输入${item.label}`">
              <el-option v-for="(option, j) in item.options" :key="j" :label="option.label" :value="option.value" />
            </el-select>
            <el-input @change="formChange(item.onChange, formData[item.prop])" v-else-if="item.type === 'textarea'" v-model="formData[item.prop]" :autosize="{ minRows: item.rows || 3, maxRows: 10 }" type="textarea" :placeholder="`请输入${item.label}`" />
            <el-input-number @change="formChange(item.onChange, formData[item.prop])" class="w100" v-else-if="item.type === 'number'" v-model="formData[item.prop]" :min="item.min" :max="item.max" />
            <el-date-picker
              @change="formChange(item.onChange, formData[item.prop])"
              :value-format="item.format"
              class="w100"
              v-else-if="item.type === 'date'"
              v-model="formData[item.prop]"
              :type="item.pickerType"
              range-separator="-"
              :placeholder="item.placeholder || '请选择时间'"
              :start-placeholder="item.startPlaceholder || '开始时间'"
              :end-placeholder="item.endPlaceholder || '结束时间'"
            />
            <el-time-picker
              @change="formChange(item.onChange, formData[item.prop])"
              :value-format="item.format"
              class="w100"
              v-else-if="item.type === 'time'"
              v-model="formData[item.prop]"
              :placeholder="item.placeholder || '请选择时间'"
              is-range
              range-separator="-"
              :start-placeholder="item.startPlaceholder || '开始时间'"
              :end-placeholder="item.endPlaceholder || '结束时间'"
            />
            <distpicker ref="distpickerRef" :changeEvent="item.onChange" :provinceCode="item.provinceCode" :cityCode="item.cityCode" :areaCode="item.areaCode" @change="distpickerChange" v-else-if="item.type === 'address'"></distpicker>
            <el-upload
              v-else-if="item.type === 'upload'"
              :limit="item.multiple ? item.limit : 1"
              :accept="item.accept"
              :auto-upload="false"
              :file-list="fileList[item.prop]"
              :ref="`upload_${item.prop}`"
              :on-exceed="onExcees"
              :on-change="selectFileCallBack"
              :on-remove="removeFile"
              list-type="picture"
            >
              <el-button type="primary" size="small" @click="selectFile(item.prop, item.multiple)">选择文件</el-button>
            </el-upload>
            <el-input @change="formChange(item.onChange, formData[item.prop])" v-else-if="item.type === 'password'" type="password" show-password v-model="formData[item.prop]" :placeholder="`请输入${item.label}`" />
            <el-input @change="formChange(item.onChange, formData[item.prop])" v-else v-model="formData[item.prop]" :placeholder="`请输入${item.label}`" />
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="showBtn">
          <el-form-item>
            <div class="w100" :class="[`text-${props.btnPosition}`]">
              <el-button>{{ props.cancelText }}</el-button>
              <el-button type="primary" @click="submit()">{{ props.submitText }}</el-button>
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
 *    type: 'input' // input, upload, radio, checkbox, select, textarea, number, date, time, address
 *    label: '姓名' // 字段名
 *    prop: 'name' // 表单字段
 *    required: false, // 是否必填
 *    span: 24 // 栅格数
 *    multiple: false // 文件是否支持多选
 *    limit: null, // 文件个数限制
 *    default: '' // 默认值
 *    provinceCode: 'provinceCode', // address 组件的省 "code" 字段名称（映射）
 *    cityCode: 'cityId', // address 组件的市 "code" 字段名称（映射）
 *    areaCode: 'areaId' // address 组件的区 "code" 字段名称（映射）
 *    options: [{ // select, radio, checkbox 组件的选项
 *      label: '' // 选项名称
 *      value: '' // 选项值
 *    }],
 *    onChange: '' // 表单数据更新时，映射父组件的函数名，父组件中，定义一个 change 映射函数，如：
 *              // handChange 映射函数示例 function handChange(fun, val, formdata) { proxy[fun](); }
 *              // fun：函数名；val 当前 form 表单项的值；formdata：表单所有数据
 *    rule: {
 *      type: '' // 类型：string, number, boolean
 *      validator: (rule: any, value: any, callback: any) => {
 *         if (false) {
 *            rule.message = '校验失败' // 校验不通过的提示文字设置
 *            callback(new Error('校验失败'))
 *          } else {
 *            callback() // 通过
 *          }
 *        } // 自定义校验函数
 *      }
 *  }]
 * labelWidth: 'auto',
 * disabled: false // 禁用表单
 * submitText: '确定' // 提交按钮文字
 * cancelText: '取消' // 取消按钮文字
 * showBtn: true // 是否显示 "取消/确定" 按钮
 * 组件事件
 * @submit(data) {} // 提交事件，data 为表单内容
 * @cancel() {} // 取消事件
 */
import { getToken } from '@/utils/auth'
import { upload } from '@/api/file'
import distpicker from '@/components/distpicker'
import useGetGlobalProperties from '@/hooks/useGlobal' // 获取全局参数或方法
import { reactive, toRaw, ref, getCurrentInstance, nextTick } from 'vue'
const { showMsg, getFilePath, deepClone } = useGetGlobalProperties() // 读取全局函数/参数
const props = defineProps({
  list: {
    type: Array,
    default() {
      return []
    }
  },
  labelWidth: {
    type: String,
    default: 'auto'
  },
  showBtn: {
    type: Boolean,
    default: true
  },
  disabled: {
    type: Boolean,
    default: false
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
let formData = ref({})
const fileList = reactive({})
const emit = defineEmits(['cancel', 'submit', 'getData', 'change'])
const formRef = ref(null)
const rules = reactive({})
const { proxy } = getCurrentInstance()
const token = `Bearer ${getToken()}`
let isMultiple = false // 是否多选文件
let uploadStr = null // 用于记录当前上传的文件，附属于 fromData 的哪个字段

/**
 * 表单内容变化
 * @param {string} fun 函数名称
 * @param {*} data 数据
 * @returns fun, formdata
 */
function formChange(fun, data) {
  if (fun) {
    emit('change', fun, data, toRaw(formData.value))
  }
}

/**
 * 初始化 "验证规则"
 */
function initRules() {
  const data = toRaw(props.list)
  const form = {}
  for (let i = 0; i < data.length; i++) {
    const inputType = ['input', 'textarea']
    // 获取组件初始化数据
    if (data[i].default) {
      form[data[i].prop] = data[i].default
    }
    rules[data[i].prop] = [
      {
        type: data[i].rule && data[i].rule.type ? data[i].rule.type : null,
        trigger: ['blur', 'change'],
        validator: data[i].rule && data[i].validator ? data[i].rule.validator : null,
        required: data[i].required,
        message: !data[i].rule || !data[i].rule.validator ? (inputType.includes(data[i].type) ? `请输入${data[i].label}` : `请选择${data[i].label}`) : '不符合验证规则'
      }
    ]
  }
  nextTick(() => {
    updateData({ ...toRaw(formData.value), ...form })
  })
}

/**
 * 文件上传数量超限
 */
function onExcees() {
  showMsg('已超出文件数量限制')
}

/**
 * 打开选择文件
 * @param {string} str 字段名
 */
function selectFile(str, multiple) {
  isMultiple = multiple
  uploadStr = str
  fileList[str] = fileList[str] || []
}

/**
 * 选择文件回调
 */
async function selectFileCallBack(file, files) {
  const result = await upload([file.raw])
  if (result) {
    updateFileData(result)
  }
}

/**
 * 删除文件
 */
function removeFile(file) {}

/**
 * 更新文件数组
 */
function updateFileData(files) {
  const newList = files.reduce((total, item) => {
    const obj = deepClone(item)
    obj.name = obj.url.split('/').pop()
    obj.url = getFilePath(obj.url)
    total.push(obj)
    return total
  }, [])
  fileList[uploadStr] = isMultiple ? [...fileList[uploadStr], ...newList] : newList
  formData.value[uploadStr] = isMultiple
    ? fileList[uploadStr].reduce((total, item) => {
        total.push(item.url)
        return total
      }, [])
    : files[0].url
}

/**
 * 表单提交
 *
 */
async function submit() {
  await proxy.$refs.formRef.validate()
  const data = toRaw(formData)
  emit('submit', data)
}

/**
 * address 组件 change 事件
 */
function distpickerChange(e, event) {
  let data = toRaw(formData.value)
  data = { ...data, ...e }
  formData.value = data
  formChange(event, e)
}

/**
 * 表单验证
 */
async function checkForm() {
  return new Promise(resolve => {
    proxy.$refs.formRef
      .validate()
      .then(() => {
        resolve(true)
      })
      .catch(() => {
        resolve(false)
      })
  })
}

/**
 * 返回表单数据
 * @returns 返回 Promise 对象，由于需要进行表单验证
 */
async function getData() {
  return new Promise(async resolve => {
    const result = await checkForm()
    if (result) {
      const data = toRaw(formData.value)
      resolve(data)
    } else {
      throw '表单验证不通过'
    }
  })
}

/**
 * 更新 form 表单数据
 * @param {object} data 表单数据
 */
function updateData(data) {
  formData.value = data
  updateFileList(data)
}

/**
 * 组件初始化时，根据 updateData() 接收的参数，将 fileList 对象初始化
 */
function updateFileList(data) {
  for (let i = 0; i < props.list.length; i++) {
    const item = props.list[i]
    const files = data[item.prop] || []
    if (item.type === 'upload' && item.multiple) {
      fileList[item.prop] = files.reduce((total, item) => {
        total.push({
          name: item.split('/').pop(),
          status: 'success',
          url: getFilePath(item),
          ossId: new Date().getTime() // 前端临时生成
        })
        return total
      }, [])
    } else if (item.type === 'upload' && files.length > 0) {
      fileList[item.prop] = [
        {
          name: files.split('/').pop(),
          status: 'success',
          url: getFilePath(files),
          ossId: new Date().getTime() // 前端临时生成
        }
      ]
    } else if (item.type === 'upload') {
      fileList[item.prop] = []
    }
  }
}

defineExpose({
  getData,
  updateData
})

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
