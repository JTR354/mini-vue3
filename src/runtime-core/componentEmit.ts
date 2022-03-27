import { camelias, toHandlerKey } from "../shared";

export function emit(instance, event: string, ...args) {
  const { props } = instance;

  const handlerName = toHandlerKey(camelias(event));
  const handler = props[handlerName];
  handler && handler(...args);
}
