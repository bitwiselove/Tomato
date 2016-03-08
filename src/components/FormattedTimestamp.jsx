import React from 'react';

export default ({
  milliseconds
}) => {
  const totalSeconds = Math.round(milliseconds / 1000);
  const seconds = parseInt(totalSeconds % 60, 10);
  const minutes = parseInt(totalSeconds / 60, 10);
  const format = time => time < 10 ? '0' + time : time;

  return <span className="countdown">{`${format(minutes)}:${format(seconds)}`}</span>
};
