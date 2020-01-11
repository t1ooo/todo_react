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

const storage = new Storage(App.storagePrefix);
const storageSet = (val) => {
  storage.set(App.storageKey, val);
};

beforeEach(() => {
  storage.remove(App.storageKey);
});

const taskText = (i = 0) => `task #${i}`;

describe("no tasks", () => {
  let ath;
  beforeEach(() => {
    ath = new AppTestHelper(render(<App />));
  });

  it("show header", () => {
    expect(ath.contains(ath.header())).toBe(true);
  });

  it("hide body", () => {
    expect(ath.contains(ath.body())).toBe(false);
  });

  it("hide footer", () => {
    expect(ath.contains(ath.footer())).toBe(false);
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
    expect(ath.contains(ath.header())).toBe(true);
  });

  it("show body", () => {
    expect(ath.contains(ath.body())).toBe(true);
  });

  it("show footer", () => {
    expect(ath.contains(ath.footer())).toBe(true);
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
    expect(ath.containsTask(taskText())).toBe(true);
  });

  it("not add task when text_task is empty", () => {
    const len = ath.tasks().length;
    ath.addTask("");
    expect(ath.tasks().length).toBe(len);
  });

  it("task is unchecked", () => {
    expect(ath.lastTask().checked()).toBe(false);
  });

  it("trim task_text", () => {
    const text = "  " + taskText(1) + "  ";
    ath.addTask(text);
    expect(ath.containsTask(text.trim())).toBe(true);
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
    ath.lastTask().clickToggle();
  });

  // task
  it("task is checked", () => {
    expect(ath.lastTask().checked()).toBe(true);
  });

  // tasks_left_count
  it("decrement tasks_left_count", () => {
    expect(ath.taskCount().textContent).toBe("0 items left");
  });

  // completed_tasks_clear_button
  it("show completed_tasks_clear_button", () => {
    expect(ath.contains(ath.removeCompleted())).toBe(true);
  });
});

describe("mark task as undone", () => {
  let ath;
  beforeEach(() => {
    ath = new AppTestHelper(render(<App />));
    ath.addTask(taskText());
    ath.lastTask().clickToggle();
    ath.lastTask().clickToggle();
  });

  // task
  it("task is unchecked", () => {
    expect(ath.lastTask().checked()).toBe(false);
  });

  // tasks_left_count
  it("increment tasks_left_count", () => {
    expect(ath.taskCount().textContent).toBe("1 item left");
  });

  // completed_tasks_clear_button
  it("hide completed_tasks_clear_button", () => {
    expect(ath.contains(ath.removeCompleted())).toBe(false);
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
      expect(task.checked()).toBe(true);
    });
  });

  // tasks_left_count
  it("decrement tasks_left_count", () => {
    expect(ath.taskCount().textContent).toBe("0 items left");
  });

  // completed_tasks_clear_button
  it("show completed_tasks_clear_button", () => {
    expect(ath.contains(ath.removeCompleted())).toBe(true);
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
      expect(task.checked()).toBe(false);
    });
  });

  // tasks_left_count
  it("increment tasks_left_count", () => {
    expect(ath.taskCount().textContent).toBe(`${count} items left`);
  });

  // completed_tasks_clear_button
  it("hide completed_tasks_clear_button", () => {
    expect(ath.contains(ath.removeCompleted())).toBe(false);
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
    const len = ath.tasks().length;
    ath.lastTask().clickRemove();
    expect(ath.tasks().length).toBe(len-1);
    expect(ath.containsTask(taskText(0))).toBe(true);
    expect(ath.containsTask(taskText(1))).toBe(false);
  });
});

describe("remove completed tasks", () => {
  const count = 4;
  let ath;
  beforeEach(() => {
    ath = new AppTestHelper(render(<App />));
    for(let i=0; i<count; i++) {
      ath.addTask(taskText(i));
    }
    ath.task(1).clickToggle();
    ath.task(3).clickToggle();
    click(ath.removeCompleted());
  });

  it("remove task", () => {
    expect(ath.tasks().length).toBe(2);
    expect(ath.containsTask(taskText(0))).toBe(true);
    expect(ath.containsTask(taskText(1))).toBe(false);
    expect(ath.containsTask(taskText(2))).toBe(true);
    expect(ath.containsTask(taskText(3))).toBe(false);
  });

  it("hide completed_tasks_clear_button", () => {
    expect(ath.contains(ath.removeCompleted())).toBe(false);
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
    const task = ath.lastTask();
    expect(task.contains(task.edit())).toBe(false);
  });

  it("show task_edit_input after double click to task", () => {
    const task = ath.lastTask();
    fireEvent.doubleClick(task.text());
    expect(task.contains(task.edit())).toBe(true);
  });

  it("hide task_edit_input after edit", () => {
    const task = ath.lastTask();
    const newText = "updated task";
    editTask(task, newText);
    pressEnter(task.edit());
    expect(task.contains(task.edit())).toBe(false);
  });

  it("hide task_text when double click to task", () => {
    const task = ath.lastTask();
    fireEvent.doubleClick(task.text());
    expect(task.contains(task.text())).toBe(false);
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
    expect(task.getText()).toBe(newText);
  });

  it("update task when task_edit_input is blured", () => {
    const task = ath.lastTask();
    const newText = "updated task";
    editTask(task, newText);
    blur(task.edit());
    expect(task.getText()).toBe(newText);
  });

  it("trim task_text", () => {
    const task = ath.lastTask();
    const newText = "updated task";
    editTask(task, "  "+newText+"  ");
    pressEnter(task.edit());
    expect(task.getText()).toBe(newText);
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
    expect(task.getText()).toBe(taskText());
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
    ath.task(1).clickToggle();
  });

  it("show active tasks when click to active_tasks_button", () => {
    click(ath.showActive());
    expect(ath.tasks().length).toBe(2);
    expect(ath.containsTask(taskText(0))).toBe(true);
    expect(ath.containsTask(taskText(1))).toBe(false);
    expect(ath.containsTask(taskText(2))).toBe(true);
  });

  it("show completed tasks when click to completed_tasks_button", () => {
    click(ath.showCompleted());
    expect(ath.containsTask(taskText(0))).toBe(false);
    expect(ath.containsTask(taskText(1))).toBe(true);
    expect(ath.containsTask(taskText(2))).toBe(false);
  });

  it("show all tasks when click to all_task_button", () => {
    click(ath.showAll());
    expect(ath.tasks().length).toBe(3);
    expect(ath.containsTask(taskText(0))).toBe(true);
    expect(ath.containsTask(taskText(1))).toBe(true);
    expect(ath.containsTask(taskText(2))).toBe(true);
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
      app.addTask(taskText(0));
      app.addTask(taskText(1));
      app.addTask(taskText(2));
      app.toggleAll();
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
      app.addTask(taskText(0));
      app.addTask(taskText(1));
      app.addTask(taskText(2));
      app.toggleAll();
      const state = JSON.stringify(app.state);
      app.addTask(taskText(3));
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
      const json = JSON.stringify(updateState(key, val));
      const app = reactDomRender(<App />, container);
      app.parseState(json);
    });
  };

  const testInvalid = (key, table) => {
    it.each(table)(`throw error when ${key} is invalid: %p`, (val) => {
      const json = JSON.stringify(updateState(key, val));
      const app = reactDomRender(<App />, container);
      expect(() => {
        app.parseState(json);
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
  
  contains = el => this.cnt.contains(el);
  containsTask = taskText => this.queryByText(taskText) !== null;
}

class TaskTestHelper {
  el;
  task;

  constructor(el) {
    this.el = el;
    this.task = within(el);
  }

  text = () => this.task.queryByTitle("double click to edit task text");
  edit = () => this.task.queryByTitle("edit task text");
  
  contains = el => this.el.contains(el);
  checked = () => this.task.getByTitle("toggle task").checked;
  clickRemove = () => click(this.task.getByText("remove"));
  clickToggle = () => click(this.task.getByTitle("toggle task"));
  getText = () => this.text().textContent;
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