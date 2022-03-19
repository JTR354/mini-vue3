import { reactiveHandler, readonlyHandler } from './baseHandles';

export const reactive = (raw) => {
  return createActiveObject(raw, reactiveHandler)
};

export const readonly = (raw) => {
  return createActiveObject(raw, readonlyHandler);
};


function createActiveObject(raw: any, baseHandler) {
  return new Proxy(raw, baseHandler);
}

