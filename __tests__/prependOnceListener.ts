import EventEmitter from "../src";

it("should prepend the listener and remove it after first event", () => {
  const e = new EventEmitter();
  const calls: number[] = [];

  e.on("foo", () => {
    calls.push(1);
  });

  e.on("foo", () => {
    calls.push(2);
  });

  e.prependOnceListener("foo", () => {
    calls.push(3);
  });

  e.emit("foo");
  e.emit("foo");

  expect(e.listeners("foo").length).toBe(2);
  expect(e.listenerCount("foo")).toBe(2);
  expect(calls).toEqual([3, 1, 2, 1, 2]);
});
