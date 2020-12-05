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
