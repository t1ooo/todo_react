import React from "react";
import {/* render as reactRender, */ unmountComponentAtNode} from "react-dom";
/* import { act } from "react-dom/test-utils"; */
import {App} from "./App";
import {act, render, fireEvent} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

beforeEach(() => {
  //localStorage.removeItem(App._storageKey);
  localStorage.clear();
});

const taskText = (i = 0) => `task #${i}`;

describe("no tasks", () => {
  let ath;
  beforeEach(() => {
    const {container} = render(<App />);
    ath = new AppTestHelper(container);
  });

  it("header should be visible", () => {
    expect(ath.header().length).toBe(1);
  });

  it("body should be NOT visible", () => {
    expect(ath.body().length).toBe(0);
  });

  it("footer should be NOT visible", () => {
    expect(ath.footer().length).toBe(0);
  });
});

describe("add task", () => {
  let ath;
  beforeEach(() => {
    const {container} = render(<App />);
    ath = new AppTestHelper(container);
    ath.addTask(taskText());
  });

  // visibility
  it("header should be visible", () => {
    expect(ath.header().length).toBe(1);
  });

  it("body should be visible", () => {
    expect(ath.body().length).toBe(1);
  });

  it("footer should be visible", () => {
    expect(ath.footer().length).toBe(1);
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
    expect(ath.task().length).toBe(1);
    expect(ath.taskText(ath.lastTask()).textContent).toBe(taskText());
  });

  it("task should be NOT added when text_task is empty", () => {
    const len = ath.task().length;
    ath.addTask("");
    expect(ath.task().length).toBe(len);
  });

  it("task should be NOT checked", () => {
    expect(ath.taskToggle(ath.lastTask()).checked).toBe(false);
  });

  it("task should be active", () => {
    //expect(ath.activeTask().length).toBe(1);
    expect(ath.taskStatus(ath.lastTask())).toBe("active");
  });

  it("task_text should be trimmed", () => {
    ath.addTask("  " + taskText() + "  ");
    expect(ath.taskText(ath.lastTask()).textContent).toBe(taskText());
  });

  // tasks_left_count
  it("tasks_left_count should be increment", () => {
    expect(ath.taskCount().textContent).toBe("1 item left");
  });
});

describe("mark task as done", () => {
  let ath;
  beforeEach(() => {
    const {container} = render(<App />);
    ath = new AppTestHelper(container);
    ath.addTask(taskText());
    ath.toggleTask(ath.lastTask());
  });

  // task
  it("task should be checked", () => {
    expect(ath.taskToggle(ath.lastTask()).checked).toBe(true);
  });

  it("task should be completed", () => {
    //expect(ath.completedTask().length).toBe(1);
    expect(ath.taskStatus(ath.lastTask())).toBe("completed");
  });
  
  // tasks_left_count
  it("tasks_left_count should be decrement", () => {
    expect(ath.taskCount().textContent).toBe("0 items left");
  });
  
  // completed_tasks_clear_button
  it("completed_tasks_clear_button should be visible", () => {
    expect(ath.removeCompleted().length).toBe(1);
  });
});

describe("mark task as undone", () => {
  let ath;
  beforeEach(() => {
    const {container} = render(<App />);
    ath = new AppTestHelper(container);
    ath.addTask(taskText());
    ath.toggleTask(ath.lastTask());
    ath.toggleTask(ath.lastTask());
  });

  // task
  it("task should be NOT checked", () => {
    expect(ath.taskToggle(ath.lastTask()).checked).toBe(false);
  });

  it("task should be active", () => {
    expect(ath.taskStatus(ath.lastTask())).toBe("active");
  });
  
  // tasks_left_count
  it("tasks_left_count should be increment", () => {
    expect(ath.taskCount().textContent).toBe("1 item left");
  });
  
  // completed_tasks_clear_button
  it("completed_tasks_clear_button should be NOT visible", () => {
    expect(ath.removeCompleted().length).toBe(0);
  });
});

describe("mark all task as done", () => {
  const count = 5;
  let ath;
  beforeEach(() => {
    const {container} = render(<App />);
    ath = new AppTestHelper(container); 
    for(let i=0; i<count; i++) {
      ath.addTask(taskText(i));
    }
    ath.toggleTaskAll();
  });

  // toggle all
  it("toggle_all should be checked", () => {
    ath.task().forEach(task=>{
      expect(ath.toggleAll().checked).toBe(true);
    });
  });

  // task
  it("all task should be checked", () => {
    ath.task().forEach(task=>{
      expect(ath.taskToggle(task).checked).toBe(true);
    });
  });
  
  //test.each([() => [... ath.task()]])("all task should be checked", task => {
  /* test.each(tasks)("all task should be checked", task => {
    expect(ath.taskToggle(task).checked).toBe(true);
  }); */

  it("all task should be completed", () => { 
    ath.task().forEach(task=>{
      expect(ath.taskStatus(task)).toBe("completed");
    });
  });
  
  // tasks_left_count
  it("tasks_left_count should be decrement", () => {
    expect(ath.taskCount().textContent).toBe("0 items left");
  });
  
  // completed_tasks_clear_button
  it("completed_tasks_clear_button should be visible", () => {
    expect(ath.removeCompleted().length).toBe(1);
  });
});

describe("mark all task as undone", () => {
  const count = 5;
  let ath;
  beforeEach(() => {
    const {container} = render(<App />);
    ath = new AppTestHelper(container); 
    for(let i=0; i<count; i++) {
      ath.addTask(taskText(i));
    }
    ath.toggleTaskAll();
    ath.toggleTaskAll();
  });

  // toggle all
  it("toggle_all should be NOT checked", () => {
    ath.task().forEach(task=>{
      expect(ath.toggleAll().checked).toBe(false);
    });
  });

  // task
  it("all task should be NOT checked", () => {
    ath.task().forEach(task=>{
      expect(ath.taskToggle(task).checked).toBe(false);
    });
  });
  
  //test.each([() => [... ath.task()]])("all task should be checked", task => {
  /* test.each(tasks)("all task should be checked", task => {
    expect(ath.taskToggle(task).checked).toBe(true);
  }); */

  it("all task should be active", () => { 
    ath.task().forEach(task=>{
      expect(ath.taskStatus(task)).toBe("active");
    });
  });
  
  // tasks_left_count
  it("tasks_left_count should be increment", () => {
    expect(ath.taskCount().textContent).toBe(`${count} items left`);
  });
  
  // completed_tasks_clear_button
  it("completed_tasks_clear_button should be NOT visible", () => {
    expect(ath.removeCompleted().length).toBe(0);
  });
});

describe("remove completed tasks", () => {
  const count = 5;
  let ath;
  beforeEach(() => {
    const {container} = render(<App />);
    ath = new AppTestHelper(container); 
    for(let i=0; i<count; i++) {
      ath.addTask(taskText(i));
    }
    ath.toggleTask(ath.task().item(1));
    ath.toggleTask(ath.task().item(3));
    click(ath.removeCompleted().item(0));
  });
  
  it("task should be removed", () => {
    expect(ath.task().length).toBe(3);
    expect(ath.taskText(ath.task().item(0)).textContent).toBe(taskText(0));
    expect(ath.taskText(ath.task().item(1)).textContent).toBe(taskText(2));
    expect(ath.taskText(ath.task().item(2)).textContent).toBe(taskText(4));
  });
  
  it("completed_tasks_clear_button should be NOT visible", () => {
    expect(ath.removeCompleted().length).toBe(0);
  });
});

describe("edit task", () => {
  let ath;
  beforeEach(() => {
    const {container} = render(<App />);
    ath = new AppTestHelper(container); 
    ath.addTask(taskText());
  });
  
  const editTask = (task, newText) => {
    fireEvent.doubleClick(ath.taskText(task));
    const edit = ath.taskEdit(task).item(0);
    changeInput(edit, newText);
    //pressEnter(edit);
    return edit;
  };
  
  it("task_edit_input should be NOT visible before edit", () => {
    expect(ath.taskEdit(ath.lastTask()).length).toBe(0);
  });
  
  it("task_edit_input should be visible after double click to task", () => {
    fireEvent.doubleClick(ath.taskText(ath.lastTask()));
    expect(ath.taskEdit(ath.lastTask()).length).toBe(1);
  });
  
  it("task_edit_input should be NOT visible after edit", () => {
    const task = ath.lastTask();
    const newText = "updated task";
    pressEnter(editTask(task, newText));
    expect(ath.taskEdit(ath.lastTask()).length).toBe(0);
  });
  
  it.todo("cursor should be setted to input field to end of task_text");
  
  it("task should be update, when type text and press [enter]", () => {
    const task = ath.lastTask();
    const newText = "updated task";
    pressEnter(editTask(task, newText));
    expect(ath.taskText(task).textContent).toBe(newText);
  });
  
  it("task_text should be trim", () => {
    const task = ath.lastTask();
    const newText = "updated task";
    pressEnter(editTask(task, "  "+newText+"  "));
    expect(ath.taskText(task).textContent).toBe(newText);
  });
  
  it("task should be remove, when type empty text and press [enter]", () => {
    const task = ath.lastTask();
    const newText = "";
    pressEnter(editTask(task, newText));
    expect(ath.task().length).toBe(0);
    expect([...ath.task()].indexOf(task)).toBe(-1);
  });
  
  it("task should be NOT update, when type text and press [escape]", () => {
    const task = ath.lastTask();
    const newText = "updated task";
    pressEscape(editTask(task, newText));
    expect(ath.taskText(task).textContent).toBe(taskText());
  }); 
});

describe("show task by type", () => {
  const count = 3;
  let ath;
  beforeEach(() => {
    const {container} = render(<App />);
    ath = new AppTestHelper(container); 
    for(let i=0; i<count; i++) {
      ath.addTask(taskText(i));
    }
    ath.toggleTask(ath.task().item(1));
  });
  
  it("should show active tasks, when click to active_tasks_button", () => {
    click(ath.showActive());
    expect(ath.task().length).toBe(2);
    expect(ath.taskText(ath.task().item(0)).textContent).toBe(taskText(0));
    expect(ath.taskText(ath.task().item(1)).textContent).toBe(taskText(2));
  });
  
  it("should show completed tasks, when click to completed_tasks_button", () => {
    click(ath.showCompleted());
    expect(ath.taskText(ath.task().item(0)).textContent).toBe(taskText(1));
  });
  
  it("should show all tasks, when click to all_task_button", () => {
    click(ath.showAll());
    expect(ath.task().length).toBe(3);
    expect(ath.taskText(ath.task().item(0)).textContent).toBe(taskText(0));
    expect(ath.taskText(ath.task().item(1)).textContent).toBe(taskText(1));
    expect(ath.taskText(ath.task().item(2)).textContent).toBe(taskText(2));
  });
});

class AppTestHelper {
  constructor(cnt) {
    this.cnt = cnt;
  }

  header = () => this.cnt.querySelectorAll(".TodoHeader");
  body = () => this.cnt.querySelectorAll(".TodoBody");
  footer = () => this.cnt.querySelectorAll(".TodoFooter");
  task = () => this.cnt.querySelectorAll(".TaskItem");
  lastTask = () => this.task().item(this.task().length - 1);
  input = () => this.cnt.querySelector(".add-new-task");
  taskCount = () => this.cnt.querySelector(".count");
  taskText = task => task.querySelector(".text");
  taskToggle = task => task.querySelector(".toggle");
  taskRemove = task => task.querySelector(".remove");
  taskStatus = task => task.getAttribute("data-status");
  taskEdit = task => task.querySelectorAll(".edit");
  activeTask = () => this.cnt.querySelectorAll("[data-status='active']");
  completedTask = () => this.cnt.querySelectorAll("[data-status='completed']");
  removeCompleted = () => this.cnt.querySelectorAll(".remove-completed");
  toggleAll = () => this.cnt.querySelector(".toggle-all");
  
  showAll = () => this.cnt.querySelector(".show-all");
  showActive = () => this.cnt.querySelector(".show-active");
  showCompleted = () => this.cnt.querySelector(".show-completed");

  addTask = text => {
    var input = this.input();
    fireEvent.change(input, {target: {value: text}});
    fireEvent.keyDown(input, {key: "Enter", keyCode: 13, which: 13});
  };
  
  toggleTask = task => {
    click(this.taskToggle(task));
  };
  
  toggleTaskAll = task => {
    click(this.toggleAll());
  };
}

function click(el) {
  fireEvent.click(el);
}

function addTask(container, text) {
  var input = container.querySelector(".add-new-task");
  fireEvent.change(input, {target: {value: text}});
  fireEvent.keyDown(input, {key: "Enter", keyCode: 13, which: 13});
  return input;
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

function isFocused(el, document) {
  return el === document.activeElement;
}
