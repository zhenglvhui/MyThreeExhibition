// 工具类

// 防抖
const debounce = function <A extends any[], R>(fn: (...args: A) => R, delay: number = 1000): (...args: A) => void {
  let timer: number | null = null;
  return function (this: void, ...args: A): void {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};

// 节流
const throttle = function <A extends any[], R>(fn: (...args: A) => R, delay: number = 1000): (...args: A) => void {
  let flag: boolean = true;
  return function (this: void, ...args: A): void {
    if (!flag) return;
    flag = false;
    setTimeout(() => {
      fn.apply(this, args);
      flag = true;
    }, delay);
  };
}

// 判断是否移动端
const isMobile = function (): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// 判断是否微信浏览器
const isWeixin = function (): boolean {
  return /MicroMessenger/i.test(navigator.userAgent);
};

export {
  debounce,
  throttle,
  isMobile,
  isWeixin,
};
