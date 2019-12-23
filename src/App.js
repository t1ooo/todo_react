// http://todomvc.com/examples/react/#/

import React from "react";
import "./App.css";
import PropTypes from "prop-types";
import { Todo, Task as TodoTask, ALL, ACTIVE, COMPLETED } from "./Todo";

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
        taskType: ALL,
        completedAll: false,
      }
    }
  }

  _loadState() {
    const state = JSON.parse(localStorage.getItem(App._storageKey));
    return {
      todo: Object.setPrototypeOf(state.todo, Todo.prototype),
      taskType: state.taskType,
      completedAll: state.completedAll,
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
        <TaskAddInputField
          addTask={v => this._addTask(v)}
          updateTaskCompletionAll={(completed) => this._updateTaskCompletionAll(completed)}
          completedAll={this.state.completedAll}
        />
          <Tasks
            tasks={this._getTasks()}
            onCheck={(task_id) => this._updateTaskCompletion(task_id)}
            onRemove={(task_id) => this._removeTask(task_id)}
            updateTaskText={(task_id, text) => this._updateTaskText(task_id, text)}
          />
        <TasksLeftCount
          num={this._getActiveTaskCount()}
        />
        <TasksShowByType
          setTasksType={taskType => this._setTasksType(taskType)}
        />
        {0 < this._getCompletedTaskCount()
          ?(<CompletedTasksClear
            removeCompletedTaskAll={() => this._removeCompletedTaskAll()}
          />)
          : ""
        }
      </div>
    );
  }

  _getTasks() {
    return this.state.todo.getTasksByType(this.state.taskType);
  }

  _setTasksType(taskType) {
    this.setState((state, props) => {
      return {taskType: taskType};
    });
  }

  _getActiveTaskCount() {
    return this.state.todo.getTasksByType(ACTIVE).length;
  }

  _getCompletedTaskCount() {
    return this.state.todo.getTasksByType(COMPLETED).length;
  }

  _updateTaskText(task_id, text) {
    if (text === "") {
      this._removeTask(task_id);
      return;
    }
    this.setState((state, props) => {
      const task = state.todo.get(task_id);
      task.text = text;
      return {todo: state.todo};
    });
  }

  _updateTaskCompletion(task_id) {
    this.setState((state, props) => {
      const task = state.todo.get(task_id);
      task.completed = !task.completed;
      return {todo: state.todo};
    });
  }

  _removeTask(task_id) {
    this.setState((state, props) => {
      state.todo.remove(task_id);
      return {todo: state.todo};
    });
  }

  _removeCompletedTaskAll() {
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
      state.todo.add(new TodoTask(text));
      return {todo: state.todo};
    });
  }

  _updateTaskCompletionAll(completed) {
    this.setState((state, props) => {
      this.state.todo.forEach(task => {
        task.completed = completed;
      });
      return {todo: state.todo, completedAll: completed};
    });
  }
}

class TaskAddInputField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
    };
  }

  render() {
    return (
      <div>
        <input
          type="checkbox"
          onChange={(event) => this.props.updateTaskCompletionAll(event.target.checked)}
          checked={this.props.completedAll}
          <form
            onSubmit={(event) => {
              event.preventDefault();
              this.props.addTask(this.state.value);
              this.setState({value: ""})
            }}
          >
            <input
              value={this.state.value}
              placeholder="What needs to be complete?"
              onChange={(event) => this.setState({value: event.target.value})}
            />
          </form>
      </div>
    );
  }
}

class Tasks extends React.Component {
  render() {
    return (
      <div className="Tasks">
        {this.props.tasks.map((task) =>
          (<div key={task.id}>
            <Task
              checked={task.completed}
              text={task.text}
              onCheck={() => this.props.onCheck(task.id)}
              onRemove={() => this.props.onRemove(task.id)}
              updateTaskText={(text) => this.props.updateTaskText(task.id, text)}
            />
          </div>)
        )}
      </div>
    );
  }
}

class Task extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.text,
      edit: false,
    };
  }

  render() {
    return (
      <div className="Task">
        <input
          type="checkbox"
          checked={this.props.checked}
          onChange={this.props.onCheck}
        />
        {this.state.edit ?this._editForm() :this._taskBody()}
      </div>
    );
  }

  _handleTextEdit(event) {
    event.preventDefault();
    this.props.updateTaskText(this.state.value);
    this.setState({edit: !this.state.edit})
  }

  _editForm() {
    return (
        <form className="form"
        onSubmit={(event) => this._handleTextEdit(event)}
      >
        <input
          value={this.state.value}
          onChange={(event) => this.setState({value: event.target.value})}
          onBlur={(event) => this._handleTextEdit(event)}
        />
      </form>
    );
  }

  _taskBody() {
    return (
      <span>
        <span
          className={this.props.checked ?"completed" :"active"}
          onDoubleClick={() => this.setState({edit: !this.state.edit})}
        >
          {this.props.text}
        </span>
        <button
          className="delete"
          onClick={this.props.onRemove}
        >
          remove
        </button>
      </span>
    );
  }
}

class TasksLeftCount extends React.Component {
  render() {
    const num = this.props.num;
    return (
      <div>
        {num} item{this._endOfWord(num)} left
      </div>
    );
  }
  _endOfWord(num) {
    switch(num) {
      case(1): return "";
      default: return "s";
    }
  }
}

class TasksShowByType extends React.Component {
  render() {
    return (
      <div>
        {[ALL, ACTIVE, COMPLETED].map(typ => 
          <button onClick={() => this.props.setTasksType(typ)}>{typ}</button>
        )}
      </div>
    );
  }
}

class CompletedTasksClear extends React.Component {
  render() {
    return (
      <div>
        <button
          onClick={this.props.removeCompletedTaskAll}
        >
          clear completed
        </button>
      </div>
    );
  }
}

function clone(original) {
  return Object.assign(Object.create(original), original);
}
