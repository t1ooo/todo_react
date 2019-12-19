// http://todomvc.com/examples/react/#/

import React from 'react';
import './App.css';
import PropTypes from 'prop-types';

export class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="App">
        <InputField />
        <Task />
        <NumberOfTaskLeft num={3}/>
        <TaskTypes />
      </div>
    );
  }
}

class InputField extends React.Component {
  render() {
    return (
      <div>
        <button>done/undone tasks</button>
        <input 
          placeholder="What needs to be done?"
        />
      </div>
    );
  }
}

class Task extends React.Component {
  render() {
    return (
      <div>
        {/* <input type="checkbox" /> */}
        <button>done/undone</button>
        <span>some task</span>
        <button>remove</button>
      </div>
    );
  }
}

class NumberOfTaskLeft extends React.Component {
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
      case(0): return "";
      case(1): return "s";
    }
  }
}

class TaskTypes extends React.Component {
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