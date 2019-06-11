// 处理时间格式（展示字段）
// 原格式为20190403152300 输出为2019-04-03 15:23:00
// 原格式为201904031523 输出为2019-04-03 15:23
// 原格式为20190403 输出为2019-04-03
export function timeFilter (time) {
  let res = time
  let length = time.length
  if (length === 12) {
    res = time.slice(0, 4) + '-' + time.slice(4, 6) + '-' + time.slice(6, 8) + ' ' + time.slice(8, 10) + ':' + time.slice(10, 12)
  } else if (length === 14) {
    res = time.slice(0, 4) + '-' + time.slice(4, 6) + '-' + time.slice(6, 8) + ' ' + time.slice(8, 10) + ':' + time.slice(10, 12) + ':' + time.slice(12, 14)
  } else if (length === 8) {
    res = time.slice(0, 4) + '-' + time.slice(4, 6) + '-' + time.slice(6, 8)
  }
  return res
}

// iview datetimerange 时间段格式处理（提交用）
// 原格式为['2019-04-03 15：20：00', '2019-04-03 15:34:23'] 输出为startTime: 20190403152000,endTime: 20190403153433
// 原格式为['2019-04-03', '2019-04-03'] 输出为startTime: 20190403000000, endTime: 20190403235959
export function startAndendTimeFilter (time) {
  // type = daterange datetimerange 值的长度不同，处理方式不同
  let start = time[0]
  let formatStart = ''
  if (start.length === 10) {
    formatStart = start.substring(0, 4) + start.substring(5, 7) + start.substring(8, 10) + '000000'
  } else if (start.length === 19) {
    formatStart = start.substring(0, 4) + start.substring(5, 7) + start.substring(8, 10) + start.substring(11, 13) + start.substring(14, 16) + start.substring(17, 19)
  }
  let end = time[1]
  let formatEnd = ''
  if (end.length === 10) {
    formatEnd = end.substring(0, 4) + end.substring(5, 7) + end.substring(8, 10) + '235959'
  } else if (end.length === 19) {
    formatEnd = end.substring(0, 4) + end.substring(5, 7) + end.substring(8, 10) + end.substring(11, 13) + end.substring(14, 16) + end.substring(17, 19)
  }
  return {
    'startTime': formatStart,
    'endTime': formatEnd
  }
}
// iview 时间处理 单个datetime
// 原格式2019-04-03 输出为20190403
export function startOrendTimeFilter (time) {
  return time.replace(/-/g, '')
}

// 获取今天0 明天1 昨天-1 ····
// 调用方式 GetDateStr(0) - 今天；GetDateStr(-1) - 昨天
// 输出格式为 20190404
export function GetDateStr (AddDayCount) {
  var dd = new Date()
  dd.setDate(dd.getDate() + AddDayCount) // 获取AddDayCount天后的日期
  var y = dd.getFullYear()
  if (y < 1900) y = y + 1900
  var m = dd.getMonth() + 1 // 获取当前月份的日期
  if (m < 10) m = '0' + m
  var d = dd.getDate()
  if (d < 10) d = '0' + d
  return y + '' + m + '' + d
}

// 数组对象 去重
// 参数 数组对象 去重依据（某个属性）
// 返回 去重后的数组对象
export function unique (arr, item) {
  const res = new Map()
  return arr.filter((arr) => !res.has(arr[item]) && res.set(arr[item], 1))
}

// 获取时间（时钟）
export function gettime () {
  var today = new Date()
  var hh = today.getHours()
  if (hh < 10) hh = '0' + hh
  var mm = today.getMinutes()
  if (mm < 10) mm = '0' + mm
  // var ss = today.getSeconds()
  // if (ss < 10) ss = '0' + ss
  let timeString = showLocale(today) + hh + ':' + mm
  return timeString
}
function showLocale (objD) {
  var str
  var yy = objD.getYear()
  if (yy < 1900) yy = yy + 1900
  var MM = objD.getMonth() + 1
  if (MM < 10) MM = '0' + MM
  var dd = objD.getDate()
  if (dd < 10) dd = '0' + dd
  // var ww = objD.getDay()
  // if (ww === 0) ww = '星期日'
  // if (ww === 1) ww = '星期一'
  // if (ww === 2) ww = '星期二'
  // if (ww === 3) ww = '星期三'
  // if (ww === 4) ww = '星期四'
  // if (ww === 5) ww = '星期五'
  // if (ww === 6) ww = '星期六'
  str = yy + '/' + MM + '/' + dd + ' '
  return (str)
}

/**
 * var regex1 = /\((.+?)\)/g;   // () 小括号
 * var regex2 = /\[(.+?)\]/g;   // [] 中括号
 * var regex3 = /\{(.+?)\}/g;  // {} 花括号，大括号
*/

/**
* 取出花括号内的内容 中英文同时检测
* @param text
* @param argus
* @returns boolean
*/
export function getBraceStrDev (text, argus) {
  let result = []
  if (isObjEmpty(text)) { return result }
  let regex = /\{(.+?)\}|{(.+?)}/g
  let options = text.match(regex)
  if (!isObjEmpty(options)) {
    options.forEach((option) => {
      if (!isObjEmpty(option)) {
        result.push(option.substring(1, option.length - 1))
      }
    })
  }
  let flag = 0
  if (result.length !== 0) {
    result.forEach((item) => {
      if (argus.indexOf(item) === -1) {
        flag += 1
      }
    })
  } else {
    return text
  }
  if (flag !== 0) {
    return false
  } else {
    return true
  }
}
/**
* 取出花括号内的内容 中英文同时检测
* @param text
* @returns []
*/
export function getBraceStr (text) {
  let result = []
  if (isObjEmpty(text)) { return result }
  let regex = /\{(.+?)\}|{(.+?)}/g
  let options = text.match(regex)
  if (!isObjEmpty(options)) {
    options.forEach((option) => {
      if (!isObjEmpty(option)) {
        result.push(option.substring(1, option.length - 1))
      }
    })
  }
  return result
}

/**
 * 取出中括号内的内容 中英文 中括号
 * @param text
 * @returns []
*/
export function getBracketStr (text) {
  let result = ''
  if (isObjEmpty(text)) { return result }
  let regex = /\[(.+?)\]|【(.+?)】/g
  let options = text.match(regex)
  if (!isObjEmpty(options)) {
    options.forEach((option) => {
      if (!isObjEmpty(option)) {
        result.push(option.substring(1, option.length - 1))
      }
    })
  }
  return result
}

/**
* 取出小括号内的内容 中英文同时检测
* @param text
* @returns []
*/
export function getParenthesesStr (text) {
  let result = []
  if (isObjEmpty(text)) { return result }
  let regex = /\((.+?)\)|（(.+?)）/g
  let options = text.match(regex)
  if (!isObjEmpty(options)) {
    options.forEach((option) => {
      if (!isObjEmpty(option)) {
        result.push(option.substring(1, option.length - 1))
      }
    })
  }
  return result
}

function isObjEmpty (obj) {
  for (var key in obj) {
    return false
  }
  return true
}

/**
 * 判断数组是否为空
 * @param {需要判断的数值} arr
 * @return boolean
*/
export function isEmptyArray (arr) {
  if (!isObjEmpty(arr) && arr.length !== 0) {
    return true
  } else {
    return false
  }
}
