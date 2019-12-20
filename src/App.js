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
        <TaskAddInputField onSubmit={v=>this._addTask(v)}/>
        {/*<Tasks tasks={this.state.todo.getTasks()}/>*/}
        {<Tasks tasks={this.state.todo.getTasks()} onChange={(task)=>this._updateTask(task)}/>}
        <ul>
          {/* this.state.todo.getTasks().map((task,i)=>
            (<li key={i}><Task onChange={(e)=>this._updateTask(task, e.target.checked)} task={task} /></li>)
          ) */}
          {/* this.state.todo.getTasks().map((task,i)=>
            (<li key={i}><Task onChange={(task)=>this._updateTask(task)} task={task} /></li>)
          ) */}
          {/* this.state.todo.getTasks().map((task,i)=>
            (<li key={i}><Task onChange={(id, props)=>this._updateTask(id, props)} task={task} /></li>)
          ) */}
        </ul>
        <TasksLeftCount num={this.state.todo.getUndone().length}/>
        <TasksShowByType />
        <CompletedTasksClear />
      </div>
    );
  }

  //_updateTask(task, checked) {
  /* _updateTask(task, checked) {
    this.setState((state, props) => {
      state.todo.update(task.id, function(_task) {
        _task.done = checked;
        return _task;
      });
      return {todo: state.todo};
    });
  } */
  _updateTask(task) {
    this.setState((state, props) => {
      state.todo.update(task.id, function(_task) {
        return task;
      });
      return {todo: state.todo};
    });
  }
  /* _updateTask(id, props) {
    this.setState((state, props) => {
      state.todo.update(id, function(task) {
        for(let i in props) {
          task[i] = props[i];
        }
        console.log(props, task);
        return task;
      });
      return {todo: state.todo};
    });
  } */

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
            onSubmit={(event)=>{
              event.preventDefault();
              this.props.onSubmit(this.state.value);
              this.setState({value: ''})
            }}
          >
            <input
              value={this.state.value}
              placeholder="What needs to be done?"
              onChange={(event)=>this.setState({value: event.target.value})}
            />
          </form>
      </div>
    );
  }
}

/* class Tasks extends React.Component {
  render() {
    return (
      <ul>
        {this.props.tasks.map((task,i)=>(<li key={i}><Task task={task}/></li>))}
      </ul>
    );
  }
} */

class Tasks extends React.Component {
  render() {
    return (
      <ul>
        {this.props.tasks.map((task,i)=>(<li key={i}><Task task={task} onChange={this.props.onChange}/></li>))}
      </ul>
    );
  }
}

/* class Task extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      task: props.task,
    };
  }
  
  render() {
    return (
      <div>
        <input
          type="checkbox"
          checked={this.state.task.done}
          onChange={(event)=>this._foo(event.target.checked)}
        />
        <span>{this.props.task.text}</span>
        <button>remove</button>
      </div>
    );
  }
  
  _foo(checked) {
    this.setState((state, props) => {
      state.task.done = checked;
      this.props.task.done = checked;
      return {task: state.task};
    });
  }
} */

/* class Task extends React.Component {
  render() {
    return (
      <div>
        <input
          type="checkbox"
          checked={this.props.checked}
          onChange={(e)=>this.props.onChange(e)}
        />
        <span>{this.props.text}</span>
        <button>remove</button>
      </div>
    );
  }
} */

class Task extends React.Component {
  render() {
    return (
      <div>
        <input
          type="checkbox"
          checked={this.props.task.checked}
          onChange={(e)=> {
            /* this.props.onChange(e) */
            /* this.props.task.done = this.props.task.checked;
            this.props.onChange(this.props.task); */
            const task = clone(this.props.task);
            task.done = e.target.checked;
            this.props.onChange(task);
            /* this.props.onChange(this.props.task.id, {done:e.target.checked}); */
          }}
        />
        <span>{this.props.task.text}</span>
        <button>remove</button>
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