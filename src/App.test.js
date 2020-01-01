import React from 'react';
import {render, unmountComponentAtNode } from 'react-dom';
/* import ReactTestUtils from 'react-dom/test-utils'; */
import { act } from 'react-dom/test-utils';
import { App } from './App';
import {fireEvent} from '@testing-library/react';

let container = null;
beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it('App', () => {
  render(<App />, container);
});

it('show todo: when there is no tasks', () => {
  const app = render(<App />, container);
  expect(container.querySelectorAll('.TodoHeader').length).toBe(1);
  expect(container.querySelectorAll('.TodoBody').length).toBe(0);
  expect(container.querySelectorAll('.TodoFooter').length).toBe(0);
  expect(container.querySelectorAll('.TaskItem').length).toBe(0);
});

it('add new task', () => {
  const app = render(<App />, container);

  var input = container.querySelector('.add-new-task');

  act(() => {
    fireEvent.change(input, { target: { value: '645' } });
    fireEvent.keyDown(input, {key: "Enter", keyCode: 13, which: 13})
  });

  expect(container.querySelectorAll('.TaskItem').length).toBe(1);
});