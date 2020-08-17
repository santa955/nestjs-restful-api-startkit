export const isObject = p => {
  return Object.prototype.toString.call(p) === '[object Object]'
}