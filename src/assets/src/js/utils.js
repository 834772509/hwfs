import QrCreator from "qr-creator";

/**
 * 替换字符串
 * @param {String} str 字符串
 * @param {String} subStr 需要替换的字符串
 * @param {String} replacement 替换内容
 * @return {String}
 */
export function replaceString(str, subStr, replacement) {
  let result = str;
  while (result.indexOf(subStr) !== -1) {
    result = result.replace(subStr, replacement);
  }
  return result;
}

/**
 * 格式化时间
 * @param {Date} date 时间
 * @param {String} fmt 需要格式化的格式
 */
export function formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }
  let o = {
    "M+": date.getMonth() + 1,
    "d+": date.getDate(),
    "h+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds(),
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + "";
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? str : padLeftZero(str)
      );
    }
  }
  return fmt;
}

function padLeftZero(str) {
  return ("00" + str).substr(str.length);
}

/**
 * 格式化文件大小(单位：B)
 */
export function formatSize(fileSize) {
  if (!fileSize) return "";
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  if (fileSize == 0) return "0 Byte";
  const i = parseInt(Math.floor(Math.log(fileSize) / Math.log(1024)));
  return Math.round(fileSize / Math.pow(1024, i), 2) + " " + sizes[i];
}

/**
 * 格式化进度值
 * @param {Number} precent 当前进度
 * @returns 
 */
export function formatPercent(precent) {
  if (precent > 10) {
    return precent.toFixed(0) + "%";
  } else {
    return precent.toFixed(1) + "%";
  }
}

export function hasClass(obj, cls) {
  return obj.className.match(new RegExp("(\\s|^)" + cls + "(\\s|$)"));
}

/**
 * 增加样式
 * @param {Object} obj DOM对象
 * @param {String} cls 类名
 */
export function addClass(obj, cls) {
  if (!hasClass(obj, cls)) obj.className = (obj.className + " " + cls).trim();
}

/**
 * 移除样式
 * @param {Object} obj DOM对象
 * @param {String} cls 类名
 */
export function removeClass(obj, cls) {
  if (hasClass(obj, cls)) {
    let reg = new RegExp("(\\s|^)" + cls + "(\\s|$)");
    obj.className = obj.className.replace(reg, " ");
  }
}

/**
 * 切换样式
 * @param {Object} obj DOM对象
 * @param {String} cls 类名
 * @returns 增加样式则返回true，移除返回false
 */
export function toggleClass(obj, cls) {
  if (hasClass(obj, cls)) {
    removeClass(obj, cls);
    return false;
  } else {
    addClass(obj, cls);
    return true;
  }
}

/**
 * 处理防抖函数
 * @param {Function} func 防抖处理的函数
 * @param {Number} delay 防抖时间
 * @returns 防抖函数
 */
export function debounce(func, delay) {
  let timer = null;
  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

// 创建二维码
export function createQR(content, element) {
  QrCreator.render(
    {
      text: content,
      // 0.0 to 0.5
      radius: 0,
      // 辨识度 L, M, Q, H
      ecLevel: "H",
      // 二维码颜色
      fill: "#999999",
      // 背景颜色
      background: null,
      size: 180,
    },
    element
  );
}

/**
 * 获取URL上一级路径
 * @param {String} url URL
 * @returns url
 */
export function getUrlParent(url) {
  let newUrl = url.split("?")[0];
  if (!newUrl.endsWith("/")) newUrl += "/";
  let arrurl = newUrl.split("/");
  if (arrurl.length == 4) {
    return newUrl;
  }
  return arrurl.slice(0, arrurl.length - 2).join("/") + "/";
}

// 获取URL路径名称
export function getUrlName(url) {
  let newUrl = url.split("/");
  return newUrl.slice(-2, -1);
}
