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
        <TaskAddInputField onSubmit={v => this._addTask(v)} checkDoneAll={(done) => this._updateDoneAll(done)}/>
          {/*<Tasks 
          tasks={this.state.todo.getTasks()} 
          onChange={(task) => this._updateDone(task)} 
          onRemove={(task) => this._removeTask(task)}
          />*/}
        {<ul>
          {this.state.todo.getTasks().map((task) => 
            (<li key={task.id}>
              <Task 
                checked={task.checked} 
                text={task.text} 
                onChange={() => this._updateDone(task.id)} 
                onRemove={() => this._removeTask(task.id)}
              />
            </li>)
          )}
        </ul>}
        <TasksLeftCount num={this.state.todo.getUndone().length}/>
        <TasksShowByType />
        <CompletedTasksClear />
      </div>
    );
  }

  _updateDone(task_id) {
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

  _addTask(text) {
    if (text === "") {
      return;
    }
    this.setState((state, props) => {
      state.todo.add(new TodoTask(text));
      return {todo: state.todo};
    });
  }
  
  _updateDoneAll(done) {
    this.setState((state, props) => {
      this.state.todo.getTasks().forEach(task => {
        //task.done = done;
        state.todo.update(task.id, function(_task) {
          _task.done = done;
          return _task;
        });
      });
      //console.log(state.todo);
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
        {this.props.tasks.map((task,i) => (<li key={i}><Task checked={task.checked} task={task} onChange={this.props.onChange} onRemove={this.props.onRemove}/></li>))}
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
          onChange={this.props.onChange}
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
        <button>clear completed</button>
      </div>
    );
  }
}

function clone(original) {
  return Object.assign(Object.create(original), original);
}