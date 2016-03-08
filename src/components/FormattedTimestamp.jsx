import React from 'react';

export default ({
  milliseconds,
  format
}) => {
  return <span className="countdown">{format(milliseconds)}</span>
};
