// @flow strict

import { describe, it, expect, beforeEach, afterEach } from 'jest-without-globals';
import React from "react";
import {App} from "./App";
import {Storage} from "./storage";
import {Todo, Task, ALL, ACTIVE, COMPLETED} from "./todo";
import {within} from '@testing-library/dom'
import {render, fireEvent} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import {render as reactDomRender, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';

const storage = new Storage(App._storagePrefix);
const storageSet = (val) => {
  storage.set(App._storageKey, val);
};
const storageRemove = () => {
  storage.remove(App._storageKey);
};

beforeEach(() => {
  storageRemove();
});

const taskText = (i = 0) => `task #${i}`;

describe("no tasks", () => {
  let ath;
  beforeEach(() => {
    ath = new AppTestHelper(render(<App />));
  });

  it("show header", () => {
    expect(ath.container()).toContainElement(ath.header());
  });

  it("hide body", () => {
    expect(ath.container()).not.toContainElement(ath.body());
  });

  it("hide footer", () => {
    expect(ath.container()).not.toContainElement(ath.footer());
  });
});

describe("add task", () => {
  let ath;
  beforeEach(() => {
    ath = new AppTestHelper(render(<App />));
    ath.addTask(taskText());
  });

  // visibility
  it("show header", () => {
    expect(ath.container()).toContainElement(ath.header());
  });

  it("show body", () => {
    expect(ath.container()).toContainElement(ath.body());
  });

  it("show footer", () => {
    expect(ath.container()).toContainElement(ath.footer());
  });

  // task_add_input_field
  it("task_add_input_field has placeholder", () => {
    expect(ath.input().placeholder).toBe("What needs to be complete?");
  });

  it("focus on task_add_input_field", () => {
    expect(ath.input()).toHaveFocus();
  });

  it("clear task_add_input_field after task is added", () => {
    expect(ath.input().value).toBe("");
  });

  // task
  it("add task to the end of task list", () => {
    expect(ath.tasks().length).toBe(1);
    expect(ath.lastTask().text().textContent).toBe(taskText());
  });

  it("not add task when text_task is empty", () => {
    const len = ath.tasks().length;
    ath.addTask("");
    expect(ath.tasks().length).toBe(len);
  });

  it("task is unchecked", () => {
    expect(ath.lastTask().toggle().checked).toBe(false);
  });

  it("task is active", () => {
    expect(ath.lastTask().status()).toBe("active");
  });

  it("trim task_text", () => {
    ath.addTask("  " + taskText() + "  ");
    expect(ath.lastTask().text().textContent).toBe(taskText());
  });

  // tasks_left_count
  it("increment tasks_left_count", () => {
    expect(ath.taskCount().textContent).toBe("1 item left");
  });
});

describe("mark task as done", () => {
  let ath;
  beforeEach(() => {
    ath = new AppTestHelper(render(<App />));
    ath.addTask(taskText());
    click(ath.lastTask().toggle());
  });

  // task
  it("task is checked", () => {
    expect(ath.lastTask().toggle().checked).toBe(true);
  });

  it("task is completed", () => {
    //expect(ath.completedTasks().length).toBe(1);
    expect(ath.lastTask().status()).toBe("completed");
  });

  // tasks_left_count
  it("decrement tasks_left_count", () => {
    expect(ath.taskCount().textContent).toBe("0 items left");
  });

  // completed_tasks_clear_button
  it("show completed_tasks_clear_button", () => {
    expect(ath.footer()).toContainElement(ath.removeCompleted());
  });
});

describe("mark task as undone", () => {
  let ath;
  beforeEach(() => {
    ath = new AppTestHelper(render(<App />));
    ath.addTask(taskText());
    click(ath.lastTask().toggle());
    click(ath.lastTask().toggle());
  });

  // task
  it("task is unchecked", () => {
    expect(ath.lastTask().toggle().checked).toBe(false);
  });

  it("task is active", () => {
    expect(ath.lastTask().status()).toBe("active");
  });

  // tasks_left_count
  it("increment tasks_left_count", () => {
    expect(ath.taskCount().textContent).toBe("1 item left");
  });

  // completed_tasks_clear_button
  it("hide completed_tasks_clear_button", () => {
    expect(ath.footer()).not.toContainElement(ath.removeCompleted());
  });
});

describe("mark all task as done", () => {
  const count = 5;
  let ath;
  beforeEach(() => {
    ath = new AppTestHelper(render(<App />));
    for(let i=0; i<count; i++) {
      ath.addTask(taskText(i));
    }
    click(ath.toggleAll());
  });

  // toggle all
  it("toggle_all is checked", () => {
    expect(ath.toggleAll().checked).toBe(true);
  });

  // task
  it("all task is checked", () => {
    ath.tasks().forEach(task=>{
      expect(task.toggle().checked).toBe(true);
    });
  });

  it("all task is completed", () => {
    ath.tasks().forEach(task=>{
      expect(task.status()).toBe("completed");
    });
  });

  // tasks_left_count
  it("decrement tasks_left_count", () => {
    expect(ath.taskCount().textContent).toBe("0 items left");
  });

  // completed_tasks_clear_button
  it("show completed_tasks_clear_button", () => {
    expect(ath.footer()).toContainElement(ath.removeCompleted());
  });
});

describe("mark all task as undone", () => {
  const count = 5;
  let ath;
  beforeEach(() => {
    ath = new AppTestHelper(render(<App />));
    for(let i=0; i<count; i++) {
      ath.addTask(taskText(i));
    }
    click(ath.toggleAll());
    click(ath.toggleAll());
  });

  // toggle all
  it("toggle_all is unchecked", () => {
    expect(ath.toggleAll().checked).toBe(false);
  });

  // task
  it("all task is unchecked", () => {
    ath.tasks().forEach(task=>{
      expect(task.toggle().checked).toBe(false);
    });
  });

  it("all task is active", () => {
    ath.tasks().forEach(task=>{
      expect(task.status()).toBe("active");
    });
  });

  // tasks_left_count
  it("increment tasks_left_count", () => {
    expect(ath.taskCount().textContent).toBe(`${count} items left`);
  });

  // completed_tasks_clear_button
  it("hide completed_tasks_clear_button", () => {
    expect(ath.footer()).not.toContainElement(ath.removeCompleted());
  });
});

describe("remove task", () => {
  let ath;
  beforeEach(() => {
    ath = new AppTestHelper(render(<App />));
    ath.addTask(taskText(0));
    ath.addTask(taskText(1));
  });

  // task
  it("remove task", () => {
    expect(ath.tasks().length).toBe(2);
    click(ath.lastTask().remove());
    expect(ath.tasks().length).toBe(1);
    expect(ath.lastTask().text().textContent).toBe(taskText(0));
  });
});

describe("remove completed tasks", () => {
  const count = 5;
  let ath;
  beforeEach(() => {
    ath = new AppTestHelper(render(<App />));
    for(let i=0; i<count; i++) {
      ath.addTask(taskText(i));
    }
    click(ath.task(1).toggle());
    click(ath.task(3).toggle());
    click(ath.removeCompleted());
  });

  it("remove task", () => {
    expect(ath.tasks().length).toBe(3);
    expect(ath.task(0).text().textContent).toBe(taskText(0));
    expect(ath.task(1).text().textContent).toBe(taskText(2));
    expect(ath.task(2).text().textContent).toBe(taskText(4));
  });

  it("hide completed_tasks_clear_button", () => {
    expect(ath.footer()).not.toContainElement(ath.removeCompleted());
  });
});

describe("edit task", () => {
  let ath;
  beforeEach(() => {
    ath = new AppTestHelper(render(<App />));
    ath.addTask(taskText());
  });

  const editTask = (task, newText, callback) => {
    fireEvent.doubleClick(task.text());
    const edit = task.edit();
    changeInput(edit, newText);
  };

  it("hide task_edit_input before edit", () => {
    expect(ath.lastTask().element()).not.toContainElement(ath.lastTask().edit());
  });

  it("show task_edit_input after double click to task", () => {
    fireEvent.doubleClick(ath.lastTask().text());
    expect(ath.lastTask().element()).toContainElement(ath.lastTask().edit());
  });

  it("hide task_edit_input after edit", () => {
    const task = ath.lastTask();
    const newText = "updated task";
    editTask(task, newText);
    pressEnter(task.edit());
    expect(task.element()).not.toContainElement(task.edit());
  });

  it("hide task_text when double click to task", () => {
    const task = ath.lastTask();
    fireEvent.doubleClick(task.text());
    expect(task.element()).not.toContainElement(task.text());
  });

  it("set cursor to input field",() => {
    const task = ath.lastTask();
    fireEvent.doubleClick(task.text());
    expect(task.edit()).toHaveFocus();
  });

  it("update task when type text and press [enter]", () => {
    const task = ath.lastTask();
    const newText = "updated task";
    editTask(task, newText);
    pressEnter(task.edit());
    expect(task.text().textContent).toBe(newText);
  });

  it("update task when task_edit_input is blured", () => {
    const task = ath.lastTask();
    const newText = "updated task";
    editTask(task, newText);
    blur(task.edit());
    expect(task.text().textContent).toBe(newText);
  });

  it("trim task_text", () => {
    const task = ath.lastTask();
    const newText = "updated task";
    editTask(task, "  "+newText+"  ");
    pressEnter(task.edit());
    expect(task.text().textContent).toBe(newText);
  });

  it("remove task when type empty text and press [enter]", () => {
    const task = ath.lastTask();
    const newText = "";
    editTask(task, newText);
    pressEnter(task.edit());
    expect(ath.tasks().length).toBe(0);
    expect(ath.tasks().indexOf(task)).toBe(-1);
  });

  it("NOT update task when type text and press [escape]", () => {
    const task = ath.lastTask();
    const newText = "updated task";
    editTask(task, newText);
    pressEscape(task.edit());
    expect(task.text().textContent).toBe(taskText());
  });
});

describe("show task by type", () => {
  const count = 3;
  let ath;
  beforeEach(() => {
    ath = new AppTestHelper(render(<App />));
    for(let i=0; i<count; i++) {
      ath.addTask(taskText(i));
    }
    click(ath.task(1).toggle());
  });

  it("show active tasks when click to active_tasks_button", () => {
    click(ath.showActive());
    expect(ath.tasks().length).toBe(2);
    expect(ath.task(0).text().textContent).toBe(taskText(0));
    expect(ath.task(1).text().textContent).toBe(taskText(2));
  });

  it("show completed tasks when click to completed_tasks_button", () => {
    click(ath.showCompleted());
    expect(ath.task(0).text().textContent).toBe(taskText(1));
  });

  it("show all tasks when click to all_task_button", () => {
    click(ath.showAll());
    expect(ath.tasks().length).toBe(3);
    expect(ath.task(0).text().textContent).toBe(taskText(0));
    expect(ath.task(1).text().textContent).toBe(taskText(1));
    expect(ath.task(2).text().textContent).toBe(taskText(2));
  });
});

function append() {
  const container = document.createElement('div');
  document.body && document.body.appendChild(container);
  return container;
}

function remove(container) {
  unmountComponentAtNode(container);
  container.remove();
  return null;
}

describe("restore state", () => {
  let container;
  beforeEach(() => {
    container = append();
  });

  afterEach(() => {
    container = remove(container);
  });

  it("equal state after restore", () => {
    const state1 = () => {
      const app = reactDomRender(<App />, container);
      app._addTask(taskText(0));
      app._addTask(taskText(1));
      app._addTask(taskText(2));
      app._toggleAll();
      const state = JSON.stringify(app.state);
      return state;
    };

    const state2 = () => {
      const app = reactDomRender(<App />, container);
      const state = JSON.stringify(app.state);
      return state;
    };

    expect(state1()).toStrictEqual(state2());
  });

  it("not equal state after restore", () => {
    const state1 = () => {
      const app = reactDomRender(<App />, container);
      app._addTask(taskText(0));
      app._addTask(taskText(1));
      app._addTask(taskText(2));
      app._toggleAll();
      const state = JSON.stringify(app.state);
      app._addTask(taskText(3));
      return state;
    };

    const state2 = () => {
      const app = reactDomRender(<App />, container);
      const state = JSON.stringify(app.state);
      return state;
    };

    expect(state1()).not.toStrictEqual(state2());
  });
});

describe("parse state", () => {
  let container;
  beforeEach(() => {
    container = append();
  });

  afterEach(() => {
    container = remove(container);
  });

  const defaultState = {
    todo: {tasks:[{text:"text", completed:true, id: "id"}]},
    taskType: "all",
    toggleAllChecked: true,
  };

  const updateState = (key, val) => ({...defaultState, [key]:val});

  const testValid = (key, table) => {
    it.each(table)(`no error when ${key} is valid: %p`, (val) => {
      const state = updateState(key, val);
      const stateJson = JSON.stringify(state);
      const app = reactDomRender(<App />, container);
      app._parseState(stateJson);
    });
  };

  const testInvalid = (key, table) => {
    it.each(table)(`throw error when ${key} is invalid: %p`, (val) => {
      const state = updateState(key, val);
      const stateJson = JSON.stringify(state);
      const app = reactDomRender(<App />, container);
      expect(() => {
        app._parseState(stateJson);
      }).toThrow();
    });
  };

  testValid("todo", [defaultState.todo]);
  testValid("taskType", [ALL, ACTIVE, COMPLETED]);
  testValid("toggleAllChecked", [true, false]);

  testInvalid("todo", ["", null, undefined, {}, {tasks:null}]);
  testInvalid("taskType", ["", null, undefined]);
  testInvalid("toggleAllChecked", ["", null, undefined]);
});

class AppTestHelper {
  cnt;
  getByPlaceholderText;
  getByTitle;
  getByText;
  queryByText;

  constructor(renderResult) {
    const {container, getByPlaceholderText, getByTitle, getByText, queryByText} = renderResult;
    this.cnt = container;
    this.getByPlaceholderText = getByPlaceholderText;
    this.getByTitle = getByTitle;
    this.getByText = getByText;
    this.queryByText = queryByText;
  }

  container = () => this.cnt;

  header = () => this.cnt.querySelector(".TodoHeader");
  body = () => this.cnt.querySelector(".TodoBody");
  footer = () => this.cnt.querySelector(".TodoFooter");

  tasks = () => [...this.cnt.querySelectorAll(".TaskItem")].map(x=>new TaskTestHelper(x));
  task = (i) => this.tasks()[i];
  lastTask = () => arrayLast(this.tasks());

  input = () => this.getByPlaceholderText("What needs to be complete?");
  toggleAll = () => this.getByTitle("toggle all tasks");

  activeTasks = () => this.cnt.querySelectorAll("[data-status='active']");
  completedTasks = () => this.cnt.querySelectorAll("[data-status='completed']");

  taskCount = () => this.cnt.querySelector(".count");
  removeCompleted = () => this.queryByText("remove completed");

  showAll = () => this.getByText("all");
  showActive = () => this.getByText("active");
  showCompleted = () => this.getByText("completed");

  addTask = text => {
    var input = this.input();
    fireEvent.change(input, {target: {value: text}});
    fireEvent.keyDown(input, {key: "Enter", keyCode: 13, which: 13});
  };
}

class TaskTestHelper {
  el;
  task;

  constructor(el) {
    this.el = el;
    this.task = within(el);
  }

  element = () => this.el;
  text = () => this.task.queryByTitle("double click to edit task text");
  toggle = () => this.task.getByTitle("toggle task");
  remove = () => this.task.getByText("remove");
  status = () => this.el.getAttribute("data-status");
  edit = () => this.task.queryByTitle("edit task text");
}

function click(el) {
  fireEvent.click(el);
}

function changeInput(el, text) {
  fireEvent.change(el, {target: {value: text}});
}

function pressEnter(el) {
  fireEvent.keyDown(el, {key: "Enter", keyCode: 13, which: 13});
}

function pressEscape(el) {
  fireEvent.keyDown(el, {key: "Escape", keyCode: 27, which: 27});
}

function blur(el) {
  fireEvent.blur(el);
}

function arrayLast(arr) {
  return arr[arr.length - 1];
}
