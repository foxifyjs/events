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

eventEmitter.setMaxListeners(25);
eventEmitter2.setMaxListeners(25);

for (let i = 0; i < 25; i++) {
  eventEmitter.on("foo", handle);
  eventEmitter2.on("foo", handle);
  eventEmitter3.on("foo", handle);
  dripEmitter.on("foo", handle);
  foxifyEmitterV1.on("foo", handle);
  foxifyEmitter.on("foo", handle);
}

new Suite()
  .add("events", () => {
    eventEmitter.listeners("foo");
  })
  .add("@foxify/events", () => {
    foxifyEmitter.listeners("foo");
  })
  .add("@foxify/events (v1)", () => {
    foxifyEmitterV1.listeners("foo");
  })
  .add("eventemitter2", () => {
    eventEmitter2.listeners("foo");
  })
  .add("eventemitter3", () => {
    eventEmitter3.listeners("foo");
  })
  .add("drip", () => {
    dripEmitter.listeners("foo");
  })
  .on("cycle", (e) => {
    console.log(e.target.toString());
  })
  .on("complete", function onComplete() {
    console.log("Fastest is %s", this.filter("fastest").map("name"));
  })
  .run();
