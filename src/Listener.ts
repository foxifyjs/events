export default class Listener<Template extends EventTemplateT, Event extends TemplateEventT<Template>, Context> {
  constructor(
    public readonly fn: TemplateListenerT<Template, Event, Context>,
    public readonly context: Context,
    public readonly once: boolean,
  ) {
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EventT = keyof any;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ListenerT = (...args: any[]) => void;

export type EventTemplateT = {
  [Event in EventT]: ListenerT;
};

export type ListenerArgsT<Listener> = [Listener] extends [
    (...args: infer Args) => void,
  ]
  ? Args
  : [Listener] extends [void]
    ? []
    : [Listener];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ListenerContextT<Listener, DefaultContext> = [Listener] extends [(this: infer Context, ...args: any[]) => void]
  ? unknown extends Context ? DefaultContext : Context
  : DefaultContext;

export type TemplateT<Template extends EventTemplateT> = Template & {
  error: (error: Error) => void;
};

export type TemplateEventT<Template extends EventTemplateT> = keyof TemplateT<Template>;

export type TemplateListenerT<Template extends EventTemplateT,
  Event extends TemplateEventT<Template>,
  Context,
  > = (this: Context, ...args: TemplateListenerArgsT<Template, Event>) => void;

export type TemplateListenerContextT<Template extends EventTemplateT,
  Event extends TemplateEventT<Template>,
  DefaultContext,
  > = ListenerContextT<TemplateT<Template>[Event], DefaultContext>;

export type TemplateListenerArgsT<Template extends EventTemplateT,
  Event extends TemplateEventT<Template>,
  > = ListenerArgsT<TemplateT<Template>[Event]>;
