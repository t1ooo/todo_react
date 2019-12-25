// http://todomvc.com/examples/react/#/

import React from "react";
import "./App.css";
import PropTypes from "prop-types";
import { Todo, Task, ALL, ACTIVE, COMPLETED } from "./Todo";

export class App extends React.Component {
  static _storageKey = "react-todo";

  constructor(props) {
    super(props);
    this.state = this._newState();
  }

  // try load state from storage or return default state
  _newState() {
    try {
      return this._loadState();
    } catch(e) {
      console.log(e);
      return {
        todo: new Todo(),
        taskType: ALL, // displayed task type
        toggleAllChecked: false, // completed all checkbox status
      }
    }
  }

  _loadState() {
    const state = JSON.parse(localStorage.getItem(App._storageKey));
    return {
      todo: Object.setPrototypeOf(state.todo, Todo.prototype),
      taskType: state.taskType,
      toggleAllChecked: state.toggleAllChecked,
    };
  }

  setState(updater, callback=()=>{}) {
    super.setState(updater, () => {this._saveState(); callback();});
  }

  _saveState() {
    localStorage.setItem(App._storageKey, JSON.stringify(this.state));
  }

  render() {
    return (
      <div className="App">
        <TodoHeader
          addTask={v => this._addTask(v)}
          toggleAll={(completed) => this._toggleAll(completed)}
          toggleAllChecked={this.state.toggleAllChecked}
        />
        {0 < this._getTasksCount(ALL) &&
          <div>
            <TodoBody
              tasks={this._getTasks()}
              onCheck={(task_id) => this._toggle(task_id)}
              onRemove={(task_id) => this.remove(task_id)}
              edit={(task_id, text) => this._edit(task_id, text)}
            />
            <TodoFooter
              count={this._getTasksCount(ACTIVE)}
              showRemoveCompleted={0 < this._getTasksCount(COMPLETED)}
              setTasksType={taskType => this._setTasksType(taskType)}
              removeCompleted={() => this._removeCompleted()}
            />
          </div>
        }
      </div>
    );
  }

  _getTasks() {
    return this.state.todo.getTasks(this.state.taskType);
  }

  _setTasksType(taskType) {
    this.setState((state, props) => {
      return {taskType: taskType};
    });
  }

  _getTasksCount(taskType) {
    return this.state.todo.getTasksCount(taskType);
  }

  _edit(task_id, text) {
    if (text === "") {
      this.remove(task_id);
      return;
    }
    this.setState((state, props) => {
      state.todo.edit(task_id, text);
      return {todo: state.todo};
    });
  }

  _toggle(task_id) {
    this.setState((state, props) => {
      state.todo.toggle(task_id);
      return {todo: state.todo};
    });
  }

  remove(task_id) {
    this.setState((state, props) => {
      state.todo.remove(task_id);
      return {todo: state.todo};
    });
  }

  _removeCompleted() {
    this.setState((state, props) => {
      state.todo.removeCompleted();
      return {todo: state.todo};
    });
  }

  _addTask(text) {
    if (text === "") {
      return;
    }
    this.setState((state, props) => {
      state.todo.add(new Task(text));
      return {todo: state.todo};
    });
  }

  _toggleAll(completed) {
    this.setState((state, props) => {
      state.todo.toggleAll(completed);
      return {todo: state.todo, toggleAllChecked: completed};
    });
  }
}

class TodoHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
    };
  }

  render() {
    return (
      <div className="TodoHeader">
        <input
          type="checkbox"
          onChange={(event) => this.props.toggleAll(event.target.checked)}
          checked={this.props.toggleAllChecked}
          title="toggle all tasks"
          className="toggle-all"
        />
        <input
          value={this.state.value}
          placeholder="What needs to be complete?"
          onChange={(event) => this.setState({value: event.target.value})}
          onKeyDown={(event) => this._handleKeyDown(event)}
          title="add new task"
          className="add-new-task"
        />
      </div>
    );
  }

  _handleKeyDown(event) {
    switch(event.key) {
      case 'Enter':
        this._submit(event);
        break;
      default:
        // do nothing
    }
  }

  _submit(event) {
    event.preventDefault();
    this.props.addTask(this.state.value);
    this.setState({value: ""})
  }
}

class TodoBody extends React.Component {
  render() {
    return (
      <div className="TodoBody">
        {this.props.tasks.map((task) =>
          (<div key={task.id}>
            <TaskItem
              checked={task.completed}
              text={task.text}
              onCheck={() => this.props.onCheck(task.id)}
              onRemove={() => this.props.onRemove(task.id)}
              edit={(text) => this.props.edit(task.id, text)}
            />
          </div>)
        )}
      </div>
    );
  }
}

class TaskItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.text,
      edit: false,
    };
  }

  render() {
    return (
      <div className="TaskItem">
        <input
          type="checkbox"
          checked={this.props.checked}
          onChange={this.props.onCheck}
          title="toggle task"
          className="toggle"
        />
        {this.state.edit ?this._editForm() :this._taskBody()}
      </div>
    );
  }

  _editForm() {
    return (
      <input
        value={this.state.value}
        onChange={(event) => this.setState({value: event.target.value})}
        onBlur={(event) => this._handleTextEdit(event)}
        onKeyDown={(event) => this._handleKeyDown(event)}
        title="edit task text"
        autoFocus
        className="edit"
      />
    );
  }

  _taskBody() {
    return (
      <span className={this.props.checked ?"completed" :"active"}>
        <span
          onDoubleClick={() => this._switchEdit()}
          title="double click to edit task text"
          className="text"
        >
          {this.props.text}
        </span>
        <button
          className="delete"
          onClick={this.props.onRemove}
          title="delete task"
        >
          remove
        </button>
      </span>
    );
  }

  _handleTextEdit(event) {
    event.preventDefault();
    this.props.edit(this.state.value);
    this._switchEdit();
  }

  _handleKeyDown(event) {
    switch(event.key) {
      case 'Enter':
        this._handleTextEdit(event);
        break;
      case 'Escape':
        this._switchEdit();
        break;
      default:
        // do nothing
    }
  }

  _switchEdit() {
    this.setState({edit: !this.state.edit});
  }
}

class TodoFooter extends React.Component {
  render() {
    return (
      <div className="TodoFooter">
        <span className="count">
          {this.props.count} item{this._plural(this.props.count)} left
        </span>

        {[ALL, ACTIVE, COMPLETED].map(typ =>
          <button
            onClick={() => this.props.setTasksType(typ)}
            title={`show ${typ} tasks`}
            key={typ}
            className={`show-${typ}`}
          >
            {typ}
          </button>
        )}

        {this.props.showRemoveCompleted &&
          <button
            onClick={this.props.removeCompleted}
            title="remove completed tasks"
            className="remove-completed"
          >
            remove completed
          </button>
        }
      </div>
    );
  }

  _plural(n) {
    return n===1 ? "" : "s";
  }
}

function clone(original) {
  return Object.assign(Object.create(original), original);
}
