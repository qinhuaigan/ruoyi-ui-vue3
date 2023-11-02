import * as echarts from 'echarts'

/**
 * 初始化 echarts 图表
 * @param {string} id 容器 id
 * @param {object} options 设置项
 */
export default function initCharts(id, options) {
  const dom = document.getElementById(id)
  let chart = echarts.getInstanceByDom(dom)
  if (!chart) {
    chart = echarts.init(dom)
  }
  chart.setOption(options)
}