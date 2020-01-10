// @flow strict

import {isString} from "./typeof.js"

export class Storage {
  _prefix: string;

  constructor(prefix: string) {
    if (prefix === "") {
      throw new Error("prefix is empty");
    }
    this._prefix = prefix + "/";
  }

  get(key: string): string {
    const val = localStorage.getItem(this._buildKey(key));
    if (! isString(val)) {
      throw new Error("key is not exist: " + key);
    }
    return val;
  }

  set(key: string, val: string) {
    return localStorage.setItem(this._buildKey(key), val);
  }

  remove(key: string) {
    localStorage.removeItem(this._buildKey(key));
  }

  clear() {
    for (let i=0; i<localStorage.length; i++) {
      const key = localStorage.key(i);
      if (isString(key) && key.startsWith(this._prefix)) {
        localStorage.removeItem(key);
      }
    }
  }

  _buildKey(key: string): string {
    return this._prefix + key;
  }
}