// @flow

export function isString(val: mixed): bool %checks {
  return typeof val === "string";
}

export function isBool(val: mixed): bool %checks {
  return typeof val === "boolean";
}