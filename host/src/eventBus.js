class EventBus {
  constructor() {
    this.listeners = new Map();
  }
  on(eventName, callback) {
    if (!this.listeners.has(eventName)) this.listeners.set(eventName, new Set());
    this.listeners.get(eventName).add(callback);
    return () => this.off(eventName, callback);
  }
  off(eventName, callback) {
    if (this.listeners.has(eventName)) {
      this.listeners.get(eventName).delete(callback);
    }
  }
  emit(eventName, payload) {
    if (!this.listeners.has(eventName)) return;
    for (const cb of this.listeners.get(eventName)) cb(payload);
  }
}

const eventBus = new EventBus();
export default eventBus;


