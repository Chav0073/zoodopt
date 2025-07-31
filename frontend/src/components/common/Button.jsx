import React from 'react';

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  onClick,
  disabled = false,
  loading = false,
  className = '',
}) => {
  return (
    <button 
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`btn btn-primary w-100 mt-3 ${className}`}
    >
      {loading ? (
        <>
          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;