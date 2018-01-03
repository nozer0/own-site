export function toDateString (value) {
  return value ? new Date(value).toLocaleString() : new Date().toLocaleString()
}

export function compare (obj1, obj2) {
  if (obj1 === obj2) return true
  if (obj1 === undefined || obj1 === null) {
    return obj2 === undefined || obj2 === null || obj2 === '' || Array.isArray(obj2) && !obj2.length
  }
  if (Array.isArray(obj1)) {
    let l = obj1.length
    if (!l && obj2 === undefined) return true
    if (!Array.isArray(obj2)) return false
    if (l !== obj2.length) return false
    for (let i = 0; i < l; ++i) {
      if (!compare(obj1[i], obj2[i])) return false
    }
    return true
  }
  if (typeof obj1 === 'object') {
    if (typeof obj2 !== 'object') return false
    let keys = []
    for (let k in obj1) {
      keys.push(k)
      if (!compare(obj1[k], obj2[k])) return false
    }
    for (let k in obj2) {
      let v = obj2[k]
      if (v !== undefined && v !== '' && (!Array.isArray(v) || v.length) && !keys.includes(k)) return false
    }
    return true
  }
  return obj1 === '' && obj2 === undefined
}

var textContextSupport = !!document.createTextNode('test').textContent

export function fastInnerText (element, content) {
  var child = element.firstChild
  if (child && child.nodeType === 3 && child.nextSibling === null) {
    // fast lane - replace existing text node
    if (textContextSupport) {
      // http://jsperf.com/replace-text-vs-reuse
      child.textContent = content
    } else {
      // http://jsperf.com/replace-text-vs-reuse
      child.data = content
    }
  } else {
    // slow lane - empty element and insert a text node
    while ((child = element.lastChild)) {
      element.removeChild(child)
    }
    element.appendChild(document.createTextNode(content))
  }
}
