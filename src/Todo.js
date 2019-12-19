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
}

export class Task {
  constructor(text) {
    this.text = text;
    this.done = false;
  }
}
