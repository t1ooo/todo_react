// @flow strict

// http://todomvc.com/examples/react/#/

import React from "react";
import {Storage} from "./storage";
import "./App.css";
import PropTypes from "prop-types";
import {Todo, Task, isTaskType, ALL, ACTIVE, COMPLETED} from "./todo";
import type {TaskType} from "./todo";
import {isBool, isString} from "./typeof";

// --------------------------------------------------------------------------------

type AppProps = {};

type AppState = {
  todo: Todo,
  taskType: TaskType,
  toggleAllChecked: bool,
};

export class App extends React.Component<AppProps, AppState> {
  static storagePrefix: string = "react-todo";
  static storageKey: string = "data";
  storage = new Storage(App.storagePrefix);
  state = this.newState();

  // try load state from storage or return default state
  newState(): AppState {
    try {
      return this.parseState(this.storage.get(App.storageKey));
    } catch (e) {
      console.log(e.message);
      return this.defaultState();
    }
  }
  
  parseState(data: string): AppState {
    const state = JSON.parse(data);
    if (! isTaskType(state.taskType)) {
      throw new Error("parse state error: bad taskType");
    }
    if (! isBool(state.toggleAllChecked)) {
      throw new Error("parse state error: bad toggleAllChecked");
    }
    return {
      todo: Todo.fromObject(state.todo),
      taskType: state.taskType,
      toggleAllChecked: state.toggleAllChecked,
    };
  }

  defaultState(): AppState {
    return {
      todo: new Todo(),
      taskType: ALL, // displayed task type
      toggleAllChecked: false, // completed all checkbox status
    };
  }

  setState(
    updater: ?$Shape<AppState> | ((AppState, AppProps) => ?$Shape<AppState>),
    callback?: () => mixed,
  ) {
    super.setState(updater, () => {
      this.saveState();
      callback && callback();
    });
  }

  saveState() {
    this.storage.set(App.storageKey, JSON.stringify(this.state));
  }

  render() {
    return (
      <div className="App">
        <TodoHeader
          addTask={v => this.addTask(v)}
          toggleAll={() => this.toggleAll()}
          toggleAllChecked={this.state.toggleAllChecked}
        />
        {0 < this.getCount(ALL) && (
          <div>
            <TodoBody
              tasks={this.getTasks()}
              onCheck={task_id => this.toggle(task_id)}
              onRemove={task_id => this.remove(task_id)}
              edit={(task_id, text) => this.edit(task_id, text)}
            />
            <TodoFooter
              count={this.getCount(ACTIVE)}
              showRemoveCompleted={0 < this.getCount(COMPLETED)}
              setTasksType={taskType => this.setTasksType(taskType)}
              removeCompleted={() => this.removeCompleted()}
            />
          </div>
        )}
      </div>
    );
  }

  getTasks(): Array<Task> {
    return this.state.todo.getTasks(this.state.taskType);
  }

  setTasksType(taskType: TaskType) {
    this.setState((state, props) => {
      return {taskType: taskType};
    });
  }

  getCount(taskType: TaskType): number {
    return this.state.todo.getCount(taskType);
  }

  edit(task_id: string, _text: string) {
    const text = _text.trim();
    if (text === "") {
      this.remove(task_id);
      return;
    }
    this.setState((state, props) => {
      state.todo.edit(task_id, text);
      return {todo: state.todo};
    });
  }

  toggle(task_id: string) {
    this.setState((state, props) => {
      state.todo.toggle(task_id);
      return {todo: state.todo};
    });
  }

  remove(task_id: string) {
    this.setState((state, props) => {
      state.todo.remove(task_id);
      return {todo: state.todo};
    });
  }

  removeCompleted() {
    this.setState((state, props) => {
      state.todo.removeCompleted();
      return {todo: state.todo};
    });
  }

  addTask(_text: string) {
    const text = _text.trim();
    if (text === "") {
      return;
    }
    this.setState((state, props) => {
      state.todo.add(new Task(text));
      return {todo: state.todo};
    });
  }

  toggleAll() {
    this.setState((state, props) => {
      const completed = !state.toggleAllChecked;
      state.todo.toggleAll(completed);
      return {todo: state.todo, toggleAllChecked: completed};
    });
  }
}

// --------------------------------------------------------------------------------

type TodoHeaderProps = {
  addTask: (string) => void,
  toggleAll: (bool) => void,
  toggleAllChecked: bool,
};

type TodoHeaderState = {
  value: string,
};

class TodoHeader extends React.Component<TodoHeaderProps, TodoHeaderState> {
  state = {
    value: "",
  };

  render() {
    return (
      <div className="TodoHeader">
        <input
          type="checkbox"
          onChange={this.props.toggleAll}
          checked={this.props.toggleAllChecked}
          title="toggle all tasks"
          className="toggle-all"
        />
        <input
          value={this.state.value}
          placeholder="What needs to be complete?"
          onChange={event => this.setState({value: event.target.value})}
          onKeyDown={event => this.handleKeyDown(event)}
          title="add new task"
          className="add-new-task"
          autoFocus
        />
      </div>
    );
  }

  handleKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case "Enter":
        this.submit(event);
        break;
      default:
      // do nothing
    }
  }

  submit(event: KeyboardEvent) {
    event.preventDefault();
    this.props.addTask(this.state.value);
    this.setState({value: ""});
  }
}

type TodoBodyProps = {
  tasks: Array<Task>,
  onCheck: (string) => void,
  onRemove: (string) => void,
  edit: (string, string) => void,
};

function TodoBody(props: TodoBodyProps) {
  return (
    <div className="TodoBody">
      {props.tasks.map(task => (
        <div key={task.id}>
          <TaskItem
            checked={task.completed}
            text={task.text}
            onCheck={() => props.onCheck(task.id)}
            onRemove={() => props.onRemove(task.id)}
            edit={text => props.edit(task.id, text)}
          />
        </div>
      ))}
    </div>
  );
}

// --------------------------------------------------------------------------------

type TaskItemProps = {
  text: string,
  checked: bool,
  onCheck: () => void,
  onRemove: () => void,
  edit: (string) => void,
};

type TaskItemState = {
  value: string,
  edit: bool,
};

class TaskItem extends React.Component<TaskItemProps, TaskItemState> {
  state = {
    value: this.props.text,
    edit: false,
  };

  render() {
    return (
      <div className="TaskItem" data-status={this.props.checked ? "completed" : "active"}>
        <input
          type="checkbox"
          checked={this.props.checked}
          onChange={this.props.onCheck}
          title="toggle task"
          className="toggle"
        />
        {this.state.edit ? this.editForm() : this.taskBody()}
      </div>
    );
  }

  editForm() {
    return (
      <input
        value={this.state.value}
        onChange={event => this.setState({value: event.target.value})}
        onBlur={event => this.handleTextEdit(event)}
        onKeyDown={event => this.handleKeyDown(event)}
        title="edit task text"
        autoFocus
        className="edit"
      />
    );
  }

  taskBody() {
    return (
      <span>
        <span
          onDoubleClick={() => this.switchEdit()}
          title="double click to edit task text"
          className="text"
        >
          {this.props.text}
        </span>
        <button
          className="remove"
          onClick={this.props.onRemove}
          title="remove task"
        >
          remove
        </button>
      </span>
    );
  }

  handleKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case "Enter":
        this.handleTextEdit(event);
        break;
      case "Escape":
        this.switchEdit();
        break;
      default:
      // do nothing
    }
  }

  handleTextEdit(event: KeyboardEvent) {
    event.preventDefault();
    this.props.edit(this.state.value);
    this.switchEdit();
  }

  switchEdit() {
    this.setState({edit: !this.state.edit});
  }
}

// --------------------------------------------------------------------------------

type TodoFooterProps = {
  count: number,
  setTasksType: (TaskType) => void,
  showRemoveCompleted: bool,
  removeCompleted: () => void,
};

function TodoFooter(props: TodoFooterProps) {
  return (
    <div className="TodoFooter">
      <span className="count">
        {props.count} item{plural(props.count)} left
      </span>

      {[ALL, ACTIVE, COMPLETED].map(typ => (
        <button
          onClick={() => props.setTasksType(typ)}
          title={`show ${typ} tasks`}
          key={typ}
          className={`show-${typ}`}
        >
          {typ}
        </button>
      ))}

      {props.showRemoveCompleted && (
        <button
          onClick={props.removeCompleted}
          title="remove completed tasks"
          className="remove-completed"
        >
          remove completed
        </button>
      )}
    </div>
  );
}

function plural(n: number): string {
  return n === 1 ? "" : "s";
}