// http://todomvc.com/examples/react/#/

import React from "react";
import "./App.css";
import PropTypes from "prop-types";
import { Todo, Task as TodoTask } from "./Todo";

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todo: new Todo(),
      taskType: 'all',
    };
  }

  render() {
    return (
      <div className="App">
        <TaskAddInputField
          addTask={v => this._addTask(v)}
          updateTaskCompletionAll={(complete) => this._updateTaskCompletionAll(complete)}
        />
          <Tasks
            tasks={this._getTasks()}
            onCheck={(task_id) => this._updateTaskCompletion(task_id)}
            onRemove={(task_id) => this._removeTask(task_id)}
          />
        <TasksLeftCount
          num={this._getNotCompleteTaskCount()}
        />
        <TasksShowByType 
          setTasksType={taskType => this._setTasksType(taskType)}
        />
        <CompletedTasksClear
          removeCompletedTaskAll={() => this._removeCompletedTaskAll()}
        />
      </div>
    );
  }
  
  _getTasks() {
    switch(this.state.taskType) {
      case 'all':       return this.state.todo.getTasks();
      case 'active':    return this.state.todo.getTasks().filter(task => ! task.complete);
      case 'completed': return this.state.todo.getTasks().filter(task => task.complete);
    }
  }
  
  _setTasksType(taskType) {
    this.setState((state, props) => {
      return {taskType: taskType};
    });
  }

  _getNotCompleteTaskCount() {
    return this.state.todo.getTasks().reduce((acc,task) => acc+(task.complete?0:1), 0);
  }

  _updateTaskCompletion(task_id) {
    this.setState((state, props) => {
      state.todo.update(task_id, function(_task) {
        _task.complete = !_task.complete;
        return _task;
      });
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
      state.todo.filter(task => !task.complete);
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

  _updateTaskCompletionAll(complete) {
    this.setState((state, props) => {
      this.state.todo.getTasks().forEach(task => {
        task.complete = complete;
      });
      return {todo: state.todo};
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
          onChange={(e) => this.props.updateTaskCompletionAll(e.target.checked)}
        />complete/undone tasks
          <form
            onSubmit={(event) => {
              event.preventDefault();
              this.props.addTask(this.state.value);
              this.setState({value: ''})
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
      <ul>
        {this.props.tasks.map((task) =>
          (<li key={task.id}>
            <Task
              checked={task.complete}
              text={task.text}
              onCheck={() => this.props.onCheck(task.id)}
              onRemove={() => this.props.onRemove(task.id)}
            />
          </li>)
        )}
      </ul>
    );
  }
}

class Task extends React.Component {
  render() {
    return (
      <div>
        <input
          type="checkbox"
          checked={this.props.checked}
          onChange={this.props.onCheck}
        />
        <span>{this.props.text}</span>
        <button
          onClick={this.props.onRemove}
        >
          remove
        </button>
      </div>
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
        <button onClick={() => this.props.setTasksType('all')}>all</button>
        <button onClick={() => this.props.setTasksType('active')}>active</button>
        <button onClick={() => this.props.setTasksType('completed')}>completed</button>
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