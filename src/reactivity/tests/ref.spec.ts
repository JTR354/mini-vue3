import { describe, expect, it } from "vitest";

import { effect } from "./../effect";
import { ref } from "../ref";

describe("ref", () => {
  it("happy path", () => {
    const a = ref(1);
    expect(a.value).toBe(1);
  });

  it("should be reactive", () => {
    const a = ref(1);
    let dummy;
    let calls = 0;
    effect(() => {
      dummy = a.value;
      calls++;
    });
    expect(dummy).toBe(1);
    expect(calls).toBe(1);
    a.value = 2;
    expect(dummy).toBe(2);
    expect(calls).toBe(2);
    // same value shouldn't trigger
    a.value = 2;
    expect(dummy).toBe(2);
    expect(calls).toBe(2);
  });

  it("should nested", () => {
    const a = ref({ count: 1 });
    let dummy;
    effect(() => {
      dummy = a.value.count;
    });
    expect(dummy).toBe(1);
    a.value.count++;
    expect(dummy).toBe(2);
  });
});
