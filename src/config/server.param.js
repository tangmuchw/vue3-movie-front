/**
 * 访问服务器端，参数配置(node)
 */
'use strict'

export const SERVER_PARAM = {
  // 当前生产/开发环境
  devConfig: {
    serverApi: 'http://localhost:3000/',
    timeout: 10 ,
    basePath: 'front/'
  },
  proConfig: {
    serverApi: '',
    timeout: 10
  }
}
