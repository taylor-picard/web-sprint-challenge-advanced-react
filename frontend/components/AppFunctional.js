import React, {useState} from 'react';
import axios from 'axios';

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

export default function AppFunctional(props) {
  const initialValues = {
    message: initialMessage,
    email: initialEmail,
    steps: initialSteps,
    index: initialIndex,
  };

  const [state, setState] = useState(initialValues)
  
  function getXY() {
    let x = 2;
    let y = 2;

    if(state.index % 3 === 0){
      x = 1;
    }
    if(state.index === 1 || state.index === 4 || state.index === 7){
      x = 2;
    }
    if(state.index === 8 || state.index === 5 || state.index === 2){
      x = 3;
    }
    if(state.index < 3){
      y = 1;
      }
    else if(state.index > 5){
      y = 3;
    }else{
      y = 2;
    }

    return [x, y];
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
  }

  function getXYMessage() {
    const [x, y] = getXY();
    return `Coordinates (${x}, ${y})`;
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
  }

  function reset() {
    setState({...initialValues});
    // Use this helper to reset all states to their initial values.
  }

  function getNextIndex(direction) {
    if(direction == 'left'){
      if(state.index % 3 === 0){
        setState({...state, message: `You can't go left`});
      }else{
        move(state.index - 1);
      }
    }
    if(direction == 'right'){
      if(state.index === 8 || state.index === 5 || state.index === 2){
        setState({...state, message: `You can't go right`});
      }else{
        move(state.index + 1);
      }
    }
    if(direction == 'up'){
      if(state.index < 3){
        setState({...state, message: `You can't go up`});
      }else{
        move(state.index - 3);
      }
    }
    if(direction == 'down'){
      if(state.index > 5){
        setState({...state, message: `You can't go down`});
      }else{
        move(state.index + 3);
      }
    }

    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
  }

  function move(newIndex) {
    setState({...state, index: newIndex, message: '', steps: state.steps + 1});

    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
  }

  function onChange(evt) {
    const {value} = evt.target;
    setState({...state, email: value});
    // You will need this to update the value of the input.
  }

  function onSubmit(evt) {
    evt.preventDefault();
    const [x, y] = getXY();
    axios.post("http://localhost:9000/api/result", {
      x: x, 
      y: y, 
      steps: state.steps, 
      email: state.email
    })
      .then(res => {
        setState({...state, message: res.data.message, email: ''});
        
      })
      .catch(err => {
        setState({...state, message: err.response.data.message})
      })

    // Use a POST request to send a payload to the server.
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage()}</h3>
        <h3 id="steps">You moved {state.steps} {state.steps === 1 ? 'time' : 'times'}</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === state.index ? ' active' : ''}`}>
              {idx === state.index ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{state.message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={()=>getNextIndex('left')}>LEFT</button>
        <button id="up" onClick={()=>getNextIndex('up')}>UP</button>
        <button id="right" onClick={()=>getNextIndex('right')}>RIGHT</button>
        <button id="down" onClick={()=>getNextIndex('down')}>DOWN</button>
        <button id="reset" onClick={reset}>reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input id="email" type="email" placeholder="type email" value={state.email} onChange={onChange}></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}
