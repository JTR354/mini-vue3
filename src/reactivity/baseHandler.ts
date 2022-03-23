import { reactive, ReactiveFlags, readonly } from "./reactive";
import { track, trigger } from "./effect";
import { extend, isObject } from "../shared";

const createGetter =
  (isReadOnly = false, isShallow = false) =>
  (target: object, key: string | number | symbol) => {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadOnly;
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadOnly;
    }
    // TODO 为啥要用Reflect???
    const res = Reflect.get(target, key);

    if (isShallow) {
      return res;
    }

    if (isObject(res)) {
      return isReadOnly ? readonly(res) : reactive(res);
    }

    !isReadOnly && track(target, key);
    return res;
  };

const createSetter = () => (target, key, value) => {
  const res = Reflect.set(target, key, value);
  trigger(target, key);
  return res;
};

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);

export const reactiveHandler = { get, set };
export const readonlyHandler = {
  get: readonlyGet,
  set() {
    console.warn(`can't set value which is readonly`);
    return true;
  },
};
export const shallowReadonlyHandler = extend({}, readonlyHandler, {
  get: shallowReadonlyGet,
});
