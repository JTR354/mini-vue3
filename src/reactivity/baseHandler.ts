import { reactive, ReactiveFlags, readonly } from "./reactive";
import { track, trigger } from "./effect";
import { isObject } from "../shared";

const createGetter =
  (isReadOnly = false) =>
  (target, key) => {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadOnly;
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadOnly;
    }
    // TODO 为啥要用Reflect???
    const res = Reflect.get(target, key);

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

export const reactiveHandler = { get, set };
export const readonlyHandler = {
  get: readonlyGet,
  set() {
    console.warn(`can't set value which is readonly`);
    return true;
  },
};
