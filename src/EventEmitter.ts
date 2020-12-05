import type {
  EventTemplateT,
  TemplateListenerArgsT,
  TemplateEventT,
  TemplateListenerT,
  ListenersT,
} from "./constants";
import Item from "./Item";

interface EventEmitter<Template extends EventTemplateT = EventTemplateT> {
  on<Event extends TemplateEventT<Template>>(
    event: Event,
    listener: TemplateListenerT<Template, Event>,
    context?: unknown,
  ): this;

  off<Event extends TemplateEventT<Template>>(
    event: Event,
    listener: TemplateListenerT<Template, Event>,
  ): this;
}

class EventEmitter<Template extends EventTemplateT = EventTemplateT> {
  protected _listeners: ListenersT<Template> = {};

  constructor() {
    this.on = this.addListener;
    this.off = this.removeListener;
  }

  public eventNames(): TemplateEventT<Template>[] {
    const listeners = this._listeners;

    return Object.keys(listeners).filter(
      (event) => listeners[event] !== undefined,
    );
  }

  public rawListeners<Event extends TemplateEventT<Template>>(
    event: Event,
  ): Item<Template, Event>[] {
    const listeners = this._listeners[event];

    if (listeners === undefined) return [];

    if (isArray(listeners)) return listeners;

    return [listeners as Item<Template, Event>];
  }

  public listeners<Event extends TemplateEventT<Template>>(
    event: Event,
  ): TemplateListenerT<Template, Event>[] {
    const listeners = this.rawListeners(event);
    const length = listeners.length;

    if (!length) return [];

    const ret = new Array(length);

    for (let i = 0; i < length; i++) {
      ret[i] = listeners[i].listener;
    }

    return ret;
  }

  public listenerCount<Event extends TemplateEventT<Template>>(
    event: Event,
  ): number {
    return this.rawListeners(event).length;
  }

  public emit<Event extends TemplateEventT<Template>>(
    event: Event,
    ...args: TemplateListenerArgsT<Template, Event>
  ): boolean {
    const listeners = this._listeners[event];

    if (listeners === undefined) {
      if (event === "error") throw args[0];

      return false;
    }

    if (isArray(listeners)) {
      let length = listeners.length;

      for (let i = 0; i < length; i++) {
        const { listener, context, once } = listeners[i];

        if (once) {
          listeners.splice(i--, 1);
          length--;
        }

        listener.apply(context, args);
      }

      if (length === 0) {
        this._listeners[event] = undefined;
      } else if (length === 1) {
        this._listeners[event] = listeners[0];
      }
    } else {
      const { listener, context, once } = listeners as Item<Template, Event>;

      if (once) this._listeners[event] = undefined;

      listener.apply(context, args);
    }

    return true;
  }

  public addListener<Event extends TemplateEventT<Template>>(
    event: Event,
    listener: TemplateListenerT<Template, Event>,
    context?: unknown,
  ): this {
    return this._addListener(event, listener, context, false, false);
  }

  public once<Event extends TemplateEventT<Template>>(
    event: Event,
    listener: TemplateListenerT<Template, Event>,
    context?: unknown,
  ): this {
    return this._addListener(event, listener, context, false, true);
  }

  public prependListener<Event extends TemplateEventT<Template>>(
    event: Event,
    listener: TemplateListenerT<Template, Event>,
    context?: unknown,
  ): this {
    return this._addListener(event, listener, context, true, false);
  }

  public prependOnceListener<Event extends TemplateEventT<Template>>(
    event: Event,
    listener: TemplateListenerT<Template, Event>,
    context?: unknown,
  ): this {
    return this._addListener(event, listener, context, true, true);
  }

  public removeAllListeners<Event extends TemplateEventT<Template>>(
    event?: Event,
  ): this {
    if (event === undefined) {
      this._listeners = {};

      return this;
    }

    if (this._listeners[event] === undefined) return this;

    this._listeners[event] = undefined;

    return this;
  }

  public removeListener<Event extends TemplateEventT<Template>>(
    event: Event,
    listener: TemplateListenerT<Template, Event>,
  ): this {
    const listeners = this._listeners[event];

    if (listeners === undefined) return this;

    if (isArray(listeners)) {
      for (let index = listeners.length - 1; index >= 0; index--) {
        if (listeners[index].listener === listener) listeners.splice(index, 1);
      }

      if (listeners.length === 0) {
        this._listeners[event] = undefined;
      } else if (listeners.length === 1) {
        this._listeners[event] = listeners[0];
      }
    } else if (listener === listeners.listener) {
      this._listeners[event] = undefined;
    }

    return this;
  }

  protected _addListener<Event extends TemplateEventT<Template>>(
    event: Event,
    listener: TemplateListenerT<Template, Event>,
    context: unknown = this,
    prepend: boolean,
    once: boolean,
  ): this {
    const item = new Item<Template, Event>(listener, context, once);
    const listeners = this._listeners;

    if (listeners[event] === undefined) {
      listeners[event] = item;
    } else if (isArray(listeners[event])) {
      if (prepend) {
        (listeners[event] as Item<Template, Event>[]).unshift(item);
      } else {
        (listeners[event] as Item<Template, Event>[]).push(item);
      }
    } else {
      if (prepend) {
        listeners[event] = [item, listeners[event] as Item<Template, Event>];
      } else {
        listeners[event] = [listeners[event] as Item<Template, Event>, item];
      }
    }

    return this;
  }
}

export default EventEmitter;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isArray(value: any): value is any[] {
  return value.length !== undefined;
}
