// @flow strict

import { describe, it, expect, } from 'jest-without-globals';
import {Todo, Task} from "./todo";

describe("Todo serialization/deserialization", () => {
  it("no error", () => {
    const todo = new Todo();
    todo.add("some task #0");
    todo.add("some task #1");
    todo.add("some task #2");
    todo.toggleAll(true);

    const json = JSON.stringify(todo);
    const todoFromJson = Todo.fromObject(JSON.parse(json));
    expect(todoFromJson).toStrictEqual(todo);
  });
});

describe("new Task from object", () => {
  const defaultObj = {
    text: "text",
    completed: true,
    id: "id"
  };

  const updateObj = (key, val) => ({...defaultObj, [key]:val});

  const testValid = (key, table) => {
    it.each(table)(`no error when ${key} is valid: %p`, (val) => {
      const obj = updateObj(key, val);
      Task.fromObject(obj);
    });
  };

  const testInvalid = (key, table) => {
    it.each(table)(`throw error when ${key} is invalid: %p`, (val) => {
      const obj = updateObj(key, val);
      expect(() => {
        Task.fromObject(obj);
      }).toThrow(`bad ${key}`);
    });
  };

  testValid("text", ["some task"]);
  testValid("completed", [true, false]);
  testValid("id", ["some id"]);

  testInvalid("text", ["", null, undefined]);
  testInvalid("completed", ["", null, undefined]);
  testInvalid("id", ["", null, undefined]);
});

describe("Task serialization/deserialization", () => {
  it("no error", () => {
    const task = new Task("some text");
    const json = JSON.stringify(task);
    const taskFromJson = Task.fromObject(JSON.parse(json));
    expect(taskFromJson).toStrictEqual(task);
  });
});