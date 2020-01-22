// @flow strict

export function isString(val: mixed): boolean %checks {
  return typeof val === "string";
}

export function isBool(val: mixed): boolean %checks {
  return typeof val === "boolean";
}
