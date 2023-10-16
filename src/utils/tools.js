import { ElLoading, ElMessage } from "element-plus";
const fileBase = import.meta.fileBase;
let loadingInstance = null;
/**
 * 获取文件完整路径
 * 拼接 fileBase 路径
 * @param {string} url 文件路径
 */
function getFilePath(url) {
  const reg = /^https?:\/\//;
  return reg.test(url) ? url : `${fileBase}${url}`;
}

/**
 * 深拷贝
 * @ 使用递归的方式实现数组、对象的深拷贝
 */
export function deepClone() {
  let objClone = Array.isArray(obj) ? [] : {};
  if (obj && typeof obj === "object") {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        // 判断ojb子元素是否为对象，如果是，递归复制
        if (obj[key] && typeof obj[key] === "object") {
          objClone[key] = this.deepClone(obj[key]);
        } else {
          // 如果不是，简单复制
          objClone[key] = obj[key];
        }
      }
    }
  }
  return objClone;
}

/**
 * 字符串转 base64
 */
export function encode(str) {
  // 对字符串进行编码
  const encode = encodeURI(str);
  // 对编码的字符串转化base64
  const base64 = btoa(encode);
  return base64;
}

/**
 * loading 方法
 * @param {string} msg 提示文字
 */
export function showLoading(msg = "请稍后...") {
  loadingInstance = ElLoading.service({
    fullscreen: true,
    background: "rgb(0, 0, 0, 0.7)",
    text: msg
  });
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

export default getFilePath
