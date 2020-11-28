import EventEmitter from "../src";

it("should work with ES6 symbols", (done) => {
  const e = new EventEmitter();
  const event = Symbol("cows");
  const unknown = Symbol("moo");

  e.on(event, function foo(arg) {
    expect(e.listenerCount(unknown)).toBe(0);
    expect(e.listeners(unknown)).toEqual([]);
    expect(arg).toBe("bar");

    function bar(onced: unknown) {
      expect(e.listenerCount(unknown)).toBe(0);
      expect(e.listeners(unknown)).toEqual([]);
      expect(onced).toBe("foo");
      done();
    }

    e.once(unknown, bar);

    expect(e.listenerCount(event)).toBe(1);
    expect(e.listeners(event)).toEqual([foo]);
    expect(e.listenerCount(unknown)).toBe(1);
    expect(e.listeners(unknown)).toEqual([bar]);

    e.removeAllListeners(event);

    expect(e.listenerCount(event)).toBe(0);
    expect(e.listeners(event)).toEqual([]);
    expect(e.emit(unknown, "foo")).toBe(true);
  });

  expect(e.emit(unknown, "bar")).toBe(false);
  expect(e.emit(event, "bar")).toBe(true);
});
