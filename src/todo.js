// @flow strict

import {isBool, isString} from "./typeof.js";
import {genId} from "./genid.js";

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

  static fromObject(o: Object): Todo {
    if (! Array.isArray(o.tasks)) {
      throw new Error("bad tasks");
    }
    const todo = new Todo();
    todo._tasks = o.tasks.map(Task.fromObject);
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

  toJSON(): Object {
    return {
      tasks: this._tasks
    };
  }
}

export class Task {
  _text: string;
  _completed: boolean = false;
  _id: string = genId();

  constructor(text: string) {
    this.text = text;
  }

  get text(): string { return this._text; }
  set text(val: string) {
    if (! isString(val) || val === "") {
      throw new Error("bad text");
    }
    this._text = val;
  }

  get completed(): bool { return this._completed; }
  set completed(val: bool) {
    if (! isBool(val)) {
      throw new Error("bad completed");
    }
    this._completed = val;
  }

  get id(): string { return this._id; }
  set id(val: string) {
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

  toJSON(): Object {
    return {
      text: this._text,
      completed: this._completed,
      id: this._id,
    };
  }
}
