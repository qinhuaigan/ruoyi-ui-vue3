<template>
  <div id="tableList">
    <el-table ref="myTableRef" :data="props.tableData" style="width: 100%" @select="selectChange" @select-all="selectChange">
      <el-table-column v-if="multiple" type="selection" width="55" />
      <el-table-column v-if="!hideIndex" type="index" label="#" :align="align" />
      <el-table-column :align="title.align || align" :label="title.label" v-for="(title, i) in props.title" :width="title.width" :key="i">
        <template #default="scope">
          <el-image fit="cover" style="width: 100%; height: 80px" :src="getFilePath(scope.row[title.prop])" v-if="title.type === 'image'">
            <template #error>
              <div class="image-slot">
                <el-icon>
                  <Picture />
                </el-icon>
              </div>
            </template>
          </el-image>
          <div v-else-if="showAll" v-html="scope.row[title.prop]" :style="color[scope.row.style ? scope.row.style[title.prop] : '']"></div>
          <el-tooltip raw-content v-else class="box-item" effect="dark" :content="scope.row[title.prop]" placement="top-start">
            <div class="overHide" v-html="scope.row[title.prop]" :style="color[scope.row.style ? scope.row.style[title.prop] : '']"></div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column type="index" :width="btnsWidth" label="操作" :align="btnAlign || align" v-if="props.btns.length > 0">
        <template #default="scope">
          <div class="flex flex-wrap btns" v-if="!props.btnBlock">
            <div class="mr10px mt10px" v-for="(btn, i) in props.btns" :key="i">
              <el-tooltip class="box-item" v-if="showBtn(scope.row, btn)" effect="dark" :content="btn.tooltip || btn.text">
                <el-button :icon="btn.icon" :link="btn.link" :size="btn.size || 'small'" :style="{ width: btn.width }" :type="btn.type" @click="handClick(btn, scope.row, scope.$index)">{{ btn.text }}</el-button>
              </el-tooltip>
            </div>
          </div>
          <div class="btns" v-else>
            <div class="mt10px" v-for="(btn, i) in props.btns" :key="i">
              <el-tooltip class="box-item" v-if="showBtn(scope.row, btn)" effect="dark" :content="btn.tooltip || btn.text">
                <el-button :icon="btn.icon" :link="btn.link" :size="btn.size || 'small'" :style="{ width: btn.width }" :type="btn.type" @click="handClick(btn, scope.row, scope.$index)">{{ btn.text }}</el-button>
              </el-tooltip>
            </div>
          </div>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="空数据" />
      </template>
    </el-table>
    <pagination v-if="showPage" :total="queryParams.total" v-model:page="queryParams.page" v-model:limit="queryParams.limit" @pagination="pageChange" />
  </div>
</template>

<script setup>
/**
 * tabel 组件，默认列超出内容用 ... 代替
 * 接收参数：
 *    title：[{
 *      label: '标题名称'
 *      prop: 'status' // 显示字段
 *      width: '100px' // 列宽
 *    }] // 列表标题
 *
 *    tableData: [{
 *      status: '成功',
 *      hiddenBtns: [], // 隐藏的按钮组，通过 text 和 tooltip 字段匹配
 *      style: { // 自定义样式，本组件已内置样式：success, fail, warning, info
 *        status: 'success' // 对应 title 中的 prop 字段
 *      }
 *    }] // 列表数据
 *    multiple: false, // 是否显示多选
 *    hideIndex: false, // 是否隐藏序号
 *    showAll: false, // 列超出内容是否换行显示
 *    pageNum: 1 // 当前页
 *    total: 0 // 列表数据总条数
 *    pageSize: 10 // 每页显示条数
 *    align: 'center' // 内容对齐方式：left, center, right
 *    btns: [{ // 列表按钮组
 *      text: '添加', // 按钮名称
 *      fun: 'add' //方法，父组件声明该方法，并声明 handClick 映射函数，由于 vue3 没有 this 指向，为了方便调用方法，可在组件定义一个 proxy 对象
 *                 // 将函数绑定在 proxy 上
 *      // handClick 映射函数示例 function handClick(fun) { proxy[fun](); }
 *      width: '', // 按钮宽度，非必填
 *      type: '' 按钮类型，对应 element-plus 的类型：primary, warning, error, info, text 等
 *    }]
 *    btnsWidth: '150px' // 按钮列宽
 *    btnAlign: 'left' // 按钮列对齐方式：left, center, right
 *    btnBlock: false // 每个按钮是否独占一行
 *    showPage: false // 是否显示分页组件
 * 组件事件
 * @pageChange(pageNum, pageSize) // 切换分页，pageNum：当前页；pageSize：每页条数
 * @select(selection, row) // 表格选中事件，selection：当前 table 选中的数据集合, row：触发选中事件的 "数据项"
 */
import { getCurrentInstance, reactive, ref, toRaw, toRefs, watch } from 'vue'
import useGetGlobalProperties from '@/hooks/useGlobal'
// import pagination from "@/components/Pagination";
const { getFilePath } = useGetGlobalProperties()
const props = defineProps({
  multiple: {
    type: Boolean,
    default: false
  },
  hideIndex: {
    type: Boolean,
    default: false
  },
  showAll: {
    type: Boolean,
    default: false
  },
  tableData: {
    type: Array,
    default: () => {
      return []
    }
  },
  title: {
    type: Array,
    default: () => {
      return []
    }
  },
  pageNum: {
    type: Number,
    default: 1
  },
  align: {
    type: String,
    default: 'left'
  },
  btns: {
    type: Array,
    default: () => {
      return []
    }
  },
  btnsWidth: {
    type: String,
    default: '180px'
  },
  btnAlign: {
    type: String,
    default: 'left'
  },
  btnBlock: {
    type: Boolean,
    default: false
  },
  showPage: {
    type: Boolean,
    default: true
  },
  total: {
    type: Number,
    default: 0
  },
  pageSize: {
    type: Number,
    default: 10
  }
})
const color = reactive({
  success: 'color:#67C23A;',
  fail: 'color:#F56C6C;',
  warning: 'color:#E6A23C;',
  info: 'color:#909399;'
})
const queryParams = reactive({
  page: props.pageNum,
  limit: props.pageSize,
  total: props.total
})
const { proxy } = getCurrentInstance()
const emit = defineEmits(['handClick', 'pageChange', 'select'])

onMounted(() => {
  // 组件挂载
})

watch(
  () => props.total,
  val => {
    queryParams.total = val
  }
)

watch(
  () => props.pageSize,
  val => {
    queryParams.limit = val
  }
)

watch(
  () => props.pageNum,
  val => {
    queryParams.page = val
  }
)

watch(
  () => props.tableData,
  (val, oldVal) => {
    tableChange()
  }
)

/**
 * 是否显示操作按钮，单条数据的各按钮显示设置
 * @param {object} row 数据
 * @param {object} btn 按钮信息
*/
function showBtn(row, btn) {
  const data = toRaw(row)
  const result = !data.hiddenBtns || (!data.hiddenBtns.includes(btn.text) && !data.hiddenBtns.includes(btn.tooltip))
  return result
}

/**
 * 表格选择变化
 * @param {array} selection table 当前选中的数据集合
 * @param {array} row 当前选中的行
 */
function selectChange(selection, row) {
  const arr = selection.reduce((total, item) => {
    total.push(toRaw(item))
    return total
  }, [])
  const data = toRaw(row)
  emit('select', arr, data)
}

/**
 * 获取 table 当前选中的数据集合
 */
function getSelectData() {
  const selection = proxy.$refs.myTableRef.getSelectionRows()
  const arr = selection.reduce((total, item) => {
    total.push(toRaw(item))
    return total
  }, [])
  return arr
}

/**
 * 表单内容更新
 * */
function tableChange() {}

/**
 * 按钮点击
 * @param {object} btn 按钮信息
 * @param {object} data 数据
 * @param {number} index 下标
 */
function handClick(btn, data, index, scope) {
  emit('handClick', btn.fun, data, index)
}

/**
 * 分页变化
 * @param {number} param0.page 当前页
 * @param {number} param0.limit 分页条数
 */
function pageChange({ page, limit }) {
  emit('pageChange', page, limit)
}

defineExpose({
  getSelectData
})
</script>
<style lang="scss" scoped>
.btns {
  margin-top: -10px;
}

.mt10px {
  margin-top: 10px;
}

.image-slot {
  position: absolute;
  display: inline-block;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>

<style lang="scss">
#tableList {
  .el-image__wrapper {
    background-color: #eee;
  }
}
</style>
