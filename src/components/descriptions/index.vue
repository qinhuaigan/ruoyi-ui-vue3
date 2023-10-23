<template>
  <div>
    <el-descriptions :title="title" :column="column" :size="size" :border="border">
      <el-descriptions-item :span="item.span" v-for="(item, i) in columnList" :key="i">
        <template #label>
          <el-icon class="icon">
            <component :is="item.icon"></component>
          </el-icon>
          <span class="">{{ item.label }}</span>
        </template>
        <div v-if="item.type === 'image'">
          <div class="" v-if="item.isArr">
            <el-image v-for="(img, j) in info[item.prop]" :key="j" :style="{ width: item.width || defaultWidth, height: item.height || defaultHeight }" :src="getFilePath(img)" fit="cover" />
          </div>
          <el-image v-else :style="{ width: item.width || defaultWidth, height: item.height || defaultHeight }" :src="getFilePath(info[item.prop])" fit="cover" />
        </div>
        <div v-else v-html="info[item.prop]"></div>
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script setup>
/**
 * 参数说明
 * size: 'default' // 组件大小，'large' | 'default' | 'small'
 * title: null // 标题
 * column: 3 // 列数
 * border: true, // 是否显示边框
 * columnList: [{
 *   label: '' // 列名
 *   prop: '' // 内容字段
 *   icon: null // 图标
 *   span: 1 // 所占列数
 *   type: 'text' // image, text
 *   isArr: false // 是否为数组，针对 type = image 时，该字段可能为数组
 * }] // 组件列数组
 * info: {} // 组件显示数据
*/
import useGetGlobalProperties from '@/hooks/useGlobal' // 获取全局参数或方法
const { getFilePath } = useGetGlobalProperties() // 读取全局函数/参数
const props = defineProps({
  size: {
    type: String,
    default: 'default' //  'large' | 'default' | 'small'
  },
  title: {
    // 标题
    type: String,
    default: ''
  },
  column: {
    // 列数
    type: Number,
    default: 3
  },
  border: {
    // 是否显示边框
    type: Boolean,
    default: true
  },
  columnList: {
    // 列表
    type: Array,
    default() {
      return []
    }
  },
  info: {
    type: Object,
    default() {
      return {}
    }
  }
})
const defaultWidth = '80px'
const defaultHeight = '80px'
onMounted(() => {
  // 组件挂载
})
</script>

<style lang="scss" scoped>
.icon {
  vertical-align: middle;
  margin-right: 5px;
}
</style>
