// @flow

// task types
export const ALL = "all";
export const ACTIVE = "active";
export const COMPLETED = "completed";

export type TaskType = "all" | "active" | "completed";

export class Todo {
  _tasks: Array<Task>;
  
  constructor(tasks: Array<Task> = []) {
    this._tasks = tasks.map(
      task => new Task(task.text, task.completed, task.id)
    );
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
        throw new Error("bad task type");
    }
  }

  getCount(taskType: TaskType = ALL): number {
    return this.getTasks(taskType).length;
  }

  toggle(task_id: string) {
    const task = this._lookup(task_id);
    task.completed = !task.completed;
  }

  toggleAll(completed: bool) {
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
    this._filter(task => task.id !== task_id);
  }

  removeCompleted() {
    this._filter(task => !task.completed);
  }

  _filter(callback: (Task) => bool) {
    this._tasks = this._tasks.filter(callback);
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
    return this._tasks;
  }
}

export class Task {
  text: string;
  completed: bool;
  id: string;

  constructor(text: string, completed: bool = false, id: string = genId()) {
    this.text = text;
    this.completed = completed;
    this.id = id;
  }
}

function genId(): string {
  return (
    Math.random()
      .toString(36)
      .substring(2) + Date.now().toString(36)
  );
}
