import EventEmitter from "../src";

it("should prepend the listener", () => {
  const e = new EventEmitter();
  const calls: number[] = [];

  e.on("foo", () => {
    calls.push(1);
  });

  e.prependListener("foo", () => {
    calls.push(2);
  });

  e.emit("foo");

  expect(e.listeners("foo").length).toBe(2);
  expect(e.listenerCount("foo")).toBe(2);
  expect(calls).toEqual([2, 1]);
});
