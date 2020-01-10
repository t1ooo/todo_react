// @flow

import {isBool, isString} from "./typeof.js";

// task types
export const ALL = "all";
export const ACTIVE = "active";
export const COMPLETED = "completed";

export type TaskType = "all" | "active" | "completed";

export function isTaskType(taskType: mixed): bool {
  return [ALL, ACTIVE, COMPLETED].includes(taskType);
}

export class Todo {
  _tasks: Array<Task> = [];

  static fromObject({tasks}): Todo {
    if (! Array.isArray(tasks)) {
      throw new Error("bad tasks");
    }
    const todo = new Todo();
    todo._tasks = tasks.map(x => Task.fromObject(x));
    return todo;
  }

  getTasks(taskType: TaskType = ALL): Array<Task> {
    switch (taskType) {
      case ALL:
        return this._tasks;
      case ACTIVE:
        return this._tasks.filter(task => !task.completed);
      case COMPLETED:
        return this._tasks.filter(task => task.completed);
      default:
        throw new Error("bad taskType");
    }
  }

  getCount(taskType: TaskType = ALL): number {
    return this.getTasks(taskType).length;
  }

  toggle(task_id: string) {
    const task = this._lookup(task_id);
    task.completed = !task.completed;
  }

  toggleAll(completed: boolean) {
    this._tasks.forEach(task => (task.completed = completed));
  }

  add(task: Task) {
    this._tasks.push(task);
  }

  edit(task_id: string, text: string) {
    const task = this._lookup(task_id);
    task.text = text;
  }

  remove(task_id: string) {
    this._tasks = this._tasks.filter(task => task.id !== task_id);
  }

  removeCompleted() {
    this._tasks = this._tasks.filter(task => !task.completed);
  }

  _lookup(task_id: string): Task {
    for (let task of this._tasks) {
      if (task.id === task_id) {
        return task;
      }
    }
    throw new Error("task not found");
  }

  toJSON(): Array<Task> {
    return {tasks: this.tasks};
  }
}

/* export class Task {
  text: string;
  completed: boolean;
  id: string;

  constructor(text: string, completed: boolean = false, id: string = genId()) {
    if (! isString(text) || text === "") {
      throw new Error("bad text");
    }
    if (! isBool(completed)) {
      throw new Error("bad completed");
    }
    if (! isString(id) || id === "") {
      throw new Error("bad id");
    }

    this.text = text;
    this.completed = completed;
    this.id = id;
  }
} */

export class Task {
  text: string;
  completed: boolean = false;
  id: string = genId();

  constructor(text: string) {
    if (! isString(text) || text === "") {
      throw new Error("bad text");
    }
    this.text = text;
  }

  static fromObject({text, completed, id}): Task {
    if (! isBool(completed)) {
      throw new Error("bad completed");
    }
    if (! isString(id) || id === "") {
      throw new Error("bad id");
    }

    const task = new Task(text);
    task.completed = completed;
    task.id = id;
    return task;
  }
}

/* export class Task {
  _text: string;
  _completed: boolean = false;
  _id: string = genId();

  constructor(text: string) {
    this.text = text;
  }
  
  get text() { return this._text; }
  set text(val) {
    if (! isString(val) || val === "") {
      throw new Error("bad text");
    }
    this._text = val;
  }
  
  get completed() { return this._completed; }
  set completed(val) {
    if (! isBool(val)) {
      throw new Error("bad completed");
    }
    this._completed = val;
  }
  
  get id() { return this._id; }
  set id(val) {
    if (! isString(val) || val === "") {
      throw new Error("bad id");
    }
    this._id = val;
  }

  static fromObject(o: Object): Task {
    const task = new Task(o.text);
    task.completed = o.completed;
    task.id = o.id;
    return task;
  }
  
  toJSON(): Array<Task> {
    return {
      text: this._text,
      completed: this._completed,
      id: this._id,      
    };
  }
} */

/* export class Task {
  _text: string;
  _completed: boolean = false;
  _id: string = genId();

  constructor(text: string) {
    this.setText(text);
  }
  
  function getText() { return this._text; }
  function setText(val) {
    if (! isString(val) || val === "") {
      throw new Error("bad text");
    }
    this._text = val;
  }
  
  function getCompleted() { return this._completed; }
  function setCompleted(val) {
    if (! isBool(val)) {
      throw new Error("bad completed");
    }
    this._completed = val;
  }
  
  function getId() { return this._id; }
  function setId(val) {
    if (! isString(val) || val === "") {
      throw new Error("bad id");
    }
    this._id = val;
  }

  static fromObject(o: Object): Task {
    const task = new Task(o.text);
    task.setCompleted(o.completed);
    task.setId(o.id);
    return task;
  }
}  */

function genId(): string {
  return (
    Math.random()
      .toString(36)
      .substring(2) + Date.now().toString(36)
  );
}