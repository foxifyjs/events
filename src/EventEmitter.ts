import Item from "./Item";

function assert(condition: boolean, message: string) {
  if (!condition) throw new TypeError(message);
}

function assertEvent(event: string | symbol) {
  assert(
    typeof event === "string" || typeof event === "symbol",
    "'event' must be an string or symbol",
  );
}

function assertListener(listener: (...args: any[]) => void) {
  assert(typeof listener === "function", "'listener' must be a function");
}

function addListener(
  emitter: EventEmitter,
  event: string | symbol,
  listener: (...args: any[]) => void,
  context: any = emitter,
  prepend: boolean,
  once: boolean,
) {
  assertEvent(event);
  assertListener(listener);

  const listeners = (emitter as any)._listeners;
  listener = new Item(listener, context, once) as any;

  if (listeners[event]) {
    if (prepend) listeners[event].unshift(listener);
    else listeners[event].push(listener);
  } else listeners[event] = [listener];

  return emitter;
}

namespace EventEmitter {
  export interface Listeners {
    [event: string]: Item[] | undefined;
  }
}

interface EventEmitter {
  on(
    event: string | symbol,
    listener: (...args: any[]) => void,
    context?: any,
  ): this;

  off(event: string | symbol, listener: (...args: any[]) => void): this;
}

class EventEmitter {
  protected _listeners: EventEmitter.Listeners = {};

  public eventNames() {
    const listeners = this._listeners;

    return Object.keys(listeners).filter(
      event => listeners[event] !== undefined,
    );
  }

  public listenerCount(event: string | symbol) {
    assertEvent(event);

    const listeners = this._listeners[event as string];

    return listeners ? listeners.length : 0;
  }

  public listeners(event: string | symbol) {
    assertEvent(event);

    const listeners = this._listeners[event as string];

    if (!listeners) return [];

    const length = listeners.length;
    const ret = [];

    for (let i = 0; i < length; i++) {
      ret[i] = listeners[i].listener;
    }

    return ret;
  }

  public rawListeners(event: string | symbol) {
    assertEvent(event);

    return this._listeners[event as string] || [];
  }

  public emit(event: "error", error: Error): boolean;
  public emit(event: string | symbol, ...args: any[]): boolean;
  public emit(event: string | symbol, ...args: any[]) {
    assertEvent(event);

    const listeners = this._listeners[event as string];

    if (!listeners) {
      if (event === "error") throw args[0];

      return false;
    }

    const length = listeners.length;

    if (!length) {
      if (event === "error") throw args[0];

      return false;
    }

    for (let i = 0; i < length; i++) {
      const { listener, context, once } = listeners[i];

      if (once) this.removeListener(event, listener);

      listener.apply(context, args);
    }

    return true;
  }

  public addListener(
    event: string | symbol,
    listener: (...args: any[]) => void,
    context?: any,
  ) {
    return addListener(this, event, listener, context, false, false);
  }

  public once(
    event: string | symbol,
    listener: (...args: any[]) => void,
    context?: any,
  ) {
    return addListener(this, event, listener, context, false, true);
  }

  public prependListener(
    event: string | symbol,
    listener: (...args: any[]) => void,
    context?: any,
  ) {
    return addListener(this, event, listener, context, true, false);
  }

  public prependOnceListener(
    event: string | symbol,
    listener: (...args: any[]) => void,
    context?: any,
  ) {
    return addListener(this, event, listener, context, true, true);
  }

  public removeAllListeners(event?: string | symbol) {
    assert(
      event === undefined ||
        typeof event === "string" ||
        typeof event === "symbol",
      "'event' must be an string, symbol or undefined",
    );

    if (event === undefined) {
      this._listeners = {};

      return this;
    }

    if (!this._listeners[event as string]) return this;

    this._listeners[event as string] = undefined;

    return this;
  }

  public removeListener(
    event: string | symbol,
    listener: (...args: any[]) => void,
  ) {
    assertEvent(event);
    assertListener(listener);

    let listeners = this._listeners[event as string];

    if (!listeners) return this;

    if (listeners.length === 1) {
      if (listener !== listeners[0].listener) return this;

      this._listeners[event as string] = undefined;

      return this;
    }

    listeners = [...listeners];

    let index = listeners.length - 1;
    for (; index >= 0; index--) {
      if (listeners[index].listener === listener) break;
    }

    if (index < 0) return this;

    if (index === 0) listeners.shift();
    else listeners.splice(index, 1);

    this._listeners[event as string] = listeners;

    return this;
  }
}

EventEmitter.prototype.on = EventEmitter.prototype.addListener;
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

export default EventEmitter;
