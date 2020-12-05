const { createStream } = require("table");
const { Suite } = require("benchmark");
const { EventEmitter } = require("events");
const { EventEmitter2 } = require("eventemitter2");
const EventEmitter3 = require("eventemitter3");
const { EventEmitter: DripEmitter } = require("drip");
const { EventEmitter: FoxifyEmitterV1 } = require("eventsV1");
const FoxifyEmitter = require("..").default;

const stream = createStream({
  columnDefault: {
    alignment: "center",
    width: 20,
  },
  columnCount: 5,
});

let base;

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
    eventEmitter.on("foo", handle);
    eventEmitter.removeListener("foo", handle);
  })
  .add("@foxify/events", () => {
    foxifyEmitter.on("foo", handle);
    foxifyEmitter.removeListener("foo", handle);
  })
  .add("@foxify/events (v1)", () => {
    foxifyEmitterV1.on("foo", handle);
    foxifyEmitterV1.removeListener("foo", handle);
  })
  .add("eventemitter2", () => {
    eventEmitter2.on("foo", handle);
    eventEmitter2.removeListener("foo", handle);
  })
  .add("eventemitter3", () => {
    eventEmitter3.on("foo", handle);
    eventEmitter3.removeListener("foo", handle);
  })
  .add("drip", () => {
    dripEmitter.on("foo", handle);
    dripEmitter.removeListener("foo", handle);
  })
  .on("cycle", (e) => {
    const { name, hz, stats } = e.target;

    if (name === "events") base = hz;

    const size = stats.sample.length;

    stream.write([
      name,
      `${hz.toLocaleString("en-US", {
        maximumFractionDigits: hz < 100 ? 2 : 0,
      })} ops/sec`,
      `${(hz / base).toLocaleString("en-US", {
        maximumFractionDigits: 2,
      })}X`,
      `\xb1${stats.rme.toLocaleString("en-US", {
        maximumFractionDigits: 2,
      })}%`,
      `${size} run${size === 1 ? "" : "s"} sampled`,
    ]);
  })
  .on("complete", function onComplete() {
    console.log("\n> Fastest is %s", this.filter("fastest").map("name"));
  })
  .run();
