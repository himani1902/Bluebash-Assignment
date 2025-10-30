import React from 'react';

export default function Card({ title, children }) {
  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
      {title && <h3 style={{ marginTop: 0 }}>{title}</h3>}
      <div>{children}</div>
    </div>
  );
}


