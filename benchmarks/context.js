const { Suite } = require("benchmark");
const { EventEmitter } = require("events");
const { EventEmitter2 } = require("eventemitter2");
const EventEmitter3 = require("eventemitter3");
const { EventEmitter: DripEmitter } = require("drip");
const { EventEmitter: FoxifyEmitterV1 } = require("eventsV1");
const FoxifyEmitter = require("..").default;

const ctx = { foo: "bar" };

function handle() {
  return this.foo;
}

const eventEmitter = new EventEmitter();
const eventEmitter2 = new EventEmitter2();
const eventEmitter3 = new EventEmitter3();
const dripEmitter = new DripEmitter();
const foxifyEmitterV1 = new FoxifyEmitterV1();
const foxifyEmitter = new FoxifyEmitter();

eventEmitter.on("foo", handle.bind(ctx));
eventEmitter2.on("foo", handle.bind(ctx));
eventEmitter3.on("foo", handle, ctx);
dripEmitter.on("foo", handle.bind(ctx));
foxifyEmitterV1.on("foo", handle, ctx);
foxifyEmitter.on("foo", handle, ctx);

new Suite()
  .add("events", () => {
    eventEmitter.emit("foo");
  })
  .add("@foxify/events", () => {
    foxifyEmitter.emit("foo");
  })
  .add("@foxify/events (v1)", () => {
    foxifyEmitterV1.emit("foo");
  })
  .add("eventemitter2", () => {
    eventEmitter2.emit("foo");
  })
  .add("eventemitter3", () => {
    eventEmitter3.emit("foo");
  })
  .add("drip", () => {
    dripEmitter.emit("foo");
  })
  .on("cycle", (e) => {
    console.log(e.target.toString());
  })
  .on("complete", function onComplete() {
    console.log("Fastest is %s", this.filter("fastest").map("name"));
  })
  .run();
