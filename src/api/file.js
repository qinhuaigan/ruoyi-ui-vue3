import request from '@/utils/request'
import { showLoading, hideLoading } from '@/utils/tools'
const uploadUrl = import.meta.env.VITE_APP_FILE_UPLOAD

export function upload(files) {
  return new Promise(async resolve => {
    const total = []
    for (let i = 0; i < files.length; i++) {
      const data = new FormData()
      data.append('file', files[i])
      total.push(
        request({
          method: 'post',
          data,
          url: uploadUrl
        })
      )
    }
    showLoading()
    const result = await Promise.all(total)
    if (result) {
      const list = result.reduce((total, item) => {
        item.data.status = 'success'
        item.data.name = item.data.fileName
        if (item) {
          total.push(item.data)
        }
        return total
      }, [])
      resolve(list)
      hideLoading()
    } else {
      resolve(false)
      hideLoading()
    }
  })
}
