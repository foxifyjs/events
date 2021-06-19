import type { EventTemplateT, TemplateEventT, TemplateListenerT } from "./constants";

export default class Listener<Template extends EventTemplateT,
  Event extends TemplateEventT<Template>,
  > {
  constructor(
    public readonly fn: TemplateListenerT<Template, Event>,
    public readonly context: unknown,
    public readonly once: boolean,
  ) {
  }
}
