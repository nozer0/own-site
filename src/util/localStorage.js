const STORE_PREFIX = 'own-site'
export default {
  getItem (key) {
    return window.localStorage.getItem(STORE_PREFIX + '-' + key)
  },
  setItem (key, value) {
    window.localStorage.setItem(STORE_PREFIX + '-' + key, value)
  },
  removeItem (key) {
    window.localStorage.removeItem(STORE_PREFIX + '-' + key)
  }
}
