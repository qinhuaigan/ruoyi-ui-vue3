<template>
  <div>
    <tableList :tableData="tableData" align="center" btnAlign="left" :btns="btns" :pageSize="queryParams.pageSize" :pageNum="queryParams.pageNum" :title="title" @pageChange="pageChange" @handClick="handClick" :total="100"></tableList>
  </div>
</template>

<script setup>
import tableList from "@/components/tableList";
import { reactive, ref } from "vue";
const proxy = {};
let tableData = ref([
  {
    status: "成功",
    fileUrl: "/aaa"
  }
]);

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10
})
const title = ref([
  {
    label: "图片",
    prop: "fileUrl",
    type: "image",
    width: "200px"
  },
  {
    label: "状态",
    prop: "status"
  }
]);
const btns = ref([
  {
    text: "添加",
    type: "primary",
    fun: "add"
  },
  {
    text: "删除",
    type: "danger",
    fun: "remove"
  }
]);

/**
 * 列表按钮点击事件映射
 * @param {string} fun 函数名
 */
function handClick(fun, data, index) {
  proxy[fun](data, index);
}

/**
 * 添加
 * @param {object} data 数据
 * @param {number} index 下标
 */
proxy.add = function (data, index) {};
function pageChange(pageNum, pageSize) {
}
</script>
<style scoped lang="scss"></style>
