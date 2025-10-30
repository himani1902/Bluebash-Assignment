import React from 'react';

export default function Tabs({ value, onChange, items }) {
  return (
    <div className="tabs">
      {items.map((it) => (
        <button
          key={it.value}
          className={['tab', value === it.value ? 'active' : ''].join(' ')}
          onClick={() => onChange(it.value)}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}


