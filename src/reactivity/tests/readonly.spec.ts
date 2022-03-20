import { isReadonly, readonly } from "../reactive";

describe('readonly', () => {
  test('happy path', () => {
    const original = {foo:1}
    const wrapped = readonly(original)
    console.warn = jest.fn()
    expect(wrapped).not.toBe(original)
    expect(wrapped.foo).toBe(1)
    wrapped.foo = 2
    expect(console.warn).toBeCalled()
    expect(wrapped.foo).toBe(1)
    // isReadonly
    expect(isReadonly(wrapped)).toBe(true)
    expect(isReadonly(original)).toBe(false)
  });
});