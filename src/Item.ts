import type {
  EventTemplateT,
  TemplateEventT,
  TemplateListenerT,
} from "./constants";

export default class Item<
  Template extends EventTemplateT,
  Event extends TemplateEventT<Template>
> {
  constructor(
    public readonly listener: TemplateListenerT<Template, Event>,
    public readonly context: unknown,
    public readonly once: boolean,
  ) {}
}
