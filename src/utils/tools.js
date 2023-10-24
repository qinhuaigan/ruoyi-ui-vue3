import { ElLoading, ElMessage, ElMessageBox } from 'element-plus'
const fileBase = import.meta.fileBase
let loadingInstance = null
/**
 * 获取文件完整路径
 * 拼接 fileBase 路径
 * @param {string} url 文件路径
 */
export function getFilePath(url) {
  const reg = /^https?:\/\//
  return reg.test(url) ? url : `${fileBase}${url}`
}

/**
 * 深拷贝
 * @ 使用递归的方式实现数组、对象的深拷贝
 */
export function deepClone(obj) {
  let objClone = Array.isArray(obj) ? [] : {}
  if (obj && typeof obj === 'object') {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        // 判断ojb子元素是否为对象，如果是，递归复制
        if (obj[key] && typeof obj[key] === 'object') {
          objClone[key] = deepClone(obj[key])
        } else {
          // 如果不是，简单复制
          objClone[key] = obj[key]
        }
      }
    }
  }
  return objClone
}

/**
 * 秒数转化为天时分秒
 * @param {number | string} times 时间
 */
export function formatSeconds(times) {
  // const nowTime = new Date(); // 返回当前时间总毫秒数
  // const inputTime = new Date(time); // 返回用户输入的时间的毫秒数
  times = typeof times === 'string' ? parseFloat(times) : times
  times = times / 1000 // 返回剩余时间总的秒数

  let d = parseInt(times / 60 / 60 / 24) // 剩余天数
  // d = d < 10 ? '0' + d : d;
  let h = parseInt((times / 60 / 60) % 24) // 剩余小时数
  // h = h < 10 ? '0' + h : h;
  let m = parseInt((times / 60) % 60) // 剩余分钟数
  let s = parseInt(times % 60) // 剩余的秒
  // s = s < 10 ? '0' + s : s;
  // return "剩余" + d + '天' + h + '时' + m + '分' + s + '秒';
  return `${d ? d + '天' : ''}${h ? h + '时' : ''}${m ? m + '分' : ''}${s}秒`
}

export function numFormat(num) {
  num = num.toString().split('.') // 分隔小数点
  const arr = num[0].split('').reverse() // 转换成字符数组并且倒序排列
  let res = []
  for (var i = 0, len = arr.length; i < len; i++) {
    if (i % 3 === 0 && i !== 0) {
      res.push(',') // 添加分隔符
    }
    res.push(arr[i])
  }
  res.reverse() // 再次倒序成为正确的顺序
  if (num[1]) {
    // 如果有小数的话添加小数部分
    res = res.join('').concat('.' + num[1])
  } else {
    res = res.join('')
  }
  return res
}

// func 是事件处理程序，delay 是事件执行的延迟时间，单位：毫秒
export function debounce(func, delay) {
  let timer = null
  return function () {
    const that = this
    const args = arguments
    // 每次触发事件 都把定时器清掉重新计时
    clearTimeout(timer)
    timer = setTimeout(function () {
      // 执行事件处理程序
      func.call(that, args)
    }, delay)
  }
}

/**
 * 获取地址栏参数
 */
export function getQueryString(name) {
  let key = null
  let value = null
  let obj = {}
  let str = location.href // 取得整个地址栏
  let num = str.indexOf('?')
  str = str.substr(num + 1) // 取得所有参数   stringvar.substr(start [, length ]
  const arr = str.split('&') // 各个参数放到数组里
  for (let i = 0; i < arr.length; i++) {
    num = arr[i].indexOf('=')
    if (num > 0) {
      key = arr[i].substring(0, num)
      value = decodeURIComponent(arr[i].substr(num + 1))
      obj[key] = value
    }
  }
  return obj[name]
}

/**
 * 生成随机数
 */
export function randomNum(min, max) {
  // 随机生成一个数字
  return Math.round(Math.random() * (max - min)) + min
}

/**
 * 字符串转 base64
 */
export function encode(str) {
  // 对字符串进行编码
  const encode = encodeURI(str)
  // 对编码的字符串转化base64
  const base64 = btoa(encode)
  return base64
}

/**
 * loading 方法
 * @param {string} msg 提示文字
 */
export function showLoading(msg = '请稍后...') {
  loadingInstance = ElLoading.service({
    fullscreen: true,
    background: 'rgb(0, 0, 0, 0.7)',
    text: msg
  })
}
/**
 * 关闭 loading
 */
export function hideLoading() {
  loadingInstance && loadingInstance.close()
}

/**
 *
 * @param {string} message 消息内容
 * @param {string} type 提示类型：warning, success, info, error
 */
export function showMsg(message, type = 'warning') {
  ElMessage({
    message,
    type,
    grouping: true
  })
}

/**
 *
 * @param {string} title 标题
 * @param {*} msg
 * @returns
 */
export function confirmBox(msg, confirmText = '确定', cancelText = '取消', title = '系统提示') {
  return new Promise((resolve, reject) => {
    ElMessageBox.confirm(msg, title, {
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      type: 'warning'
    })
      .then(() => {
        resolve(true)
      })
      .catch(() => {
        reject(false)
      })
  })
}
