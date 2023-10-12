<template>
  <div id="tableList">
    <el-table :data="props.tableData" style="width: 100%">
      <el-table-column type="index" label="#" :align="align" />
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
          <div v-else v-html="scope.row[title.prop]" :style="color[scope.row.style ? scope.row.style[title.prop] : '']"></div>
        </template>
      </el-table-column>
      <el-table-column type="index" :width="btnsWidth" label="操作" :align="btnAlign || align" v-if="props.btns.length > 0">
        <template #default="scope">
          <div class="flex flex-wrap btns" v-if="!props.btnBlock">
            <div class="mr10px" v-for="(btn, i) in props.btns" :key="i">
              <el-button class="mt10px" :icon="btn.icon" size="small" :style="{ width: btn.width }" :type="btn.type" @click="handClick(btn, scope.row, scope.$index)">{{ btn.text }}</el-button>
            </div>
          </div>
          <div class="btns" v-else>
            <div class="mt10px" v-for="(btn, i) in props.btns" :key="i">
              <el-button :icon="btn.icon" size="small" :style="{ width: btn.width }" :type="btn.type" @click="handClick(btn, scope.row, scope.$index)">{{ btn.text }}</el-button>
            </div>
          </div>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="空数据" />
      </template>
    </el-table>
    <pagination v-if="props.showPage" :total="props.total" :limit="props.pageSize" :page="props.pageNum" @pagination="pageChange"></pagination>
  </div>
</template>

<script setup>
/**
 * tabel 组件
 * 接收参数：
 *    title：[{
 *      label: '标题名称'
 *      prop: 'status' // 显示字段
 *      width: '100px' // 列宽
 *    }] // 列表标题
 *
 *    tableData: [{
 *      status: '成功',
 *      style: { // 自定义样式，本组件已内置样式：success, fail, warning, info
 *        status: 'success' // 对应 title 中的 prop 字段
 *      }
 *    }] // 列表数据
 *
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
 */
import { watch } from "vue";
import useGetGlobalProperties from "@/hooks/useGlobal";
import pagination from "@/components/Pagination";
const { getFilePath } = useGetGlobalProperties();
const props = defineProps({
  tableData: {
    type: Array,
    default: () => {
      return [];
    }
  },
  title: {
    type: Array,
    default: () => {
      return [];
    }
  },
  pageNum: {
    type: Number,
    default: 1
  },
  align: {
    type: String,
    default: "left"
  },
  btns: {
    type: Array,
    default: () => {
      return [];
    }
  },
  btnsWidth: {
    type: String,
    default: "180px"
  },
  btnAlign: {
    type: String,
    default: "left"
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
});
const color = reactive({
  success: "color:#67C23A;",
  fail: "color:#F56C6C;",
  warning: "color:#E6A23C;",
  info: "color:#909399;"
});

const emit = defineEmits(["handClick", "pageChange"]);

onMounted(() => {
  // 组件挂载
});

watch(
  () => props.tableData,
  (val, oldVal) => {
    tableChange();
  }
);

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
  emit("handClick", btn.fun, data, index);
}

/**
 * 分页变化
 * @param {number} param0.page 当前页
 * @param {number} param0.limit 分页条数
*/
function pageChange({page, limit}) {
  emit('pageChange', page, limit)
}
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
