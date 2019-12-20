export class Todo {
  constructor() {
    this._tasks = [];
  }

  getUndone() {
    return this.getTasks().filter(task=>task.done===false);
  }

  getTasks() {
    return this._tasks;
  }

  add(task) {
    this._tasks.push(task);
  }

  update(task_id, callback) {
    /* for(let task of this._tasks) {
      if (task.id === task_id) {
        task = callback(task);
        return;
      }
    } */
    for(let i in this._tasks) {
      if (this._tasks[i].id === task_id) {
        this._tasks[i] = callback(this._tasks[i]);
        return;
      }
    }
    throw new Error("task not found");
  }
}

export class Task {
  constructor(text) {
    this.text = text;
    this.done = false;
    this.id = genId();
  }
}


function genId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}