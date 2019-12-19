export class Todo {
  constructor() {
    this._tasks = [];
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
