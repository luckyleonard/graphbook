import React from 'react';

const style = {
  backgroundColor: '#6ca6fd',
  width: 40,
  height: 40,
};

function Loading({ color, size }) {
  if (typeof color !== typeof undefined) {
    style.color = color;
  }
  if (typeof size !== typeof undefined) {
    style.width = size;
    style.height = size;
  }

  return <div className='bouncer' style={style} />;
}

export default Loading;
