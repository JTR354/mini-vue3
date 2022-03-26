export const extend = Object.assign;

export const isObject = (value) => {
  return value !== null && typeof value === "object";
};

export const hasChanged = (newValue, value) => {
  return !Object.is(newValue, value);
};

export const hasOwn = (obj, key) =>
  obj && Object.prototype.hasOwnProperty.call(obj, key);
