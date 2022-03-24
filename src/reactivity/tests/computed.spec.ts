import { describe, it, expect, vi } from "vitest";

import { reactive } from "./../reactive";
import { computed } from "../compted";

describe("computed", () => {
  it("happy path", () => {
    const user = reactive({ age: 1 });
    const age = computed(() => {
      return user.age + 1;
    });
    expect(age.value).toBe(2);
  });

  it("should computed lazily", () => {
    const value = reactive({ foo: 1 });

    const getter = vi.fn(() => {
      return value.foo;
    });

    const cValue = computed(getter);

    // lazy

    expect(getter).not.toHaveBeenCalled();

    expect(cValue.value).toBe(1);
    expect(getter).toHaveBeenCalledTimes(1);

    // should not compute again
    cValue.value;
    expect(getter).toHaveBeenCalledTimes(1);

    // should not compute until needed
    value.foo = 2;
    expect(getter).toHaveBeenCalledTimes(1);

    // now it should compute
    expect(cValue.value).toBe(2);
    expect(getter).toHaveBeenCalledTimes(2);

    // should not compute again
    cValue.value;
    expect(getter).toHaveBeenCalledTimes(2);
  });
});
