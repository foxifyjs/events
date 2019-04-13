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

function assertListener(listener: EventEmitter.DefaultListener) {
  assert(typeof listener === "function", "'listener' must be a function");
}

function addListener(
  emitter: EventEmitter,
  event: string | symbol,
  listener: EventEmitter.DefaultListener,
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
  export type DefaultListener = (...args: any[]) => void;

  export type DefaultEvents = {
    [E in string | symbol]: EventEmitter.DefaultListener
  };

  export type Event<Events extends {}> = Extract<keyof Events, string | symbol>;

  export type EmitArgs<T> = [T] extends [(...args: infer U) => any]
    ? U
    : [T] extends [void]
    ? []
    : [T];

  export type Listener<E extends {}, K extends keyof E> = (
    ...args: EmitArgs<E[K]>
  ) => void;

  export interface Listeners {
    [event: string]: Item[] | undefined;
  }
}

interface EventEmitter<Events extends {} = EventEmitter.DefaultEvents> {
  on(event: "error", listener: (error: Error) => void, context?: any): this;
  on<K extends EventEmitter.Event<Events>>(
    event: K,
    listener: EventEmitter.Listener<Events, K>,
    context?: any,
  ): this;

  off(event: "error", listener: (error: Error) => void): this;
  off<K extends EventEmitter.Event<Events>>(
    event: K,
    listener: EventEmitter.Listener<Events, K>,
  ): this;
}

class EventEmitter<Events extends {} = EventEmitter.DefaultEvents> {
  protected _listeners: EventEmitter.Listeners = {};

  public eventNames(): Array<EventEmitter.Event<Events>> {
    const listeners = this._listeners;

    return Object.keys(listeners).filter(
      event => listeners[event] !== undefined,
    ) as any;
  }

  public rawListeners(event: "error"): Item[];
  public rawListeners<K extends EventEmitter.Event<Events>>(event: K): Item[];
  public rawListeners(event: string | symbol) {
    assertEvent(event);

    return this._listeners[event as string] || [];
  }

  public listeners(event: "error"): EventEmitter.DefaultListener[];
  public listeners<K extends EventEmitter.Event<Events>>(
    event: K,
  ): Array<EventEmitter.Listener<Events, K>>;
  public listeners(event: string | symbol) {
    const listeners = this.rawListeners(event as any);
    const length = listeners.length;

    if (!length) return [];

    const ret = new Array(length);

    for (let i = 0; i < length; i++) {
      ret[i] = listeners[i].listener;
    }

    return ret;
  }

  public listenerCount(event: "error"): number;
  public listenerCount<K extends EventEmitter.Event<Events>>(event: K): number;
  public listenerCount(event: string | symbol) {
    return this.rawListeners(event as any).length;
  }

  public emit(event: "error", error: Error): boolean;
  public emit<K extends EventEmitter.Event<Events>>(
    event: K,
    ...args: EventEmitter.EmitArgs<Events[K]>
  ): boolean;
  public emit(event: string | symbol, ...args: any[]) {
    const listeners = this.rawListeners(event as any);
    const length = listeners.length;

    if (!length) {
      if (event === "error") throw args[0];

      return false;
    }

    for (let i = 0; i < length; i++) {
      const { listener, context, once } = listeners[i];

      if (once) this.removeListener(event as any, listener as any);

      listener.apply(context, args);
    }

    return true;
  }

  public addListener(
    event: "error",
    listener: (error: Error) => void,
    context?: any,
  ): this;
  public addListener<K extends EventEmitter.Event<Events>>(
    event: K,
    listener: EventEmitter.Listener<Events, K>,
    context?: any,
  ): this;
  public addListener(
    event: string | symbol,
    listener: EventEmitter.DefaultListener,
    context?: any,
  ) {
    return addListener(this, event, listener, context, false, false);
  }

  public once(
    event: "error",
    listener: (error: Error) => void,
    context?: any,
  ): this;
  public once<K extends EventEmitter.Event<Events>>(
    event: K,
    listener: EventEmitter.Listener<Events, K>,
    context?: any,
  ): this;
  public once(
    event: string | symbol,
    listener: EventEmitter.DefaultListener,
    context?: any,
  ) {
    return addListener(this, event, listener, context, false, true);
  }

  public prependListener(
    event: "error",
    listener: (error: Error) => void,
    context?: any,
  ): this;
  public prependListener<K extends EventEmitter.Event<Events>>(
    event: K,
    listener: EventEmitter.Listener<Events, K>,
    context?: any,
  ): this;
  public prependListener(
    event: string | symbol,
    listener: EventEmitter.DefaultListener,
    context?: any,
  ) {
    return addListener(this, event, listener, context, true, false);
  }

  public prependOnceListener(
    event: "error",
    listener: (error: Error) => void,
    context?: any,
  ): this;
  public prependOnceListener<K extends EventEmitter.Event<Events>>(
    event: K,
    listener: EventEmitter.Listener<Events, K>,
    context?: any,
  ): this;
  public prependOnceListener(
    event: string | symbol,
    listener: EventEmitter.DefaultListener,
    context?: any,
  ) {
    return addListener(this, event, listener, context, true, true);
  }

  public removeAllListeners(event?: "error"): this;
  public removeAllListeners<K extends EventEmitter.Event<Events>>(
    event: K,
  ): this;
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

  public removeListener(event: "error", listener: (error: Error) => void): this;
  public removeListener<K extends EventEmitter.Event<Events>>(
    event: K,
    listener: EventEmitter.Listener<Events, K>,
  ): this;
  public removeListener(
    event: string | symbol,
    listener: EventEmitter.DefaultListener,
  ) {
    assertListener(listener);

    let listeners = this.rawListeners(event as any);
    const length = listeners.length;

    if (!length) return this;

    if (length === 1) {
      if (listener !== listeners[0].listener) return this;

      this._listeners[event as string] = undefined;

      return this;
    }

    listeners = listeners.slice(0);

    let index = length - 1;
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
