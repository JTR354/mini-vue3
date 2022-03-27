export const extend = Object.assign;

export const isObject = (value) => {
  return value !== null && typeof value === "object";
};

export const hasChanged = (newValue, value) => {
  return !Object.is(newValue, value);
};

export const hasOwn = (obj: object, key: string) =>
  obj && Object.prototype.hasOwnProperty.call(obj, key);

export const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const camelias = (str: string) =>
  str.replace(/-(\w)/g, (_, c: string) => (c ? c.toUpperCase() : ""));

export const toHandlerKey = (event: string) => "on" + capitalize(event);
