// @flow strict

import { describe, it, expect, } from 'jest-without-globals';
import {Todo, Task} from "./todo";

describe("new Task", () => {
  it.each([
    "some task"
  ])("no error when text is valid: %p", (text) => {
    new Task(text);
  });

  it.each([
    "", 
    null, 
    undefined
  ])("throw error when text is invalid: %p", (text) => {
    expect(() => {
      new Task(text);
    }).toThrow("bad text");
  });
});

describe("new Task from object", () => {
  const defaultObj = {
    text: "text",
    completed: true,
    id: "id"
  };
  const updateObj = (key, val) => ({...defaultObj, [key]:val});

  // text
  it.each([
    "some task"
  ])("no error when text is valid: %p", (text) => {
    const obj = updateObj("text", text);
    Task.fromObject(obj);
  });

  it.each([
    "", 
    null, 
    undefined
  ])("throw error when text is invalid: %p", (text) => {
    const obj = updateObj("text", text);
    expect(() => {
      Task.fromObject(obj);
    }).toThrow("bad text");
  });

  // completed
  it.each([
    true, 
    false
  ])("no error when completed is valid: %p", (completed) => {
    const obj = updateObj("completed", completed);
    Task.fromObject(obj);
  });

  it.each([
    "", 
    null, 
    undefined
  ])("throw error when completed is invalid: %p", (completed) => {
    const obj = updateObj("completed", completed);
    expect(() => {
      Task.fromObject(obj);
    }).toThrow("bad completed");
  });

  // id
  it.each([
    "id"
  ])("no error when id is valid: %p", (id) => {
    const obj = updateObj("id", id);
    Task.fromObject(obj);
  });

  it.each([
    "", 
    null, 
    undefined
  ])("throw error when id is invalid: %p", (id) => {
    const obj = updateObj("id", id);
    expect(() => {
      Task.fromObject(obj);
    }).toThrow("bad id");
  });
});
