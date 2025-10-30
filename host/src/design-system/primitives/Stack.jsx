import React from 'react';

export default function Stack({ direction = 'column', gap = 12, children }) {
  const style = { display: 'flex', flexDirection: direction, gap };
  return <div style={style}>{children}</div>;
}


