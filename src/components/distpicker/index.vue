<template>
  <div class="w100">
    <el-cascader class="w100" v-model="distpickerModel" placeholder="请选择省市区" :options="distpickerData" :props="cascaderProps" @change="change" filterable />
  </div>
</template>

<script setup>
import provincesData from './json/provinces_cn.json'
import cityData from './json/cities_cn.json'
import areaData from './json/areas_cn.json'
import useGetGlobalProperties from '@/hooks/useGlobal' // 获取全局参数或方法
import { ref, toRaw } from 'vue'
const {} = useGetGlobalProperties() // 读取全局函数/参数
const cascaderProps = {
  label: 'name',
  value: 'code'
}
const emit = defineEmits(['change'])
const codeMap = {} // name 匹配 code
const props = defineProps({
  changeEvent: {
    type: String,
    default: ''
  },
  province: {
    type: String,
    default: null
  },
  city: {
    type: String,
    default: null
  },
  area: {
    type: String,
    default: null
  },
  provinceCode: {
    // 省 code 字段名
    type: String,
    default: 'provinceCode'
  },
  cityCode: {
    // 市 code 字段名
    type: String,
    default: 'cityCode'
  },
  areaCode: {
    // 区 code 字段名
    type: String,
    default: 'areaCode'
  }
})
const distpickerData = ref([])
const distpickerModel = ref([])
onMounted(() => {
  // 组件挂载
  initData()
})

/**
 * 转树形结构
 */
function toTree(data) {
  // 1.定义最外层的数组
  const tree = []
  // 2.定义一个空对象
  const otherObj = {}
  // 3.遍历数组内所有对象
  data.forEach(item => {
    // 3.1.给每个当前对象添加一个 children 属性, 以便存放子级对象
    item.children = []
    // 3.2 将当前对象的 id 作为键, 与当前对象自身形成键值对
    otherObj[item.code] = item
  })

  // 4.再次遍历数组内所有对象
  data.forEach(item => {
    // 4.1.判断每个当前对象的 pid, 如当前对象 pid 不为空, 则说明不是最上级的根对象
    if (item.parent_code !== '0') {
      // 4.3.利用当前对象的 otherObj[pid] 找到 otherObj[id] 中对应当前对象的父级对象, 将当前对象添加到其对应的父级对象的 children 属性中
      otherObj[item.parent_code].children.push(item)
    } else {
      // 4.3.当前对象 pid 如果为空, 则为树状结构的根对象
      tree.push(item)
    }
  })
  // 5.返回树状结构
  return tree
}

/**
 * change 事件
 */
function change(e) {
  const info = toRaw(distpickerModel.value)
  const data = {
    province: codeMap[info[0]],
    city: codeMap[info[1]],
    area: codeMap[info[2]]
  }
  data[props.provinceCode] = info[0]
  data[props.cityCode] = info[1]
  data[props.areaCode] = info[2]
  emit('change', data, props.changeEvent)
}

/**
 * 初始化 "省市区" 数据
 */
function initData() {
  const data = [...provincesData, ...cityData, ...areaData]
  data.forEach(item => {
    codeMap[item.code] = item.name
  })
  distpickerData.value = toTree(data)
}
</script>

<style lang="scss" scoped></style>
