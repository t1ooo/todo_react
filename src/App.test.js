import React from 'react';
/* import ReactTestUtils from 'react-dom/test-utils'; */
import { act } from 'react-dom/test-utils';
import { App } from './App';
import {render, fireEvent} from '@testing-library/react';

it('show todo: when there is no tasks', () => {
  const {container} = render(<App />);
  expect(container.querySelectorAll('.TodoHeader').length).toBe(1);
  expect(container.querySelectorAll('.TodoBody').length).toBe(0);
  expect(container.querySelectorAll('.TodoFooter').length).toBe(0);
  expect(container.querySelectorAll('.TaskItem').length).toBe(0);
});

it('add new task', () => {
  const {container} = render(<App />);
  
  var input = container.querySelector('.add-new-task');

  fireEvent.change(input, { target: { value: '645' } });
  fireEvent.keyDown(input, {key: "Enter", keyCode: 13, which: 13})

  expect(container.querySelectorAll('.TaskItem').length).toBe(1);
});