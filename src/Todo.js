// task types
export const ALL = "all";
export const ACTIVE = "active";
export const COMPLETED = "completed";

export class Todo {
  constructor(tasks=[]) {
    this._tasks = tasks;
  }
  
  forEach(callback) {
    this._getTasks().forEach(callback)
  }

  _getTasks() {
    return this._tasks;
  }
  
  getTasksByType(taskType) {
    switch(taskType) {
      case ALL:       return this._getTasks();
      case ACTIVE:    return this._getTasks().filter(task => !task.completed);
      case COMPLETED: return this._getTasks().filter(task => task.completed);
      default:        throw new Error("bad task type");
    }
  }
  
  getTasksCountByType(taskType) {
    return this.getTasksByType(taskType).length;
  }

  get(task_id) {
    const i = this._lookup(task_id);
    return this._tasks[i];
  }

  add(task) {
    this._tasks.push(task);
  }
  
  remove(task_id) {
    const i = this._lookup(task_id);
    this._tasks.splice(i, 1);
  }
  
  removeCompleted() {
    this._filter(task => !task.completed);
  }
  
  _filter(callback) {
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
