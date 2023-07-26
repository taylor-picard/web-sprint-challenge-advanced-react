import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom/extend-expect';
import AppClass from "./AppClass";

// Write your tests here
test('renders with no errors', () => {
  render(<AppClass/>);
})

test('renders header', ()=> {
  render(<AppClass/>);
  const grid = document.querySelector('#grid');
  expect(grid).toBeInTheDocument();
})

test('renders no email error message', async()=> {
  render(<AppClass/>);
  const submit = document.querySelector('#submit');
  fireEvent.click(submit);
  const message = document.querySelector('#message');
  await waitFor(()=> {
    expect(message.textContent).toMatch("Ouch: email is required");
  })
  
})

test('renders error message if moving left not possible', async()=> {
  render(<AppClass/>);
  const left = document.querySelector('#left');
  const message = document.querySelector('#message');
  fireEvent.click(left);
  fireEvent.click(left);
  expect(message.textContent).toMatch(/you can't go left/i);
})

test('reset button resets steps, coordinates, and clears email input', async()=> {
  render(<AppClass/>);
  const reset = document.querySelector('#reset');
  const coordinates = document.querySelector('#coordinates');
  const steps = document.querySelector('#steps');
  const email = document.querySelector('#email');
  fireEvent.click(reset);
  await waitFor(()=>{
    expect(coordinates.textContent).toMatch(/\(2.*2\)$/);
    expect(steps.textContent).toBe("You moved 0 times");
    expect(email).toHaveValue('');
  })
})