const { Suite } = require("benchmark");
const { EventEmitter } = require("events");
const { EventEmitter2 } = require("eventemitter2");
const EventEmitter3 = require("eventemitter3");
const { EventEmitter: DripEmitter } = require("drip");
const { EventEmitter: FoxifyEmitterV1 } = require("eventsV1");
const FoxifyEmitter = require("..").default;

new Suite()
  .add("events", () => {
    const emitter = new EventEmitter();
  })
  .add("@foxify/events", () => {
    const emitter = new FoxifyEmitter();
  })
  .add("@foxify/events (v1)", () => {
    const emitter = new FoxifyEmitterV1();
  })
  .add("eventemitter2", () => {
    const emitter = new EventEmitter2();
  })
  .add("eventemitter3", () => {
    const emitter = new EventEmitter3();
  })
  .add("drip", () => {
    const emitter = new DripEmitter();
  })
  .on("cycle", (e) => {
    console.log(e.target.toString());
  })
  .on("complete", function onComplete() {
    console.log("Fastest is %s", this.filter("fastest").map("name"));
  })
  .run();
