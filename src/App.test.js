import React from "react";
import {render as reactRender, unmountComponentAtNode } from 'react-dom';
/* import { act } from "react-dom/test-utils"; */
import { App } from "./App";
import {fireEvent} from "@testing-library/react";

let container = null;
beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
  localStorage.removeItem(App._storageKey);
});

function render(component) {
  return reactRender(component, container);
}

it("show todo: when there is no tasks", () => {
  const app = render(<App />);
  expect(container.querySelectorAll(".TodoHeader").length).toBe(1);
  expect(container.querySelectorAll(".TodoBody").length).toBe(0);
  expect(container.querySelectorAll(".TodoFooter").length).toBe(0);
});

it("show todo: when there is at least one task", () => {
  const app = render(<App />);
  
  const text = "new task";
  addTask(container, text);
  
  expect(container.querySelectorAll(".TodoHeader").length).toBe(1);
  expect(container.querySelectorAll(".TodoBody").length).toBe(1);
  expect(container.querySelectorAll(".TodoFooter").length).toBe(1);
});

it("add new task", () => {
  const app = render(<App />);

  var tasks = container.querySelectorAll(".TaskItem");
  expect(tasks.length).toBe(0);

  const text = "new task";
  addTask(container, text);

  var tasks = container.querySelectorAll(".TaskItem");
  expect(tasks.length).toBe(1);

  const task = tasks.item(0);
  expect(task.querySelector(".text").textContent).toBe(text);
  expect(task.querySelector(".toggle").checked).toBe(false); 
});

function addTask(container, text) {
  const input = container.querySelector(".add-new-task");
  fireEvent.change(input, {target: {value: text}});
  fireEvent.keyDown(input, {key: "Enter", keyCode: 13, which: 13});
}