// http://todomvc.com/examples/react/#/

import React from "react";
import "./App.css";
import PropTypes from "prop-types";
import { Todo, Task as TodoTask } from "./Todo";

export class App extends React.Component {
  constructor(props) {
    super(props);
    /* this.state = {
      todo: Todo.fromJSON(localStorage.getItem('react-todo')) || new Todo(),
      taskType: "all",
    }; */
    this.state = this._newState();
  }
  
  _newState() {
    const state = tryFromJSON(localStorage.getItem('react-todo'), null);
    if (state !== null) {
      return {
        todo: new Todo(state.todo._tasks),
        taskType: state.taskType,
        completionAllChecked: state.completionAllChecked,
      };
    }
    return {
      todo: new Todo(),
      taskType: "all",
      completionAllChecked: false,
    };
  }

  render() {
    return (
      <div className="App">
        <TaskAddInputField
          addTask={v => this._addTask(v)}
          updateTaskCompletionAll={(complete) => this._updateTaskCompletionAll(complete)}
          completionAllChecked={this.state.completionAllChecked}
        />
          <Tasks
            tasks={this._getTasks()}
            onCheck={(task_id) => this._updateTaskCompletion(task_id)}
            onRemove={(task_id) => this._removeTask(task_id)}
            updateTaskText={(task_id, text) => this._updateTaskText(task_id, text)}
          />
        <TasksLeftCount
          num={this._getNotCompleteTaskCount()}
        />
        <TasksShowByType
          setTasksType={taskType => this._setTasksType(taskType)}
        />
        {0 < this._getCompleteTaskCount() 
          ?(<CompletedTasksClear
            removeCompletedTaskAll={() => this._removeCompletedTaskAll()}
          />)
          : ""
        }
      </div>
    );
  }
  
  setState(callback) {
    super.setState(callback, ()=> localStorage.setItem('react-todo', JSON.stringify(this.state)));
    //localStorage.setItem('react-todo', JSON.stringify(this.state.todo));
    
  }

  _getTasks() {
    switch(this.state.taskType) {
      case "all":       return this.state.todo.getTasks();
      case "active":    return this.state.todo.getTasks().filter(task => !task.complete);
      case "completed": return this.state.todo.getTasks().filter(task => task.complete);
    }
  }

  _setTasksType(taskType) {
    this.setState((state, props) => {
      return {taskType: taskType};
    });
  }

  _getNotCompleteTaskCount() {
    return this.state.todo.getTasks().reduce((acc,task) => acc+(task.complete ?0 :1), 0);
  }
  
  _getCompleteTaskCount() {
    return this.state.todo.getTasks().reduce((acc,task) => acc+(task.complete ?1 :0), 0);
  }

  _updateTaskText(task_id, text) {
    if (text === "") {
      this._removeTask(task_id);
      return;
    }
    this.setState((state, props) => {
      state.todo.update(task_id, function(_task) {
        _task.text = text;
        return _task;
      });
      return {todo: state.todo};
    });
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
      return {todo: state.todo, completionAllChecked: complete};
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
          checked={this.props.completionAllChecked}
        />complete/undone tasks
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
              checked={task.complete}
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
    //console.log(this.state.value);
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
          className={this.props.checked ?"complete" :"not-complete"}
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
        <button onClick={() => this.props.setTasksType("all")}>all</button>
        <button onClick={() => this.props.setTasksType("active")}>active</button>
        <button onClick={() => this.props.setTasksType("completed")}>completed</button>
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

function tryFromJSON(data, defValue) {
  try {
    return JSON.parse(data)
  } catch {
    return defValue;
  }
}
