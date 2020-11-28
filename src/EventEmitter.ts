import type {
  EventTemplateT,
  TemplateListenerArgsT,
  TemplateEventT,
  TemplateListenerT,
  ListenersT,
} from "./constants";
import Item from "./Item";

export default class EventEmitter<
  Template extends EventTemplateT = EventTemplateT
> {
  protected _listeners: ListenersT<Template> = {};

  public on: <Event extends TemplateEventT<Template>>(
    event: Event,
    listener: TemplateListenerT<Template, Event>,
    context?: unknown,
  ) => this;

  public off: <Event extends TemplateEventT<Template>>(
    event: Event,
    listener: TemplateListenerT<Template, Event>,
  ) => this;

  constructor() {
    this.on = this.addListener;
    this.off = this.removeListener;
  }

  public eventNames(): TemplateEventT<Template>[] {
    const listeners = this._listeners;

    return Object.keys(listeners).filter((event) => listeners[event] != null);
  }

  public rawListeners<Event extends TemplateEventT<Template>>(
    event: Event,
  ): Item<Template, Event>[] {
    return this._listeners[event] ?? [];
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
    const listeners = this.rawListeners(event);
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

    if (!this._listeners[event]) return this;

    this._listeners[event] = undefined;

    return this;
  }

  public removeListener<Event extends TemplateEventT<Template>>(
    event: Event,
    listener: TemplateListenerT<Template, Event>,
  ): this {
    let listeners = this.rawListeners(event);
    const length = listeners.length;

    if (!length) return this;

    if (length === 1) {
      if (listener !== listeners[0].listener) return this;

      this._listeners[event] = undefined;

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

    this._listeners[event] = listeners;

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

    if (listeners[event]) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      if (prepend) listeners[event]!.unshift(item);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      else listeners[event]!.push(item);
    } else listeners[event] = [item];

    return this;
  }
}
