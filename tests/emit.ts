import { EventEmitter } from "../src";

it("should return false when there are not events to emit", () => {
  const e = new EventEmitter();

  expect(e.emit("foo")).toBe(false);
  expect(e.emit("bar")).toBe(false);
});

it("should emit with context", done => {
  const context = { bar: "baz" };
  const e = new EventEmitter();

  e.on(
    "foo",
    function(this: any, bar) {
      expect(bar).toBe("bar");
      expect(this).toEqual(context);

      done();
    },
    context,
  ).emit("foo", "bar");
});

it("should emit with context, multiple arguments (force apply)", done => {
  const context = { bar: "baz" };
  const e = new EventEmitter();

  e.on(
    "foo",
    function(this: any, bar) {
      expect(bar).toBe("bar");
      expect(this).toEqual(context);

      done();
    },
    context,
  ).emit("foo", "bar", 1, 2, 3, 4, 5, 6, 7, 8, 9, 0);
});

it("should be able to emit the function with multiple arguments", () => {
  const e = new EventEmitter();

  for (let i = 0; i < 100; i++) {
    (function(j) {
      const args: any[] = [];

      for (let i = 0; i < j; i++) {
        args.push(j);
      }

      e.once("args", function() {
        expect(arguments.length).toBe(args.length);
      });

      e.emit.apply(e, ["args", ...args]);
    })(i);
  }
});

it("should be able to emit the function with multiple arguments, multiple listeners", () => {
  const e = new EventEmitter();

  for (let i = 0; i < 100; i++) {
    (function(j) {
      const args: any[] = [];

      for (let i = 0; i < j; i++) {
        args.push(j);
      }

      e.once("args", function() {
        expect(arguments.length).toBe(args.length);
      });

      e.emit.apply(e, ["args", ...args]);
    })(i);
  }
});

it("should be able to emit with context, multiple listeners (force loop)", () => {
  const e = new EventEmitter();

  e.on(
    "foo",
    function(this: any, bar) {
      expect(this).toEqual({ foo: "bar" });
      expect(bar).toBe("bar");
    },
    { foo: "bar" },
  );

  e.on(
    "foo",
    function(this: any, bar) {
      expect(this).toEqual({ bar: "baz" });
      expect(bar).toBe("bar");
    },
    { bar: "baz" },
  );

  e.emit("foo", "bar");
});

it("should be able to emit with different contexts", () => {
  const e = new EventEmitter();
  let pattern = "";

  function writer(this: any) {
    pattern += this;
  }

  e.on("write", writer, "foo");
  e.on("write", writer, "baz");
  e.once("write", writer, "bar");

  e.emit("write");
  expect(pattern).toBe("foobazbar");
});

it("should return true when there are events to emit", () => {
  const e = new EventEmitter();
  let called = 0;

  e.on("foo", function() {
    called++;
  });

  expect(e.emit("foo")).toBe(true);
  expect(e.emit("foob")).toBe(false);
  expect(called).toBe(1);
});

it("receives the emitted events", done => {
  const e = new EventEmitter();

  e.on("data", function(a, b, c, d, undef) {
    expect(a).toBe("foo");
    expect(b).toEqual(e);
    expect(c).toBeInstanceOf(Date);
    expect(undef).toBe(undefined);
    expect(arguments.length).toBe(3);

    done();
  });

  e.emit("data", "foo", e, new Date());
});

it("emits to all event listeners", () => {
  const e = new EventEmitter();
  const pattern: string[] = [];

  e.on("foo", function() {
    pattern.push("foo1");
  });

  e.on("foo", function() {
    pattern.push("foo2");
  });

  e.emit("foo");

  expect(pattern.join(";")).toBe("foo1;foo2");
});
