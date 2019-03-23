import { EventEmitter } from "..";

it("throws an error if the listener is not a function", () => {
  const e = new EventEmitter();

  try {
    e.on("foo", "bar" as any);
  } catch (ex) {
    expect(ex).toBeInstanceOf(TypeError);
    expect(ex.message).toBe("'listener' must be a function");
    return;
  }

  throw new Error("oops");
});
