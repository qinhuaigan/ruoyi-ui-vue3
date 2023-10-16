<template>
  <div>
    <myForm :list="list" ref="myFormRef"></myForm>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const proxy = {}
const list = [{
  label: '姓名',
  prop: 'name',
  type: 'input',
  required: true,
  span: 12
}, {
  label: '头像',
  prop: 'avatar',
  type: 'upload',
  multiple: false
}, {
  label: '性别',
  prop: 'sex',
  type: 'radio',
  required: true,
  default: 1,
  span: 12,
  options: [{
    label: '男',
    value: 1
  }, {
    label: '女',
    value: 2
  }, {
    label: '保密',
    value: 3
  }]
}, {
  label: '爱好',
  prop: 'hobby',
  type: 'checkbox',
  required: true,
  default: 1,
  options: [{
    label: '游泳',
    value: 1
  }, {
    label: '健身',
    value: 2
  }, {
    label: '听音乐',
    value: 3
  }, {
    label: '看电影',
    value: 4
  }, {
    label: '游戏',
    value: 5
  }]
}, {
  label: '学历',
  prop: 'degree',
  type: 'select',
  options: [{
    label: '专科',
    value: 1
  }, {
    label: '本科',
    value: 2
  }, {
    label: '研究生',
    value: 3
  }, {
    label: '博士',
    value: 4
  }]
}, {
  label: '简介',
  prop: 'introduce',
  type: 'textarea',
  rows: 5
}, {
  label: '年龄',
  prop: 'age',
  type: 'number'
}, {
  label: '生日',
  prop: 'birthday',
  type: 'date'
}, {
  label: '文件',
  prop: 'files',
  type: 'upload',
  multiple: true
}]

</script>
<style scoped lang="scss"></style>
