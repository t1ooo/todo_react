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
        <TaskAddInputField onSubmit={v => this._addTask(v)}/>
        {<Tasks tasks={this.state.todo.getTasks()} onChange={(task) => this._updateTask(task)} onRemove={(task) => this._removeTask(task)}/>}
        <TasksLeftCount num={this.state.todo.getUndone().length}/>
        <TasksShowByType />
        <CompletedTasksClear />
      </div>
    );
  }

  _updateTask(task) {
    this.setState((state, props) => {
      state.todo.update(task.id, function(_task) {
        return task;
      });
      return {todo: state.todo};
    });
  }
  
  _removeTask(task) {
    this.setState((state, props) => {
      state.todo.remove(task.id);
      return {todo: state.todo};
    });
  }

  _addTask(text) {
    this.setState((state, props) => {
      state.todo.add(new TodoTask(text));
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
        <button>done/undone tasks</button>
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
        {this.props.tasks.map((task,i) => (<li key={i}><Task task={task} onChange={this.props.onChange} onRemove={this.props.onRemove}/></li>))}
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
          checked={this.props.task.checked}
          onChange={(e) => {
            this.props.task.done = e.target.checked;
            this.props.onChange(this.props.task);
            /* const task = clone(this.props.task);
            task.done = e.target.checked;
            this.props.onChange(task); */
          }}
        />
        <span>{this.props.task.text}</span>
        <button onClick={(e) => this.props.onRemove(this.props.task)}>remove</button>
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
        <button>clear completed</button>
      </div>
    );
  }
}

function clone(original) {
  return Object.assign(Object.create(original), original);
}