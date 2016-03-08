import React from 'react';
import ReactDOM from 'react-dom';

class CountdownTimer extends React.Component {
  constructor(props) {
    super(props);
    this.pause = this.pause.bind(this);
    this.resume = this.resume.bind(this);
    this.tick = this.tick.bind(this);
    this.state = {
      timeRemaining: 1500000,
      previousTime: null,
      timeoutId: null,
    }
  }

  componentDidMount() {
    this.tick();
  }

  componentWillUnmount() {
    if (this.state.timeout)
      clearTimeout(this.state.timeout);
  }

  tick() {
    var currentTime = Date.now();
    var dt = this.state.previousTime ? (currentTime - this.state.previousTime) : 0;
    var interval = 1000;

    var timeRemainingInInterval = (interval - (dt % interval));
    var timeout = timeRemainingInInterval;

    if (timeRemainingInInterval < (interval / 2.0)) {
      timeout += interval;
    }

    var timeRemaining = Math.max(this.state.timeRemaining - dt, 0);
    var countdownComplete = (this.state.previousTime && timeRemaining <= 0);

    this.setState({
      timeout: countdownComplete ? null : setTimeout(this.tick, timeout),
      previousTime: currentTime,
      timeRemaining: timeRemaining
    });

    if (countdownComplete) {
      clearTimeout(this.state.timeout);
    }
  }

  resume() {
    console.log('Time elapsed between pausing and resuming:');
    console.log(this.formatTime(Date.now() - this.state.previousTime))
    this.setState({
      previousTime: Date.now()
    }, this.tick);
  }

  pause() {
    clearTimeout(this.state.timeout);
  }

  formatTime(milliseconds) {
    const totalSeconds = Math.round(milliseconds / 1000);
    const seconds = parseInt(totalSeconds % 60, 10);
    const minutes = parseInt(totalSeconds / 60, 10);
    const format = time => time < 10 ? '0' + time : time;

    return `${format(minutes)}:${format(seconds)}`;
  }

  render() {
    return (
      <div>
        <p>{this.formatTime(this.state.timeRemaining)}</p>
        <button onClick={this.pause}>Pause</button>
        <button onClick={this.resume}>Resume</button>
      </div>
    );
  }
}

class App extends React.Component {
  render() {
    return (
      <div>
        <h1>Tomato</h1>
        <CountdownTimer />
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
