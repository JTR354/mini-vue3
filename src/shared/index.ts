export const extend = Object.assign;

export const isObject = (value) => {
  return value !== null && typeof value === "object";
};

export const hasChanged = (newValue, value) => {
  return !Object.is(newValue, value);
};
