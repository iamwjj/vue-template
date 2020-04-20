/**
 * 将axio封装好的http方法
 */
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
   * arrayFormat: 'repeat'       =>    a=b&&a=c
   */
  let method = config.method.toUpperCase()

  // 将请求时的参数转换一下，主要是转换数组参数的格式
  if(method === 'GET') {
    config.paramsSerializer = (params) => {
      return Qs.stringify(params, { arrayFormat: 'repeat' })
    }
  } else if(method === 'POST') {
    config.transformRequest = (data) => {
      if(data && data.file) {
        config.headers['Content-Type'] = 'multipart/form-data'
        // 删除file标记属性
        delete data.file
        // 将参数转换为formData格式
        let formData = new FormData()
        for(let key in data) {
          if(Array.isArray(data[key])) {
            for(let item of data[key]) {
              formData.append(key, item)
            }
          } else {
            formData.append(key, data[key])
          }
        }
        return formData
      } else {
        return Qs.stringify(data, { arrayFormat: 'repeat' })
      }
    }
  }

  return config
}, error => {
  return Promise.reject(error)
})

// 拦截响应，可在then接收数据之前修改响应内容
instance.interceptors.response.use(response => {
  let c = response.data.c
  let m = response.data.m
  switch (c) {
    case 0:
      return response.data.d
    case 302:
      location.href = response.data.d
      return Promise.reject(m)
    default:
      return Promise.reject(response.data)
  }
})

// 创建一个用来请求easy-mock的axios实例
const mock = axios.create({
  baseURL: 'https://easy-mock.com/mock/5b27e843555eff092b541ba4',
  timeout: 6 * 1000
})

// mock.interceptors.response.use(response => response.data);
mock.interceptors.response.use(response => {
  return response.data.d
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

Object.defineProperties(Vue.prototype, {
  $get: {
    get() {
      return createGet
    }
  },

  $post: {
    get() {
      return createPost
    }
  },

  $http: {
    get() {
      return instance
    }
  },

  $axios: {
    get() {
      return axios
    }
  },

  $mock: {
    get() {
      return mock
    }
  }
})

export const $get = createGet

export const $post = createPost
