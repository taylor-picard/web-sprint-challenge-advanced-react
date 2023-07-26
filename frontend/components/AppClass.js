import React from 'react';
import axios from 'axios';

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 
// the index the "B" is at; [0,1,2,
//                           3,4,5,
//                           6,7,8]
const initialState = {
  message: initialMessage,
  email: initialEmail,
  index: initialIndex,
  steps: initialSteps,
}

export default class AppClass extends React.Component {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  constructor(){
    super();
    this.state = initialState;
  }
  getXY = () => {
    
    let x = 2;
    let y = 2;

    if(this.state.index % 3 === 0){
      x = 1;
    }
    if(this.state.index === 1 || this.state.index === 4 || this.state.index === 7){
      x = 2;
    }
    if(this.state.index === 8 || this.state.index === 5 || this.state.index === 2){
      x = 3;
    }
    if(this.state.index < 3){
      y = 1;
      }
    else if(this.state.index > 5){
      y = 3;
    }else{
      y = 2;
    }


    return [x, y];
    // It is not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
  }

  getXYMessage = () => {
    const [x, y] = this.getXY();
    return `Coordinates (${x}, ${y})`;

    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
  } 

  reset = () => {
    this.setState({...initialState});
    // Use this helper to reset all states to their initial values.
  }

  getNextIndex = (direction) => {
    if(direction == 'left'){
      if(this.state.index % 3 === 0){
        this.setState({...this.state, message: `You can't go left`});
      }else{
        this.move(this.state.index - 1);
      }

    }
    if(direction == 'right'){
      if(this.state.index === 8 || this.state.index === 5 || this.state.index === 2){
        this.setState({...this.state, message: `You can't go right`});
      }else{
        this.move(this.state.index + 1);
      }
    }
    if(direction == 'up'){
      if(this.state.index < 3){
        this.setState({...this.state, message: `You can't go up`});
      }else{
        this.move(this.state.index - 3);
      }
    }
    if(direction == 'down'){
      if(this.state.index > 5){
        this.setState({...this.state, message: `You can't go down`});
      }else{
        this.move(this.state.index + 3);
      }
    }

    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
  }

  move = newIndex => {
    this.setState({...this.state, index: newIndex, message: '', steps: this.state.steps + 1});
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
  }

  onChange = (evt) => {
    const {value} = evt.target;
    this.setState({...this.state, email: value});
    // You will need this to update the value of the input.
  }

  onSubmit = (evt) => {
    evt.preventDefault();
    const [x, y] = this.getXY();
    axios.post("http://localhost:9000/api/result", {
      x: x, 
      y: y, 
      steps: this.state.steps, 
      email: this.state.email
    })
      .then(res => {
        this.setState({...this.state, message: res.data.message});
        
      })
      .catch(err => {
        this.setState({...this.state, message: err.response.data.message})
      })
    
    this.reset();
    // Use a POST request to send a payload to the server.
  }

  render() {
    const { className } = this.props
    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">{this.getXYMessage()}</h3>
          <h3 id="steps">You moved {this.state.steps} {this.state.steps === 1 ? 'time' : 'times'}</h3>
        </div>
        <div id="grid">
          {
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
              <div key={idx} className={`square${idx === this.state.index ? ' active' : ''}`}>
                {idx === this.state.index ? 'B' : null}
              </div>
            ))
          }
        </div>
        <div className="info">
          <h3 id="message">{this.state.message}</h3>
        </div>
        <div id="keypad">
          <button id="left" onClick={()=>this.getNextIndex('left')}>LEFT</button>
          <button id="up" onClick={()=>this.getNextIndex('up')}>UP</button>
          <button id="right" onClick={()=>this.getNextIndex('right')}>RIGHT</button>
          <button id="down" onClick={()=>this.getNextIndex('down')}>DOWN</button>
          <button id="reset" onClick={this.reset}>reset</button>
        </div>
        <form onSubmit={this.onSubmit}>
          <input id="email" type="email" placeholder="type email" value={this.state.email} onChange={this.onChange}></input>
          <input id="submit" type="submit"></input>
        </form>
      </div>
    )
  }
}
