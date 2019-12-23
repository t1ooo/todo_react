export class Todo {
  constructor(tasks=[]) {
    this._tasks = tasks;
  }

  getTasks() {
    return this._tasks;
  }

  add(task) {
    this._tasks.push(task);
  }

  update(task_id, callback) {
    const i = this._lookup(task_id);
    this._tasks[i] = callback(this._tasks[i]);
  }
  
  remove(task_id) {
    const i = this._lookup(task_id);
    this._tasks.splice(i, 1);
  }
  
  filter(callback) {
    this._tasks = this._tasks.filter(callback);
  }
  
  _lookup(task_id) {
    for(let i in this._tasks) {
      if (this._tasks[i].id === task_id) {
        return i;
      }
    }
    throw new Error("task not found");
  }
}

export class Task {
  constructor(text) {
    this.text = text;
    this.completed = false;
    this.id = genId();
  }
}

function genId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
