import axios from 'axios'
import Qs from 'qs'

// post请求时，参数以form-data形式提交
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

// 新建一个axios实例，通过配置该实例后用来发送请求
const instance = axios.create({
  baseURL: '',  // 接口的基础域名
  timeout: 60 * 1000,  //请求超时时间
  withCredentials: true  // CORS请求是否带上cookie，需要跟Access-Control-Allow-Origin配合使用
})

// 拦截实例请求，可在这里修改请求的配置
instance.interceptors.request.use(config => {
  /**
   * @param params 例如 { a:['b','c'] }
   * @returns 序列化后的参数
   * arrayFormat: 'indices'      =>    a[1]=b&&a[2]==c
   * arrayFormat: 'brackets'     =>    a[]=b&&a[]=c
   * arrayFormat: 'repeat'       =>    a=b&&a=c
   * arrayFormat: 'comma'        =>    a=b,c
   */
  let method = config.method.toUpperCase()

  // 将请求时的参数转换一下，主要是转换数组参数的格式
  if(method === 'GET') {
    config.paramsSerializer = (params) => {
      return Qs.stringify(params, { arrayFormat: 'repeat' })
    }
  } else if(method === 'POST') {
    config.transformRequest = (data) => {
      // 如果是有上传文件，需要改一下Content-Type头部，并修改参数格式为FormData形式
      // config.headers['Content-Type'] = 'multipart/form-data'
      return Qs.stringify(data, { arrayFormat: 'repeat' })
    }
  }
  return config
}, error => {
  return Promise.reject(error)
})

// 拦截响应，可在then接收数据之前修改响应内容
instance.interceptors.response.use(response => {
  // 可对状态码判断，在此处理异常情况
})

/**
 * 创建用于挂靠在vue上得get请求方法
 * @param  {[type]} url      请求地址
 * @param  {[type]} params   参数
 */
function createGet(url, params) {
  return instance.get(url, { params: params })
}

function createPost(url, params) {
  return instance.post(url, params)
}

const installer =  {
  install(Vue) {
    Object.defineProperties(Vue.prototype, {
      axios: {
        get() {
          return instance
        }
      },
      $http: {
        get() {
          return instance
        }
      },
    })
  }
}

export {
  installer as VueAxios,
  createGet as $get,
  createPost as $post
}
