// @flow

export class Storage {
  prefix: string;

  constructor(prefix: string) {
    if (prefix === "") {
      throw new Error("prefix is empty");
    }
    this._prefix = prefix + "/";
  }

  get(key): string {
    const val = localStorage.getItem(this._buildKey(key));
    if (val === null) {
      throw new Error("key is not exist: " + key);
    }
    return val;
  }

  set(key: string, val: string) {
    return localStorage.setItem(this._buildKey(key), val);
  }
  
  remove(key): string {
    localStorage.removeItem(this._buildKey(key));
  }

  clear() {
    for (let i=0; i<localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startWith(this._prefix)) {
        localStorage.remove(key);
      }
    }
  }

  _buildKey(key: string): string {
    return this._prefix + key;
  }
}