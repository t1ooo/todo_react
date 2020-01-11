// @flow strict

import { describe, it, expect, } from 'jest-without-globals';
import {Todo, Task} from "./todo";

/* describe("test Task", () => {
  const defaultText = "text";
  const defaultComleted = true;
  const defaultId = "id";

  //
  it.each(["some task"])("no error when text valid", (text) => {
    new Task(text, defaultComleted, defaultId);
  });

  it.each(["", null, undefined])("throw error when text invalid", (text) => {
    expect(() => {
      new Task(text, defaultComleted, defaultId);
    }).toThrow("bad text");
  });

  //
  it.each([true, false, undefined])("no error when completed valid", (completed) => {
    new Task(defaultText, completed, defaultId);
  });

  it.each(["", null])("throw error when completed invalid", (completed) => {
    expect(() => {
      new Task(defaultText, completed, defaultId);
    }).toThrow("bad completed");
  });

  //
  it.each(["id", undefined])("no error when id valid", (id) => {
    new Task(defaultText, defaultComleted, id);
  });

  it.each(["", null])("throw error when id invalid", (id) => {
    expect(() => {
      new Task(defaultText, defaultComleted, id);
    }).toThrow("bad id");
  });
}); */
describe("new Task", () => {
  const defaultText = "text";
  const defaultComleted = true;
  const defaultId = "id";

  //
  it.each(["some task"])("no error when text is valid", (text) => {
    new Task(text);
  });

  it.each(["", null, undefined])("throw error when text is invalid", (text) => {
    expect(() => {
      new Task(text);
    }).toThrow("bad text");
  });
});

describe("new Task from object", () => {
  const defaultText = "text";
  const defaultComleted = true;
  const defaultId = "id";
  const newObject = (text, completed, id) => ({text:text, completed:completed, id:id});

  //
  it.each(["some task"])("no error when text is valid", (text) => {
    Task.fromObject(newObject(text, defaultComleted, defaultId));
  });

  it.each(["", null, undefined])("throw error when text is invalid", (text) => {
    expect(() => {
      Task.fromObject(newObject(text, defaultComleted, defaultId));
    }).toThrow("bad text");
  });

  //
  it.each([true, false])("no error when completed is valid", (completed) => {
    Task.fromObject(newObject(defaultText, completed, defaultId));
  });

  it.each(["", null, undefined])("throw error when completed is invalid", (completed) => {
    expect(() => {
      Task.fromObject(newObject(defaultText, completed, defaultId));
    }).toThrow("bad completed");
  });

  //
  it.each(["id"])("no error when id is valid", (id) => {
    Task.fromObject(newObject(defaultText, defaultComleted, id));
  });

  it.each(["", null, undefined])("throw error when id is invalid", (id) => {
    expect(() => {
      Task.fromObject(newObject(defaultText, defaultComleted, id));
    }).toThrow("bad id");
  });
});
