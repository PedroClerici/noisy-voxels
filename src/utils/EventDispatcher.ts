// Credits: https://danilafe.com/blog/typescript_typesafe_events
export class EventDispatcher<T> {
  private handlers: {
    [eventName in keyof T]?: ((value: T[eventName] | null) => void)[];
  };

  constructor() {
    this.handlers = {};
  }

  dispatch<K extends keyof T>(event: K, value: T[K] | null = null): void {
    if (!this.handlers[event]) {
      return;
    }

    for (const handler of this.handlers[event]) {
      handler(value);
    }
  }

  on<K extends keyof T>(event: K, handler: (value: T[K] | null) => void): void {
    if (!this.handlers[event]) {
      this.handlers[event] = [handler];
    } else {
      this.handlers[event].push(handler);
    }
  }

  off<K extends keyof T>(event: K) {
    if (Array.isArray(this.handlers[event])) {
      this.handlers = {};
    }
  }
}
