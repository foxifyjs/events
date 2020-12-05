const { Suite } = require("benchmark");
const { EventEmitter } = require("events");
const { EventEmitter2 } = require("eventemitter2");
const EventEmitter3 = require("eventemitter3");
const { EventEmitter: DripEmitter } = require("drip");
const { EventEmitter: FoxifyEmitterV1 } = require("eventsV1");
const FoxifyEmitter = require("..").default;

function handle() {
  return 1;
}

const eventEmitter = new EventEmitter();
const eventEmitter2 = new EventEmitter2();
const eventEmitter3 = new EventEmitter3();
const dripEmitter = new DripEmitter();
const foxifyEmitterV1 = new FoxifyEmitterV1();
const foxifyEmitter = new FoxifyEmitter();

new Suite()
  .add("events", () => {
    eventEmitter.once("foo", handle).emit("foo");
  })
  .add("@foxify/events", () => {
    foxifyEmitter.once("foo", handle).emit("foo");
  })
  .add("@foxify/events (v1)", () => {
    foxifyEmitterV1.once("foo", handle).emit("foo");
  })
  .add("eventemitter2", () => {
    eventEmitter2.once("foo", handle).emit("foo");
  })
  .add("eventemitter3", () => {
    eventEmitter3.once("foo", handle).emit("foo");
  })
  .add("drip", () => {
    dripEmitter.once("foo", handle).emit("foo");
  })
  .on("cycle", (e) => {
    console.log(e.target.toString());
  })
  .on("complete", function onComplete() {
    console.log("Fastest is %s", this.filter("fastest").map("name"));
  })
  .run();
