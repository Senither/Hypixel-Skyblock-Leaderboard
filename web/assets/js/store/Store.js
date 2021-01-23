export default class Store {
  constructor() {
    this.store = {}
  }

  put(key, value) {
    this.store[key] = value
  }

  has(key) {
    return this.store.hasOwnProperty(key)
  }

  get(key, fallback = null) {
    if (!this.has(key)) {
      return fallback
    }
    return this.store[key]
  }

  remove(key) {
    delete this.store[key]
  }
}
