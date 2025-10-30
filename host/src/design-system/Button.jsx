import React from 'react';

const baseStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  borderRadius: 8,
  border: '1px solid transparent',
  cursor: 'pointer',
  fontWeight: 600,
  transition: 'transform 120ms ease, box-shadow 120ms ease, background 120ms ease, border-color 120ms ease',
};

const sizes = {
  sm: { padding: '6px 10px', fontSize: 12 },
  md: { padding: '8px 14px', fontSize: 14 },
  lg: { padding: '12px 18px', fontSize: 16 }
};

const variants = {
  primary: {
    background: 'linear-gradient(180deg, rgba(79,70,229,.95), rgba(79,70,229,.8))',
    color: '#e8eaff',
    border: '1px solid #4338ca',
    boxShadow: '0 6px 20px rgba(79,70,229,.25)'
  },
  secondary: {
    background: 'rgba(255,255,255,.06)',
    color: '#e2e8f0',
    border: '1px solid #26304b'
  },
  ghost: {
    background: 'transparent',
    color: '#cbd5e1',
    border: '1px solid transparent'
  },
  danger: {
    background: 'linear-gradient(180deg, rgba(239,68,68,.95), rgba(239,68,68,.8))',
    color: '#fff',
    border: '1px solid #b91c1c',
    boxShadow: '0 6px 20px rgba(239,68,68,.25)'
  },
  default: {
    background: 'rgba(255,255,255,.08)',
    color: '#111827',
    border: '1px solid #d1d5db'
  }
};

export default function Button({
  children,
  onClick,
  variant = 'secondary',
  size = 'md',
  disabled = false,
  loading = false,
  leftIcon = null,
  rightIcon = null,
  className,
  style,
  type = 'button',
  ...rest
}) {
  const computedStyle = {
    ...baseStyle,
    ...(sizes[size] || sizes.md),
    ...(variants[variant] || variants.secondary),
    opacity: disabled ? .6 : 1,
    transform: disabled ? 'none' : undefined,
    ...style
  };
  return (
    <button
      type={type}
      className={className}
      style={computedStyle}
      onClick={disabled || loading ? undefined : onClick}
      disabled={disabled || loading}
      {...rest}
    >
      {leftIcon}
      {loading ? 'Loading…' : children}
      {rightIcon}
    </button>
  );
}


