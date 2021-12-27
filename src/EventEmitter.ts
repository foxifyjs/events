import Listener from "./Listener";
import type {
  EventTemplateT,
  TemplateEventT,
  TemplateListenerArgsT,
  TemplateListenerContextT,
  TemplateListenerT,
} from "./Listener";

export default class EventEmitter<Template extends EventTemplateT = EventTemplateT> {
  protected events: EventsT<Template> = {};

  public on = this.addListener;

  public off = this.removeListener;

  /**
   * Returns an array listing the events for which the emitter has registered listeners.
   */
  public eventNames(): TemplateEventT<Template>[] {
    const events = this.events;

    return Object.keys(events).filter((event) => events[event] !== undefined);
  }

  /**
   * Returns the array of listeners for the specified `event`.
   *
   * @param event
   */
  public rawListeners<Event extends TemplateEventT<Template>>(
    event: Event,
  ): Listener<Template, Event, this>[] {
    const listeners = this.events[event];

    if (listeners === undefined) return [];

    if (isSingleListener(listeners)) return [listeners];

    return listeners;
  }

  /**
   * Returns a copy of the array of listeners for the specified `event`.
   *
   * @param event
   */
  public listeners<Event extends TemplateEventT<Template>>(
    event: Event,
  ): TemplateListenerT<Template, Event, this>[] {
    const listeners = this.rawListeners(event);
    const length = listeners.length;

    if (length === 0) return [];

    const result = new Array(length);

    for (let index = 0; index < length; index++) result[index] = listeners[index].fn;

    return result;
  }

  /**
   * Returns the number of listeners listening to the specified `event`.
   *
   * @param event
   */
  public listenerCount<Event extends TemplateEventT<Template>>(
    event: Event,
  ): number {
    return this.rawListeners(event).length;
  }

  /**
   * Synchronously calls each of the listeners registered for the specified `event`,
   * in the order they were registered, passing the supplied arguments to each.
   *
   * @param event
   * @param args
   * @returns - `true` if the `event` had listeners, `false` otherwise.
   */
  public emit<Event extends TemplateEventT<Template>>(
    event: Event,
    ...args: TemplateListenerArgsT<Template, Event>
  ): boolean {
    const events = this.events;
    const listeners = events[event];

    if (listeners === undefined) {
      if (event === "error") throw args[0];

      return false;
    }

    if (isSingleListener(listeners)) {
      const { fn, context, once } = listeners;

      if (once) events[event] = undefined;

      fn.apply(context, args);

      return true;
    }

    let length = listeners.length;

    for (let index = 0; index < length; index++) {
      const { fn, context, once } = listeners[index];

      if (once) {
        listeners.splice(index--, 1);

        length--;
      }

      fn.apply(context, args);
    }

    if (length === 0) events[event] = undefined;
    else if (length === 1) events[event] = listeners[0];

    return true;
  }

  /**
   * Adds the `listener` function to the end of the listeners array for the specified `event`.
   * No checks are made to see if the listener has already been added.
   * Multiple calls passing the same combination of `event` and `listener` will result in the listener being added,
   * and called, multiple times.
   *
   * @param event
   * @param listener
   * @param context - default: `this` (EventEmitter instance)
   */
  public addListener<Event extends TemplateEventT<Template>, Context = TemplateListenerContextT<Template, Event, this>>(
    event: Event,
    listener: TemplateListenerT<Template, Event, Context>,
    context?: Context,
  ): this {
    return this._addListener(event, listener, context, true, false);
  }

  /**
   * Adds a one-time `listener` function for the specified `event` to the end of the `listeners` array.
   * The next time `event` is triggered, this listener is removed, and then invoked.
   *
   * @param event
   * @param listener
   * @param context - default: `this` (EventEmitter instance)
   */
  public once<Event extends TemplateEventT<Template>, Context = TemplateListenerContextT<Template, Event, this>>(
    event: Event,
    listener: TemplateListenerT<Template, Event, Context>,
    context?: Context,
  ): this {
    return this._addListener(event, listener, context, true, true);
  }

  /**
   * Adds the `listener` function to the beginning of the listeners array for the specified `event`.
   * No checks are made to see if the listener has already been added.
   * Multiple calls passing the same combination of `event` and `listener` will result in the listener being added,
   * and called, multiple times.
   *
   * @param event
   * @param listener
   * @param context - default: `this` (EventEmitter instance)
   */
  public prependListener<Event extends TemplateEventT<Template>, Context = TemplateListenerContextT<Template, Event, this>>(
    event: Event,
    listener: TemplateListenerT<Template, Event, Context>,
    context?: Context,
  ): this {
    return this._addListener(event, listener, context, false, false);
  }

  /**
   * Adds a one-time `listener` function for the specified `event` to the beginning of the `listeners` array.
   * The next time `event` is triggered, this listener is removed, and then invoked.
   *
   * @param event
   * @param listener
   * @param context - default: `this` (EventEmitter instance)
   */
  public prependOnceListener<Event extends TemplateEventT<Template>, Context = TemplateListenerContextT<Template, Event, this>>(
    event: Event,
    listener: TemplateListenerT<Template, Event, Context>,
    context?: Context,
  ): this {
    return this._addListener(event, listener, context, false, true);
  }

  /**
   * Removes all `listeners`, or those of the specified `event`.
   *
   * @param event
   */
  public removeAllListeners<Event extends TemplateEventT<Template>>(
    event?: Event,
  ): this {
    if (event === undefined) {
      this.events = {};

      return this;
    }

    if (this.events[event] === undefined) return this;

    this.events[event] = undefined;

    return this;
  }

  /**
   * Removes the specified `listener` from the `listeners` array for the specified `event`.
   *
   * @param event
   * @param listener
   */
  public removeListener<Event extends TemplateEventT<Template>>(
    event: Event,
    listener: TemplateListenerT<Template, Event, this>,
  ): this {
    const listeners = this.events[event];

    if (listeners === undefined) return this;

    if (isSingleListener(listeners)) {
      if (listeners.fn === listener) this.events[event] = undefined;

      return this;
    }

    for (let index = listeners.length - 1; index >= 0; index--) {
      if (listeners[index].fn === listener) listeners.splice(index, 1);
    }

    if (listeners.length === 0) this.events[event] = undefined;
    else if (listeners.length === 1) this.events[event] = listeners[0];

    return this;
  }

  protected _addListener<Event extends TemplateEventT<Template>, Context = TemplateListenerContextT<Template, Event, this>>(
    event: Event,
    fn: TemplateListenerT<Template, Event, Context>,
    context: Context = this as never,
    append: boolean,
    once: boolean,
  ): this {
    const events = this.events;
    const listeners = events[event];
    const listener = new Listener<Template, Event, Context>(fn, context, once);

    if (listeners === undefined) {
      events[event] = listener;

      return this;
    }

    if (isSingleListener(listeners)) {
      events[event] = append ? [listeners, listener] : [listener, listeners];

      return this;
    }

    if (append) {
      listeners.push(listener);
    } else {
      listeners.unshift(listener);
    }

    return this;
  }
}

function isSingleListener<Type>(value: Type | Type[]): value is Type {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (value as any).length === undefined;
}

export type EventsT<Template extends EventTemplateT> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [Event in TemplateEventT<Template>]?: Listener<Template, Event, any> | Listener<Template, Event, any>[];
};
