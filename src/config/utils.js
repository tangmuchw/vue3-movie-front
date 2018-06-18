/* 定义公共的js方法 */
/**
 * 存储localStorage
 */
export const setStore = (name, content) => {
  if (!name) return
  if (typeof content !== 'string') {
    content = JSON.stringify(content)
  }
  window.localStorage.setItem(name, content)
}

// 格式化日期
export const formatDate = (date, pattern = 'yyyy-MM-dd hh:mm:ss') => {
  if (!date) return ''
  let o = {
    'y+': date.getFullYear(),
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S+': date.getMilliseconds() // 毫秒
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(pattern)) {
      if (k == 'y+') {
        pattern = pattern.replace(RegExp.$1, ('' + o[k]).substr(4 - RegExp.$1.length))
      } else if (k == 'S+') {
        let lens = RegExp.$1.length
        lens = lens == 1 ? 3 : lens
        pattern = pattern.replace(RegExp.$1, ('00' + o[k]).substr(('' + o[k]).length - 1, lens))
      } else {
        pattern = pattern.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
      }
    }
  }
  return pattern
}

// 密码合法性验证
export const isPasswordLegal = (password) => {
  if (!password) {
    return false
  }
  return password.length >= 8
}

export const isVerificationCodeLegal = (verificationCode) => {
  if (!verificationCode) {
    return false
  }
  return verificationCode.length >= 6
}

export const isMobileNumberLegal = (mobile) => {
  return mobile.length >= 11 && mobile.startsWith('1')
}

/**
 * 选座--格式化选座页面的日期(年和月：02.23）
 * @param date 标准日期格式 2018-02-23
 */
export const formatSeatDate = (date) => {
  if (date != '') {
    return date.substr(5, 2) + '.' + date.substr(8, 2)
  } else {
    return date
  }
}

/**
 * 得到当前日期为星期几
 * @param date 标准日期格式 2018-02-23
 */
export const getCurrentWeek = (date) => {
  let newDate = new Date(date)
  switch (newDate.getDay()) {
    case 0:
      return '周日'
    case 1:
      return '周一'
    case 2:
      return '周二'
    case 3:
      return '周三'
    case 4:
      return '周四'
    case 5:
      return '周五'
    case 6:
      return '周六'
  }
}

/**
 * 即将上映--格式化过滤器中的排期日期, 处理为：2018年01月 02月
 * @param date 标准日期格式 2018-02
 * @return Object { key: '2018-02-12', value: '02月'}
 */
export const disposeMonths = (date) => {
  let arrMonth = []
  if (date == '') {
    return arrMonth
  }
  arrMonth.push({
    key: 'all',
    value: '全部'
  })
  for (let [index, elem] of date.entries()) {
    // 处理如02单月前的'0'
    let newValue
    if (elem.substr(5, 1) == '0') {
      if (index == 0) {
        newValue = elem.substr(0, 4) + '年' + elem.substr(6, 1) + '月'
      } else {
        newValue = elem.substr(6, 1) + '月'
      }
    } else {
      newValue = elem.substr(5, 2) + '月'
    }
    arrMonth.push({
      key: elem,
      value: newValue
    })
  }
  return arrMonth
}

/**
 * 场次--处理影票上映时间，处理为：明天 11月28日 18:00
 * @param date 标准日期 2018-02-24 12:30:00
 * @return String
 */
export const disposeOrderPlayTime = (date) => {
  let playTime = ''
  if (date == '') {
    return playTime
  }
  // 获得当前时间
  let currentDate = new Date()
  let currentYear = currentDate.getFullYear()
  let currentMonth = currentDate.getMonth() + 1
  let currentDay = currentDate.getDate()

  let year = date.substr(0, 4)
  let month
  let day = date.substr(8, 2)
  let playDate = date.substr(5, 2) + '月' + date.substr(8, 2) + '日 ' + date.substr(11, 5)
  // 是当前年
  if (year == currentYear) {
    // 处理如02单月前的'0'
    month = date.substr(6, 1)
    if (month == currentMonth && day == currentDay) {
      playTime = '今天 ' + playDate
    } else if (month == currentMonth && day == currentDay + 1) {
      playTime = '明天 ' + playDate
    } else if (month == currentMonth && day == currentDay + 2) {
      playTime = '后天 ' + playDate
    } else {
      playTime = date.substr(5, 2) + '月' + date.substr(8, 2) + '日 ' + date.substr(11, 5)
    }
  }
  return playTime
}

/**
 * 确认订单--处理排期日期，处理为：显示今天明天后天以及月号，如今天02月12日
 * @param date 后台返回 [ { planCount: 7 , showDate: "2018-02-12"} ]
 * @return Object { key: '2018-02-12', value: '今天02月12号'}
 */
export const disposePlanDate = (date) => {
  let arrPlanDate = []
  // 获得当前时间
  let currentDate = new Date()
  let currentYear = currentDate.getFullYear()
  let currentMonth = currentDate.getMonth() + 1
  let currentDay = currentDate.getDate()
  if (date == '') {
    return arrPlanDate
  }
  for (let elem of date) {
    let newValue
    let planDate = elem.showDate
    let scheduleId = elem.planCount
    let year = planDate.substr(0, 4)
    let month
    let day = planDate.substr(8, 2)
    // 是当前年
    if (year == currentYear) {
      // 处理如02单月前的'0'
      month = planDate.substr(6, 1)
      if (month == currentMonth && day == currentDay) {
        newValue = '今天' + planDate.substr(5, 2) + '月' + planDate.substr(8, 2) + '日'
      } else if (month == currentMonth && day == currentDay + 1) {
        newValue = '明天' + planDate.substr(5, 2) + '月' + planDate.substr(8, 2) + '日'
      } else if (month == currentMonth && day == currentDay + 2) {
        newValue = '后天' + planDate.substr(5, 2) + '月' + planDate.substr(8, 2) + '日'
      } else {
        newValue = planDate.substr(5, 2) + '月' + planDate.substr(8, 2) + '日'
      }
    }
    arrPlanDate.push({
      key: planDate,
      value: newValue,
      scheduleId:scheduleId
    })
  }
  return arrPlanDate
}

/**
 * 确认订单--处理剩余支付时间，处理为：10:00
 * @param date 后台返回 时间戳
 * @param validTime 时间限制 例如：600000 默认为10分钟
 * @return String
 */
export const disposeResidualPayTime = (date, validTime = 600000) => {
  let residualPayTime = ''
  if (date == '') {
    return residualPayTime
  }
  // 获得当前时间
  let currentDate = new Date()
  let now = currentDate.getTime()
  // 设置截止时间
  let time = new Date(date)
  let endDate = time.setMinutes(time.getMinutes() + validTime / 60000)
  let end = new Date(endDate).getTime()
  // 时间差
  let mistiming = end - now
  // 保存倒计时的时间
  let residualMinute = ''
  let residualSecond = ''
  if (mistiming > 0) {
    residualMinute = Math.floor(mistiming / 1000 / 60 % 60)
    residualSecond = Math.floor(mistiming / 1000 % 60)
  }
  if (residualMinute < 10) {
    residualMinute = '0' + residualMinute
  }
  if (residualSecond < 10) {
    residualSecond = '0' + residualSecond
  }
  if (residualMinute == 0 && residualSecond == 0) {
    return '00:00'
  }
  return residualMinute + ':' + residualSecond
}

export const isWeixinBrowser = () => {
  return /micromessenger/.test(navigator.userAgent.toLowerCase())
}


/**
 * 处理城市列表
 * @param arrCityList
 * @return Array
 */
export const disposeCityList = (cityListFilter) => {
  if (cityListFilter == '') {
    return cityListFilter
  }
  let oldCityList = cityListFilter
  let newCityList = []
  // 构建字母项
  for (let i = 0; i < 26; i++) {
    let obj = {}
    obj.letter = String.fromCharCode((65 + i))
    obj.citylist = []
    newCityList.push(obj)
  }
  for (let i = 0; i < oldCityList.length; i++) {
    // 得到城市的第一个字母
    let letter = oldCityList[i].pinyin.charAt(0).toUpperCase()
    let _index = Number(letter.charCodeAt(0) - 65)
    //插入城市数据
    if (_index >= 0 && _index < 26) {
      newCityList[_index].citylist.push(oldCityList[i])
    }
  }
  // 如果newCityList中cityList中没有值的话，过滤这一项
  let showCityList = newCityList.filter(value => {
    let len = value.citylist.length
    return len > 0
  })
  return showCityList
}

/**
 * 判断Object是否为空
 * @param  Object
 * @return Boolean
 */
export const isEmptyObject = (obj) => {
  for (let key in obj) {
    return false
  }
  return true
}


export const getRequestFromSearch = () => {
  var url = location.search // 获取 url 中 "?" 符后的字串
  var theRequest = new Object()
  if (url.indexOf('?') != -1) {
    var str = url.substr(1)
    str = str.substring(0, str.length - 1)
    var strs = str.split('&')
    for (var i = 0; i < strs.length; i++) {
      theRequest[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1])
    }
  }
  return theRequest
}

export function TMap(key) {
  return new Promise(function (resolve, reject) {
    window.init = function () {
      resolve(qq)//注意这里
    }
    var script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = 'http://map.qq.com/api/js?v=2.exp&callback=init&key='+key
    script.onerror = reject
    document.head.appendChild(script)
  })
}


/**
 * 验证手机号
 * @param phoneNum
 * @return Boolean 正确返回true,错误返回false
 */

export const checkMobile = (phoneNum) => {
  var reg_phone = /^1[3|4|5|7|8][0-9]{9}$/;
   var regPhone = new RegExp(reg_phone);
   if (regPhone.test(phoneNum)) {
       return true;
   } else {
       return false;
   }
}