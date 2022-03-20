import { reactiveHandler, readonlyHandler } from './baseHandler';

export enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly'
}

export const reactive = (raw) => {
  return createActiveObject(raw, reactiveHandler)
};

export const readonly = (raw) => {
  return createActiveObject(raw, readonlyHandler);
};

export const isReactive = (value) => {
  return !!value[ReactiveFlags.IS_REACTIVE]
} 

export const isReadonly = (value) => {
  return !!value[ReactiveFlags.IS_READONLY]
}

function createActiveObject(raw: any, baseHandler) {
  return new Proxy(raw, baseHandler);
}

