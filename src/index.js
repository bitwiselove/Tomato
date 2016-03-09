import React from 'react';
import ReactDOM from 'react-dom';
import { CountdownTimer } from './components/CountdownTimer';

function formatTime(milliseconds) {
  const totalSeconds = Math.round(milliseconds / 1000);
  const seconds = parseInt(totalSeconds % 60, 10);
  const minutes = parseInt(totalSeconds / 60, 10);
  const format = time => time < 10 ? '0' + time : time;

  return `${format(minutes)}:${format(seconds)}`;
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.tomatoTime = 1000 * 60 * 25;
    this.smallBreak = 1000 * 60 * 5;
    this.largeBreak = 1000 * 60 * 25;
    this.onComplete = this.onComplete.bind(this);
    this.state = {
      totalTomatos: 0,
      breakCounter: 0,
      breakLength: this.smallBreak,
    }
  }

  onComplete() {
    if ((this.state.breakCounter + 1) < 4) {
      this.setState({
        totalTomatos: this.state.totalTomatos + 1,
        breakCounter: this.state.breakCounter + 1,
        breakLength: this.smallBreak,
      });
    } else {
      this.setState({
        totalTomatos: this.state.totalTomatos + 1,
        breakCounter: 0,
        breakLength: this.largeBreak,
      });
    }
  }

  render() {
    var tomatos = [];
    for (var i = 0; i < this.state.totalTomatos; i++) {
      tomatos.push(<img src="http://emojipedia-us.s3.amazonaws.com/cache/89/dd/89dd52458d0d4c147b56bfa316ce5fe2.png" className="icon-small" />);
    }
    tomatos = tomatos.length > 0 ? tomatos : <img src="http://emojipedia-us.s3.amazonaws.com/cache/2c/e1/2ce12e2adad77ef4248afab9c094f08e.png" className="icon-small" />


    return (
      <div>
        <div className="container">
          <h1><img src="http://emojipedia-us.s3.amazonaws.com/cache/89/dd/89dd52458d0d4c147b56bfa316ce5fe2.png"/></h1>
          <CountdownTimer
            initialTimeInMs={this.tomatoTime}
            breakLength={this.state.breakLength}
            onComplete={this.onComplete}
            timeFormatter={formatTime}
          />
          <div className="flex-vertical">
            <span className="completed-text">Tomatos completed:</span> {tomatos}
          </div>
        </div>
        <p className="credits">Created by <a href="http://forkbombs.com" target="_blank">Brandon Newton</a>.</p>
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
