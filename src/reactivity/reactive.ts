import {
  reactiveHandler,
  readonlyHandler,
  shallowReadonlyHandler,
} from "./baseHandler";

export enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
  IS_READONLY = "__v_isReadonly",
}

export const reactive = (raw) => {
  return createActiveObject(raw, reactiveHandler);
};

export const readonly = (raw) => {
  return createActiveObject(raw, readonlyHandler);
};

export const shallowReadonly = (raw) => {
  return createActiveObject(raw, shallowReadonlyHandler);
};

export const isReactive = (value) => {
  return !!value[ReactiveFlags.IS_REACTIVE];
};

export const isReadonly = (value) => {
  return !!value[ReactiveFlags.IS_READONLY];
};

export const isProxy = (value) => {
  return isReactive(value) || isReadonly(value);
};

function createActiveObject(raw: any, baseHandler) {
  return new Proxy(raw, baseHandler);
}
