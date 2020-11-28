import EventEmitter from "../src";

it("should listen to all the emits", () => {
  const e = new EventEmitter();
  let calls = 0;

  e.on("foo", () => {
    calls++;
  });

  e.emit("foo");
  e.emit("foo");
  e.emit("foo");
  e.emit("foo");
  e.emit("foo");

  expect(e.listeners("foo").length).toBe(1);
  expect(calls).toBe(5);
});
