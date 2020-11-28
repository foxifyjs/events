import type Item from "./Item";

export type EventTemplateT = {
  [Event in EventT]: ListenerT;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EventT = keyof any;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ListenerT = (...args: any[]) => void;

export type ListenerArgsT<Listener> = [Listener] extends [
  (...args: infer Args) => void,
]
  ? Args
  : [Listener] extends [void]
  ? []
  : [Listener];

export type TemplateT<Template extends EventTemplateT> = Template & {
  error: (error: Error) => void;
};

export type TemplateEventT<
  Template extends EventTemplateT
> = keyof TemplateT<Template>;

export type TemplateListenerT<
  Template extends EventTemplateT,
  Event extends TemplateEventT<Template>
> = (...args: TemplateListenerArgsT<Template, Event>) => void;

export type TemplateListenerArgsT<
  Template extends EventTemplateT,
  Event extends TemplateEventT<Template>
> = ListenerArgsT<TemplateT<Template>[Event]>;

export type ListenersT<Template extends EventTemplateT> = {
  [Event in TemplateEventT<Template>]?: Item<Template, Event>[];
};
