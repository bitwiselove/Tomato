import React from 'react';
import ReactDOM from 'react-dom';
import formatTime from './lib/formatTime';
import CountdownTimer from './components/CountdownTimer';
import TomatoPresenter from './components/TomatoPresenter';

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
          <TomatoPresenter numTomatos={this.state.totalTomatos} />
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
