import { EventEmitter } from "../src";

it("only emits it once", () => {
  const e = new EventEmitter();
  let calls = 0;

  e.once("foo", () => {
    calls++;
  });

  e.emit("foo");
  e.emit("foo");
  e.emit("foo");
  e.emit("foo");
  e.emit("foo");

  expect(e.listeners("foo").length).toBe(0);
  expect(calls).toBe(1);
});

it("only emits once if emits are nested inside the listener", () => {
  const e = new EventEmitter();
  let calls = 0;

  e.once("foo", () => {
    calls++;
    e.emit("foo");
  });

  e.emit("foo");
  expect(e.listeners("foo").length).toBe(0);
  expect(calls).toBe(1);
});

it("only emits once for multiple events", () => {
  const e = new EventEmitter();
  let multi = 0;
  let foo = 0;
  let bar = 0;

  e.once("foo", () => {
    foo++;
  });

  e.once("foo", () => {
    bar++;
  });

  e.on("foo", () => {
    multi++;
  });

  e.emit("foo");
  e.emit("foo");
  e.emit("foo");
  e.emit("foo");
  e.emit("foo");

  expect(e.listeners("foo").length).toBe(1);
  expect(foo).toBe(1);
  expect(bar).toBe(1);
  expect(multi).toBe(5);
});

it("only emits once with context", done => {
  const context = { foo: "bar" };
  const e = new EventEmitter();

  e.once(
    "foo",
    function(this: any, bar) {
      expect(this).toEqual(context);
      expect(bar).toBe("bar");

      done();
    },
    context,
  ).emit("foo", "bar");
});
