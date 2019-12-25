// task types
export const ALL = "all";
export const ACTIVE = "active";
export const COMPLETED = "completed";

export class Todo {
  constructor(tasks=[]) {
    this._tasks = tasks;
  }
  
  getTasksByType(taskType) {
    switch(taskType) {
      case ALL:       return this._tasks;
      case ACTIVE:    return this._tasks.filter(task => !task.completed);
      case COMPLETED: return this._tasks.filter(task => task.completed);
      default:        throw new Error("bad task type");
    }
  }
  
  getTasksCountByType(taskType) {
    return this.getTasksByType(taskType).length;
  }
  
  toggle(task_id) {
    const task = this._lookup(task_id);
    task.completed = !task.completed;
  }
  
  toggleAll(completed) {
    this._tasks.forEach(task => task.completed = completed);
  }

  add(task) {
    this._tasks.push(task);
  }
  
  edit(task_id, text) {
    const task = this._lookup(task_id);
    task.text = text;
  }
  
  remove(task_id) {
    this._filter(task => task.id !== task_id);
  }
  
  removeCompleted() {
    this._filter(task => !task.completed);
  }
  
  _filter(callback) {
    this._tasks = this._tasks.filter(callback);
  }
  
  _lookup(task_id) {
    for(let task of this._tasks) {
      if (task.id === task_id) {
        return task;
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
