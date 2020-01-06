import React from "react";
import {App} from "./App";
import {within} from '@testing-library/dom'
import {render, fireEvent} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

beforeEach(() => {
  localStorage.clear();
});

const taskText = (i = 0) => `task #${i}`;

describe("no tasks", () => {
  let ath;
  beforeEach(() => {
    ath = new AppTestHelper(render(<App />));
  });

  it("header should be visible", () => {
    expect(ath.container()).toContainElement(ath.header());
  });

  it("body should be NOT visible", () => {
    expect(ath.container()).not.toContainElement(ath.body());
  });

  it("footer should be NOT visible", () => {
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
  it("header should be visible", () => {
    expect(ath.container()).toContainElement(ath.header());
  });

  it("body should be visible", () => {
    expect(ath.container()).toContainElement(ath.body());
  });

  it("footer should be visible", () => {
    expect(ath.container()).toContainElement(ath.footer());
  });

  // task_add_input_field
  it("task_add_input_field should has placeholder", () => {
    expect(ath.input().placeholder).toBe("What needs to be complete?");
  });

  it("task_add_input_field should be focused", () => {
    expect(ath.input()).toHaveFocus();
  });

  it("task_add_input_field should be cleared after task added", () => {
    expect(ath.input().value).toBe("");
  });

  // task
  it("task should be added to the end of task list", () => {
    expect(ath.tasks().length).toBe(1);
    expect(ath.lastTask().text().textContent).toBe(taskText());
  });

  it("task should be NOT added when text_task is empty", () => {
    const len = ath.tasks().length;
    ath.addTask("");
    expect(ath.tasks().length).toBe(len);
  });

  it("task should be NOT checked", () => {
    expect(ath.lastTask().toggle().checked).toBe(false);
  });

  it("task should be active", () => {
    expect(ath.lastTask().status()).toBe("active");
  });

  it("task_text should be trimmed", () => {
    ath.addTask("  " + taskText() + "  ");
    expect(ath.lastTask().text().textContent).toBe(taskText());
  });

  // tasks_left_count
  it("tasks_left_count should be increment", () => {
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
  it("task should be checked", () => {
    expect(ath.lastTask().toggle().checked).toBe(true);
  });

  it("task should be completed", () => {
    //expect(ath.completedTasks().length).toBe(1);
    expect(ath.lastTask().status()).toBe("completed");
  });

  // tasks_left_count
  it("tasks_left_count should be decrement", () => {
    expect(ath.taskCount().textContent).toBe("0 items left");
  });

  // completed_tasks_clear_button
  it("completed_tasks_clear_button should be visible", () => {
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
  it("task should be NOT checked", () => {
    expect(ath.lastTask().toggle().checked).toBe(false);
  });

  it("task should be active", () => {
    expect(ath.lastTask().status()).toBe("active");
  });

  // tasks_left_count
  it("tasks_left_count should be increment", () => {
    expect(ath.taskCount().textContent).toBe("1 item left");
  });

  // completed_tasks_clear_button
  it("completed_tasks_clear_button should be NOT visible", () => {
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
  it("toggle_all should be checked", () => {
    expect(ath.toggleAll().checked).toBe(true);
  });

  // task
  it("all task should be checked", () => {
    ath.tasks().forEach(task=>{
      expect(task.toggle().checked).toBe(true);
    });
  });

  it("all task should be completed", () => {
    ath.tasks().forEach(task=>{
      expect(task.status()).toBe("completed");
    });
  });

  // tasks_left_count
  it("tasks_left_count should be decrement", () => {
    expect(ath.taskCount().textContent).toBe("0 items left");
  });

  // completed_tasks_clear_button
  it("completed_tasks_clear_button should be visible", () => {
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
  it("toggle_all should be NOT checked", () => {
    expect(ath.toggleAll().checked).toBe(false);
  });

  // task
  it("all task should be NOT checked", () => {
    ath.tasks().forEach(task=>{
      expect(task.toggle().checked).toBe(false);
    });
  });

  it("all task should be active", () => {
    ath.tasks().forEach(task=>{
      expect(task.status()).toBe("active");
    });
  });

  // tasks_left_count
  it("tasks_left_count should be increment", () => {
    expect(ath.taskCount().textContent).toBe(`${count} items left`);
  });

  // completed_tasks_clear_button
  it("completed_tasks_clear_button should be NOT visible", () => {
    expect(ath.footer()).not.toContainElement(ath.removeCompleted());
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

  it("task should be removed", () => {
    expect(ath.tasks().length).toBe(3);
    expect(ath.task(0).text().textContent).toBe(taskText(0));
    expect(ath.task(1).text().textContent).toBe(taskText(2));
    expect(ath.task(2).text().textContent).toBe(taskText(4));
  });

  it("completed_tasks_clear_button should be NOT visible", () => {
    expect(ath.footer()).not.toContainElement(ath.removeCompleted());
  });
});

describe("edit task", () => {
  let ath;
  beforeEach(() => {
    ath = new AppTestHelper(render(<App />));
    ath.addTask(taskText());
  });

  const editTask = (task, newText, key) => {
    fireEvent.doubleClick(task.text());
    const edit = task.edit();
    changeInput(edit, newText);
    keyDown(edit, key);
    return edit;
  };

  it("task_edit_input should be NOT visible before edit", () => {
    expect(ath.lastTask().element()).not.toContainElement(ath.lastTask().edit());
  });

  it("task_edit_input should be visible after double click to task", () => {
    fireEvent.doubleClick(ath.lastTask().text());
    expect(ath.lastTask().element()).toContainElement(ath.lastTask().edit());
  });

  it("task_edit_input should be NOT visible after edit", () => {
    const task = ath.lastTask();
    const newText = "updated task";
    editTask(task, newText, ENTER);
    expect(task.element()).not.toContainElement(task.edit());
  });

  it.todo("task_text should be NOT visible, when double click to task");

  it.todo("cursor should be setted to input field to end of task_text");

  it("task should be update, when type text and press [enter]", () => {
    const task = ath.lastTask();
    const newText = "updated task";
    editTask(task, newText, ENTER);
    expect(task.text().textContent).toBe(newText);
  });

  it("task_text should be trim", () => {
    const task = ath.lastTask();
    const newText = "updated task";
    editTask(task, "  "+newText+"  ", ENTER);
    expect(task.text().textContent).toBe(newText);
  });

  it("task should be remove, when type empty text and press [enter]", () => {
    const task = ath.lastTask();
    const newText = "";
    editTask(task, newText, ENTER);
    expect(ath.tasks().length).toBe(0);
    expect(ath.tasks().indexOf(task)).toBe(-1);
  });

  it("task should be NOT update, when type text and press [escape]", () => {
    const task = ath.lastTask();
    const newText = "updated task";
    editTask(task, newText, ESCAPE);
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

  it("should show active tasks, when click to active_tasks_button", () => {
    click(ath.showActive());
    expect(ath.tasks().length).toBe(2);
    expect(ath.task(0).text().textContent).toBe(taskText(0));
    expect(ath.task(1).text().textContent).toBe(taskText(2));
  });

  it("should show completed tasks, when click to completed_tasks_button", () => {
    click(ath.showCompleted());
    expect(ath.task(0).text().textContent).toBe(taskText(1));
  });

  it("should show all tasks, when click to all_task_button", () => {
    click(ath.showAll());
    expect(ath.tasks().length).toBe(3);
    expect(ath.task(0).text().textContent).toBe(taskText(0));
    expect(ath.task(1).text().textContent).toBe(taskText(1));
    expect(ath.task(2).text().textContent).toBe(taskText(2));
  });
});

class AppTestHelper {
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
  constructor(el) {
    this.el = el;
    this.task = within(el);
  }

  element = () => this.el;
  text = () => this.task.getByTitle("double click to edit task text");
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

const ENTER = {key: "Enter", keyCode: 13, which: 13};
const ESCAPE = {key: "Escape", keyCode: 27, which: 27};

function keyDown(el, key) {
  fireEvent.keyDown(el, key);
}

function arrayLast(arr) {
  return arr[arr.length - 1];
}