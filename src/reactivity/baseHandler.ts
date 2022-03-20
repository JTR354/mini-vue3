import { ReactiveFlags } from './reactive';
import { track, trigger } from "./effect";

const createGetter =
  (isReadOnly = false) =>
  (target, key) => {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadOnly
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadOnly
    }
    // TODO 为啥要用Reflect???
    const res = Reflect.get(target, key);
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
    return true;
  },
};
