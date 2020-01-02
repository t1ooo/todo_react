import React from "react";
import {/* render as reactRender, */ unmountComponentAtNode } from 'react-dom';
/* import { act } from "react-dom/test-utils"; */
import { App } from "./App";
import {render, fireEvent} from "@testing-library/react";

afterEach(() => {
  //localStorage.removeItem(App._storageKey);
  localStorage.clear();
});

it("show todo: not task: show header", () => {
  var {container} = render(<App />);
  
  expect(container.querySelectorAll(".TodoHeader").length).toBe(1);
  expect(container.querySelectorAll(".TodoBody").length).toBe(0);
  expect(container.querySelectorAll(".TodoFooter").length).toBe(0);
});

it("show todo: add task: show header, body, footer", () => {
  var {container} = render(<App />);

  var text = "new task";
  addTask(container, text);

  expect(container.querySelectorAll(".TodoHeader").length).toBe(1);
  expect(container.querySelectorAll(".TodoBody").length).toBe(1);
  expect(container.querySelectorAll(".TodoFooter").length).toBe(1);
});

it("add new task", () => {
  var {container} = render(<App />);

  var tasks = container.querySelectorAll(".TaskItem");
  expect(tasks.length).toBe(0);

  var text = "new task";
  var input = addTask(container, text);

  var tasks = container.querySelectorAll(".TaskItem");
  expect(tasks.length).toBe(1);
  expect(container.querySelector(".count").textContent).toBe("1 item left");

  var lastTask = tasks.item(tasks.length-1);
  expect(lastTask.querySelector(".text").textContent).toBe(text);
  expect(lastTask.querySelector(".toggle").checked).toBe(false);
  expect(lastTask.querySelectorAll(".active").length).toBe(1);

  expect(input.value).toBe("");
});

it("mark task as done/undone", () => {
  var {container} = render(<App />);

  addTask(container, "new task");
  
  const task = () => container.querySelector(".TaskItem");
  const toggle = () => task().querySelector(".toggle");
  //const wrapper = () => task().querySelector(".active");
  const count = () => container.querySelector(".count");
  const removeCompleted = () => container.querySelectorAll(".remove-completed");
  const active = () => container.querySelectorAll(".active");
  const completed = () => container.querySelectorAll(".completed");
  
  //const wrapperEl = wrapper();
  
  fireEvent.click(toggle());  
  expect(toggle().checked).toBe(true);
  //expect(wrapperEl.className).toBe("completed");
  expect(count().textContent).toBe("0 items left");
  expect(removeCompleted().length).toBe(1);
  expect(active().length).toBe(0);
  expect(completed().length).toBe(1);
  
  fireEvent.click(toggle());
  expect(toggle().checked).toBe(false);
  //expect(wrapperEl.className).toBe("active");
  expect(count().textContent).toBe("1 item left");
  expect(removeCompleted().length).toBe(0);
  expect(active().length).toBe(1);
  expect(completed().length).toBe(0);
});

it("mark all tasks as done/undone", () => {
  var {container} = render(<App />);

  addTask(container, "new task");
  addTask(container, "new task");
  
  const task = (i) => container.querySelectorAll(".TaskItem").item(i);
  const active = () => container.querySelectorAll(".active");
  const completed = () => container.querySelectorAll(".completed");
  const count = () => container.querySelector(".count");
  const toggle = (i) => task(i).querySelector(".toggle");
  const toggleAll = () => container.querySelector(".toggle-all");

  fireEvent.click(toggleAll());
  expect(active().length).toBe(0);
  expect(completed().length).toBe(2);
  expect(toggle(0).checked).toBe(true);
  expect(toggle(1).checked).toBe(true);
  expect(toggleAll().checked).toBe(true);
  
  fireEvent.click(toggleAll());
  expect(active().length).toBe(2);
  expect(completed().length).toBe(0);
  expect(toggle(0).checked).toBe(false);
  expect(toggle(1).checked).toBe(false);
  expect(toggleAll().checked).toBe(false);
});

function addTask(container, text) {
  var input = container.querySelector(".add-new-task");
  fireEvent.change(input, {target: {value: text}});
  fireEvent.keyDown(input, {key: "Enter", keyCode: 13, which: 13});
  return input;
}