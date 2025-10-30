import React from 'react';

export default function Header({ title, right }) {
  return (
    <div className="surface header">
      <div className="brand">
        <span style={{ width: 10, height: 10, borderRadius: 2, background: 'linear-gradient(180deg,#60a5fa,#4f46e5)' }} />
        {title}
        <span className="badge">POC</span>
      </div>
      <div>{right}</div>
    </div>
  );
}


