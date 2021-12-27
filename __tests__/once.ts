import EventEmitter from "../src";

it("should only emits it once (case 1)", () => {
  const e = new EventEmitter();

  const listener = jest.fn();

  e.once("foo", listener);

  e.emit("foo");
  e.emit("foo");
  e.emit("foo");
  e.emit("foo");
  e.emit("foo");

  expect(e.listeners("foo").length).toBe(0);
  expect(listener).toBeCalledTimes(1);
});

it("should only emits it once (case 2)", () => {
  const e = new EventEmitter();

  const listener = jest.fn();

  e.once("foo", listener);

  e.emit("foo");
  e.emit("foo");

  expect(e.listeners("foo").length).toBe(0);
  expect(listener).toBeCalledTimes(1);
});

it("should only emits it once (case 3)", () => {
  const e = new EventEmitter();

  const listener = jest.fn();

  e.once("foo", listener);
  e.once("foo", listener);

  e.emit("foo");

  expect(e.listeners("foo").length).toBe(0);
  expect(listener).toBeCalledTimes(2);
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

it("only emits once with context", (done) => {
  expect.assertions(4);

  const context = { foo: "bar" };
  const e = new EventEmitter();

  e.once(
    "foo",
    function (bar) {
      expect(this).toEqual(context);
      expect(bar).toBe("bar");

      done();
    },
    context,
  );

  expect(e.emit("foo", "bar")).toBe(true);
  expect(e.listenerCount("foo")).toBe(0);
});
