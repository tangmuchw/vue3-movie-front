import axios from 'axios'
import store from './store/store'
import {
  SERVER_PARAM
} from './config/server.param'
import * as types from './store/types'
import router from './router'
import Qs from 'querystring'


axios.defaults.timeout = 10000
let apiConfig = SERVER_PARAM
let serverUrl = apiConfig.devConfig.serverApi
let serverPath = apiConfig.devConfig.basePath

let movieClient = axios.create({
  baseURL: serverUrl,
  headers: {
    'Access-Control-Allow-Origin':'*',    
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
  }
})

movieClient.defaults.params = {
  // 'channelId': serverConfig.channelId,
  // 'tenantId': serverConfig.tenantId,

}


class APIServer {
  constructor(path, client, store) {
    this.path = path
    this.axiosClient = client
    this.store = store
  }

  get(url, params = {}) {
    console.log(store)
    params.timestamp = new Date().getTime()
    params.userId = store.state.userInfo ? store.state.userInfo.id : -2
    let basePath = this.path
    console.log(basePath + url)

    return this.axiosClient.get(basePath + url, {
      params: params
    }).then(response => {
      console.table(response)
      return APIServer.responseHandle(response)
    }, error => {
      console.error(error)
      return Promise.reject(APIServer.generateErrorResponse(-1, '网络错误'))
    })
  }

  post(url, data, params = {}) {
    data.timestamp = new Date().getTime()
    data.userId = store.state.userInfo ? store.state.userInfo.id : -2
    let basePath = this.path
    return this.axiosClient.post(basePath + url, data, {
      params: params,
      transformRequest: [function (data) {
        data = Qs.stringify(data)
        return data
      }]
    }).then(response => {
      console.table(response)
      return APIServer.responseHandle(response)
    }, error => {
      console.error(error)
      return Promise.reject(APIServer.generateErrorResponse(-1, '网络错误'))
    })
  }

  static responseHandle(response) {
    switch (parseInt(response.status)) {
      case 200:
      return response.data
      default: return Promise.reject(APIServer.generateErrorResponse(parseInt(response.status), response.error))
    }
  }

  static generateErrorResponse(code, message) {
    return {
      code: code,
      message: message
    }
  }
}

let MovieServer = new APIServer(serverPath, movieClient, store)

export {
  MovieServer
}

export default axios
