<template>
  <div id="my-search">
    <div class="flex flex-wrap flex-grap">
      <div>
        <slot name="left"></slot>
      </div>
      <div class="flex flex-center" v-for="(item, i) in props.list" :key="i" :style="{ width: item.width }">
        <span class="fz14px mr10px" v-if="item.label">{{ item.label }}</span>
        <div class="flex-1">
          <el-select v-if="item.type === 'select'" v-model="models[i]" class="m-2" :placeholder="item.placeholder || '请选择'">
            <el-option v-for="obj in item.options" :key="obj.value" :label="obj.label" :value="obj.value" />
          </el-select>
          <el-date-picker
            :value-format="item.format"
            class="w100"
            v-else-if="item.type === 'date'"
            v-model="models[i]"
            :type="item.pickerType"
            :placeholder="item.placeholder || '请选择日期'"
            range-separator="-"
            :start-placeholder="item.startPlaceholder || '开始时间'"
            :end-placeholder="item.endPlaceholder || '结束时间'"
          />
          <el-input v-else class="w100" :type="item.type" v-model="models[i]" :placeholder="item.placeholder || '请输入内容'" />
        </div>
      </div>
      <div>
        <el-button icon="Search" type="primary" @click="search()">搜索</el-button>
        <el-button icon="Refresh" @click="reset()">重置</el-button>
      </div>
      <slot></slot>
      <div class="flex-1">
        <div class="fr">
          <slot name="right"></slot>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
/**
 * 组件说明
 * 接收参数：
 *    list: [{ // 组件列表
 *      label: '',
 *      type: 'input', // 类型：input, select, date, password
 *      width: '', // 宽度
 *      placeholder: '', // input, select 等组件的提示
 *      default: null, // 默认值
 *      options: [{ // select 组件的选项
 *        label: '', // 选项
 *        value: null // 选项值
 *      }],
 *      format: '' // date, time 组件的 value "格式化"
 *      pickerType: '', // date 组件的类型：date, daterange 等，可参考 element-plus 对应的 type
 *      startPlaceholder: '', // date 组件的 提示文字
 *      endPlaceholder: '' // date 组件的 提示文字
 *    }]
 * 组件事件：
 *    @search(models) // 搜索事件：models 为各组件的值
 */
import useGetGlobalProperties from '@/hooks/useGlobal' // 获取全局参数或方法
import { ref, toRaw } from 'vue'
const {} = useGetGlobalProperties() // 读取全局函数/参数
const emit = defineEmits(['search'])
const props = defineProps({
  list: {
    type: Array,
    default() {
      return []
    }
  }
})

// 初始化搜索框 v-model
const models = ref([])

/**
 * 重置
 */
function reset() {
  models.value = []
  search()
}

/**
 * 为 models 赋默认值
 */
function initData() {
  const list = toRaw(props.list)
  list.forEach((item, i) => {
    if (item.default !== undefined) {
      models.value[i] = item.default
    }
  })
}

onMounted(() => {
  // 组件挂载
  initData()
})

/**
 * 搜索
 */
function search() {
  const data = toRaw(models.value)
  emit('search', data)
}
</script>

<style lang="scss" scoped>
.flex-grap {
  gap: 10px;
  margin-left: -10px;
}
</style>
