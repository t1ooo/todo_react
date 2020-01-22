// @flow strict

const uuidv4 = require("uuid/v4");

export function genId(): string {
  return uuidv4();
}
