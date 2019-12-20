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
    };
  }

  render() {
    return (
      <div className="App">
        <TaskAddInputField onSubmit={v => this._addTask(v)} checkDoneAll={(done) => this._updateTaskDoneAll(done)}/>
          <Tasks
            tasks={this.state.todo.getTasks()}
            onCheck={(task_id) => this._updateTaskDone(task_id)}
            onRemove={(task_id) => this._removeTask(task_id)}
          />
        <TasksLeftCount num={this.state.todo.getUndone().length}/>
        <TasksShowByType />
        <CompletedTasksClear removeDoneTaskAll={() => this._removeDoneTaskAll()}/>
      </div>
    );
  }

  _updateTaskDone(task_id) {
    this.setState((state, props) => {
      state.todo.update(task_id, function(_task) {
        _task.done = !_task.done;
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
  
  _removeDoneTaskAll() {
    this.setState((state, props) => {
      state.todo.filter(task => task.done === false);
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

  _updateTaskDoneAll(done) {
    this.setState((state, props) => {
      this.state.todo.getTasks().forEach(task => {
        task.done = done;
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
        <input type="checkbox" onChange={(e) => this.props.checkDoneAll(e.target.checked)} />done/undone tasks
          <form
            onSubmit={(event) => {
              event.preventDefault();
              this.props.onSubmit(this.state.value);
              this.setState({value: ''})
            }}
          >
            <input
              value={this.state.value}
              placeholder="What needs to be done?"
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
              checked={task.done}
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
        <button onClick={this.props.onRemove}>remove</button>
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
        <button>all</button>
        <button>active</button>
        <button>completed</button>
      </div>
    );
  }
}

class CompletedTasksClear extends React.Component {
  render() {
    return (
      <div>
        <button onClick={this.props.removeDoneTaskAll}>clear completed</button>
      </div>
    );
  }
}

function clone(original) {
  return Object.assign(Object.create(original), original);
}