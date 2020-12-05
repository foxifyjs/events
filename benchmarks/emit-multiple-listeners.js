const { Suite } = require("benchmark");
const { EventEmitter } = require("events");
const { EventEmitter2 } = require("eventemitter2");
const EventEmitter3 = require("eventemitter3");
const { EventEmitter: DripEmitter } = require("drip");
const { EventEmitter: FoxifyEmitterV1 } = require("eventsV1");
const FoxifyEmitter = require("..").default;

function foo() {
  return 1;
}

function bar() {
  return 2;
}

function baz() {
  return 3;
}

const eventEmitter = new EventEmitter();
const eventEmitter2 = new EventEmitter2();
const eventEmitter3 = new EventEmitter3();
const dripEmitter = new DripEmitter();
const foxifyEmitterV1 = new FoxifyEmitterV1();
const foxifyEmitter = new FoxifyEmitter();

eventEmitter.on("foo", foo).on("foo", bar).on("foo", baz);
eventEmitter2.on("foo", foo).on("foo", bar).on("foo", baz);
eventEmitter3.on("foo", foo).on("foo", bar).on("foo", baz);
dripEmitter.on("foo", foo).on("foo", bar).on("foo", baz);
foxifyEmitterV1.on("foo", foo).on("foo", bar).on("foo", baz);
foxifyEmitter.on("foo", foo).on("foo", bar).on("foo", baz);

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
